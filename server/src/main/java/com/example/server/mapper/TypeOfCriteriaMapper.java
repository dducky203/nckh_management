package com.example.server.mapper;

import java.util.List;

import org.mapstruct.Mapper;

import com.example.server.DTO.typeOfCriteria.TypeOfCriteriaDto;
import com.example.server.domain.TypeOfCriterion;

@Mapper(componentModel = "spring")
public interface TypeOfCriteriaMapper {
    TypeOfCriteriaDto dto(TypeOfCriterion entity);

    List<TypeOfCriteriaDto> dto(List<TypeOfCriterion> entity);
}
