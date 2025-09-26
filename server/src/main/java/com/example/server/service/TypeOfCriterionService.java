package com.example.server.service;

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
public class TypeOfCriterionService {
    @Autowired
    private TypeOfCriterionRepository typeOfCriterionRepository;

    public void flush() {
        typeOfCriterionRepository.flush();
    }

    public <S extends TypeOfCriterion> S saveAndFlush(S entity) {
        return typeOfCriterionRepository.saveAndFlush(entity);
    }

    public <S extends TypeOfCriterion> List<S> saveAllAndFlush(Iterable<S> entities) {
        return typeOfCriterionRepository.saveAllAndFlush(entities);
    }

    @Deprecated
    public void deleteInBatch(Iterable<TypeOfCriterion> entities) {
        typeOfCriterionRepository.deleteInBatch(entities);
    }

    public void deleteAllInBatch(Iterable<TypeOfCriterion> entities) {
        typeOfCriterionRepository.deleteAllInBatch(entities);
    }

    public void deleteAllByIdInBatch(Iterable<Integer> integers) {
        typeOfCriterionRepository.deleteAllByIdInBatch(integers);
    }

    public void deleteAllInBatch() {
        typeOfCriterionRepository.deleteAllInBatch();
    }

    @Deprecated
    public TypeOfCriterion getOne(Integer integer) {
        return typeOfCriterionRepository.getOne(integer);
    }

    @Deprecated
    public TypeOfCriterion getById(Integer integer) {
        return typeOfCriterionRepository.getById(integer);
    }

    public TypeOfCriterion getReferenceById(Integer integer) {
        return typeOfCriterionRepository.getReferenceById(integer);
    }

    public <S extends TypeOfCriterion> List<S> findAll(Example<S> example) {
        return typeOfCriterionRepository.findAll(example);
    }

    public <S extends TypeOfCriterion> List<S> findAll(Example<S> example, Sort sort) {
        return typeOfCriterionRepository.findAll(example, sort);
    }

    public <S extends TypeOfCriterion> List<S> saveAll(Iterable<S> entities) {
        return typeOfCriterionRepository.saveAll(entities);
    }

    public List<TypeOfCriterion> findAll() {
        return typeOfCriterionRepository.findAll();
    }

    public List<TypeOfCriterion> findAllById(Iterable<Integer> integers) {
        return typeOfCriterionRepository.findAllById(integers);
    }

    public <S extends TypeOfCriterion> S save(S entity) {
        return typeOfCriterionRepository.save(entity);
    }

    public Optional<TypeOfCriterion> findById(Integer integer) {
        return typeOfCriterionRepository.findById(integer);
    }

    public boolean existsById(Integer integer) {
        return typeOfCriterionRepository.existsById(integer);
    }

    public long count() {
        return typeOfCriterionRepository.count();
    }

    public void deleteById(Integer integer) {
        typeOfCriterionRepository.deleteById(integer);
    }

    public void delete(TypeOfCriterion entity) {
        typeOfCriterionRepository.delete(entity);
    }

    public void deleteAllById(Iterable<? extends Integer> integers) {
        typeOfCriterionRepository.deleteAllById(integers);
    }

    public void deleteAll(Iterable<? extends TypeOfCriterion> entities) {
        typeOfCriterionRepository.deleteAll(entities);
    }

    public void deleteAll() {
        typeOfCriterionRepository.deleteAll();
    }

    public List<TypeOfCriterion> findAll(Sort sort) {
        return typeOfCriterionRepository.findAll(sort);
    }

    public Page<TypeOfCriterion> findAll(Pageable pageable) {
        return typeOfCriterionRepository.findAll(pageable);
    }

    public <S extends TypeOfCriterion> Optional<S> findOne(Example<S> example) {
        return typeOfCriterionRepository.findOne(example);
    }

    public <S extends TypeOfCriterion> Page<S> findAll(Example<S> example, Pageable pageable) {
        return typeOfCriterionRepository.findAll(example, pageable);
    }

    public <S extends TypeOfCriterion> long count(Example<S> example) {
        return typeOfCriterionRepository.count(example);
    }

    public <S extends TypeOfCriterion> boolean exists(Example<S> example) {
        return typeOfCriterionRepository.exists(example);
    }

    public <S extends TypeOfCriterion, R> R findBy(Example<S> example, Function<FluentQuery.FetchableFluentQuery<S>, R> queryFunction) {
        return typeOfCriterionRepository.findBy(example, queryFunction);
    }
}
