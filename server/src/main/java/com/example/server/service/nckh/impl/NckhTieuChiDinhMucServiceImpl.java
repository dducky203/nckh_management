package com.example.server.service.nckh.impl;

import com.example.server.DTO.nckh.NckhTieuChiDinhMucRequest;
import com.example.server.DTO.nckh.NckhTieuChiDinhMucResponse;
import com.example.server.domain.nckh.NckhTieuChiDinhMuc;
import com.example.server.mapper.NckhTieuChiDinhMucMapper;
import com.example.server.repository.nckh.NckhTieuChiDinhMucRepository;
import com.example.server.service.nckh.NckhTieuChiDinhMucService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class NckhTieuChiDinhMucServiceImpl implements NckhTieuChiDinhMucService {

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
    public List<NckhTieuChiDinhMucResponse> getAll(Integer phuongAn, String chucDanh) {
        if (phuongAn == null || chucDanh == null) {
            return mapper.toResponseList(repository.findAll());
        }
        return mapper.toResponseList(repository.findByPhuongAnAndChucDanh(phuongAn, chucDanh));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new IllegalStateException("Không tìm thấy tiêu chí định mức với id=" + id);
        }
        repository.deleteById(id);
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
        try {
            return NckhTieuChiDinhMuc.ChucDanh.valueOf(chucDanh.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new IllegalStateException("chuc_danh không hợp lệ. Cho phép: GS_PGS, TS, THS, KS_CN");
        }
    }
}
