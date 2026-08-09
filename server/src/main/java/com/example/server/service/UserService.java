package com.example.server.service;

import java.util.*;
import java.util.function.Function;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.*;
import org.springframework.data.repository.query.FluentQuery;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import com.example.server.DTO.response.SuccessResponseDTO;
import com.example.server.DTO.users.UserDetailsDTO;
import com.example.server.DTO.users.UserRequest;
import com.example.server.domain.*;
import com.example.server.domain.User;
import com.example.server.exception.ErrorException;
import com.example.server.helpers.CustomUserDetails;
import com.example.server.mapper.ResumeMapper;
import com.example.server.mapper.UserMapper;
import com.example.server.repository.*;
import com.example.server.service.PasswordService;
import com.example.server.utils.DateTimeConstant;
import com.example.server.utils.NormalizeUtils;

import jakarta.transaction.Transactional;

@Service
public class UserService implements UserDetailsService {
   @Value("${password.reset-default}")
    private final String passwordDefault;
    private final UserRepository userRepository;
    private final GuestRepository guestRepository;
    private final MemberRepository memberRepository;
    private final ResumeRepository resumeRepository;
    private final UserMapper userMapper;
    private final ResumeMapper resumeMapper;
    private final AddressService addressService;
    private final PasswordService passwordService;


    public UserService(
            @Value("${password.reset-default}") String passwordDefault,
            UserRepository userRepository,
            GuestRepository guestRepository,
            MemberRepository memberRepository,
            ResumeRepository resumeRepository,
            UserMapper userMapper,
            ResumeMapper resumeMapper,
            AddressService addressService,
            PasswordService passwordService) {
        this.passwordDefault = passwordDefault;
        this.userRepository = userRepository;
        this.guestRepository = guestRepository;
        this.memberRepository = memberRepository;
        this.resumeRepository = resumeRepository;
        this.userMapper = userMapper;
        this.resumeMapper = resumeMapper;
        this.addressService = addressService;
        this.passwordService = passwordService;
    }

    @Transactional
    public void createUser(UserRequest request) {
        // Validate user data
        validateUserForCreate(request);

        Resume resumeSaved = resumeMapper.toEntity(request);
        addressService.applyAddressToResume(
                resumeSaved,
                request.getProvinceCode(),
                request.getWardCode(),
                request.getAddressDetail(),
                request.getAddress());
        resumeSaved = resumeRepository.save(resumeSaved);

        User userSaved = userMapper.toEntity(request);
        userSaved.setPassword(passwordService.encode(DateTimeConstant.toDate(request.getBirthday())));
        if (request.getIdRole() == null)
            userSaved.setIdRole(new Role(2));
        else
            userSaved.setIdRole(new Role(request.getIdRole().getId()));
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
                existingResume.setBirthday(request.getBirthday());
                addressService.applyAddressToResume(
                        existingResume,
                        request.getProvinceCode(),
                        request.getWardCode(),
                        request.getAddressDetail(),
                        request.getAddress());
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
        if (profileUser.isPresent()) {
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
    public void changePassword(String username, String currentPassword, String newPassword, Boolean forgotPassword) {
        User existingUser = userRepository.findByUsername(username);
        if (existingUser != null) {
            if (passwordService.matches(currentPassword, existingUser.getPassword()) && !forgotPassword) {
                existingUser.setPassword(passwordService.encode(newPassword));
                userRepository.save(existingUser);
            } else if (forgotPassword && currentPassword == null) {
                existingUser.setPassword(passwordService.encode(newPassword));
                userRepository.save(existingUser);
            } else
                throw new ErrorException("Mật khẩu hiện tại không chính xác !", HttpStatus.BAD_REQUEST);

        } else {
            throw new ErrorException("Tài khoản không tồn tại", HttpStatus.NOT_FOUND);
        }
    }

    @Transactional
    public void resetPassword(String username) {
        User existingUser = userRepository.findByUsername(username);
        if (existingUser != null) {
            existingUser.setPassword(passwordService.encode(passwordDefault));
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


    public <S extends User> Page<S> findAll(Example<S> example, Pageable pageable) {
        return userRepository.findAll(example, pageable);
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



    public long count() {
        return userRepository.count();
    }

    public void delete(User entity) {
        userRepository.delete(entity);
    }

    public <S extends User> List<S> findAll(Example<S> example, Sort sort) {
        return userRepository.findAll(example, sort);
    }


    public List<User> findAll() {
        return userRepository.findAll();
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
        if (request.getPhone() != null && !request.getPhone().isBlank()) {
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
        if (request.getPhone() != null && !request.getPhone().isBlank()) {
            if (isPhoneExistsForOtherUser(request.getPhone(), userId)) {
                throw new ErrorException("Số điện thoại đã tồn tại", HttpStatus.BAD_REQUEST);
            }
        }
    }

    public ResponseEntity<?> searchUsers(String keyword, String type, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        String mode;

        if (type == null || type.equalsIgnoreCase("all")) {
            mode = "ALL";
        } else if (type.equalsIgnoreCase("Sinh viên")) {
            mode = "STUDENT";
        } else {
            mode = "OTHERS";
        }

        // Gọi repository với mode tương ứng
        Page<User> userPage = userRepository.searchUsers(keyword, mode, pageable);

        List<UserDetailsDTO> users = userPage.getContent().stream()
                .map(userMapper::toUserDetailDTO)
                .toList();

        Map<String, Object> response = new HashMap<>();
        response.put("users", users);
        response.put("totalItems", userPage.getTotalElements());
        response.put("totalPages", userPage.getTotalPages());
        response.put("currentPage", page);

        return ResponseEntity.ok(
                new SuccessResponseDTO<>(response, "Tìm kiếm người dùng thành công."));
    }
}
