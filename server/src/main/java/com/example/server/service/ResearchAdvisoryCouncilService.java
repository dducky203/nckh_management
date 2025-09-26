package com.example.server.service;

import com.example.server.DTO.AllEventDto;
import com.example.server.domain.Conference;
import com.example.server.domain.ResearchAdvisoryCouncil;
import com.example.server.repository.ResearchAdvisoryCouncilRepository;
import groovy.transform.AutoClone;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.FluentQuery;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.function.Function;

@Service
public class ResearchAdvisoryCouncilService {
    @Autowired
    ResearchAdvisoryCouncilRepository advisoryCouncilRepository;

    public String saveE(AllEventDto allEventDto){
        ResearchAdvisoryCouncil researchAdvisoryCouncil = allEventDto.getResearchAdvisoryCouncil();
        Integer idEvent = researchAdvisoryCouncil.getIdEvent();
        ResearchAdvisoryCouncil currentData = advisoryCouncilRepository.findByIdEvent(idEvent);
        if (currentData == null) {
            // Nếu là tạo mới, thì lưu thẳng
            advisoryCouncilRepository.save(researchAdvisoryCouncil);
        } else {
            // Cập nhật từng field nếu có dữ liệu mới, giữ nguyên nếu không có
            if (researchAdvisoryCouncil.getDocumentTemplate() != null && !researchAdvisoryCouncil.getDocumentTemplate().isEmpty()) {
                currentData.setDocumentTemplate(researchAdvisoryCouncil.getDocumentTemplate());
            }

            if (researchAdvisoryCouncil.getImage() != null && !researchAdvisoryCouncil.getImage().isEmpty()) {
                currentData.setImage(researchAdvisoryCouncil.getImage());
            }

            advisoryCouncilRepository.save(currentData);
        }
        return "null";
    }

    public Optional<ResearchAdvisoryCouncil> findById(Integer integer) {
        return advisoryCouncilRepository.findById(integer);
    }

    @Deprecated
    public ResearchAdvisoryCouncil getOne(Integer integer) {
        return advisoryCouncilRepository.getOne(integer);
    }

    public boolean existsById(Integer integer) {
        return advisoryCouncilRepository.existsById(integer);
    }

    public void deleteAllByIdInBatch(Iterable<Integer> integers) {
        advisoryCouncilRepository.deleteAllByIdInBatch(integers);
    }

    public void deleteAllInBatch() {
        advisoryCouncilRepository.deleteAllInBatch();
    }

    public ResearchAdvisoryCouncil getReferenceById(Integer integer) {
        return advisoryCouncilRepository.getReferenceById(integer);
    }

    public void flush() {
        advisoryCouncilRepository.flush();
    }

    public <S extends ResearchAdvisoryCouncil> S save(S entity) {
        return advisoryCouncilRepository.save(entity);
    }

    public List<ResearchAdvisoryCouncil> findAll(Sort sort) {
        return advisoryCouncilRepository.findAll(sort);
    }

    public <S extends ResearchAdvisoryCouncil> Optional<S> findOne(Example<S> example) {
        return advisoryCouncilRepository.findOne(example);
    }

    public void deleteAll(Iterable<? extends ResearchAdvisoryCouncil> entities) {
        advisoryCouncilRepository.deleteAll(entities);
    }

    public <S extends ResearchAdvisoryCouncil> S saveAndFlush(S entity) {
        return advisoryCouncilRepository.saveAndFlush(entity);
    }

    public void deleteAllById(Iterable<? extends Integer> integers) {
        advisoryCouncilRepository.deleteAllById(integers);
    }

    public <S extends ResearchAdvisoryCouncil, R> R findBy(Example<S> example, Function<FluentQuery.FetchableFluentQuery<S>, R> queryFunction) {
        return advisoryCouncilRepository.findBy(example, queryFunction);
    }

    public void deleteAll() {
        advisoryCouncilRepository.deleteAll();
    }

    public Page<ResearchAdvisoryCouncil> findAll(Pageable pageable) {
        return advisoryCouncilRepository.findAll(pageable);
    }

    @Deprecated
    public ResearchAdvisoryCouncil getById(Integer integer) {
        return advisoryCouncilRepository.getById(integer);
    }

    public <S extends ResearchAdvisoryCouncil> List<S> findAll(Example<S> example, Sort sort) {
        return advisoryCouncilRepository.findAll(example, sort);
    }

    public <S extends ResearchAdvisoryCouncil> boolean exists(Example<S> example) {
        return advisoryCouncilRepository.exists(example);
    }

    public <S extends ResearchAdvisoryCouncil> List<S> saveAllAndFlush(Iterable<S> entities) {
        return advisoryCouncilRepository.saveAllAndFlush(entities);
    }

    public void deleteById(Integer integer) {
        advisoryCouncilRepository.deleteById(integer);
    }

    public <S extends ResearchAdvisoryCouncil> List<S> saveAll(Iterable<S> entities) {
        return advisoryCouncilRepository.saveAll(entities);
    }

    public <S extends ResearchAdvisoryCouncil> long count(Example<S> example) {
        return advisoryCouncilRepository.count(example);
    }

    public void delete(ResearchAdvisoryCouncil entity) {
        advisoryCouncilRepository.delete(entity);
    }

    public <S extends ResearchAdvisoryCouncil> List<S> findAll(Example<S> example) {
        return advisoryCouncilRepository.findAll(example);
    }

    public void deleteAllInBatch(Iterable<ResearchAdvisoryCouncil> entities) {
        advisoryCouncilRepository.deleteAllInBatch(entities);
    }

    public List<ResearchAdvisoryCouncil> findAll() {
        return advisoryCouncilRepository.findAll();
    }

    public List<ResearchAdvisoryCouncil> findAllById(Iterable<Integer> integers) {
        return advisoryCouncilRepository.findAllById(integers);
    }

    public long count() {
        return advisoryCouncilRepository.count();
    }

    @Deprecated
    public void deleteInBatch(Iterable<ResearchAdvisoryCouncil> entities) {
        advisoryCouncilRepository.deleteInBatch(entities);
    }

    public <S extends ResearchAdvisoryCouncil> Page<S> findAll(Example<S> example, Pageable pageable) {
        return advisoryCouncilRepository.findAll(example, pageable);
    }
}
