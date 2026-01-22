package com.example.server.service;

import com.example.server.DTO.typeOfCriteria.TypeOfCriteriaDto;
import com.example.server.domain.TypeOfCriterion;
import com.example.server.repository.TypeOfCriterionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.repository.query.FluentQuery;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.function.Function;

@Service
public interface TypeOfCriterionService {
   List<TypeOfCriteriaDto> findAllTypeEvent();

}
