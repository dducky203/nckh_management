package com.example.server.service;

import com.example.server.DTO.AllEventDto;
import com.example.server.domain.ExpertPresentation;
import com.example.server.domain.Seminar;
import com.example.server.repository.SeminarRepository;
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
public class SeminarService {
    @Autowired
    private SeminarRepository seminarRepository;

    public String saveE(AllEventDto allEventDto) {
        Seminar ep = allEventDto.getSeminar();
        Integer idEvent = ep.getIdEvent(); // hoặc id phù hợp

        Seminar currentData = seminarRepository.findByIdEvent(idEvent);
        if (currentData == null) {
            // Nếu là tạo mới, thì lưu thẳng
            seminarRepository.save(ep);
        } else {
            // Cập nhật từng field nếu có dữ liệu mới, giữ nguyên nếu không có
            if (ep.getPresentationFile() != null && !ep.getPresentationFile().isEmpty()) {
                currentData.setPresentationFile(ep.getPresentationFile());
            }

            if (ep.getMinutesOfMeeting() != null && !ep.getMinutesOfMeeting().isEmpty()) {
                currentData.setMinutesOfMeeting(ep.getMinutesOfMeeting());
            }

            if (ep.getSeminarPhoto() != null && !ep.getSeminarPhoto().isEmpty()) {
                currentData.setSeminarPhoto(ep.getSeminarPhoto());
            }

            seminarRepository.save(currentData);
        }

        return "null";
    }
    public String createE(AllEventDto allEventDto) {
        Seminar ep = allEventDto.getSeminar();
        seminarRepository.save(ep);
        return "null";
    }
    public void deleteById(Integer integer) {
        seminarRepository.deleteById(integer);
    }

    public <S extends Seminar> boolean exists(Example<S> example) {
        return seminarRepository.exists(example);
    }

    public <S extends Seminar> List<S> saveAllAndFlush(Iterable<S> entities) {
        return seminarRepository.saveAllAndFlush(entities);
    }

    public long count() {
        return seminarRepository.count();
    }

    public <S extends Seminar> List<S> findAll(Example<S> example) {
        return seminarRepository.findAll(example);
    }

    public <S extends Seminar> long count(Example<S> example) {
        return seminarRepository.count(example);
    }

    public void delete(Seminar entity) {
        seminarRepository.delete(entity);
    }

    public <S extends Seminar> List<S> saveAll(Iterable<S> entities) {
        return seminarRepository.saveAll(entities);
    }

    public <S extends Seminar> S saveAndFlush(S entity) {
        return seminarRepository.saveAndFlush(entity);
    }

    public Seminar getReferenceById(Integer integer) {
        return seminarRepository.getReferenceById(integer);
    }

    public <S extends Seminar> S save(S entity) {
        return seminarRepository.save(entity);
    }

    public <S extends Seminar> Optional<S> findOne(Example<S> example) {
        return seminarRepository.findOne(example);
    }

    public void deleteAllById(Iterable<? extends Integer> integers) {
        seminarRepository.deleteAllById(integers);
    }

    public void flush() {
        seminarRepository.flush();
    }

    @Deprecated
    public Seminar getById(Integer integer) {
        return seminarRepository.getById(integer);
    }

    public <S extends Seminar, R> R findBy(Example<S> example, Function<FluentQuery.FetchableFluentQuery<S>, R> queryFunction) {
        return seminarRepository.findBy(example, queryFunction);
    }

    public List<Seminar> findAll(Sort sort) {
        return seminarRepository.findAll(sort);
    }

    @Deprecated
    public Seminar getOne(Integer integer) {
        return seminarRepository.getOne(integer);
    }

    public void deleteAll(Iterable<? extends Seminar> entities) {
        seminarRepository.deleteAll(entities);
    }

    public Optional<Seminar> findById(Integer integer) {
        return seminarRepository.findById(integer);
    }

    public void deleteAll() {
        seminarRepository.deleteAll();
    }

    public void deleteAllInBatch() {
        seminarRepository.deleteAllInBatch();
    }

    public Page<Seminar> findAll(Pageable pageable) {
        return seminarRepository.findAll(pageable);
    }

    public void deleteAllByIdInBatch(Iterable<Integer> integers) {
        seminarRepository.deleteAllByIdInBatch(integers);
    }

    public boolean existsById(Integer integer) {
        return seminarRepository.existsById(integer);
    }

    public void deleteAllInBatch(Iterable<Seminar> entities) {
        seminarRepository.deleteAllInBatch(entities);
    }

    public <S extends Seminar> Page<S> findAll(Example<S> example, Pageable pageable) {
        return seminarRepository.findAll(example, pageable);
    }

    @Deprecated
    public void deleteInBatch(Iterable<Seminar> entities) {
        seminarRepository.deleteInBatch(entities);
    }

    public List<Seminar> findAll() {
        return seminarRepository.findAll();
    }

    public <S extends Seminar> List<S> findAll(Example<S> example, Sort sort) {
        return seminarRepository.findAll(example, sort);
    }

    public List<Seminar> findAllById(Iterable<Integer> integers) {
        return seminarRepository.findAllById(integers);
    }
}
