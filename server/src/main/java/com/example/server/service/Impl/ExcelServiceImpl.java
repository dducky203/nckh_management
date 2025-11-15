package com.example.server.service.Impl;

import com.example.server.domain.User;
import com.example.server.repository.UserRepository;
import com.example.server.service.ExcelService;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class ExcelServiceImpl implements ExcelService {
    // private static final String TEMPLATE_PATH = "/templates/file/template_output.xlsx";
    private static final int COL_STT = 0;
    private static final int COL_NAME = 1;
    private static final int COL_USERNAME = 2;
    private static final int COL_ROLE = 3;
    private static final int COL_TITLE = 4;
    private static final int COL_POWER = 5;
    private static final int COL_STATUS = 6;
    private static final int COL_CREATED_DATE = 7;
    private static final int COL_UPDATED_DATE = 8;
   

    @Autowired
    private UserRepository userRepository;

    @Override
    public byte[] exportExcelFile(List<Integer> userIds) {
        try (XSSFWorkbook workbook = new XSSFWorkbook();
                ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            // Tạo sheet mới
            Sheet sheet = workbook.createSheet("Danh sách người dùng");

            // Tạo header styles
            CellStyle headerStyle = createHeaderStyle(workbook);
            CellStyle dataStyle = createDataStyle(workbook);

            // Tạo header row
            createHeaderRow(sheet, headerStyle);

            // Lấy danh sách user theo IDs
            List<User> users = userRepository.findAllById(userIds);

            // Tạo data rows
            createDataRows(sheet, users, dataStyle);

            // Auto-size columns
            autoSizeColumns(sheet);

            // Ghi workbook vào output stream
            workbook.write(out);
            return out.toByteArray();

        } catch (IOException e) {
            throw new RuntimeException("Lỗi khi xuất file Excel: " + e.getMessage(), e);
        } catch (Exception e) {
            throw new RuntimeException("Lỗi không xác định khi xuất file Excel: " + e.getMessage(), e);
        }
    }

    private CellStyle createHeaderStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();

        // Background color
        style.setFillForegroundColor(IndexedColors.LIGHT_BLUE.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);

        // Font
        Font font = workbook.createFont();
        font.setFontName("Times New Roman");
        font.setBold(true);
        font.setFontHeightInPoints((short) 12);
        font.setColor(IndexedColors.WHITE.getIndex());
        style.setFont(font);

        // Borders
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);

        // Alignment
        style.setAlignment(HorizontalAlignment.CENTER);
        style.setVerticalAlignment(VerticalAlignment.CENTER);

        return style;
    }

    /**
     * Tạo style cho data cells
     */
    private CellStyle createDataStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();

        // Borders
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);

        // Alignment
        style.setVerticalAlignment(VerticalAlignment.CENTER);

        // Wrap text
        style.setWrapText(true);

        return style;
    }

    private void createHeaderRow(Sheet sheet, CellStyle headerStyle) {
        Row headerRow = sheet.createRow(0);
        headerRow.setHeight((short) 600); // Tăng chiều cao header

        String[] headers = {
                "STT",
                "Tên người dùng",
                "Tên đăng nhập",
                "Vai trò",
                "Chức danh",
                "Quyền hạn",
                "Trạng thái",
                "Ngày tạo",
                "Ngày cập nhật"
        };

        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(headerStyle);
        }
    }

    /**
     * Tạo data rows
     */
    private void createDataRows(Sheet sheet, List<User> users, CellStyle dataStyle) {
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

        for (int i = 0; i < users.size(); i++) {
            Row row = sheet.createRow(i + 1);
            User user = users.get(i);

            // STT
            createStyledCell(row, COL_STT, i + 1, dataStyle);

            // Tên người dùng
            createStyledCell(row, COL_NAME, user.getName() != null ? user.getName() : "", dataStyle);

            // Tên đăng nhập
            createStyledCell(row, COL_USERNAME, user.getUsername() != null ? user.getUsername() : "", dataStyle);

            // Vai trò
            String roleName = "";
            if (user.getIdRole() != null) {
                roleName = user.getIdRole().getName() != null ? user.getIdRole().getName() : "";
            }
            createStyledCell(row, COL_ROLE, roleName, dataStyle);

            // Chức danh
            String titleName = "";
            if (user.getIdTitle() != null) {
                titleName = user.getIdTitle().getName() != null ? user.getIdTitle().getName() : "";
            }
            createStyledCell(row, COL_TITLE, titleName, dataStyle);

            // Quyền hạn
            String powerLevel = "";
            if (user.getPower() != null) {
                powerLevel = getPowerDescription(user.getPower());
            }
            createStyledCell(row, COL_POWER, powerLevel, dataStyle);

            // Trạng thái
            String status = "";
            if (user.getInActive() != null) {
                status = user.getInActive() ? "Không hoạt động" : "Hoạt động";
            }
            createStyledCell(row, COL_STATUS, status, dataStyle);

            // Ngày tạo
            String createdDate = "";
            if (user.getCreatedAt() != null) {
                createdDate = user.getCreatedAt().toInstant()
                        .atZone(java.time.ZoneId.systemDefault())
                        .toLocalDateTime()
                        .format(dateFormatter);
            }
            createStyledCell(row, COL_CREATED_DATE, createdDate, dataStyle);

            // Ngày cập nhật
            String modifiedDate = "";
            if (user.getUpdatedAt() != null) {
                modifiedDate = user.getUpdatedAt().toInstant()
                        .atZone(java.time.ZoneId.systemDefault())
                        .toLocalDateTime()
                        .format(dateFormatter);
            }
            createStyledCell(row, COL_UPDATED_DATE, modifiedDate, dataStyle);
        }
    }

    private void createStyledCell(Row row, int columnIndex, Object value, CellStyle style) {
        Cell cell = row.createCell(columnIndex);

        if (value instanceof String) {
            cell.setCellValue((String) value);
        } else if (value instanceof Integer) {
            cell.setCellValue((Integer) value);
        } else if (value instanceof Double) {
            cell.setCellValue((Double) value);
        } else if (value instanceof Boolean) {
            cell.setCellValue((Boolean) value);
        } else if (value != null) {
            cell.setCellValue(value.toString());
        }

        cell.setCellStyle(style);
    }

    private void autoSizeColumns(Sheet sheet) {
        for (int i = 0; i < 10; i++) {
            sheet.autoSizeColumn(i);
            // Đặt width tối thiểu cho các cột
            int currentWidth = sheet.getColumnWidth(i);
            if (currentWidth < 3000) {
                sheet.setColumnWidth(i, 3000);
            }
            // Đặt width tối đa để tránh cột quá rộng
            if (currentWidth > 8000) {
                sheet.setColumnWidth(i, 8000);
            }
        }
    }

    private String getPowerDescription(Integer power) {
        if (power == null)
            return "";

        switch (power) {
            case 1:
                return "Trưởng khoa";
            case 2:
                return "Phó khoa";
            case 3:
                return "Cán bộ khoa";
            case 4:
                return "Sinh viên";
            default:
                return "Không xác định";
        }
    }
};
