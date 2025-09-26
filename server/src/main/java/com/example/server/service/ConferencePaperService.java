package com.example.server.service;

import com.example.server.DTO.AllEventDto;
import com.example.server.domain.ConferencePaper;
import com.example.server.repository.ConferencePaperRepository;
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
public class ConferencePaperService {
    @Autowired
    private ConferencePaperRepository conferencePaperRepository;

    public String saveE(AllEventDto allEventDto){
        ConferencePaper conferencePaper = allEventDto.getConferencePaper();
        conferencePaperRepository.save(conferencePaper);
        return "null";
    }

    @Deprecated
    public ConferencePaper getById(Integer integer) {
        return conferencePaperRepository.getById(integer);
    }

    public Page<ConferencePaper> findAll(Pageable pageable) {
        return conferencePaperRepository.findAll(pageable);
    }

    public <S extends ConferencePaper> Page<S> findAll(Example<S> example, Pageable pageable) {
        return conferencePaperRepository.findAll(example, pageable);
    }

    public boolean existsById(Integer integer) {
        return conferencePaperRepository.existsById(integer);
    }

    @Deprecated
    public ConferencePaper getOne(Integer integer) {
        return conferencePaperRepository.getOne(integer);
    }

    public void deleteAllInBatch() {
        conferencePaperRepository.deleteAllInBatch();
    }

    public <S extends ConferencePaper> List<S> findAll(Example<S> example) {
        return conferencePaperRepository.findAll(example);
    }

    public void deleteAll() {
        conferencePaperRepository.deleteAll();
    }

    public <S extends ConferencePaper> S saveAndFlush(S entity) {
        return conferencePaperRepository.saveAndFlush(entity);
    }

    public void deleteAll(Iterable<? extends ConferencePaper> entities) {
        conferencePaperRepository.deleteAll(entities);
    }

    public ConferencePaper getReferenceById(Integer integer) {
        return conferencePaperRepository.getReferenceById(integer);
    }

    public Optional<ConferencePaper> findById(Integer integer) {
        return conferencePaperRepository.findById(integer);
    }

    public <S extends ConferencePaper> Optional<S> findOne(Example<S> example) {
        return conferencePaperRepository.findOne(example);
    }

    public void flush() {
        conferencePaperRepository.flush();
    }

    public <S extends ConferencePaper> List<S> saveAll(Iterable<S> entities) {
        return conferencePaperRepository.saveAll(entities);
    }

    @Deprecated
    public void deleteInBatch(Iterable<ConferencePaper> entities) {
        conferencePaperRepository.deleteInBatch(entities);
    }

    public void delete(ConferencePaper entity) {
        conferencePaperRepository.delete(entity);
    }

    public <S extends ConferencePaper, R> R findBy(Example<S> example, Function<FluentQuery.FetchableFluentQuery<S>, R> queryFunction) {
        return conferencePaperRepository.findBy(example, queryFunction);
    }

    public <S extends ConferencePaper> List<S> findAll(Example<S> example, Sort sort) {
        return conferencePaperRepository.findAll(example, sort);
    }

    public List<ConferencePaper> findAll(Sort sort) {
        return conferencePaperRepository.findAll(sort);
    }

    public List<ConferencePaper> findAll() {
        return conferencePaperRepository.findAll();
    }

    public void deleteAllById(Iterable<? extends Integer> integers) {
        conferencePaperRepository.deleteAllById(integers);
    }

    public <S extends ConferencePaper> List<S> saveAllAndFlush(Iterable<S> entities) {
        return conferencePaperRepository.saveAllAndFlush(entities);
    }

    public <S extends ConferencePaper> S save(S entity) {
        return conferencePaperRepository.save(entity);
    }

    public <S extends ConferencePaper> boolean exists(Example<S> example) {
        return conferencePaperRepository.exists(example);
    }

    public List<ConferencePaper> findAllById(Iterable<Integer> integers) {
        return conferencePaperRepository.findAllById(integers);
    }

    public long count() {
        return conferencePaperRepository.count();
    }

    public void deleteAllByIdInBatch(Iterable<Integer> integers) {
        conferencePaperRepository.deleteAllByIdInBatch(integers);
    }

    public <S extends ConferencePaper> long count(Example<S> example) {
        return conferencePaperRepository.count(example);
    }

    public void deleteById(Integer integer) {
        conferencePaperRepository.deleteById(integer);
    }

    public void deleteAllInBatch(Iterable<ConferencePaper> entities) {
        conferencePaperRepository.deleteAllInBatch(entities);
    }
}
