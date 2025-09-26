package com.example.server.service;

import com.example.server.domain.Room;
import com.example.server.repository.RoomRepository;
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
public class RoomService {
    @Autowired
    private RoomRepository roomRepository;

    public void flush() {
        roomRepository.flush();
    }

    public boolean existsById(Integer integer) {
        return roomRepository.existsById(integer);
    }

    public Page<Room> findAll(Pageable pageable) {
        return roomRepository.findAll(pageable);
    }

    public <S extends Room> Page<S> findAll(Example<S> example, Pageable pageable) {
        return roomRepository.findAll(example, pageable);
    }

    @Deprecated
    public Room getById(Integer integer) {
        return roomRepository.getById(integer);
    }

    public Optional<Room> findById(Integer integer) {
        return roomRepository.findById(integer);
    }

    public <S extends Room> S saveAndFlush(S entity) {
        return roomRepository.saveAndFlush(entity);
    }

    public Room getReferenceById(Integer integer) {
        return roomRepository.getReferenceById(integer);
    }

    public <S extends Room> List<S> findAll(Example<S> example) {
        return roomRepository.findAll(example);
    }

    public List<Room> findAll() {
        return roomRepository.findAll();
    }

    public long count() {
        return roomRepository.count();
    }

    public <S extends Room> List<S> saveAllAndFlush(Iterable<S> entities) {
        return roomRepository.saveAllAndFlush(entities);
    }

    public <S extends Room> List<S> findAll(Example<S> example, Sort sort) {
        return roomRepository.findAll(example, sort);
    }

    public List<Room> findAllById(Iterable<Integer> integers) {
        return roomRepository.findAllById(integers);
    }

    @Deprecated
    public void deleteInBatch(Iterable<Room> entities) {
        roomRepository.deleteInBatch(entities);
    }

    public void delete(Room entity) {
        roomRepository.delete(entity);
    }

    public <S extends Room, R> R findBy(Example<S> example, Function<FluentQuery.FetchableFluentQuery<S>, R> queryFunction) {
        return roomRepository.findBy(example, queryFunction);
    }

    public void deleteAllInBatch(Iterable<Room> entities) {
        roomRepository.deleteAllInBatch(entities);
    }

    public void deleteById(Integer integer) {
        roomRepository.deleteById(integer);
    }

    public <S extends Room> Optional<S> findOne(Example<S> example) {
        return roomRepository.findOne(example);
    }

    public <S extends Room> List<S> saveAll(Iterable<S> entities) {
        return roomRepository.saveAll(entities);
    }

    public void deleteAllByIdInBatch(Iterable<Integer> integers) {
        roomRepository.deleteAllByIdInBatch(integers);
    }

    public <S extends Room> long count(Example<S> example) {
        return roomRepository.count(example);
    }

    public void deleteAll() {
        roomRepository.deleteAll();
    }

    public void deleteAllInBatch() {
        roomRepository.deleteAllInBatch();
    }

    public <S extends Room> S save(S entity) {
        return roomRepository.save(entity);
    }

    public <S extends Room> boolean exists(Example<S> example) {
        return roomRepository.exists(example);
    }

    public void deleteAllById(Iterable<? extends Integer> integers) {
        roomRepository.deleteAllById(integers);
    }

    public List<Room> findAll(Sort sort) {
        return roomRepository.findAll(sort);
    }

    public void deleteAll(Iterable<? extends Room> entities) {
        roomRepository.deleteAll(entities);
    }

    @Deprecated
    public Room getOne(Integer integer) {
        return roomRepository.getOne(integer);
    }
}
