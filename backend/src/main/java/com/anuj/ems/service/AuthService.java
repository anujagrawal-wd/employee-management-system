package com.anuj.ems.service;

import com.anuj.ems.dto.AdminUserRequest;
import com.anuj.ems.dto.AdminUserResponse;
import com.anuj.ems.dto.ChangePasswordRequest;
import com.anuj.ems.dto.LoginRequest;
import com.anuj.ems.dto.RegisterRequest;
import com.anuj.ems.entity.User;

import java.util.List;

public interface AuthService {

    User register(RegisterRequest request);

    User login(LoginRequest request);

    User createUserByAdmin(
            AdminUserRequest request
    );

    User getCurrentUser(
            String email
    );

    void changePassword(
            String email,
            ChangePasswordRequest request
    );

    List<AdminUserResponse> getAllUsers();

    void updateUserStatus(
            Long userId,
            boolean enabled
    );
}