package com.example.server.service;

import com.example.server.DTO.AllEventDto;
import com.example.server.domain.ActiveInCouncil;
import com.example.server.domain.Conference;
import com.example.server.repository.ActiveInCouncilRepository;
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
public class ActiveInCouncilService {
    @Autowired
    private ActiveInCouncilRepository activeInCouncilRepository;
    public String saveE(AllEventDto allEventDto){
        //
        ActiveInCouncil activeInCouncil = allEventDto.getActiveInCouncil();
        Integer idEvent = activeInCouncil.getIdEvent();
        ActiveInCouncil currentData = activeInCouncilRepository.findByIdEvent(idEvent);
        if (currentData == null) {
            // Nếu là tạo mới, thì lưu thẳng
            activeInCouncilRepository.save(activeInCouncil);
        } else {
            // Cập nhật từng field nếu có dữ liệu mới, giữ nguyên nếu không có
            if (activeInCouncil.getPresentationFile() != null && !activeInCouncil.getPresentationFile().isEmpty()) {
                currentData.setPresentationFile(activeInCouncil.getPresentationFile());
            }

            if (activeInCouncil.getMinutesOfMeeting() != null && !activeInCouncil.getMinutesOfMeeting().isEmpty()) {
                currentData.setMinutesOfMeeting(activeInCouncil.getMinutesOfMeeting());
            }

            if (activeInCouncil.getImage() != null && !activeInCouncil.getImage().isEmpty()) {
                currentData.setImage(activeInCouncil.getImage());
            }

            activeInCouncilRepository.save(currentData);
        }
        return "null";
    }

    public void flush() {
        activeInCouncilRepository.flush();
    }

    public <S extends ActiveInCouncil> List<S> saveAll(Iterable<S> entities) {
        return activeInCouncilRepository.saveAll(entities);
    }

    public void deleteAllById(Iterable<? extends Integer> integers) {
        activeInCouncilRepository.deleteAllById(integers);
    }

    public <S extends ActiveInCouncil> Optional<S> findOne(Example<S> example) {
        return activeInCouncilRepository.findOne(example);
    }

    public <S extends ActiveInCouncil, R> R findBy(Example<S> example, Function<FluentQuery.FetchableFluentQuery<S>, R> queryFunction) {
        return activeInCouncilRepository.findBy(example, queryFunction);
    }

    @Deprecated
    public void deleteInBatch(Iterable<ActiveInCouncil> entities) {
        activeInCouncilRepository.deleteInBatch(entities);
    }

    public void delete(ActiveInCouncil entity) {
        activeInCouncilRepository.delete(entity);
    }

    public void deleteAllByIdInBatch(Iterable<Integer> integers) {
        activeInCouncilRepository.deleteAllByIdInBatch(integers);
    }

    public void deleteAllInBatch(Iterable<ActiveInCouncil> entities) {
        activeInCouncilRepository.deleteAllInBatch(entities);
    }

    public void deleteById(Integer integer) {
        activeInCouncilRepository.deleteById(integer);
    }

    public long count() {
        return activeInCouncilRepository.count();
    }

    public <S extends ActiveInCouncil> List<S> saveAllAndFlush(Iterable<S> entities) {
        return activeInCouncilRepository.saveAllAndFlush(entities);
    }

    public List<ActiveInCouncil> findAllById(Iterable<Integer> integers) {
        return activeInCouncilRepository.findAllById(integers);
    }

    public <S extends ActiveInCouncil> List<S> findAll(Example<S> example) {
        return activeInCouncilRepository.findAll(example);
    }

    public List<ActiveInCouncil> findAll() {
        return activeInCouncilRepository.findAll();
    }

    public <S extends ActiveInCouncil> List<S> findAll(Example<S> example, Sort sort) {
        return activeInCouncilRepository.findAll(example, sort);
    }

    public <S extends ActiveInCouncil> Page<S> findAll(Example<S> example, Pageable pageable) {
        return activeInCouncilRepository.findAll(example, pageable);
    }

    public boolean existsById(Integer integer) {
        return activeInCouncilRepository.existsById(integer);
    }

    public Page<ActiveInCouncil> findAll(Pageable pageable) {
        return activeInCouncilRepository.findAll(pageable);
    }

    @Deprecated
    public ActiveInCouncil getById(Integer integer) {
        return activeInCouncilRepository.getById(integer);
    }

    public <S extends ActiveInCouncil> S saveAndFlush(S entity) {
        return activeInCouncilRepository.saveAndFlush(entity);
    }

    public <S extends ActiveInCouncil> long count(Example<S> example) {
        return activeInCouncilRepository.count(example);
    }

    public ActiveInCouncil getReferenceById(Integer integer) {
        return activeInCouncilRepository.getReferenceById(integer);
    }

    public Optional<ActiveInCouncil> findById(Integer integer) {
        return activeInCouncilRepository.findById(integer);
    }

    public void deleteAllInBatch() {
        activeInCouncilRepository.deleteAllInBatch();
    }

    public void deleteAll() {
        activeInCouncilRepository.deleteAll();
    }

    public void deleteAll(Iterable<? extends ActiveInCouncil> entities) {
        activeInCouncilRepository.deleteAll(entities);
    }

    public List<ActiveInCouncil> findAll(Sort sort) {
        return activeInCouncilRepository.findAll(sort);
    }

    public <S extends ActiveInCouncil> S save(S entity) {
        return activeInCouncilRepository.save(entity);
    }

    public <S extends ActiveInCouncil> boolean exists(Example<S> example) {
        return activeInCouncilRepository.exists(example);
    }

    @Deprecated
    public ActiveInCouncil getOne(Integer integer) {
        return activeInCouncilRepository.getOne(integer);
    }
}
