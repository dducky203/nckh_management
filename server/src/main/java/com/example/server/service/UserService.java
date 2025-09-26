package com.example.server.service;

import com.example.server.domain.Guest;
import com.example.server.domain.Member;
import com.example.server.domain.User;
import com.example.server.repository.GuestRepository;
import com.example.server.repository.MemberRepository;
import com.example.server.repository.UserRepository;
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
public class UserService {
    @Autowired
    UserRepository userRepository;
    @Autowired
    GuestRepository guestRepository;
    @Autowired
    MemberRepository memberRepository;

    public UserService(GuestRepository guestRepository, MemberRepository memberRepository) {
        this.guestRepository = guestRepository;
        this.memberRepository = memberRepository;
    }

    public boolean isGuest(Integer userId) {
        return guestRepository.existsByUserId(userId);
    }

    public boolean isMember(Integer userId) {
        return memberRepository.existsByUserId(userId);
    }


    public User getReferenceById(Integer integer) {
        return userRepository.getReferenceById(integer);
    }

    public <S extends User> boolean exists(Example<S> example) {
        return userRepository.exists(example);
    }

    public void flush() {
        userRepository.flush();
    }

    public Optional<User> findById(Integer integer) {
        return userRepository.findById(integer);
    }

    public void deleteAll() {
        userRepository.deleteAll();
    }

    public boolean existsById(Integer integer) {
        return userRepository.existsById(integer);
    }

    public <S extends User, R> R findBy(Example<S> example, Function<FluentQuery.FetchableFluentQuery<S>, R> queryFunction) {
        return userRepository.findBy(example, queryFunction);
    }

    public <S extends User> List<S> findAll(Example<S> example) {
        return userRepository.findAll(example);
    }

    public <S extends User> S saveAndFlush(S entity) {
        return userRepository.saveAndFlush(entity);
    }

    @Deprecated
    public User getOne(Integer integer) {
        return userRepository.getOne(integer);
    }

    public <S extends User> S save(S entity) {
        return userRepository.save(entity);
    }

    public void deleteAllInBatch() {
        userRepository.deleteAllInBatch();
    }

    public <S extends User> Page<S> findAll(Example<S> example, Pageable pageable) {
        return userRepository.findAll(example, pageable);
    }

    public void deleteAllById(Iterable<? extends Integer> integers) {
        userRepository.deleteAllById(integers);
    }

    public Page<User> findAll(Pageable pageable) {
        return userRepository.findAll(pageable);
    }

    @Deprecated
    public User getById(Integer integer) {
        return userRepository.getById(integer);
    }

    public List<User> findAll(Sort sort) {
        return userRepository.findAll(sort);
    }

    public <S extends User> long count(Example<S> example) {
        return userRepository.count(example);
    }

    public void deleteAll(Iterable<? extends User> entities) {
        userRepository.deleteAll(entities);
    }

    public void deleteById(Integer integer) {
        userRepository.deleteById(integer);
    }

    public void deleteAllInBatch(Iterable<User> entities) {
        userRepository.deleteAllInBatch(entities);
    }

    public long count() {
        return userRepository.count();
    }

    public void delete(User entity) {
        userRepository.delete(entity);
    }

    public void deleteAllByIdInBatch(Iterable<Integer> integers) {
        userRepository.deleteAllByIdInBatch(integers);
    }

    public <S extends User> List<S> saveAll(Iterable<S> entities) {
        return userRepository.saveAll(entities);
    }

    public <S extends User> List<S> findAll(Example<S> example, Sort sort) {
        return userRepository.findAll(example, sort);
    }

    public <S extends User> Optional<S> findOne(Example<S> example) {
        return userRepository.findOne(example);
    }

    public <S extends User> List<S> saveAllAndFlush(Iterable<S> entities) {
        return userRepository.saveAllAndFlush(entities);
    }

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public List<User> findAllById(Iterable<Integer> integers) {
        return userRepository.findAllById(integers);
    }

    @Deprecated
    public void deleteInBatch(Iterable<User> entities) {
        userRepository.deleteInBatch(entities);
    }

    public void removeGuest(Integer userId, Integer eventId) {
        Guest guest = guestRepository.findByUserIdAndEventId(userId, eventId);
        if (guest != null) {
            guestRepository.delete(guest);
        }
    }

    public void removeMember(Integer userId, Integer eventId) {
        Member member = memberRepository.findByUserIdAndEventId(userId, eventId);
        if (member != null) {
            memberRepository.delete(member);
        }
    }
}
