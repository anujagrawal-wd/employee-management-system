package com.anuj.ems.service.impl;

import com.anuj.ems.dto.AdminUserRequest;
import com.anuj.ems.dto.ChangePasswordRequest;
import com.anuj.ems.dto.LoginRequest;
import com.anuj.ems.dto.RegisterRequest;
import com.anuj.ems.entity.Role;
import com.anuj.ems.entity.User;
import com.anuj.ems.repository.UserRepository;
import com.anuj.ems.service.AuthService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.anuj.ems.dto.AdminUserResponse;
import java.util.List;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;


    public AuthServiceImpl(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }


    @Override
    public User register(RegisterRequest request) {

        if (userRepository.existsByEmail(
                request.getEmail())) {

            throw new RuntimeException(
                    "User already exists with email: "
                            + request.getEmail()
            );
        }


        User user = new User();

        user.setName(
                request.getName()
        );

        user.setEmail(
                request.getEmail()
        );

        user.setPassword(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );

        user.setRole(
                Role.EMPLOYEE
        );

        user.setEnabled(true);


        return userRepository.save(user);
    }


    @Override
    public User login(LoginRequest request) {

        User user =
                userRepository.findByEmail(
                        request.getEmail()
                ).orElseThrow(() ->
                        new RuntimeException(
                                "Invalid email or password"
                        )
                );


        if (!user.isEnabled()) {

            throw new RuntimeException(
                    "User account is disabled"
            );
        }


        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {

            throw new RuntimeException(
                    "Invalid email or password"
            );
        }


        return user;
    }


    @Override
    public User createUserByAdmin(
            AdminUserRequest request) {

        if (userRepository.existsByEmail(
                request.getEmail())) {

            throw new RuntimeException(
                    "User already exists with email: "
                            + request.getEmail()
            );
        }


        if (request.getRole() == null) {

            throw new RuntimeException(
                    "Role is required"
            );
        }


        if (request.getRole() == Role.ADMIN) {

            throw new RuntimeException(
                    "Admin accounts cannot be created through this endpoint"
            );
        }


        User user = new User();

        user.setName(
                request.getName()
        );

        user.setEmail(
                request.getEmail()
        );

        user.setPassword(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );

        user.setRole(
                request.getRole()
        );

        user.setEnabled(true);


        return userRepository.save(user);
    }


    @Override
    public User getCurrentUser(
            String email) {

        return userRepository.findByEmail(
                email
        ).orElseThrow(() ->
                new RuntimeException(
                        "User not found with email: "
                                + email
                )
        );
    }


    /*
     * =========================================
     * CHANGE PASSWORD
     * =========================================
     */

    @Override
    public void changePassword(
            String email,
            ChangePasswordRequest request) {


        User user =
                userRepository.findByEmail(
                        email
                ).orElseThrow(() ->
                        new RuntimeException(
                                "User not found with email: "
                                        + email
                        )
                );


        /*
         * Check current password
         */

        if (!passwordEncoder.matches(
                request.getCurrentPassword(),
                user.getPassword())) {

            throw new RuntimeException(
                    "Current password is incorrect"
            );
        }


        /*
         * Check new password confirmation
         */

        if (!request.getNewPassword().equals(
                request.getConfirmPassword())) {

            throw new RuntimeException(
                    "New password and confirm password do not match"
            );
        }


        /*
         * Prevent using the same password
         */

        if (passwordEncoder.matches(
                request.getNewPassword(),
                user.getPassword())) {

            throw new RuntimeException(
                    "New password must be different from current password"
            );
        }


        /*
         * Encode new password with BCrypt
         */

        String encodedPassword =
                passwordEncoder.encode(
                        request.getNewPassword()
                );


        user.setPassword(
                encodedPassword
        );


        userRepository.save(user);
    }
    @Override
public List<AdminUserResponse> getAllUsers() {

    return userRepository.findAll()
            .stream()
            .map(user -> new AdminUserResponse(
                    user.getId(),
                    user.getName(),
                    user.getEmail(),
                    user.getRole(),
                    user.isEnabled(),
                    user.getCreatedAt()
            ))
            .toList();
}


@Override
public void updateUserStatus(
        Long userId,
        boolean enabled) {

    User user =
            userRepository.findById(userId)
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "User not found with id: "
                                            + userId
                            )
                    );


    /*
     * ADMIN accounts cannot be disabled
     * through this user-management feature.
     */

    if (user.getRole() ==
            Role.ADMIN) {

        throw new RuntimeException(
                "Admin accounts cannot be disabled"
        );
    }


    user.setEnabled(enabled);

    userRepository.save(user);
}
}