package com.example.server.controller.nckh;

import java.time.Year;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.server.DTO.response.SuccessResponseDTO;
import com.example.server.DTO.nckh.*;
import com.example.server.service.DinhMucAiScanService;
import com.example.server.service.nckh.NckhTieuChiDinhMucService;
import com.example.server.utils.SecurityUtils;

@RestController
@RequestMapping("/nckh/tieu-chi-dinh-muc")
@CrossOrigin(origins = "*")
public class DinhMucController {

    @Autowired
    private NckhTieuChiDinhMucService service;

    @Autowired
    private DinhMucAiScanService aiScanService;

    @PostMapping
    public NckhTieuChiDinhMucResponse create(@RequestBody NckhTieuChiDinhMucRequest request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    public NckhTieuChiDinhMucResponse update(@PathVariable Long id, @RequestBody NckhTieuChiDinhMucRequest request) {
        return service.update(id, request);
    }

    @GetMapping("/{id}")
    public NckhTieuChiDinhMucResponse getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @GetMapping
    public List<NckhTieuChiDinhMucResponse> getAll(
            @RequestParam(required = false) Integer phuongAn,
            @RequestParam(required = false) String chucDanh,
            @RequestParam(required = false) Integer year
    ) {
        SecurityUtils.assertCurrentUserCanAccessQuota();
        int currentYear = year == null ? Year.now().getValue() : year;
        return service.getAll(phuongAn, chucDanh, String.valueOf(currentYear));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    @GetMapping("/export-template")
    public ResponseEntity<ByteArrayResource> exportImportTemplate(
            @RequestParam(required = false) Integer phuongAn,
            @RequestParam(required = false) String chucDanh,
            @RequestParam(required = false) Integer year
    ) {
        int currentYear = year == null ? Year.now().getValue() : year;
        byte[] data = service.exportImportTemplate(phuongAn, chucDanh, String.valueOf(currentYear));
        ByteArrayResource resource = new ByteArrayResource(data);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentDispositionFormData("attachment",
                "[Template]Dinh-muc-" + currentYear + ".xlsx");
        headers.setContentType(MediaType.parseMediaType(
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));

        return ResponseEntity.ok()
                .headers(headers)
                .contentLength(data.length)
                .body(resource);
    }

    @PostMapping("/import")
    public ResponseEntity<ByteArrayResource> importFromExcel(@RequestParam("file") MultipartFile file) {
        try {
            NckhTieuChiDinhMucImportResult result = service.importFromExcel(file);

            ByteArrayResource resource = new ByteArrayResource(result.resultExcel);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentDispositionFormData("attachment", "ket-qua-import-dinh-muc.xlsx");
            headers.setContentType(MediaType.parseMediaType(
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
            headers.set("X-Import-Total", String.valueOf(result.totalRows));
            headers.set("X-Import-Success", String.valueOf(result.successCount));
            headers.set("X-Import-Error", String.valueOf(result.errorCount));

            return ResponseEntity.ok()
                    .headers(headers)
                    .contentLength(result.resultExcel.length)
                    .body(resource);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Quét nhiều ảnh/PDF bằng Gemini AI, trả về danh sách định mức để preview.
     * Frontend hiển thị bảng preview, cho phép sửa rồi gọi /batch-save.
     */
    @PostMapping("/ai-scan")
    public ResponseEntity<SuccessResponseDTO<List<NckhTieuChiDinhMucRequest>>> aiScan(
            @RequestParam("files") List<MultipartFile> files,
            @RequestParam(value = "year", required = false) String year) {

        if (files == null || files.isEmpty()) throw new RuntimeException("Chưa chọn file nào");

        String effectiveYear = (year != null && !year.isBlank())
                ? year
                : String.valueOf(java.time.Year.now().getValue());

        List<NckhTieuChiDinhMucRequest> rows = aiScanService.scanFiles(files, effectiveYear);
        return ResponseEntity.ok(new SuccessResponseDTO<>(rows, "Quét AI thành công: " + rows.size() + " dòng"));
    }

    /**
     * Lưu hàng loạt các dòng định mức đã được confirm từ bước preview.
     */
    @PostMapping("/batch-save")
    public ResponseEntity<SuccessResponseDTO<Integer>> batchSave(
            @RequestBody List<NckhTieuChiDinhMucRequest> rows) {

        if (rows == null || rows.isEmpty()) throw new RuntimeException("Danh sách rỗng");

        int count = 0;
        for (NckhTieuChiDinhMucRequest req : rows) {
            try {
                service.create(req);
                count++;
            } catch (Exception e) {
                // Bỏ qua dòng lỗi, tiếp tục
            }
        }
        return ResponseEntity.ok(new SuccessResponseDTO<>(count,
                "Đã lưu " + count + "/" + rows.size() + " dòng thành công"));
    }
}
