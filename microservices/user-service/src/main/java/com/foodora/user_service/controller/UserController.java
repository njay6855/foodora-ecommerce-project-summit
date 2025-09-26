package com.foodora.user_service.controller;

import com.foodora.user_service.dto.UserRequestDTO;
import com.foodora.user_service.dto.UserResponseDTO;
import com.foodora.user_service.dto.LoginRequestDTO;
import com.foodora.user_service.exception.UserNotFoundException;
import com.foodora.user_service.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/users")
@RequiredArgsConstructor
public class UserController extends BaseController {

    private final UserService userService;

    @PostMapping
    @Operation(summary = "Create a new user")
    public ResponseEntity<UserResponseDTO> createUser(@RequestBody UserRequestDTO userDTO) {
        logRequest("createUser", userDTO);
        UserResponseDTO response = userService.createUser(userDTO);
        logger.info("User created with ID: {}", response.getId());
        return created(response);
    }

    @GetMapping("/{userId}")
    @Operation(summary = "Get current authenticated user's information")
    public ResponseEntity<?> getCurrentUser(@PathVariable long userId) {
        logRequest("getCurrentUser", "userId=" + userId);
            UserResponseDTO response = userService.getCurrentUser(userId);
            return ok(response);
      
    }

    @PostMapping("/login")
    @Operation(summary = "Authenticate user and return user details")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequestDTO LoginDTO) {
        logRequest("loginUser", LoginDTO);
            UserResponseDTO response = userService.loginUser(LoginDTO);
            return ok(response);
    }

}
