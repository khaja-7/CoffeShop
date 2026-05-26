package com.coffeeshop.service;

import com.coffeeshop.dto.request.LoginRequest;
import com.coffeeshop.dto.request.RegisterRequest;
import com.coffeeshop.dto.response.AuthResponse;
import com.coffeeshop.entity.User;
import com.coffeeshop.exception.ConflictException;
import com.coffeeshop.exception.UnauthorizedException;
import com.coffeeshop.repository.UserRepository;
import com.coffeeshop.security.JwtUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Business logic for user registration, login, and profile retrieval.
 */
@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository  userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils        jwtUtils;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtils jwtUtils) {
        this.userRepository  = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils        = jwtUtils;
    }

    // ── Register ─────────────────────────────────────────────
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ConflictException("An account with this email already exists.");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone() != null ? request.getPhone() : "")
                .build();

        user = userRepository.save(user);
        log.info("New user registered: {}", user.getEmail());

        String token = jwtUtils.generateToken(user.getId(), user.getEmail(), user.getName());

        return AuthResponse.builder()
                .message("Account created successfully!")
                .token(token)
                .user(mapToUserDto(user))
                .build();
    }

    // ── Login ────────────────────────────────────────────────
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Invalid email or password.");
        }

        String token = jwtUtils.generateToken(user.getId(), user.getEmail(), user.getName());
        log.info("User logged in: {}", user.getEmail());

        return AuthResponse.builder()
                .message("Login successful!")
                .token(token)
                .user(mapToUserDto(user))
                .build();
    }

    // ── Get current user profile ─────────────────────────────
    @Transactional(readOnly = true)
    public AuthResponse.UserDto getProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new com.coffeeshop.exception.NotFoundException("User not found."));
        return mapToUserDto(user);
    }

    // ── Helper ───────────────────────────────────────────────
    private AuthResponse.UserDto mapToUserDto(User user) {
        return AuthResponse.UserDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .build();
    }
}
