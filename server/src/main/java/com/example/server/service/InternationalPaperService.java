package com.example.server.service;

import com.example.server.DTO.AllEventDto;
import com.example.server.domain.InternationalPaper;
import com.example.server.repository.InternationalPaperRepository;
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
public class InternationalPaperService {
    @Autowired
    InternationalPaperRepository internationalPaperRepository;

    public String saveE(AllEventDto allEventDto) {
        InternationalPaper internationalPaper = allEventDto.getInternationalPaper();
        internationalPaperRepository.save(internationalPaper);
        return "null";
    }

    public Optional<InternationalPaper> findById(Integer integer) {
        return internationalPaperRepository.findById(integer);
    }

    @Deprecated
    public InternationalPaper getOne(Integer integer) {
        return internationalPaperRepository.getOne(integer);
    }

    public List<InternationalPaper> findAllById(Iterable<Integer> integers) {
        return internationalPaperRepository.findAllById(integers);
    }

    public void deleteAll() {
        internationalPaperRepository.deleteAll();
    }

    @Deprecated
    public InternationalPaper getById(Integer integer) {
        return internationalPaperRepository.getById(integer);
    }

    public <S extends InternationalPaper> Page<S> findAll(Example<S> example, Pageable pageable) {
        return internationalPaperRepository.findAll(example, pageable);
    }

    public Page<InternationalPaper> findAll(Pageable pageable) {
        return internationalPaperRepository.findAll(pageable);
    }

    public <S extends InternationalPaper> Optional<S> findOne(Example<S> example) {
        return internationalPaperRepository.findOne(example);
    }

    public void flush() {
        internationalPaperRepository.flush();
    }

    public InternationalPaper getReferenceById(Integer integer) {
        return internationalPaperRepository.getReferenceById(integer);
    }

    public <S extends InternationalPaper> List<S> saveAll(Iterable<S> entities) {
        return internationalPaperRepository.saveAll(entities);
    }

    public <S extends InternationalPaper> S saveAndFlush(S entity) {
        return internationalPaperRepository.saveAndFlush(entity);
    }

    public <S extends InternationalPaper> List<S> findAll(Example<S> example) {
        return internationalPaperRepository.findAll(example);
    }

    public List<InternationalPaper> findAll() {
        return internationalPaperRepository.findAll();
    }

    public boolean existsById(Integer integer) {
        return internationalPaperRepository.existsById(integer);
    }

    public void deleteById(Integer integer) {
        internationalPaperRepository.deleteById(integer);
    }

    public <S extends InternationalPaper> boolean exists(Example<S> example) {
        return internationalPaperRepository.exists(example);
    }

    public <S extends InternationalPaper> List<S> saveAllAndFlush(Iterable<S> entities) {
        return internationalPaperRepository.saveAllAndFlush(entities);
    }

    public <S extends InternationalPaper> List<S> findAll(Example<S> example, Sort sort) {
        return internationalPaperRepository.findAll(example, sort);
    }

    @Deprecated
    public void deleteInBatch(Iterable<InternationalPaper> entities) {
        internationalPaperRepository.deleteInBatch(entities);
    }

    public <S extends InternationalPaper, R> R findBy(Example<S> example, Function<FluentQuery.FetchableFluentQuery<S>, R> queryFunction) {
        return internationalPaperRepository.findBy(example, queryFunction);
    }

    public long count() {
        return internationalPaperRepository.count();
    }

    public void deleteAllInBatch(Iterable<InternationalPaper> entities) {
        internationalPaperRepository.deleteAllInBatch(entities);
    }

    public <S extends InternationalPaper> S save(S entity) {
        return internationalPaperRepository.save(entity);
    }

    public void deleteAllById(Iterable<? extends Integer> integers) {
        internationalPaperRepository.deleteAllById(integers);
    }

    public void deleteAll(Iterable<? extends InternationalPaper> entities) {
        internationalPaperRepository.deleteAll(entities);
    }

    public List<InternationalPaper> findAll(Sort sort) {
        return internationalPaperRepository.findAll(sort);
    }

    public <S extends InternationalPaper> long count(Example<S> example) {
        return internationalPaperRepository.count(example);
    }

    public void deleteAllByIdInBatch(Iterable<Integer> integers) {
        internationalPaperRepository.deleteAllByIdInBatch(integers);
    }

    public void delete(InternationalPaper entity) {
        internationalPaperRepository.delete(entity);
    }

    public void deleteAllInBatch() {
        internationalPaperRepository.deleteAllInBatch();
    }
}
