package com.example.server.service;

import com.example.server.DTO.AllEventDto;
import com.example.server.domain.VietnamesePaper;
import com.example.server.repository.VietnamesePaperRepository;
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
public class VietnamesePaperService {
    @Autowired
    private VietnamesePaperRepository vietnamesePaperRepository;

    public String saveE(AllEventDto allEventDto){
        VietnamesePaper vietnamesePaper = allEventDto.getVietnamesePaper();
        vietnamesePaperRepository.save(vietnamesePaper);
        return "null";
    }

    public void deleteAllById(Iterable<? extends Integer> integers) {
        vietnamesePaperRepository.deleteAllById(integers);
    }

    public <S extends VietnamesePaper> List<S> saveAll(Iterable<S> entities) {
        return vietnamesePaperRepository.saveAll(entities);
    }

    public void deleteAllInBatch(Iterable<VietnamesePaper> entities) {
        vietnamesePaperRepository.deleteAllInBatch(entities);
    }

    public <S extends VietnamesePaper> S save(S entity) {
        return vietnamesePaperRepository.save(entity);
    }

    public List<VietnamesePaper> findAll() {
        return vietnamesePaperRepository.findAll();
    }

    public void deleteAllByIdInBatch(Iterable<Integer> integers) {
        vietnamesePaperRepository.deleteAllByIdInBatch(integers);
    }

    public void delete(VietnamesePaper entity) {
        vietnamesePaperRepository.delete(entity);
    }

    public void deleteAll() {
        vietnamesePaperRepository.deleteAll();
    }

    public void deleteAllInBatch() {
        vietnamesePaperRepository.deleteAllInBatch();
    }

    public <S extends VietnamesePaper> boolean exists(Example<S> example) {
        return vietnamesePaperRepository.exists(example);
    }

    @Deprecated
    public VietnamesePaper getOne(Integer integer) {
        return vietnamesePaperRepository.getOne(integer);
    }

    public Optional<VietnamesePaper> findById(Integer integer) {
        return vietnamesePaperRepository.findById(integer);
    }

    public List<VietnamesePaper> findAll(Sort sort) {
        return vietnamesePaperRepository.findAll(sort);
    }

    public void deleteAll(Iterable<? extends VietnamesePaper> entities) {
        vietnamesePaperRepository.deleteAll(entities);
    }

    public Page<VietnamesePaper> findAll(Pageable pageable) {
        return vietnamesePaperRepository.findAll(pageable);
    }

    public <S extends VietnamesePaper> Optional<S> findOne(Example<S> example) {
        return vietnamesePaperRepository.findOne(example);
    }

    public <S extends VietnamesePaper, R> R findBy(Example<S> example, Function<FluentQuery.FetchableFluentQuery<S>, R> queryFunction) {
        return vietnamesePaperRepository.findBy(example, queryFunction);
    }

    @Deprecated
    public VietnamesePaper getById(Integer integer) {
        return vietnamesePaperRepository.getById(integer);
    }

    public <S extends VietnamesePaper> Page<S> findAll(Example<S> example, Pageable pageable) {
        return vietnamesePaperRepository.findAll(example, pageable);
    }

    public void flush() {
        vietnamesePaperRepository.flush();
    }

    public VietnamesePaper getReferenceById(Integer integer) {
        return vietnamesePaperRepository.getReferenceById(integer);
    }

    public <S extends VietnamesePaper> S saveAndFlush(S entity) {
        return vietnamesePaperRepository.saveAndFlush(entity);
    }

    public <S extends VietnamesePaper> long count(Example<S> example) {
        return vietnamesePaperRepository.count(example);
    }

    public boolean existsById(Integer integer) {
        return vietnamesePaperRepository.existsById(integer);
    }

    public <S extends VietnamesePaper> List<S> findAll(Example<S> example) {
        return vietnamesePaperRepository.findAll(example);
    }

    public List<VietnamesePaper> findAllById(Iterable<Integer> integers) {
        return vietnamesePaperRepository.findAllById(integers);
    }

    public long count() {
        return vietnamesePaperRepository.count();
    }

    public <S extends VietnamesePaper> List<S> saveAllAndFlush(Iterable<S> entities) {
        return vietnamesePaperRepository.saveAllAndFlush(entities);
    }

    public void deleteById(Integer integer) {
        vietnamesePaperRepository.deleteById(integer);
    }

    public <S extends VietnamesePaper> List<S> findAll(Example<S> example, Sort sort) {
        return vietnamesePaperRepository.findAll(example, sort);
    }

    @Deprecated
    public void deleteInBatch(Iterable<VietnamesePaper> entities) {
        vietnamesePaperRepository.deleteInBatch(entities);
    }
}
