package com.college.clubmanagement.dto;

import jakarta.validation.constraints.NotNull;

public record AttendanceRequest(
        @NotNull(message = "Student id is required")
        Long studentId,
        @NotNull(message = "Status is required")
        String status
) {}
