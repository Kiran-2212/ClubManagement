package com.college.clubmanagement.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record NewClubAdminRequest(
        @NotBlank(message = "Club admin name is required")
        String name,

        @NotBlank(message = "Club admin email is required")
        @Email(message = "Enter a valid club admin email address")
        String email,

        @NotBlank(message = "Club admin password is required")
        @Size(min = 8, max = 72, message = "Club admin password must be between 8 and 72 characters")
        String password
) {}
