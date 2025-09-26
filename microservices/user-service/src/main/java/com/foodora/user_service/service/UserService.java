package com.foodora.user_service.service;


import com.foodora.user_service.dto.UserRequestDTO;
import com.foodora.user_service.dto.UserResponseDTO;
import com.foodora.user_service.dto.LoginRequestDTO;


public interface UserService {
    UserResponseDTO createUser(UserRequestDTO userDTO);
    UserResponseDTO getCurrentUser(Long userId);
    UserResponseDTO loginUser(LoginRequestDTO loginDTO);
}
