package com.example.server.service;

import com.example.server.DTO.users.UserDetailsDTO;
import com.example.server.DTO.users.UserRequest;
import com.example.server.domain.*;
import com.example.server.exception.ErrorException;
import com.example.server.helpers.CustomUserDetails;
import com.example.server.mapper.ResumeMapper;
import com.example.server.mapper.UserMapper;
import com.example.server.repository.GuestRepository;
import com.example.server.repository.MemberRepository;
import com.example.server.repository.ResumeRepository;
import com.example.server.repository.UserRepository;
import com.example.server.utils.DateTimeConstant;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.repository.query.FluentQuery;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.function.Function;

@Service
public class UserService implements UserDetailsService {
    @Autowired
    UserRepository userRepository;
    @Autowired
    GuestRepository guestRepository;
    @Autowired
    MemberRepository memberRepository;
    @Autowired
    ResumeRepository resumeRepository;
    @Autowired
    UserMapper userMapper;
    @Autowired
    ResumeMapper resumeMapper;


    public UserService(GuestRepository guestRepository, MemberRepository memberRepository) {
        this.guestRepository = guestRepository;
        this.memberRepository = memberRepository;

    }

    @Transactional
    public void createUser(UserRequest request) {
        Optional<User> user = userRepository.findByUsernameOrEmail(request.getUsername(), request.getEmail());
        if (user.isEmpty()) {
            Resume resumeSaved = resumeRepository.save(resumeMapper.toEntity(request));

            User userSaved = userMapper.toEntity(request);
            userSaved.setPassword(SHA_256_password.GM_SHA_password(DateTimeConstant.toDate(request.getBirthday())));
            if (request.getIdRole() == null) userSaved.setIdRole(new Role(2));
            else userSaved.setIdRole(new Role(request.getIdRole().getId()));
            userSaved.setIdTitle(new Title(request.getIdTitle().getId()));
            userSaved.setIdResume(new Resume(resumeSaved.getId()));
            userRepository.save(userSaved);

        } else throw new ErrorException("Username hoặc Email đã tồn tại", HttpStatus.BAD_REQUEST);
    }


    public void updateUser(UserRequest request) {

//        User existingUser = userRepository.findById(request.getId())
//                .orElseThrow(() -> new ErrorException("User không tồn tại", HttpStatus.NOT_FOUND));
//        if(existingUser != null){
//            User userSaved = userMapper.toEntity(request);
//            userSaved.setPassword(SHA_256_password.GM_SHA_password(existingUser.getPassword());
//            if (request.getIdRole() == null) userSaved.setIdRole(new Role(2));
//            else userSaved.setIdRole(new Role(request.getIdRole().getId()));
//            userSaved.setIdTitle(new Title(request.getIdTitle().getId()));
//            userRepository.save(userSaved);
//
//            Resume profile = resumeRepository.findByIdUser(existingUser.getId());
//            Resume resumeSaved = resumeMapper.toEntity(request);
//            resumeSaved.setIdUser(new User(profile.getIdUser().getId());
//            resumeRepository.save(resumeSaved);
//
//        }


    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username);
        if (user == null) throw new UsernameNotFoundException("Không tìm thấy người dùng với username: " + username);

        return new CustomUserDetails(user);
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
