package com.example.server.service.nckh;

import com.example.server.DTO.nckh.NckhTieuChiDinhMucRequest;
import com.example.server.DTO.nckh.NckhTieuChiDinhMucResponse;

import java.util.List;

public interface NckhTieuChiDinhMucService {
    NckhTieuChiDinhMucResponse create(NckhTieuChiDinhMucRequest request);

    NckhTieuChiDinhMucResponse update(Long id, NckhTieuChiDinhMucRequest request);

    NckhTieuChiDinhMucResponse getById(Long id);

    List<NckhTieuChiDinhMucResponse> getAll(Integer phuongAn, String chucDanh);

    void delete(Long id);
}
