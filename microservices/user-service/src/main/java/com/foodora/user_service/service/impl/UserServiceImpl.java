package com.foodora.user_service.service.impl;

import com.foodora.user_service.dto.UserRequestDTO;
import com.foodora.user_service.dto.UserResponseDTO;
import com.foodora.user_service.dto.LoginRequestDTO;
import com.foodora.user_service.exception.UserAlreadyExistsException;
import com.foodora.user_service.exception.InvalidRoleException;
import com.foodora.user_service.exception.UserNotFoundException;
import com.foodora.user_service.model.User;
import com.foodora.user_service.repository.UserRepository;
import com.foodora.user_service.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private static final List<String> ALLOWED_ROLES = List.of("DataSteward", "Supplier", "Customer");

    @Override
    public UserResponseDTO createUser(UserRequestDTO userDTO) {
        String email = userDTO.getEmail().toLowerCase();

        if (userRepository.existsByEmail(email)) {
            throw new UserAlreadyExistsException("User with email '" + email + "' already exists.");
        }

        String role = userDTO.getRole() == null ? "Customer" : userDTO.getRole();

        if (!ALLOWED_ROLES.contains(role)) {
            throw new InvalidRoleException("Invalid role: " + role + ". Allowed roles: " + ALLOWED_ROLES);
        }

        User user = User.builder()
                .email(email)
                .password(userDTO.getPassword())
                .role(role)
                .build();

        User saved = userRepository.save(user);

        return UserResponseDTO.builder()
                .id(saved.getId())
                .email(saved.getEmail())
                .role(saved.getRole())
                .build();
    }

    @Override
    public UserResponseDTO getCurrentUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found" ));

        return UserResponseDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }

    @Override
    public UserResponseDTO loginUser(LoginRequestDTO loginDTO) {
        String email = loginDTO.getEmail().toLowerCase();
        String password = loginDTO.getPassword();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("Invalid email or password"));

        if (!user.getPassword().equals(password)) {
            throw new UserNotFoundException("Invalid email or password");
        }

        return UserResponseDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }
}
