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
import com.example.server.utils.NormalizeUtils;
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
        // Validate user data
        validateUserForCreate(request);

        Resume resumeSaved = resumeRepository.save(resumeMapper.toEntity(request));

        User userSaved = userMapper.toEntity(request);
        userSaved.setPassword(SHA_256_password.GM_SHA_password(DateTimeConstant.toDate(request.getBirthday())));
        if (request.getIdRole() == null)
            userSaved.setIdRole(new Role(2));
        else userSaved.setIdRole(new Role(request.getIdRole().getId()));
        userSaved.setName(NormalizeUtils.normalizeName(request.getName()));
        userSaved.setIdTitle(new Title(request.getIdTitle().getId()));
        userSaved.setIdResume(new Resume(resumeSaved.getId()));
        userRepository.save(userSaved);
    }

    @Transactional
    public void updateUser(UserRequest request) {

        User existingUser = userRepository.findByUsername(request.getUsername());
        if (existingUser != null) {
            // Validate user data for update
            validateUserForUpdate(request, existingUser.getId());
            existingUser.setName(NormalizeUtils.normalizeName(request.getName()));
            existingUser.setPower(request.getPower());
            existingUser.setInActive(request.getInActive());
            if (request.getIdRole() != null) {
                existingUser.setIdRole(new Role(request.getIdRole().getId()));
            }
            if (request.getIdTitle() != null) {
                existingUser.setIdTitle(new Title(request.getIdTitle().getId()));
            }
            userRepository.save(existingUser);

            Resume existingResume = resumeRepository.findResumeById(existingUser.getIdResume().getId());

            if (existingResume != null) {
                existingResume.setEmail(request.getEmail());
                existingResume.setPhone(request.getPhone());
                existingResume.setAddress(request.getAddress());
                existingResume.setBirthday(request.getBirthday());
                resumeRepository.save(existingResume);

            }
        } else {
            throw new ErrorException("Tài khoản không tồn tại", HttpStatus.NOT_FOUND);
        }
    }

    @Transactional
    public void deleteUser(String username, Boolean force) {
        User existingUser = userRepository.findByUsername(username);
        Optional<Resume> profileUser = resumeRepository.findById(existingUser.getIdResume().getId());
        if (existingUser != null && profileUser.isPresent()) {
            if (force != null && force) {
                resumeRepository.deleteById(existingUser.getIdResume().getId());
                userRepository.delete(existingUser);
            } else {
                existingUser.setIsDeleted(true);
                userRepository.save(existingUser);
            }
        } else {
            throw new ErrorException("Tài khoản không tồn tại", HttpStatus.NOT_FOUND);
        }
    }

    @Transactional
    public void changePassword(String username, String currentPassword, String newPassword) {
        User existingUser = userRepository.findByUsername(username);
        if (existingUser != null) {
            if (SHA_256_password.comparePassword(currentPassword, existingUser.getPassword())) {
                existingUser.setPassword(SHA_256_password.GM_SHA_password(newPassword));
                userRepository.save(existingUser);
            } else throw new ErrorException("Mật khẩu hiện tại không chính xác !", HttpStatus.BAD_REQUEST);
        } else {
            throw new ErrorException("Tài khoản không tồn tại", HttpStatus.NOT_FOUND);
        }
    }

    @Transactional
    public void resetPassword(String username) {
        User existingUser = userRepository.findByUsername(username);
        if (existingUser != null) {
            existingUser.setPassword(SHA_256_password.GM_SHA_password("userfita@12345"));
            userRepository.save(existingUser);
        } else {
            throw new ErrorException("Tài khoản không tồn tại", HttpStatus.NOT_FOUND);
        }
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username);
        if (user == null)
            throw new UsernameNotFoundException("Không tìm thấy người dùng với username: " + username);

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

    public <S extends User, R> R findBy(Example<S> example,
                                        Function<FluentQuery.FetchableFluentQuery<S>, R> queryFunction) {
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

    // Check if email exists
    public boolean isEmailExists(String email) {
        return resumeRepository.existsByEmail(email);
    }

    // Check if phone exists
    public boolean isPhoneExists(String phone) {
        return resumeRepository.existsByPhone(phone);
    }

    // Check if email exists excluding current user (for update)
    public boolean isEmailExistsForOtherUser(String email, Integer userId) {
        return resumeRepository.existsByEmailExcludingUser(email, userId);
    }

    // Check if phone exists excluding current user (for update)
    public boolean isPhoneExistsForOtherUser(String phone, Integer userId) {
        return resumeRepository.existsByPhoneExcludingUser(phone, userId);
    }

    // Comprehensive validation for create user
    public void validateUserForCreate(UserRequest request) {
        // Check username
        if (userRepository.findByUsername(request.getUsername()) != null) {
            throw new ErrorException("Username đã tồn tại", HttpStatus.BAD_REQUEST);
        }

        // Check email
        if (isEmailExists(request.getEmail())) {
            throw new ErrorException("Email đã tồn tại", HttpStatus.BAD_REQUEST);
        }

        // Check phone (if provided)
        if (request.getPhone() != null && !request.getPhone().trim().isEmpty()) {
            if (isPhoneExists(request.getPhone())) {
                throw new ErrorException("Số điện thoại đã tồn tại", HttpStatus.BAD_REQUEST);
            }
        }
    }

    // Comprehensive validation for update user
    public void validateUserForUpdate(UserRequest request, Integer userId) {
        // Check email (excluding current user)
        if (isEmailExistsForOtherUser(request.getEmail(), userId)) {
            throw new ErrorException("Email đã tồn tại", HttpStatus.BAD_REQUEST);
        }

        // Check phone (if provided and excluding current user)
        if (request.getPhone() != null && !request.getPhone().trim().isEmpty()) {
            if (isPhoneExistsForOtherUser(request.getPhone(), userId)) {
                throw new ErrorException("Số điện thoại đã tồn tại", HttpStatus.BAD_REQUEST);
            }
        }
    }
}
