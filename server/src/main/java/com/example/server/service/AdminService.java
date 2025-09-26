package com.example.server.service;

import com.example.server.domain.Admin;
import com.example.server.repository.AdminRepository;
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
public class AdminService {
    @Autowired
    AdminRepository adminRepository;


    public void flush() {
        adminRepository.flush();
    }

    public Admin getReferenceById(Integer integer) {
        return adminRepository.getReferenceById(integer);
    }

    public <S extends Admin> boolean exists(Example<S> example) {
        return adminRepository.exists(example);
    }

    public Optional<Admin> findById(Integer integer) {
        return adminRepository.findById(integer);
    }

    public void deleteAll() {
        adminRepository.deleteAll();
    }

    public boolean existsById(Integer integer) {
        return adminRepository.existsById(integer);
    }

    public <S extends Admin, R> R findBy(Example<S> example, Function<FluentQuery.FetchableFluentQuery<S>, R> queryFunction) {
        return adminRepository.findBy(example, queryFunction);
    }

    public <S extends Admin> List<S> findAll(Example<S> example) {
        return adminRepository.findAll(example);
    }

    public <S extends Admin> S saveAndFlush(S entity) {
        return adminRepository.saveAndFlush(entity);
    }

    @Deprecated
    public Admin getOne(Integer integer) {
        return adminRepository.getOne(integer);
    }

    public <S extends Admin> S save(S entity) {
        return adminRepository.save(entity);
    }

    public void deleteAllInBatch() {
        adminRepository.deleteAllInBatch();
    }

    public <S extends Admin> Page<S> findAll(Example<S> example, Pageable pageable) {
        return adminRepository.findAll(example, pageable);
    }

    public void deleteAllById(Iterable<? extends Integer> integers) {
        adminRepository.deleteAllById(integers);
    }

    public Page<Admin> findAll(Pageable pageable) {
        return adminRepository.findAll(pageable);
    }

    @Deprecated
    public Admin getById(Integer integer) {
        return adminRepository.getById(integer);
    }

    public List<Admin> findAll(Sort sort) {
        return adminRepository.findAll(sort);
    }

    public <S extends Admin> long count(Example<S> example) {
        return adminRepository.count(example);
    }

    public void deleteAll(Iterable<? extends Admin> entities) {
        adminRepository.deleteAll(entities);
    }

    public void deleteById(Integer integer) {
        adminRepository.deleteById(integer);
    }

    public void deleteAllInBatch(Iterable<Admin> entities) {
        adminRepository.deleteAllInBatch(entities);
    }

    public long count() {
        return adminRepository.count();
    }

    public void delete(Admin entity) {
        adminRepository.delete(entity);
    }

    public void deleteAllByIdInBatch(Iterable<Integer> integers) {
        adminRepository.deleteAllByIdInBatch(integers);
    }

    public <S extends Admin> List<S> saveAll(Iterable<S> entities) {
        return adminRepository.saveAll(entities);
    }

    public <S extends Admin> List<S> findAll(Example<S> example, Sort sort) {
        return adminRepository.findAll(example, sort);
    }

    public <S extends Admin> Optional<S> findOne(Example<S> example) {
        return adminRepository.findOne(example);
    }

    public <S extends Admin> List<S> saveAllAndFlush(Iterable<S> entities) {
        return adminRepository.saveAllAndFlush(entities);
    }

    public List<Admin> findAll() {
        return adminRepository.findAll();
    }

    public List<Admin> findAllById(Iterable<Integer> integers) {
        return adminRepository.findAllById(integers);
    }

    @Deprecated
    public void deleteInBatch(Iterable<Admin> entities) {
        adminRepository.deleteInBatch(entities);
    }
}
