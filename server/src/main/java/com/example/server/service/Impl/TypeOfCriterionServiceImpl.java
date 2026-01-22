package com.example.server.service.Impl;

import com.example.server.DTO.typeOfCriteria.TypeOfCriteriaDto;
import com.example.server.domain.TypeOfCriterion;
import com.example.server.mapper.TypeOfCriteriaMapper;
import com.example.server.repository.TypeOfCriterionRepository;
import com.example.server.service.TypeOfCriterionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TypeOfCriterionServiceImpl implements TypeOfCriterionService {
    @Autowired
    private TypeOfCriterionRepository typeOfCriterionRepository;
    @Autowired
    private TypeOfCriteriaMapper typeOfCriteriaMapper;

    @Override
    public List<TypeOfCriteriaDto> findAllTypeEvent(){
        return typeOfCriteriaMapper.dto(typeOfCriterionRepository.findAllByIsEvent(true))  ;
    }

}
