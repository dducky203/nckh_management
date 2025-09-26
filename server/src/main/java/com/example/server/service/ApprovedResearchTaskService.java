package com.example.server.service;

import com.example.server.DTO.AllEventDto;
import com.example.server.domain.ApprovedResearchTask;
import com.example.server.repository.ApprovedResearchTaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.repository.query.FluentQuery;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.function.Function;

@Service
public class ApprovedResearchTaskService {
    @Autowired
    ApprovedResearchTaskRepository approvedResearchTaskRepository;

    public String saveE(AllEventDto allEventDto){
        ApprovedResearchTask approvedResearchTask = allEventDto.getApprovedResearchTask();
        LocalDate startDate = approvedResearchTask.getStartTime();
        LocalDate endDate = approvedResearchTask.getEndTime();
        if (startDate != null && endDate != null) {
            if (startDate.isAfter(endDate)) {
                // Báo lỗi hoặc xử lý logic
                return "Ngày bắt đầu phải trước ngày kết thúc!";
            }
        }
        approvedResearchTaskRepository.save(approvedResearchTask);
        return "null";
    }

    @Deprecated
    public com.example.server.domain.ApprovedResearchTask getById(Integer integer) {
        return approvedResearchTaskRepository.getById(integer);
    }

    public Page<com.example.server.domain.ApprovedResearchTask> findAll(Pageable pageable) {
        return approvedResearchTaskRepository.findAll(pageable);
    }

    public <S extends com.example.server.domain.ApprovedResearchTask> Page<S> findAll(Example<S> example, Pageable pageable) {
        return approvedResearchTaskRepository.findAll(example, pageable);
    }

    public boolean existsById(Integer integer) {
        return approvedResearchTaskRepository.existsById(integer);
    }

    @Deprecated
    public com.example.server.domain.ApprovedResearchTask getOne(Integer integer) {
        return approvedResearchTaskRepository.getOne(integer);
    }

    public void deleteAllInBatch() {
        approvedResearchTaskRepository.deleteAllInBatch();
    }

    public <S extends com.example.server.domain.ApprovedResearchTask> List<S> findAll(Example<S> example) {
        return approvedResearchTaskRepository.findAll(example);
    }

    public void deleteAll() {
        approvedResearchTaskRepository.deleteAll();
    }

    public <S extends com.example.server.domain.ApprovedResearchTask> S saveAndFlush(S entity) {
        return approvedResearchTaskRepository.saveAndFlush(entity);
    }

    public void deleteAll(Iterable<? extends com.example.server.domain.ApprovedResearchTask> entities) {
        approvedResearchTaskRepository.deleteAll(entities);
    }

    public com.example.server.domain.ApprovedResearchTask getReferenceById(Integer integer) {
        return approvedResearchTaskRepository.getReferenceById(integer);
    }

    public Optional<com.example.server.domain.ApprovedResearchTask> findById(Integer integer) {
        return approvedResearchTaskRepository.findById(integer);
    }

    public <S extends com.example.server.domain.ApprovedResearchTask> Optional<S> findOne(Example<S> example) {
        return approvedResearchTaskRepository.findOne(example);
    }

    public void flush() {
        approvedResearchTaskRepository.flush();
    }

    public <S extends com.example.server.domain.ApprovedResearchTask> List<S> saveAll(Iterable<S> entities) {
        return approvedResearchTaskRepository.saveAll(entities);
    }

    @Deprecated
    public void deleteInBatch(Iterable<com.example.server.domain.ApprovedResearchTask> entities) {
        approvedResearchTaskRepository.deleteInBatch(entities);
    }

    public void delete(com.example.server.domain.ApprovedResearchTask entity) {
        approvedResearchTaskRepository.delete(entity);
    }

    public <S extends com.example.server.domain.ApprovedResearchTask, R> R findBy(Example<S> example, Function<FluentQuery.FetchableFluentQuery<S>, R> queryFunction) {
        return approvedResearchTaskRepository.findBy(example, queryFunction);
    }

    public <S extends com.example.server.domain.ApprovedResearchTask> List<S> findAll(Example<S> example, Sort sort) {
        return approvedResearchTaskRepository.findAll(example, sort);
    }

    public List<com.example.server.domain.ApprovedResearchTask> findAll(Sort sort) {
        return approvedResearchTaskRepository.findAll(sort);
    }

    public List<com.example.server.domain.ApprovedResearchTask> findAll() {
        return approvedResearchTaskRepository.findAll();
    }

    public void deleteAllById(Iterable<? extends Integer> integers) {
        approvedResearchTaskRepository.deleteAllById(integers);
    }

    public <S extends com.example.server.domain.ApprovedResearchTask> List<S> saveAllAndFlush(Iterable<S> entities) {
        return approvedResearchTaskRepository.saveAllAndFlush(entities);
    }

    public <S extends com.example.server.domain.ApprovedResearchTask> S save(S entity) {
        return approvedResearchTaskRepository.save(entity);
    }

    public <S extends com.example.server.domain.ApprovedResearchTask> boolean exists(Example<S> example) {
        return approvedResearchTaskRepository.exists(example);
    }

    public List<com.example.server.domain.ApprovedResearchTask> findAllById(Iterable<Integer> integers) {
        return approvedResearchTaskRepository.findAllById(integers);
    }

    public long count() {
        return approvedResearchTaskRepository.count();
    }

    public void deleteAllByIdInBatch(Iterable<Integer> integers) {
        approvedResearchTaskRepository.deleteAllByIdInBatch(integers);
    }

    public <S extends com.example.server.domain.ApprovedResearchTask> long count(Example<S> example) {
        return approvedResearchTaskRepository.count(example);
    }

    public void deleteById(Integer integer) {
        approvedResearchTaskRepository.deleteById(integer);
    }

    public void deleteAllInBatch(Iterable<com.example.server.domain.ApprovedResearchTask> entities) {
        approvedResearchTaskRepository.deleteAllInBatch(entities);
    }
}
