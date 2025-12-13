package com.example.server.service.Impl;

import com.example.server.DTO.users.UserDetailsDTO;
import com.example.server.domain.User;
import com.example.server.mapper.UserMapper;
import com.example.server.repository.UserRepository;
import com.example.server.service.ExcelService;
import com.example.server.utils.Constants;
import com.example.server.utils.DateTimeConstant;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class ExcelServiceImpl implements ExcelService {
    // private static final String TEMPLATE_PATH =
    // "/templates/file/template_output.xlsx";
    private static final int COL_STT = 0;
    private static final int COL_NAME = 1;
    private static final int COL_USERNAME = 2;
    private static final int COL_EMAIL = 3;
    private static final int COL_ROLE = 4;
    private static final int COL_TITLE = 5;
    private static final int COL_POWER = 6;
    private static final int COL_PHONE = 7;
    private static final int COL_BIRTHDAY = 8;
    private static final int COL_ADDRESS = 9;
    private static final int COL_STATUS = 10;
    private static final int COL_CREATED_DATE = 11;
    private static final int COL_UPDATED_DATE = 12;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserMapper userMapper;

    @Override
    public byte[] exportExcelFile(List<Integer> userIds) {
        try (XSSFWorkbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            // Tạo sheet mới
            Sheet sheet = workbook.createSheet("Danh sách người dùng");

            // Tạo header styles
            CellStyle headerStyle = createHeaderStyle(workbook);
            CellStyle dataStyle = createDataStyle(workbook);

            createHeaderRow(sheet, headerStyle);

            List<UserDetailsDTO> listUser = userMapper.toUserDetailDTO(userRepository.findAllById(userIds));

            createDataRows(sheet, listUser, dataStyle);

            autoSizeColumns(sheet);

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

        String[] headers = {"STT", "Tên người dùng", "Tên đăng nhập", "Email", "Vai trò", "Chức danh", "Quyền hạn", "Số điện thoại", "Ngày sinh", "Địa chỉ", "Trạng thái", "Ngày tạo", "Ngày cập nhật"};

        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(headerStyle);
        }
    }

    private void createDataRows(Sheet sheet, List<UserDetailsDTO> users, CellStyle dataStyle) {
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
        DateTimeFormatter birthdayFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");

        for (int i = 0; i < users.size(); i++) {
            Row row = sheet.createRow(i + 1);
            UserDetailsDTO user = users.get(i);

            // STT
            createStyledCell(row, COL_STT, i + 1, dataStyle);

            // Tên người dùng
            createStyledCell(row, COL_NAME, user.getName() != null ? user.getName() : "", dataStyle);

            // Tên đăng nhập
            createStyledCell(row, COL_USERNAME, user.getUsername() != null ? user.getUsername() : "", dataStyle);

            // Email
            createStyledCell(row, COL_EMAIL, user.getEmail() != null ? user.getEmail() : "", dataStyle);

            // Vai trò
            createStyledCell(row, COL_ROLE, user.getRole() != null ? user.getRole() : "", dataStyle);

            // Chức danh
            createStyledCell(row, COL_TITLE, user.getTitle() != null ? user.getTitle() : "", dataStyle);

            // Quyền hạn
            String powerLevel = "";
            if (user.getPower() != null) {
                powerLevel = Constants.getPowerDescription(user.getPower());
            }
            createStyledCell(row, COL_POWER, powerLevel, dataStyle);

            // Số điện thoại
            createStyledCell(row, COL_PHONE, user.getPhone() != null ? user.getPhone() : "", dataStyle);

            // Ngày sinh
            createStyledCell(row, COL_BIRTHDAY, DateTimeConstant.toDate(user.getBirthday()), dataStyle);

            // Địa chỉ
            createStyledCell(row, COL_ADDRESS, user.getAddress() != null ? user.getAddress() : "", dataStyle);

            // Trạng thái
            String status = "";
            if (user.getIsDeleted() != null && user.getIsDeleted()) {
                status = "Đã xóa";
            } else if (user.getInActive() != null) {
                status = user.getInActive() ? "Không hoạt động" : "Hoạt động";
            }
            createStyledCell(row, COL_STATUS, status, dataStyle);

            createStyledCell(row, COL_CREATED_DATE, DateTimeConstant.toDateTime(user.getCreatedAt()), dataStyle);

            createStyledCell(row, COL_UPDATED_DATE, DateTimeConstant.toDateTime(user.getUpdatedAt()), dataStyle);
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
        for (int i = 0; i < 13; i++) {
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


};
