package com.college.clubmanagement.dto;

import com.college.clubmanagement.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UpdateUserRequest(
        @NotBlank(message = "Name is required")
        String name,

        @NotBlank(message = "Email is required")
        @Email(message = "Enter a valid email address")
        String email,

        @NotNull(message = "Role is required")
        Role role,

        String department,
        Integer year,
        Boolean enabled
) {}
