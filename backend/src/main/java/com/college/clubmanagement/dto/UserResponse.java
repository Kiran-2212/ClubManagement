package com.college.clubmanagement.dto;

import com.college.clubmanagement.entity.User;

public record UserResponse(Long id, String name, String email, String role, String department, Integer year, boolean enabled) {
    public static UserResponse from(User user) {
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name(),
                user.getDepartment(),
                user.getYear(),
                user.isEnabled()
        );
    }
}
