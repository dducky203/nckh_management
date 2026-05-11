package com.example.server.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.server.DTO.typeOfCriteria.TypeOfCriteriaDto;

@Service
public interface TypeOfCriterionService {
   List<TypeOfCriteriaDto> findAllTypeEvent();

}
