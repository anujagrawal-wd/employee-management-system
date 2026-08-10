package com.anuj.ems.controller;

import com.anuj.ems.dto.AdminUserRequest;
import com.anuj.ems.dto.AuthResponse;
import com.anuj.ems.dto.ChangePasswordRequest;
import com.anuj.ems.dto.LoginRequest;
import com.anuj.ems.dto.RegisterRequest;
import com.anuj.ems.entity.User;
import com.anuj.ems.security.JwtService;
import com.anuj.ems.service.AuthService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;
import com.anuj.ems.dto.AdminUserResponse;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;


    public AuthController(
            AuthService authService,
            JwtService jwtService) {

        this.authService = authService;
        this.jwtService = jwtService;
    }


    /*
     * =========================================
     * REGISTER
     * =========================================
     */

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest request) {

        User user =
                authService.register(request);


        AuthResponse response =
                new AuthResponse(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getRole(),
                        null
                );


        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }


    /*
     * =========================================
     * LOGIN
     * =========================================
     */

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request) {

        User user =
                authService.login(request);


        String token =
                jwtService.generateToken(user);


        AuthResponse response =
                new AuthResponse(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getRole(),
                        token
                );


        return ResponseEntity.ok(response);
    }


    /*
     * =========================================
     * ADMIN CREATE USER
     * =========================================
     */

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/admin/create-user")
    public ResponseEntity<AuthResponse> createUserByAdmin(
            @Valid @RequestBody AdminUserRequest request) {

        User user =
                authService.createUserByAdmin(
                        request
                );


        AuthResponse response =
                new AuthResponse(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getRole(),
                        null
                );


        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }


    /*
     * =========================================
     * CURRENT USER
     * =========================================
     */

    @GetMapping("/me")
    public ResponseEntity<AuthResponse> getCurrentUser(
            Authentication authentication) {

        User user =
                authService.getCurrentUser(
                        authentication.getName()
                );


        AuthResponse response =
                new AuthResponse(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getRole(),
                        null
                );


        return ResponseEntity.ok(response);
    }


    /*
     * =========================================
     * CHANGE PASSWORD
     * =========================================
     */

    @PutMapping("/change-password")
    public ResponseEntity<String> changePassword(
            Authentication authentication,
            @Valid @RequestBody ChangePasswordRequest request) {

        authService.changePassword(
                authentication.getName(),
                request
        );


        return ResponseEntity.ok(
                "Password changed successfully"
        );
    }
    /*
 * =========================================
 * GET ALL USERS
 * =========================================
 */

@PreAuthorize("hasRole('ADMIN')")
@GetMapping("/admin/users")
public ResponseEntity<List<AdminUserResponse>> getAllUsers() {

    return ResponseEntity.ok(
            authService.getAllUsers()
    );
}


/*
 * =========================================
 * ENABLE / DISABLE USER
 * =========================================
 */

@PreAuthorize("hasRole('ADMIN')")
@PutMapping("/admin/users/{id}/status")
public ResponseEntity<String> updateUserStatus(
        @PathVariable Long id,
        @RequestParam boolean enabled) {

    authService.updateUserStatus(
            id,
            enabled
    );

    return ResponseEntity.ok(
            enabled
                    ? "User enabled successfully"
                    : "User disabled successfully"
    );
}
}