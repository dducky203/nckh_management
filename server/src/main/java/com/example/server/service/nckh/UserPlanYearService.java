package com.example.server.service.nckh;

import com.example.server.DTO.nckh.PlanSelectionStatisticsResponse;
import com.example.server.DTO.nckh.PlanSelectionStatisticsRow;
import com.example.server.domain.User;
import com.example.server.domain.nckh.UserPlanYear;
import com.example.server.repository.UserRepository;
import com.example.server.repository.nckh.UserPlanYearRepository;
import com.example.server.service.EmailService;
import com.example.server.utils.PlanSelectionWindowUtil;
import org.apache.poi.ss.usermodel.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class UserPlanYearService {

    private static final int MAX_PLAN_ID = 6;
    private static final String PLAN_TEMPLATE_PATH = "templates/research-group/Mau_PA_NCKH.xlsx";
    private static final int TITLE_ROW_INDEX = 4; // C5
    private static final int TITLE_COL_INDEX = 2; // C
    private static final short TITLE_FONT_SIZE_PT = 16;
    private static final int DATA_START_ROW_INDEX = 7; // B8
    private static final int DATA_START_COL_INDEX = 1; // B
    private static final int DATA_COL_COUNT = 10; // B..K

    @Autowired
    private UserPlanYearRepository repo;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private EmailService emailService;

    public UserPlanYear getPlanCurrent(Integer userId, Integer year) {

        if (!userRepository.existsById(userId)) {
            return null;
        }
        return repo.findByUserIdAndAcademicYear(userId, year)
                .orElse(null);
    }

    @Transactional
    public UserPlanYear selectAndLock(Integer userId, Integer planId, Integer year) {
        if (year == null) year = LocalDate.now().getYear();

        // Kiểm tra cửa sổ thời gian
        if (PlanSelectionWindowUtil.isPastDeadline()) {
            throw new IllegalStateException(
                    "Đã hết thời hạn đăng ký phương án (02/01–16/01). " +
                    "Hệ thống đã tự động xếp bạn vào Phương án 1 (PA1).");
        }
        if (!PlanSelectionWindowUtil.isOpen()) {
            throw new IllegalStateException(
                    "Chưa đến thời gian đăng ký phương án. " +
                    "Thời gian đăng ký: 02/01–16/01 hàng năm.");
        }

        if (repo.existsByUserIdAndAcademicYear(userId, year)) {
            throw new IllegalStateException("Bạn đã chọn phương án cho năm này và đã bị khóa.");
        }

        LocalDateTime now = LocalDateTime.now();
        UserPlanYear row = new UserPlanYear();
        row.setUserId(userId);
        row.setAcademicYear(year);
        row.setPlanId(planId);
        row.setIsLocked(true);
        row.setSelectedAt(now);
        row.setLockedAt(now);
        row.setLockedBy(userId);

        UserPlanYear saved = repo.save(row);

        // Gửi email xác nhận (async, không block)
        try {
            User user = userRepository.findById(userId).orElse(null);
            if (user != null && user.getIdResume() != null && user.getIdResume().getEmail() != null) {
                emailService.sendPlanSelectionConfirmationEmail(
                        user.getIdResume().getEmail(),
                        user.getName(),
                        planId,
                        year,
                        now,
                        false
                );
            }
        } catch (Exception ignored) {
            // Lỗi gửi email không ảnh hưởng đến việc lưu dữ liệu
        }

        return saved;
    }

    /**
     * Tự động gán PA1 cho tất cả users chưa chọn phương án trong năm.
     * Được gọi bởi scheduler vào ngày 17/01.
     */
    @Transactional
    public int autoAssignDefaultPlan(int year) {
        List<User> allUsers = userRepository.findUsersWithoutPlanForYear( year);

        int count = 0;
        for (User user : allUsers) {

            LocalDateTime now = LocalDateTime.now();
            UserPlanYear row = new UserPlanYear();
            row.setUserId(user.getId());
            row.setAcademicYear(year);
            row.setPlanId(PlanSelectionWindowUtil.DEFAULT_PLAN_ID);
            row.setIsLocked(true);
            row.setSelectedAt(now);
            row.setLockedAt(now);
            row.setLockedBy(31); // system
            repo.save(row);
            count++;

            // Gửi email thông báo (async)
            try {
                if (user.getIdResume() != null && user.getIdResume().getEmail() != null) {
                    emailService.sendPlanSelectionConfirmationEmail(
                            user.getIdResume().getEmail(),
                            user.getName(),
                            PlanSelectionWindowUtil.DEFAULT_PLAN_ID,
                            year,
                            now,
                            true
                    );
                }
            } catch (Exception ignored) {}
        }
        return count;
    }

    /**
     * Gửi email nhắc nhở tới tất cả users chưa chọn phương án trong năm.
     */
    public void sendReminderEmails(int year, boolean isLastDay) {
        List<User> allUsers = userRepository.findUsersWithoutPlanForYear(year);
        for (User user : allUsers) {
            try {
                if (user.getIdResume() != null && user.getIdResume().getEmail() != null) {
                    emailService.sendPlanSelectionReminderEmail(
                            user.getIdResume().getEmail(),
                            user.getName(),
                            year,
                            isLastDay
                    );
                    Thread.sleep(2000);
                }
            } catch (Exception ignored) {}
        }
    }

    @Transactional
    public UserPlanYear adminOverride(Integer adminId, Integer userId, Integer year, Integer planId, String reason) {
        UserPlanYear row = repo.findByUserIdAndAcademicYear(userId, year)
                .orElseThrow(() -> new IllegalStateException("Người dùng chưa chọn phương án năm này."));
        row.setPlanId(planId);
        row.setLockedBy(adminId);
        row.setAdminOverrideReason(reason);
        return repo.save(row);
    }

    public PlanSelectionStatisticsResponse getPlanStatistics(Integer year) {
        int selectedYear = year == null ? LocalDate.now().getYear() : year;

        List<User> users = userRepository.findUsersForPlanStatistics();
        List<UserPlanYear> planRows = repo.findByAcademicYear(selectedYear);

        Map<Integer, Integer> planByUserId = planRows.stream()
                .collect(Collectors.toMap(
                        UserPlanYear::getUserId,
                        UserPlanYear::getPlanId,
                        (left, right) -> left));

        PlanSelectionStatisticsResponse response = new PlanSelectionStatisticsResponse();
        response.academicYear = selectedYear;
        response.totalUsers = (long) users.size();
        response.planCounts = new LinkedHashMap<>();
        for (int plan = 1; plan <= MAX_PLAN_ID; plan++) {
            response.planCounts.put(plan, 0L);
        }

        List<PlanSelectionStatisticsRow> rows = new ArrayList<>();
        long selectedUsers = 0L;

        for (int i = 0; i < users.size(); i++) {
            User user = users.get(i);
            Integer planId = planByUserId.get(user.getId());

            PlanSelectionStatisticsRow row = new PlanSelectionStatisticsRow();
            row.stt = i + 1;
            row.userId = user.getId();
            row.fullName = user.getName();
            row.staffCode = user.getUsername();
            row.title = user.getIdTitle() == null ? null : user.getIdTitle().getName();
            row.planId = planId;
            row.pa1 = Integer.valueOf(1).equals(planId);
            row.pa2 = Integer.valueOf(2).equals(planId);
            row.pa3 = Integer.valueOf(3).equals(planId);
            row.pa4 = Integer.valueOf(4).equals(planId);
            row.pa5 = Integer.valueOf(5).equals(planId);
            row.pa6 = Integer.valueOf(6).equals(planId);

            if (planId != null) {
                selectedUsers++;
                if (response.planCounts.containsKey(planId)) {
                    response.planCounts.put(planId, response.planCounts.get(planId) + 1);
                }
            }

            rows.add(row);
        }

        response.selectedUsers = selectedUsers;
        response.rows = rows;
        return response;
    }

    public byte[] exportPlanStatisticsExcel(Integer year) {
        PlanSelectionStatisticsResponse stats = getPlanStatistics(year);

        try (
                InputStream in = new ClassPathResource(PLAN_TEMPLATE_PATH).getInputStream();
                Workbook workbook = WorkbookFactory.create(in);
                ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.getSheetAt(0);

            setCellText(sheet, TITLE_ROW_INDEX, TITLE_COL_INDEX,
                    "TỔNG HỢP CÁC PHƯƠNG ÁN ĐĂNG KÝ HOẠT ĐỘNG KH&CN NĂM " + stats.academicYear);
            applyFontToCell(sheet, TITLE_ROW_INDEX, TITLE_COL_INDEX, true, TITLE_FONT_SIZE_PT);

            int footerStart = findFooterStartRow(sheet);
            int desiredFooterStart = DATA_START_ROW_INDEX + stats.rows.size() + 2;
            if (footerStart >= 0 && desiredFooterStart > footerStart) {
                int shift = desiredFooterStart - footerStart;
                sheet.shiftRows(footerStart, sheet.getLastRowNum(), shift, true, false);
                footerStart = footerStart + shift;
            }

            ensureFooter(sheet, desiredFooterStart, footerStart);

            Row templateDataRow = sheet.getRow(DATA_START_ROW_INDEX);

            int rowIdx = DATA_START_ROW_INDEX;
            for (PlanSelectionStatisticsRow rowData : stats.rows) {
                Row row = getOrCreateRow(sheet, rowIdx++);
                fillRowStylesFromTemplate(row, templateDataRow);

                setCellText(row, DATA_START_COL_INDEX, String.valueOf(rowData.stt == null ? 0 : rowData.stt)); // B
                setCellText(row, DATA_START_COL_INDEX + 1, rowData.fullName == null ? "" : rowData.fullName); // C
                setCellText(row, DATA_START_COL_INDEX + 2, rowData.staffCode == null ? "" : rowData.staffCode); // D
                setCellText(row, DATA_START_COL_INDEX + 3, Boolean.TRUE.equals(rowData.pa1) ? "x" : ""); // E
                setCellText(row, DATA_START_COL_INDEX + 4, Boolean.TRUE.equals(rowData.pa2) ? "x" : ""); // F
                setCellText(row, DATA_START_COL_INDEX + 5, Boolean.TRUE.equals(rowData.pa3) ? "x" : ""); // G
                setCellText(row, DATA_START_COL_INDEX + 6, Boolean.TRUE.equals(rowData.pa4) ? "x" : ""); // H
                setCellText(row, DATA_START_COL_INDEX + 7, Boolean.TRUE.equals(rowData.pa5) ? "x" : ""); // I
                setCellText(row, DATA_START_COL_INDEX + 8, Boolean.TRUE.equals(rowData.pa6) ? "x" : ""); // J
                setCellText(row, DATA_START_COL_INDEX + 9, ""); // K
            }

            workbook.write(out);
            return out.toByteArray();
        } catch (IOException e) {
            throw new IllegalStateException("Không thể xuất file Excel thống kê phương án", e);
        }
    }

    private int findFooterStartRow(Sheet sheet) {
        for (int i = DATA_START_ROW_INDEX; i <= sheet.getLastRowNum(); i++) {
            Row row = sheet.getRow(i);
            if (row == null) {
                continue;
            }
            for (int j = 0; j < DATA_COL_COUNT + DATA_START_COL_INDEX + 2; j++) {
                Cell cell = row.getCell(j);
                if (cell == null) {
                    continue;
                }
                String text = cell.toString();
                if (text == null) {
                    continue;
                }
                String normalized = text.trim().toLowerCase();
                if (isFooterMarker(normalized)) {
                    return i;
                }
            }
        }
        return -1;
    }

    private boolean isFooterMarker(String normalizedText) {
        return normalizedText.contains("hà nội")
                || normalizedText.contains("ngày tháng năm")
                || normalizedText.contains("người lập")
                || normalizedText.contains("lãnh đạo đơn vị")
                || normalizedText.contains("ký, họ và tên");
    }

    private void ensureFooter(Sheet sheet, int desiredFooterStart, int detectedFooterStart) {
        int footerStart = detectedFooterStart;
        if (footerStart < 0) {
            footerStart = desiredFooterStart;
            createDefaultFooter(sheet, footerStart);
        }
        normalizeFooterSignatureText(sheet, footerStart);
        applyFooterSignatureBold(sheet, footerStart);
        updateFooterDateLine(sheet, footerStart);
    }

    private void createDefaultFooter(Sheet sheet, int footerStartRow) {
        setCellText(sheet, footerStartRow, 8, "Hà Nội, ngày ... tháng ... năm ...");
        setCellText(sheet, footerStartRow + 1, 2, "Người lập");
        setCellText(sheet, footerStartRow + 1, 8, "Lãnh đạo đơn vị");
        setCellText(sheet, footerStartRow + 2, 2, "(Ký, họ và tên)");
        setCellText(sheet, footerStartRow + 2, 8, "(Ký, họ và tên)");
    }

    private void normalizeFooterSignatureText(Sheet sheet, int footerStartRow) {
        setCellText(sheet, footerStartRow + 1, 2, "Người lập");
        setCellText(sheet, footerStartRow + 1, 8, "Lãnh đạo đơn vị");
        setCellText(sheet, footerStartRow + 2, 2, "(Ký, họ và tên)");
        setCellText(sheet, footerStartRow + 2, 8, "(Ký, họ và tên)");
    }

    private void applyFooterSignatureBold(Sheet sheet, int footerStartRow) {
        applyBoldToCell(sheet, footerStartRow + 1, 2);
        applyBoldToCell(sheet, footerStartRow + 1, 8);
    }

    private void applyBoldToCell(Sheet sheet, int rowIndex, int colIndex) {
        applyFontToCell(sheet, rowIndex, colIndex, true, null);
    }

    private void applyFontToCell(Sheet sheet, int rowIndex, int colIndex, boolean bold, Short fontSizePt) {
        Row row = getOrCreateRow(sheet, rowIndex);
        Cell cell = row.getCell(colIndex);
        if (cell == null) {
            cell = row.createCell(colIndex);
        }

        Workbook workbook = sheet.getWorkbook();
        CellStyle currentStyle = cell.getCellStyle();
        CellStyle boldStyle = workbook.createCellStyle();
        if (currentStyle != null) {
            boldStyle.cloneStyleFrom(currentStyle);
        }

        Font baseFont = null;
        if (currentStyle != null) {
            baseFont = workbook.getFontAt(currentStyle.getFontIndex());
        }

        Font boldFont = workbook.createFont();
        if (baseFont != null) {
            boldFont.setFontName(baseFont.getFontName());
            boldFont.setFontHeight(baseFont.getFontHeight());
            boldFont.setColor(baseFont.getColor());
            boldFont.setUnderline(baseFont.getUnderline());
            boldFont.setItalic(baseFont.getItalic());
            boldFont.setStrikeout(baseFont.getStrikeout());
            boldFont.setCharSet(baseFont.getCharSet());
            boldFont.setTypeOffset(baseFont.getTypeOffset());
        }
        if (fontSizePt != null && fontSizePt > 0) {
            boldFont.setFontHeightInPoints(fontSizePt);
        }
        boldFont.setBold(bold);

        boldStyle.setFont(boldFont);
        cell.setCellStyle(boldStyle);
    }

    private void updateFooterDateLine(Sheet sheet, int footerStartRow) {
        LocalDate today = LocalDate.now();
        String dateLine = String.format("Hà Nội, ngày %02d tháng %02d năm %d",
                today.getDayOfMonth(),
                today.getMonthValue(),
                today.getYear());

        for (int i = footerStartRow; i <= sheet.getLastRowNum(); i++) {
            Row row = sheet.getRow(i);
            if (row == null) {
                continue;
            }
            for (int j = 0; j < DATA_COL_COUNT + DATA_START_COL_INDEX + 4; j++) {
                Cell cell = row.getCell(j);
                if (cell == null) {
                    continue;
                }
                String text = cell.toString();
                if (text == null) {
                    continue;
                }
                String normalized = text.trim().toLowerCase();
                if (normalized.contains("hà nội") || normalized.contains("ha noi")) {
                    cell.setCellValue(dateLine);
                    return;
                }
            }
        }
    }

    private void fillRowStylesFromTemplate(Row target, Row template) {
        if (template == null) {
            return;
        }
        for (int i = 0; i < DATA_COL_COUNT; i++) {
            int col = DATA_START_COL_INDEX + i;
            Cell templateCell = template.getCell(col);
            if (templateCell == null) {
                continue;
            }
            Cell targetCell = target.getCell(col);
            if (targetCell == null) {
                targetCell = target.createCell(col);
            }
            CellStyle style = templateCell.getCellStyle();
            if (style != null) {
                targetCell.setCellStyle(style);
            }
        }
    }

    private Row getOrCreateRow(Sheet sheet, int rowIndex) {
        Row row = sheet.getRow(rowIndex);
        if (row != null) {
            return row;
        }
        return sheet.createRow(rowIndex);
    }

    private void setCellText(Sheet sheet, int rowIndex, int colIndex, String value) {
        Row row = getOrCreateRow(sheet, rowIndex);
        setCellText(row, colIndex, value);
    }

    private void setCellText(Row row, int colIndex, String value) {
        Cell cell = row.getCell(colIndex);
        if (cell == null) {
            cell = row.createCell(colIndex);
        }
        cell.setCellValue(value == null ? "" : value);
    }
}
