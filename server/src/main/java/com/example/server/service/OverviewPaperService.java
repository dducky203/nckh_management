package com.example.server.service;

import com.example.server.DTO.AllEventDto;
import com.example.server.domain.OverviewPaper;
import com.example.server.repository.OverviewPaperRepository;
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
public class OverviewPaperService {
    @Autowired
    OverviewPaperRepository overviewPaperRepository;

    public String saveE(AllEventDto allEventDto) {
        OverviewPaper overviewPaper = allEventDto.getOverviewPaper();
        overviewPaperRepository.save(overviewPaper);
        return "null";
    }

    @Deprecated
    public OverviewPaper getById(Integer integer) {
        return overviewPaperRepository.getById(integer);
    }

    public <S extends OverviewPaper> Page<S> findAll(Example<S> example, Pageable pageable) {
        return overviewPaperRepository.findAll(example, pageable);
    }

    public boolean existsById(Integer integer) {
        return overviewPaperRepository.existsById(integer);
    }

    public <S extends OverviewPaper> long count(Example<S> example) {
        return overviewPaperRepository.count(example);
    }

    public <S extends OverviewPaper> S saveAndFlush(S entity) {
        return overviewPaperRepository.saveAndFlush(entity);
    }

    public Page<OverviewPaper> findAll(Pageable pageable) {
        return overviewPaperRepository.findAll(pageable);
    }

    public OverviewPaper getReferenceById(Integer integer) {
        return overviewPaperRepository.getReferenceById(integer);
    }

    public void flush() {
        overviewPaperRepository.flush();
    }

    public Optional<OverviewPaper> findById(Integer integer) {
        return overviewPaperRepository.findById(integer);
    }

    public <S extends OverviewPaper> List<S> saveAllAndFlush(Iterable<S> entities) {
        return overviewPaperRepository.saveAllAndFlush(entities);
    }

    public long count() {
        return overviewPaperRepository.count();
    }

    public <S extends OverviewPaper> List<S> findAll(Example<S> example) {
        return overviewPaperRepository.findAll(example);
    }

    @Deprecated
    public void deleteInBatch(Iterable<OverviewPaper> entities) {
        overviewPaperRepository.deleteInBatch(entities);
    }

    public List<OverviewPaper> findAll() {
        return overviewPaperRepository.findAll();
    }

    public List<OverviewPaper> findAllById(Iterable<Integer> integers) {
        return overviewPaperRepository.findAllById(integers);
    }

    public <S extends OverviewPaper> List<S> findAll(Example<S> example, Sort sort) {
        return overviewPaperRepository.findAll(example, sort);
    }

    public void deleteAllInBatch(Iterable<OverviewPaper> entities) {
        overviewPaperRepository.deleteAllInBatch(entities);
    }

    public <S extends OverviewPaper> S save(S entity) {
        return overviewPaperRepository.save(entity);
    }

    public void deleteAllById(Iterable<? extends Integer> integers) {
        overviewPaperRepository.deleteAllById(integers);
    }

    public <S extends OverviewPaper> List<S> saveAll(Iterable<S> entities) {
        return overviewPaperRepository.saveAll(entities);
    }

    public <S extends OverviewPaper> Optional<S> findOne(Example<S> example) {
        return overviewPaperRepository.findOne(example);
    }

    public <S extends OverviewPaper, R> R findBy(Example<S> example, Function<FluentQuery.FetchableFluentQuery<S>, R> queryFunction) {
        return overviewPaperRepository.findBy(example, queryFunction);
    }

    public void deleteAllByIdInBatch(Iterable<Integer> integers) {
        overviewPaperRepository.deleteAllByIdInBatch(integers);
    }

    public void delete(OverviewPaper entity) {
        overviewPaperRepository.delete(entity);
    }

    public void deleteById(Integer integer) {
        overviewPaperRepository.deleteById(integer);
    }

    public <S extends OverviewPaper> boolean exists(Example<S> example) {
        return overviewPaperRepository.exists(example);
    }

    public void deleteAllInBatch() {
        overviewPaperRepository.deleteAllInBatch();
    }

    public void deleteAll() {
        overviewPaperRepository.deleteAll();
    }

    public void deleteAll(Iterable<? extends OverviewPaper> entities) {
        overviewPaperRepository.deleteAll(entities);
    }

    public List<OverviewPaper> findAll(Sort sort) {
        return overviewPaperRepository.findAll(sort);
    }

    @Deprecated
    public OverviewPaper getOne(Integer integer) {
        return overviewPaperRepository.getOne(integer);
    }
}
