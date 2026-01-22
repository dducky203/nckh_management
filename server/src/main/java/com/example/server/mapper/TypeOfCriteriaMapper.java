package com.example.server.mapper;

import com.example.server.DTO.typeOfCriteria.TypeOfCriteriaDto;
import com.example.server.domain.TypeOfCriterion;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface TypeOfCriteriaMapper {
    TypeOfCriteriaDto dto(TypeOfCriterion entity);

    List<TypeOfCriteriaDto> dto(List<TypeOfCriterion> entity);
}
