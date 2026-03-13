package com.example.server.mapper;

import com.example.server.DTO.nckh.NckhTieuChiDinhMucResponse;
import com.example.server.domain.nckh.NckhTieuChiDinhMuc;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface NckhTieuChiDinhMucMapper {

    @Mapping(source = "chucDanh", target = "chucDanh")
    NckhTieuChiDinhMucResponse toResponse(NckhTieuChiDinhMuc entity);

    List<NckhTieuChiDinhMucResponse> toResponseList(List<NckhTieuChiDinhMuc> entities);
}
