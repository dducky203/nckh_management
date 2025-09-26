package com.example.server.service;

import com.example.server.DTO.AllEventDto;
import com.example.server.domain.StudentResearchGuidance;
import com.example.server.repository.StudentResearchGuidanceRepository;
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
public class StudentResearchGuidanceService {
    @Autowired
    private StudentResearchGuidanceRepository studentResearchGuidanceRepository;

    public String saveE(AllEventDto allEventDto){
        StudentResearchGuidance guidance = allEventDto.getStudentResearchGuidance();
        studentResearchGuidanceRepository.save(guidance);
        return "null";
    }

    public List<StudentResearchGuidance> findAll(Sort sort) {
        return studentResearchGuidanceRepository.findAll(sort);
    }

    public void deleteAll(Iterable<? extends StudentResearchGuidance> entities) {
        studentResearchGuidanceRepository.deleteAll(entities);
    }

    public void deleteAllByIdInBatch(Iterable<Integer> integers) {
        studentResearchGuidanceRepository.deleteAllByIdInBatch(integers);
    }

    public List<StudentResearchGuidance> findAll() {
        return studentResearchGuidanceRepository.findAll();
    }

    public <S extends StudentResearchGuidance> S save(S entity) {
        return studentResearchGuidanceRepository.save(entity);
    }

    public <S extends StudentResearchGuidance> Optional<S> findOne(Example<S> example) {
        return studentResearchGuidanceRepository.findOne(example);
    }

    public <S extends StudentResearchGuidance> List<S> saveAll(Iterable<S> entities) {
        return studentResearchGuidanceRepository.saveAll(entities);
    }

    public void deleteAll() {
        studentResearchGuidanceRepository.deleteAll();
    }

    public void deleteAllInBatch(Iterable<StudentResearchGuidance> entities) {
        studentResearchGuidanceRepository.deleteAllInBatch(entities);
    }

    public Optional<StudentResearchGuidance> findById(Integer integer) {
        return studentResearchGuidanceRepository.findById(integer);
    }

    public void delete(StudentResearchGuidance entity) {
        studentResearchGuidanceRepository.delete(entity);
    }

    public Page<StudentResearchGuidance> findAll(Pageable pageable) {
        return studentResearchGuidanceRepository.findAll(pageable);
    }

    public <S extends StudentResearchGuidance> boolean exists(Example<S> example) {
        return studentResearchGuidanceRepository.exists(example);
    }

    @Deprecated
    public StudentResearchGuidance getById(Integer integer) {
        return studentResearchGuidanceRepository.getById(integer);
    }

    public void deleteAllInBatch() {
        studentResearchGuidanceRepository.deleteAllInBatch();
    }

    public void deleteAllById(Iterable<? extends Integer> integers) {
        studentResearchGuidanceRepository.deleteAllById(integers);
    }

    public <S extends StudentResearchGuidance, R> R findBy(Example<S> example, Function<FluentQuery.FetchableFluentQuery<S>, R> queryFunction) {
        return studentResearchGuidanceRepository.findBy(example, queryFunction);
    }

    @Deprecated
    public StudentResearchGuidance getOne(Integer integer) {
        return studentResearchGuidanceRepository.getOne(integer);
    }

    public void flush() {
        studentResearchGuidanceRepository.flush();
    }

    public <S extends StudentResearchGuidance> List<S> findAll(Example<S> example) {
        return studentResearchGuidanceRepository.findAll(example);
    }

    public long count() {
        return studentResearchGuidanceRepository.count();
    }

    public void deleteById(Integer integer) {
        studentResearchGuidanceRepository.deleteById(integer);
    }

    public <S extends StudentResearchGuidance> long count(Example<S> example) {
        return studentResearchGuidanceRepository.count(example);
    }

    public <S extends StudentResearchGuidance> S saveAndFlush(S entity) {
        return studentResearchGuidanceRepository.saveAndFlush(entity);
    }

    public StudentResearchGuidance getReferenceById(Integer integer) {
        return studentResearchGuidanceRepository.getReferenceById(integer);
    }

    public boolean existsById(Integer integer) {
        return studentResearchGuidanceRepository.existsById(integer);
    }

    public <S extends StudentResearchGuidance> List<S> saveAllAndFlush(Iterable<S> entities) {
        return studentResearchGuidanceRepository.saveAllAndFlush(entities);
    }

    public <S extends StudentResearchGuidance> Page<S> findAll(Example<S> example, Pageable pageable) {
        return studentResearchGuidanceRepository.findAll(example, pageable);
    }

    @Deprecated
    public void deleteInBatch(Iterable<StudentResearchGuidance> entities) {
        studentResearchGuidanceRepository.deleteInBatch(entities);
    }

    public <S extends StudentResearchGuidance> List<S> findAll(Example<S> example, Sort sort) {
        return studentResearchGuidanceRepository.findAll(example, sort);
    }

    public List<StudentResearchGuidance> findAllById(Iterable<Integer> integers) {
        return studentResearchGuidanceRepository.findAllById(integers);
    }
}
