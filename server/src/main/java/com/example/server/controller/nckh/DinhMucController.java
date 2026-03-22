package com.example.server.controller.nckh;

import com.example.server.DTO.nckh.NckhTieuChiDinhMucRequest;
import com.example.server.DTO.nckh.NckhTieuChiDinhMucResponse;

import com.example.server.service.nckh.NckhTieuChiDinhMucService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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
            @RequestParam(required = false) String chucDanh

    ) {
        return service.getAll(phuongAn, chucDanh);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
