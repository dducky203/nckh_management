package com.example.server.service;

import com.example.server.DTO.AllEventDto;
import com.example.server.domain.MinistryTask;
import com.example.server.repository.MinistryTaskRepository;
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
public class MinistryTaskService {
    @Autowired
    private MinistryTaskRepository ministryTaskRepository;

    public String saveE(AllEventDto allEventDto){
        MinistryTask ministryTask = allEventDto.getMinistryTask();
        ministryTaskRepository.save(ministryTask);
        return "null";
    }

    @Deprecated
    public MinistryTask getById(Integer integer) {
        return ministryTaskRepository.getById(integer);
    }

    public <S extends MinistryTask> Page<S> findAll(Example<S> example, Pageable pageable) {
        return ministryTaskRepository.findAll(example, pageable);
    }

    public boolean existsById(Integer integer) {
        return ministryTaskRepository.existsById(integer);
    }

    public <S extends MinistryTask> long count(Example<S> example) {
        return ministryTaskRepository.count(example);
    }

    public <S extends MinistryTask> S saveAndFlush(S entity) {
        return ministryTaskRepository.saveAndFlush(entity);
    }

    public Page<MinistryTask> findAll(Pageable pageable) {
        return ministryTaskRepository.findAll(pageable);
    }

    public MinistryTask getReferenceById(Integer integer) {
        return ministryTaskRepository.getReferenceById(integer);
    }

    public void flush() {
        ministryTaskRepository.flush();
    }

    public Optional<MinistryTask> findById(Integer integer) {
        return ministryTaskRepository.findById(integer);
    }

    public <S extends MinistryTask> List<S> saveAllAndFlush(Iterable<S> entities) {
        return ministryTaskRepository.saveAllAndFlush(entities);
    }

    public long count() {
        return ministryTaskRepository.count();
    }

    public <S extends MinistryTask> List<S> findAll(Example<S> example) {
        return ministryTaskRepository.findAll(example);
    }

    @Deprecated
    public void deleteInBatch(Iterable<MinistryTask> entities) {
        ministryTaskRepository.deleteInBatch(entities);
    }

    public List<MinistryTask> findAll() {
        return ministryTaskRepository.findAll();
    }

    public List<MinistryTask> findAllById(Iterable<Integer> integers) {
        return ministryTaskRepository.findAllById(integers);
    }

    public <S extends MinistryTask> List<S> findAll(Example<S> example, Sort sort) {
        return ministryTaskRepository.findAll(example, sort);
    }

    public void deleteAllInBatch(Iterable<MinistryTask> entities) {
        ministryTaskRepository.deleteAllInBatch(entities);
    }

    public <S extends MinistryTask> S save(S entity) {
        return ministryTaskRepository.save(entity);
    }

    public void deleteAllById(Iterable<? extends Integer> integers) {
        ministryTaskRepository.deleteAllById(integers);
    }

    public <S extends MinistryTask> List<S> saveAll(Iterable<S> entities) {
        return ministryTaskRepository.saveAll(entities);
    }

    public <S extends MinistryTask> Optional<S> findOne(Example<S> example) {
        return ministryTaskRepository.findOne(example);
    }

    public <S extends MinistryTask, R> R findBy(Example<S> example, Function<FluentQuery.FetchableFluentQuery<S>, R> queryFunction) {
        return ministryTaskRepository.findBy(example, queryFunction);
    }

    public void deleteAllByIdInBatch(Iterable<Integer> integers) {
        ministryTaskRepository.deleteAllByIdInBatch(integers);
    }

    public void delete(MinistryTask entity) {
        ministryTaskRepository.delete(entity);
    }

    public void deleteById(Integer integer) {
        ministryTaskRepository.deleteById(integer);
    }

    public <S extends MinistryTask> boolean exists(Example<S> example) {
        return ministryTaskRepository.exists(example);
    }

    public void deleteAllInBatch() {
        ministryTaskRepository.deleteAllInBatch();
    }

    public void deleteAll() {
        ministryTaskRepository.deleteAll();
    }

    public void deleteAll(Iterable<? extends MinistryTask> entities) {
        ministryTaskRepository.deleteAll(entities);
    }

    public List<MinistryTask> findAll(Sort sort) {
        return ministryTaskRepository.findAll(sort);
    }

    @Deprecated
    public MinistryTask getOne(Integer integer) {
        return ministryTaskRepository.getOne(integer);
    }
}
