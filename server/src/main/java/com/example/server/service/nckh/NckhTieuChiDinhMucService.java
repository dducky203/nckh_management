package com.example.server.service.nckh;

import com.example.server.DTO.nckh.NckhTieuChiDinhMucImportResult;
import com.example.server.DTO.nckh.NckhTieuChiDinhMucRequest;
import com.example.server.DTO.nckh.NckhTieuChiDinhMucResponse;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface NckhTieuChiDinhMucService {
    NckhTieuChiDinhMucResponse create(NckhTieuChiDinhMucRequest request);

    NckhTieuChiDinhMucResponse update(Long id, NckhTieuChiDinhMucRequest request);

    /** Tạo mới nếu chưa tồn tại, cập nhật nếu đã có (tieuChiCode + chucDanh + year + phuongAn). */
    NckhTieuChiDinhMucResponse upsert(NckhTieuChiDinhMucRequest request);

    NckhTieuChiDinhMucResponse getById(Long id);

    List<NckhTieuChiDinhMucResponse> getAll(Integer phuongAn, String chucDanh , String year);

    void delete(Long id);

    byte[] exportImportTemplate(Integer phuongAn, String chucDanh, String year);

    NckhTieuChiDinhMucImportResult importFromExcel(MultipartFile file) throws IOException;
}
