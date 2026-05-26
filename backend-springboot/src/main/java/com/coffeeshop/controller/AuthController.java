package com.coffeeshop.controller;

import com.coffeeshop.dto.request.LoginRequest;
import com.coffeeshop.dto.request.RegisterRequest;
import com.coffeeshop.dto.response.AuthResponse;
import com.coffeeshop.security.AuthenticatedUser;
import com.coffeeshop.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for authentication — mirrors /api/auth/* Express routes.
 *
 * POST /api/auth/register  → register a new user
 * POST /api/auth/login     → login and get JWT
 * GET  /api/auth/me        → get current user profile (protected)
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // ── POST /api/auth/register ──────────────────────────────
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest request) {

        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // ── POST /api/auth/login ─────────────────────────────────
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request) {

        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    // ── GET /api/auth/me (requires JWT) ─────────────────────
    @GetMapping("/me")
    public ResponseEntity<AuthResponse.UserDto> getProfile(
            @AuthenticationPrincipal AuthenticatedUser currentUser) {

        AuthResponse.UserDto profile = authService.getProfile(currentUser.getId());
        return ResponseEntity.ok(profile);
    }
}
