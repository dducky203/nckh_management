package com.example.server.service.nckh;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;

import org.apache.poi.xwpf.usermodel.ParagraphAlignment;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.apache.poi.xwpf.usermodel.XWPFRun;
import org.apache.poi.xwpf.usermodel.XWPFTable;
import org.apache.poi.xwpf.usermodel.XWPFTableCell;
import org.apache.poi.xwpf.usermodel.XWPFTableRow;
import org.openxmlformats.schemas.wordprocessingml.x2006.main.CTRow;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.example.server.constant.NckhTieuChiConstants;
import com.example.server.domain.ResearchGroup;
import com.example.server.exception.ErrorException;

@Service
public class NckhGroupQuotaWordExportService {

    private static final String TEMPLATE_PATH = "templates/research-group/template_thong_ke_nhom.docx";

    private static final List<String> TEMPLATE_QUOTA_CODES = List.of(
            NckhTieuChiConstants.SEMINAR_TRINH_BAY,
            NckhTieuChiConstants.HT_TC_HV,
            NckhTieuChiConstants.HT_THAM_LUAN,
            NckhTieuChiConstants.BB_WOS_SCOPUS,
            NckhTieuChiConstants.BB_TA_HOCVIEN,
            NckhTieuChiConstants.BB_TV_HOCVIEN,
            "HT_THAM_LUAN_KYYEU",
            NckhTieuChiConstants.TONG_QUAN,
            NckhTieuChiConstants.TU_VAN_BAN_TIN,
            NckhTieuChiConstants.QUY_TRINH_KY_THUAT,
            NckhTieuChiConstants.DE_XUAT_BO,
            NckhTieuChiConstants.DT_BO_CHUNHIEM,
            NckhTieuChiConstants.HD_SVNCKH,
            NckhTieuChiConstants.HOI_DONG_TU_VAN,
            NckhTieuChiConstants.MOI_CHUYEN_GIA);

    @SuppressWarnings("unchecked")
    public byte[] exportBytes(
            ResearchGroup group,
            Map<String, Object> data,
            int academicYear) {
        List<Map<String, Object>> members = (List<Map<String, Object>>) data.getOrDefault("members", List.of());
        Map<String, Double> groupQuota = (Map<String, Double>) data.getOrDefault("groupQuota", Map.of());
        return buildDocument(group, data, members, groupQuota, academicYear);
    }

    public String buildFileName(ResearchGroup group, int academicYear) {
        return safeFileName("ThongKeDinhMucNhom_" + group.getGroupName() + "_" + academicYear + ".docx");
    }

    private byte[] buildDocument(
            ResearchGroup group,
            Map<String, Object> data,
            List<Map<String, Object>> members,
            Map<String, Double> groupQuota,
            int academicYear) {
        ClassPathResource template = new ClassPathResource(TEMPLATE_PATH);
        if (!template.exists()) {
            throw new ErrorException("Không tìm thấy template xuất Word thống kê nhóm", HttpStatus.NOT_FOUND);
        }

        try (InputStream in = template.getInputStream();
             XWPFDocument doc = new XWPFDocument(in);
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            fillHeader(doc, group, data, members, academicYear);
            fillMemberTable(doc, members);
            fillQuotaTable(doc, groupQuota);
            doc.write(out);
            return out.toByteArray();
        } catch (IOException e) {
            throw new ErrorException("Không thể xuất file Word thống kê nhóm: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private void fillHeader(
            XWPFDocument doc,
            ResearchGroup group,
            Map<String, Object> data,
            List<Map<String, Object>> members,
            int academicYear) {
        List<XWPFParagraph> paragraphs = doc.getParagraphs();
        String unitName = members.stream()
                .map(m -> stringValue(m.get("address")))
                .filter(s -> !s.isBlank())
                .findFirst()
                .orElse("");

        setParagraphText(paragraphs, 0,
                "DANH SÁCH THÀNH VIÊN VÀ ĐỊNH MỨC NHIỆM VỤ KH&CN CỦA CÁC NHÓM NGHIÊN CỨU NĂM "
                        + academicYear,
                true,
                true);
        setParagraphText(paragraphs, 1,
                "(Kèm theo Quyết định số 48/QĐ-HVN ngày 06 tháng 01 năm "
                        + academicYear
                        + " của Giám đốc Học viện Nông nghiệp Việt Nam)",
                false,
                true);
        setParagraphText(paragraphs, 2, "Đơn vị: " + unitName, false, false);
        setParagraphText(paragraphs, 3, groupLabel(group) + ": " + data.getOrDefault("groupName", ""), true, false);
    }

    private void fillMemberTable(XWPFDocument doc, List<Map<String, Object>> members) {
        if (doc.getTables().isEmpty()) {
            throw new ErrorException("Template Word thiếu bảng danh sách thành viên", HttpStatus.INTERNAL_SERVER_ERROR);
        }
        XWPFTable table = doc.getTables().get(0);
        XWPFTableRow prototype = table.getNumberOfRows() > 1 ? table.getRow(1) : table.getRow(0);
        int desiredRows = 1 + Math.max(1, members.size());

        while (table.getNumberOfRows() > desiredRows) {
            table.removeRow(table.getNumberOfRows() - 1);
        }
        while (table.getNumberOfRows() < desiredRows) {
            table.addRow(new XWPFTableRow((CTRow) prototype.getCtRow().copy(), table));
        }

        if (members.isEmpty()) {
            fillMemberRow(table.getRow(1), 1, Map.of());
            return;
        }
        for (int i = 0; i < members.size(); i++) {
            fillMemberRow(table.getRow(i + 1), i + 1, members.get(i));
        }
    }

    private void fillMemberRow(XWPFTableRow row, int index, Map<String, Object> member) {
        setCellText(row.getCell(0), member.isEmpty() ? "" : String.valueOf(index), false, ParagraphAlignment.CENTER);
        setCellText(row.getCell(1), stringValue(member.get("name")), false, ParagraphAlignment.LEFT);
        setCellText(row.getCell(2), stringValue(member.get("chucDanh")), false, ParagraphAlignment.CENTER);
        setCellText(row.getCell(3), stringValue(member.get("role")), false, ParagraphAlignment.CENTER);
        setCellText(row.getCell(4), stringValue(member.get("address")), false, ParagraphAlignment.CENTER);
        setCellText(row.getCell(5), formatNumber(numberValue(member.get("participationPercent"))), false,
                ParagraphAlignment.CENTER);
    }

    private void fillQuotaTable(XWPFDocument doc, Map<String, Double> groupQuota) {
        if (doc.getTables().size() < 2) {
            throw new ErrorException("Template Word thiếu bảng định mức nhóm", HttpStatus.INTERNAL_SERVER_ERROR);
        }
        XWPFTable table = doc.getTables().get(1);
        if (table.getNumberOfRows() < 3) {
            throw new ErrorException("Bảng định mức trong template không đúng cấu trúc",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
        XWPFTableRow valuesRow = table.getRow(2);
        for (int i = 0; i < Math.min(TEMPLATE_QUOTA_CODES.size(), valuesRow.getTableCells().size()); i++) {
            String code = TEMPLATE_QUOTA_CODES.get(i);
            double value = groupQuota.getOrDefault(code, 0.0);
            setCellText(valuesRow.getCell(i), formatNumber(value), false, ParagraphAlignment.CENTER);
        }
    }

    private static void setParagraphText(
            List<XWPFParagraph> paragraphs,
            int index,
            String text,
            boolean bold,
            boolean center) {
        if (index >= paragraphs.size()) {
            return;
        }
        XWPFParagraph paragraph = paragraphs.get(index);
        paragraph.setAlignment(center ? ParagraphAlignment.CENTER : ParagraphAlignment.LEFT);
        for (int i = paragraph.getRuns().size() - 1; i >= 0; i--) {
            paragraph.removeRun(i);
        }
        XWPFRun run = paragraph.createRun();
        run.setText(text != null ? text : "");
        run.setBold(bold);
        run.setFontFamily("Times New Roman");
        run.setFontSize(index <= 1 ? 12 : 11);
        if (index == 1) {
            run.setItalic(true);
        }
    }

    private static void setCellText(
            XWPFTableCell cell,
            String text,
            boolean bold,
            ParagraphAlignment alignment) {
        if (cell == null) {
            return;
        }
        for (int i = cell.getParagraphs().size() - 1; i >= 0; i--) {
            cell.removeParagraph(i);
        }
        XWPFParagraph paragraph = cell.addParagraph();
        paragraph.setAlignment(alignment);
        XWPFRun run = paragraph.createRun();
        run.setText(text != null ? text : "");
        run.setBold(bold);
        run.setFontFamily("Times New Roman");
        run.setFontSize(10);
    }

    private static String groupLabel(ResearchGroup group) {
        String kind = NckhGroupQuotaRules.resolveGroupKind(group.getGroupType());
        if ("XUAT_SAC".equals(kind)) {
            return "Nhóm nghiên cứu xuất sắc";
        }
        if ("TINH_HOA".equals(kind)) {
            return "Nhóm nghiên cứu tinh hoa";
        }
        return "Nhóm Nghiên cứu mạnh";
    }

    private static String stringValue(Object value) {
        return Objects.toString(value, "");
    }

    private static double numberValue(Object value) {
        return value instanceof Number n ? n.doubleValue() : 0;
    }

    private static String formatNumber(double value) {
        DecimalFormatSymbols symbols = DecimalFormatSymbols.getInstance(new Locale("vi", "VN"));
        DecimalFormat format = new DecimalFormat("#,##0.##", symbols);
        return format.format(value);
    }

    private static String safeFileName(String fileName) {
        String normalized = fileName == null ? "ThongKeDinhMucNhom.docx" : fileName;
        return normalized.replaceAll("[\\\\/:*?\"<>|]+", "_").replaceAll("\\s+", "_");
    }
}
