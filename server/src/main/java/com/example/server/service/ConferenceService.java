package com.example.server.service;

import com.example.server.DTO.AllEventDto;
import com.example.server.domain.Conference;
import com.example.server.domain.Seminar;
import com.example.server.repository.ConferenceRepository;
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
public class ConferenceService {
    @Autowired
    private ConferenceRepository conferenceRepository;

    public String saveE(AllEventDto allEventDto){
        //
        Conference conference = allEventDto.getConference();
        Integer idEvent = conference.getIdEvent();
        Conference currentData = conferenceRepository.findByIdEvent(idEvent);
        if (currentData == null) {
            // Nếu là tạo mới, thì lưu thẳng
            conferenceRepository.save(conference);
        } else {
            // Cập nhật từng field nếu có dữ liệu mới, giữ nguyên nếu không có
            if (conference.getPresentationFiles() != null && !conference.getPresentationFiles().isEmpty()) {
                currentData.setPresentationFiles(conference.getPresentationFiles());
            }

            if (conference.getMinutesOfMeeting() != null && !conference.getMinutesOfMeeting().isEmpty()) {
                currentData.setMinutesOfMeeting(conference.getMinutesOfMeeting());
            }

            if (conference.getImage() != null && !conference.getImage().isEmpty()) {
                currentData.setImage(conference.getImage());
            }

            conferenceRepository.save(currentData);
        }
        return "null";
    }

    public long count() {
        return conferenceRepository.count();
    }

    public <S extends Conference> List<S> findAll(Example<S> example) {
        return conferenceRepository.findAll(example);
    }

    public <S extends Conference> long count(Example<S> example) {
        return conferenceRepository.count(example);
    }

    public <S extends Conference> S saveAndFlush(S entity) {
        return conferenceRepository.saveAndFlush(entity);
    }

    public Conference getReferenceById(Integer integer) {
        return conferenceRepository.getReferenceById(integer);
    }

    public void flush() {
        conferenceRepository.flush();
    }

    public void deleteById(Integer integer) {
        conferenceRepository.deleteById(integer);
    }

    @Deprecated
    public Conference getById(Integer integer) {
        return conferenceRepository.getById(integer);
    }

    public <S extends Conference, R> R findBy(Example<S> example, Function<FluentQuery.FetchableFluentQuery<S>, R> queryFunction) {
        return conferenceRepository.findBy(example, queryFunction);
    }

    public void delete(Conference entity) {
        conferenceRepository.delete(entity);
    }

    public void deleteAll(Iterable<? extends Conference> entities) {
        conferenceRepository.deleteAll(entities);
    }

    public List<Conference> findAll(Sort sort) {
        return conferenceRepository.findAll(sort);
    }

    @Deprecated
    public Conference getOne(Integer integer) {
        return conferenceRepository.getOne(integer);
    }

    public <S extends Conference> S save(S entity) {
        return conferenceRepository.save(entity);
    }

    public void deleteAllById(Iterable<? extends Integer> integers) {
        conferenceRepository.deleteAllById(integers);
    }

    public <S extends Conference> boolean exists(Example<S> example) {
        return conferenceRepository.exists(example);
    }

    public void deleteAllInBatch() {
        conferenceRepository.deleteAllInBatch();
    }

    public void deleteAll() {
        conferenceRepository.deleteAll();
    }

    public List<Conference> findAllById(Iterable<Integer> integers) {
        return conferenceRepository.findAllById(integers);
    }

    public void deleteAllByIdInBatch(Iterable<Integer> integers) {
        conferenceRepository.deleteAllByIdInBatch(integers);
    }

    public Optional<Conference> findById(Integer integer) {
        return conferenceRepository.findById(integer);
    }

    public Page<Conference> findAll(Pageable pageable) {
        return conferenceRepository.findAll(pageable);
    }

    public <S extends Conference> Optional<S> findOne(Example<S> example) {
        return conferenceRepository.findOne(example);
    }

    public void deleteAllInBatch(Iterable<Conference> entities) {
        conferenceRepository.deleteAllInBatch(entities);
    }

    public <S extends Conference> List<S> saveAll(Iterable<S> entities) {
        return conferenceRepository.saveAll(entities);
    }

    public <S extends Conference> Page<S> findAll(Example<S> example, Pageable pageable) {
        return conferenceRepository.findAll(example, pageable);
    }

    public boolean existsById(Integer integer) {
        return conferenceRepository.existsById(integer);
    }

    @Deprecated
    public void deleteInBatch(Iterable<Conference> entities) {
        conferenceRepository.deleteInBatch(entities);
    }

    public <S extends Conference> List<S> findAll(Example<S> example, Sort sort) {
        return conferenceRepository.findAll(example, sort);
    }

    public <S extends Conference> List<S> saveAllAndFlush(Iterable<S> entities) {
        return conferenceRepository.saveAllAndFlush(entities);
    }

    public List<Conference> findAll() {
        return conferenceRepository.findAll();
    }
}
