package com.college.clubmanagement.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;

public record CreateClubRequest(
        @NotBlank(message = "Club name is required")
        String name,
        String description,
        String category,
        String facultyCoordinator,
        String logo,
        Long clubAdminId,
        @Valid NewClubAdminRequest newClubAdmin
) {}
