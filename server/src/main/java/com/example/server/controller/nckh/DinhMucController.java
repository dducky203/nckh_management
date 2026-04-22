package com.example.server.controller.nckh;

import com.example.server.DTO.nckh.NckhTieuChiDinhMucImportResult;
import com.example.server.DTO.nckh.NckhTieuChiDinhMucRequest;
import com.example.server.DTO.nckh.NckhTieuChiDinhMucResponse;

import com.example.server.service.nckh.NckhTieuChiDinhMucService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.Year;
import java.util.List;



@RestController
@RequestMapping("/nckh/tieu-chi-dinh-muc")
public class DinhMucController {

    @Autowired
    private  NckhTieuChiDinhMucService service;

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
        int currentYear =  year == null ? Year.now().getValue() : year;
        return service.getAll(phuongAn, chucDanh, String.valueOf(currentYear) );
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
}
