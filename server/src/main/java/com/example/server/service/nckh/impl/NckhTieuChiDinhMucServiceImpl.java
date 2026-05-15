package com.example.server.service.nckh.impl;

import com.example.server.DTO.nckh.NckhTieuChiDinhMucImportResult;
import com.example.server.DTO.nckh.NckhTieuChiDinhMucRequest;
import com.example.server.DTO.nckh.NckhTieuChiDinhMucResponse;
import com.example.server.domain.nckh.NckhTieuChiDinhMuc;
import com.example.server.mapper.NckhTieuChiDinhMucMapper;
import com.example.server.repository.nckh.NckhTieuChiDinhMucRepository;
import com.example.server.service.nckh.NckhTieuChiDinhMucService;
import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.VerticalAlignment;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.util.List;

@Service
public class NckhTieuChiDinhMucServiceImpl implements NckhTieuChiDinhMucService {

    // Cột 0: ID ẩn (người dùng không thấy, dùng để import matching)
    private static final int COL_ID        = 0;
    // Cột hiển thị bắt đầu từ 1
    private static final int COL_STT       = 1;
    private static final int COL_PHUONG_AN = 2;
    private static final int COL_TEN_TIEU_CHI = 3;
    private static final int COL_CHUC_DANH = 4;
    private static final int COL_DON_VI    = 5;
    private static final int COL_DINH_MUC  = 6;  // người dùng nhập
    private static final int COL_GIO_QUY_DOI = 7; // người dùng nhập
    // Không có cột Năm và Tổng giờ trong template

    private final NckhTieuChiDinhMucRepository repository;
    private final NckhTieuChiDinhMucMapper mapper;

    public NckhTieuChiDinhMucServiceImpl(NckhTieuChiDinhMucRepository repository, NckhTieuChiDinhMucMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    @Transactional
    public NckhTieuChiDinhMucResponse create(NckhTieuChiDinhMucRequest request) {
        NckhTieuChiDinhMuc entity = new NckhTieuChiDinhMuc();
        mapRequestToEntity(request, entity);
        validateEntity(entity);
        return mapper.toResponse(repository.save(entity));
    }

    @Override
    @Transactional
    public NckhTieuChiDinhMucResponse update(Long id, NckhTieuChiDinhMucRequest request) {
        NckhTieuChiDinhMuc entity = repository.findById(id)
                .orElseThrow(() -> new IllegalStateException("Không tìm thấy tiêu chí định mức với id=" + id));
        mapRequestToEntity(request, entity);
        validateEntity(entity);
        return mapper.toResponse(repository.save(entity));
    }

    @Override
    public NckhTieuChiDinhMucResponse getById(Long id) {
        NckhTieuChiDinhMuc entity = repository.findById(id)
                .orElseThrow(() -> new IllegalStateException("Không tìm thấy tiêu chí định mức với id=" + id));
        return mapper.toResponse(entity);
    }

    @Override
    public List<NckhTieuChiDinhMucResponse> getAll(Integer phuongAn, String chucDanh, String year) {
        if (phuongAn == null || chucDanh == null) {
            return mapper.toResponseList(repository.findAllByYear(year));
        }
        return mapper.toResponseList(repository.findByPhuongAnAndChucDanh(phuongAn, chucDanh, year));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new IllegalStateException("Không tìm thấy tiêu chí định mức với id=" + id);
        }
        repository.deleteById(id);
    }

    @Override
    public byte[] exportImportTemplate(Integer phuongAn, String chucDanh, String year) {
        List<NckhTieuChiDinhMuc> rows;
        if (phuongAn != null && chucDanh != null && !chucDanh.isBlank()) {
            rows = repository.findByPhuongAnAndChucDanh(phuongAn, chucDanh, year);
        } else {
            rows = repository.findAllByYear(year);
            if (phuongAn != null) {
                rows = rows.stream().filter(r -> phuongAn.equals(r.getPhuongAn())).toList();
            }
        }

        try (XSSFWorkbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Định mức");

            CellStyle headerStyle = createHeaderStyle(workbook);
            CellStyle dataStyle  = createDataStyle(workbook);
            CellStyle emptyStyle = createEmptyInputStyle(workbook);
            CellStyle lockedNoteStyle = createNoteStyle(workbook);

            // Template: (ẩn) ID | STT | Phương án | Tên tiêu chí | Chức danh | Đơn vị | Định mức | Giờ quy đổi
            String[] visibleHeaders = {
                    "STT", "Phương án", "Tên tiêu chí", "Chức danh", "Đơn vị",
                    "Định mức (*)", "Giờ quy đổi (*)"
            };
            int totalVisibleCols = visibleHeaders.length; // = 7

            Row headerRow = sheet.createRow(0);
            headerRow.setHeight((short) 500);
            Cell idHeaderCell = headerRow.createCell(0);
            idHeaderCell.setCellValue("ID");
            idHeaderCell.setCellStyle(headerStyle);
            for (int i = 0; i < totalVisibleCols; i++) {
                Cell cell = headerRow.createCell(i + 1);
                cell.setCellValue(visibleHeaders[i]);
                cell.setCellStyle(headerStyle);
            }

            Row noteRow = sheet.createRow(1);
            Cell noteCell = noteRow.createCell(1);
            noteCell.setCellValue(
                    "Lưu ý: Nhập giá trị vào 2 cột (*) Định mức và Giờ quy đổi. Tổng giờ tối thiểu sẽ được hệ thống tự tính = Định mức × Giờ quy đổi."
            );
            noteCell.setCellStyle(lockedNoteStyle);
            sheet.addMergedRegion(new org.apache.poi.ss.util.CellRangeAddress(1, 1, 1, totalVisibleCols));

            int rowIndex = 2;
            int stt = 1;
            for (NckhTieuChiDinhMuc r : rows) {
                Row row = sheet.createRow(rowIndex++);
                setCell(row, COL_ID,           r.getId() == null ? "" : r.getId().toString(), dataStyle);
                setCell(row, COL_STT,          String.valueOf(stt++), dataStyle);
                setCell(row, COL_PHUONG_AN,    r.getPhuongAn() == null ? "" : String.valueOf(r.getPhuongAn()), dataStyle);
                setCell(row, COL_TEN_TIEU_CHI, r.getTieuChiName() == null ? "" : r.getTieuChiName(), dataStyle);
                setCell(row, COL_CHUC_DANH,    r.getChucDanh() == null ? "" : r.getChucDanh().name(), dataStyle);
                setCell(row, COL_DON_VI,       r.getDonViTinh() == null ? "" : r.getDonViTinh(), dataStyle);
                // Định mức và Giờ quy đổi để trống để người dùng nhập
                row.createCell(COL_DINH_MUC).setCellStyle(emptyStyle);
                row.createCell(COL_GIO_QUY_DOI).setCellStyle(emptyStyle);
            }

            // Ẩn cột 0 (ID)
            sheet.setColumnWidth(0, 0);
            // Auto-size cột hiển thị 1-7
            for (int i = 1; i <= totalVisibleCols; i++) {
                sheet.autoSizeColumn(i);
                int w = sheet.getColumnWidth(i);
                if (w < 3000) sheet.setColumnWidth(i, 3000);
                if (w > 14000) sheet.setColumnWidth(i, 14000);
            }

            workbook.write(out);
            return out.toByteArray();
        } catch (IOException e) {
            throw new RuntimeException("Lỗi khi xuất file Excel mẫu: " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional
    public NckhTieuChiDinhMucImportResult importFromExcel(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalStateException("File Excel không được để trống");
        }
        String filename = file.getOriginalFilename();
        if (filename == null ||
                (!filename.toLowerCase().endsWith(".xlsx") && !filename.toLowerCase().endsWith(".xls"))) {
            throw new IllegalStateException("File phải có định dạng Excel (.xlsx hoặc .xls)");
        }

        NckhTieuChiDinhMucImportResult result = new NckhTieuChiDinhMucImportResult();

        // Đọc workbook, xử lý và ghi kết quả thẳng vào cột "Kết quả" rồi trả về
        try (InputStream in = file.getInputStream(); XSSFWorkbook workbook = new XSSFWorkbook(in)) {
            Sheet sheet = workbook.getSheetAt(0);
            final int COL_RESULT = COL_GIO_QUY_DOI + 1; // cột 8

            // Tạo style cho cột "Kết quả"
            CellStyle successStyle = workbook.createCellStyle();
            Font successFont = workbook.createFont();
            successFont.setColor(IndexedColors.GREEN.getIndex());
            successFont.setBold(true);
            successStyle.setFont(successFont);
            successStyle.setBorderTop(BorderStyle.THIN);
            successStyle.setBorderRight(BorderStyle.THIN);
            successStyle.setBorderBottom(BorderStyle.THIN);
            successStyle.setBorderLeft(BorderStyle.THIN);

            CellStyle errorStyle = workbook.createCellStyle();
            Font errorFont = workbook.createFont();
            errorFont.setColor(IndexedColors.RED.getIndex());
            errorFont.setBold(true);
            errorStyle.setFont(errorFont);
            errorStyle.setBorderTop(BorderStyle.THIN);
            errorStyle.setBorderRight(BorderStyle.THIN);
            errorStyle.setBorderBottom(BorderStyle.THIN);
            errorStyle.setBorderLeft(BorderStyle.THIN);
            errorStyle.setWrapText(true);

            // Thêm header "Kết quả" vào dòng 0
            Row headerRow = sheet.getRow(0);
            if (headerRow == null) headerRow = sheet.createRow(0);
            Cell headerResultCell = headerRow.createCell(COL_RESULT);
            headerResultCell.setCellValue("Kết quả");
            CellStyle headerStyle = createHeaderStyle(workbook);
            headerResultCell.setCellStyle(headerStyle);

            int rowIndex = 2;
            while (true) {
                Row row = sheet.getRow(rowIndex);
                if (row == null) break;

                String idStr = getStringValue(row, COL_ID);
                if (idStr == null || idStr.isBlank()) break;

                result.totalRows++;
                Cell resultCell = row.createCell(COL_RESULT);

                try {
                    Long id = Long.parseLong(idStr.trim());
                    NckhTieuChiDinhMuc entity = repository.findById(id).orElse(null);
                    if (entity == null) {
                        result.errorCount++;
                        resultCell.setCellValue("Không tìm thấy bản ghi (id=" + id + ")");
                        resultCell.setCellStyle(errorStyle);
                        rowIndex++;
                        continue;
                    }

                    BigDecimal dinhMuc = getDecimalValue(row, COL_DINH_MUC);
                    BigDecimal gioQuyDoi = getDecimalValue(row, COL_GIO_QUY_DOI);

                    if (dinhMuc == null) {
                        result.errorCount++;
                        resultCell.setCellValue("Thiếu giá trị Định mức");
                        resultCell.setCellStyle(errorStyle);
                        rowIndex++;
                        continue;
                    }
                    if (gioQuyDoi == null) {
                        result.errorCount++;
                        resultCell.setCellValue("Thiếu giá trị Giờ quy đổi");
                        resultCell.setCellStyle(errorStyle);
                        rowIndex++;
                        continue;
                    }

                    entity.setDinhMucToiThieu(dinhMuc);
                    entity.setGioQuyDoiPerUnit(gioQuyDoi);
                    entity.setTongGioToiThieu(dinhMuc.multiply(gioQuyDoi));
                    repository.save(entity);

                    result.successCount++;
                    resultCell.setCellValue("✓ Thành công");
                    resultCell.setCellStyle(successStyle);
                } catch (NumberFormatException nfe) {
                    result.errorCount++;
                    resultCell.setCellValue("ID không hợp lệ (" + idStr + ")");
                    resultCell.setCellStyle(errorStyle);
                } catch (Exception e) {
                    result.errorCount++;
                    resultCell.setCellValue(e.getMessage());
                    resultCell.setCellStyle(errorStyle);
                }
                rowIndex++;
            }

            // Auto-size cột "Kết quả"
            sheet.autoSizeColumn(COL_RESULT);
            int w = sheet.getColumnWidth(COL_RESULT);
            if (w < 4000) sheet.setColumnWidth(COL_RESULT, 4000);

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            workbook.write(out);
            result.resultExcel = out.toByteArray();
        }

        return result;
    }

    private void mapRequestToEntity(NckhTieuChiDinhMucRequest request, NckhTieuChiDinhMuc entity) {
        entity.setPhuongAn(request.phuongAn);
        entity.setTieuChiCode(request.tieuChiCode);
        entity.setTieuChiName(request.tieuChiName);
        entity.setChucDanh(parseChucDanh(request.chucDanh));
        entity.setDonViTinh(request.donViTinh);
        entity.setDinhMucToiThieu(request.dinhMucToiThieu);
        entity.setGioQuyDoiPerUnit(request.gioQuyDoiPerUnit);
        entity.setTongGioToiThieu(calcTongGioToiThieu(request.dinhMucToiThieu, request.gioQuyDoiPerUnit));
        entity.setGhiChu(request.ghiChu);
        entity.setSortOrder(request.sortOrder == null ? 0 : request.sortOrder);
        if (request.year != null && !request.year.isBlank()) {
            entity.setYear(request.year);
        } else if (entity.getYear() == null) {
            entity.setYear(String.valueOf(java.time.Year.now().getValue()));
        }
    }

    private void validateEntity(NckhTieuChiDinhMuc entity) {
        if (entity.getPhuongAn() == null || entity.getPhuongAn() < 1 || entity.getPhuongAn() > 6) {
            throw new IllegalStateException("phuong_an phải nằm trong khoảng 1-6");
        }
        if (entity.getTieuChiCode() == null || entity.getTieuChiCode().isBlank()) {
            throw new IllegalStateException("tieu_chi_code không được để trống");
        }
        if (entity.getTieuChiName() == null || entity.getTieuChiName().isBlank()) {
            throw new IllegalStateException("tieu_chi_name không được để trống");
        }
        if (entity.getChucDanh() == null) {
            throw new IllegalStateException("chuc_danh không hợp lệ. Cho phép: GS_PGS, TS, THS, KS_CN");
        }
    }

    private BigDecimal calcTongGioToiThieu(BigDecimal dinhMucToiThieu, BigDecimal gioQuyDoiPerUnit) {
        if (dinhMucToiThieu == null || gioQuyDoiPerUnit == null) {
            return null;
        }
        return dinhMucToiThieu.multiply(gioQuyDoiPerUnit);
    }

    private NckhTieuChiDinhMuc.ChucDanh parseChucDanh(String chucDanh) {
        if (chucDanh == null || chucDanh.isBlank()) {
            return null;
        }
        String normalized = chucDanh.trim().toUpperCase()
                .replace("/", "_")
                .replace(" ", "_")
                .replace("-", "_");
        // Chuẩn hoá các biến thể phổ biến
        if (normalized.contains("GS") || normalized.contains("PGS")) {
            return NckhTieuChiDinhMuc.ChucDanh.GS_PGS;
        }
        if (normalized.equals("TS") || normalized.contains("TIEN_SI") || normalized.contains("TIẾN_SĨ")) {
            return NckhTieuChiDinhMuc.ChucDanh.TS;
        }
        if (normalized.equals("THS") || normalized.contains("THAC_SI") || normalized.contains("THẠC_SĨ")) {
            return NckhTieuChiDinhMuc.ChucDanh.THS;
        }
        if (normalized.contains("KS") || normalized.contains("CN") || normalized.contains("KY_SU") || normalized.contains("CU_NHAN")) {
            return NckhTieuChiDinhMuc.ChucDanh.KS_CN;
        }
        try {
            return NckhTieuChiDinhMuc.ChucDanh.valueOf(normalized);
        } catch (IllegalArgumentException ex) {
            throw new IllegalStateException("chuc_danh không hợp lệ: '" + chucDanh + "'. Cho phép: GS_PGS (GS/PGS), TS, THS (ThS), KS_CN (KS/CN)");
        }
    }

    private CellStyle createHeaderStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        style.setFillForegroundColor(IndexedColors.LIGHT_BLUE.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        Font font = workbook.createFont();
        font.setFontName("Times New Roman");
        font.setBold(true);
        font.setFontHeightInPoints((short) 12);
        font.setColor(IndexedColors.WHITE.getIndex());
        style.setFont(font);
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setAlignment(HorizontalAlignment.CENTER);
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        return style;
    }

    private CellStyle createDataStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        return style;
    }

    private CellStyle createNoteStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setItalic(true);
        font.setColor(IndexedColors.DARK_RED.getIndex());
        style.setFont(font);
        style.setAlignment(HorizontalAlignment.LEFT);
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        return style;
    }

    /** Style cho ô trống chờ người dùng nhập — nền vàng nhạt, viền xanh dương */
    private CellStyle createEmptyInputStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        style.setFillForegroundColor(IndexedColors.LIGHT_YELLOW.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setTopBorderColor(IndexedColors.CORNFLOWER_BLUE.getIndex());
        style.setRightBorderColor(IndexedColors.CORNFLOWER_BLUE.getIndex());
        style.setBottomBorderColor(IndexedColors.CORNFLOWER_BLUE.getIndex());
        style.setLeftBorderColor(IndexedColors.CORNFLOWER_BLUE.getIndex());
        style.setAlignment(HorizontalAlignment.RIGHT);
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        return style;
    }

    private void setCell(Row row, int col, String value, CellStyle style) {
        Cell cell = row.createCell(col);
        cell.setCellValue(value);
        cell.setCellStyle(style);
    }

    private void setNumber(Row row, int col, BigDecimal value, CellStyle style) {
        Cell cell = row.createCell(col);
        if (value != null) {
            cell.setCellValue(value.doubleValue());
        }
        cell.setCellStyle(style);
    }

    private String getStringValue(Row row, int col) {
        Cell cell = row.getCell(col);
        if (cell == null) return null;
        CellType type = cell.getCellType();
        if (type == CellType.STRING) {
            return cell.getStringCellValue().trim();
        } else if (type == CellType.NUMERIC) {
            double d = cell.getNumericCellValue();
            if (d == Math.floor(d) && !Double.isInfinite(d)) {
                return String.valueOf((long) d);
            }
            return String.valueOf(d);
        } else if (type == CellType.BOOLEAN) {
            return String.valueOf(cell.getBooleanCellValue());
        } else if (type == CellType.FORMULA) {
            try {
                return cell.getStringCellValue().trim();
            } catch (Exception e) {
                try {
                    return String.valueOf(cell.getNumericCellValue());
                } catch (Exception ex) {
                    return null;
                }
            }
        }
        return null;
    }

    private BigDecimal getDecimalValue(Row row, int col) {
        Cell cell = row.getCell(col);
        if (cell == null) return null;
        CellType type = cell.getCellType();
        try {
            if (type == CellType.NUMERIC) {
                return BigDecimal.valueOf(cell.getNumericCellValue());
            } else if (type == CellType.STRING) {
                String s = cell.getStringCellValue().trim().replace(",", ".");
                if (s.isEmpty()) return null;
                return new BigDecimal(s);
            } else if (type == CellType.FORMULA) {
                try {
                    return BigDecimal.valueOf(cell.getNumericCellValue());
                } catch (Exception e) {
                    return null;
                }
            }
        } catch (NumberFormatException e) {
            return null;
        }
        return null;
    }
}
