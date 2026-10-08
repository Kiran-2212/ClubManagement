package com.college.clubmanagement.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDate;
import java.time.LocalTime;

public record EventRequest(
        @NotBlank(message = "Title is required")
        String title,
        String description,
        @NotNull(message = "Date is required")
        LocalDate date,
        @NotNull(message = "Time is required")
        LocalTime time,
        @NotBlank(message = "Venue is required")
        String venue,
        @NotNull(message = "Capacity is required")
        @Positive(message = "Capacity must be positive")
        Integer capacity,
        String status
) {}
