package com.foodora.user_service.dto;


import lombok.Data;

@Data
public class UserRequestDTO {
    private String email;
    private String password;
    private String role; // Optional, defaults to "Customer"
}
