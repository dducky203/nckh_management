package com.example.server.service;

import com.example.server.domain.Resume;
import com.example.server.repository.ResumeRepository;
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
public class ResumeService {
    @Autowired
    private ResumeRepository resumeRepository;



    public void deleteById(Integer integer) {
        resumeRepository.deleteById(integer);
    }

    public <S extends Resume> List<S> findAll(Example<S> example, Sort sort) {
        return resumeRepository.findAll(example, sort);
    }

    public <S extends Resume> List<S> saveAllAndFlush(Iterable<S> entities) {
        return resumeRepository.saveAllAndFlush(entities);
    }

    public <S extends Resume> boolean exists(Example<S> example) {
        return resumeRepository.exists(example);
    }

    public <S extends Resume> List<S> findAll(Example<S> example) {
        return resumeRepository.findAll(example);
    }

    public <S extends Resume> List<S> saveAll(Iterable<S> entities) {
        return resumeRepository.saveAll(entities);
    }

    public <S extends Resume> S saveAndFlush(S entity) {
        return resumeRepository.saveAndFlush(entity);
    }

    public void delete(Resume entity) {
        resumeRepository.delete(entity);
    }

    public <S extends Resume> long count(Example<S> example) {
        return resumeRepository.count(example);
    }

    public void deleteAllInBatch(Iterable<Resume> entities) {
        resumeRepository.deleteAllInBatch(entities);
    }

    public List<Resume> findAll() {
        return resumeRepository.findAll();
    }

    public List<Resume> findAllById(Iterable<Integer> integers) {
        return resumeRepository.findAllById(integers);
    }

    public long count() {
        return resumeRepository.count();
    }

    public <S extends Resume> Page<S> findAll(Example<S> example, Pageable pageable) {
        return resumeRepository.findAll(example, pageable);
    }

    @Deprecated
    public void deleteInBatch(Iterable<Resume> entities) {
        resumeRepository.deleteInBatch(entities);
    }

    public Optional<Resume> findById(Integer integer) {
        return resumeRepository.findById(integer);
    }

    @Deprecated
    public Resume getOne(Integer integer) {
        return resumeRepository.getOne(integer);
    }

    public void deleteAllInBatch() {
        resumeRepository.deleteAllInBatch();
    }

    public void deleteAll() {
        resumeRepository.deleteAll();
    }

    public boolean existsById(Integer integer) {
        return resumeRepository.existsById(integer);
    }

    public void deleteAllByIdInBatch(Iterable<Integer> integers) {
        resumeRepository.deleteAllByIdInBatch(integers);
    }

    public void flush() {
        resumeRepository.flush();
    }

    public <S extends Resume> Optional<S> findOne(Example<S> example) {
        return resumeRepository.findOne(example);
    }

    public Resume getReferenceById(Integer integer) {
        return resumeRepository.getReferenceById(integer);
    }

    public <S extends Resume> S save(S entity) {
        return resumeRepository.save(entity);
    }

    public void deleteAllById(Iterable<? extends Integer> integers) {
        resumeRepository.deleteAllById(integers);
    }

    public <S extends Resume, R> R findBy(Example<S> example, Function<FluentQuery.FetchableFluentQuery<S>, R> queryFunction) {
        return resumeRepository.findBy(example, queryFunction);
    }

    public Page<Resume> findAll(Pageable pageable) {
        return resumeRepository.findAll(pageable);
    }

    @Deprecated
    public Resume getById(Integer integer) {
        return resumeRepository.getById(integer);
    }

    public void deleteAll(Iterable<? extends Resume> entities) {
        resumeRepository.deleteAll(entities);
    }

    public List<Resume> findAll(Sort sort) {
        return resumeRepository.findAll(sort);
    }
}
