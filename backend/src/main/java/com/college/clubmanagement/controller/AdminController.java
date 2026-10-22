package com.college.clubmanagement.controller;

import com.college.clubmanagement.dto.*;
import com.college.clubmanagement.entity.*;
import com.college.clubmanagement.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@PreAuthorize("hasRole('SYSTEM_ADMIN')")
public class AdminController {
    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/admin/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboard() {
        return ResponseEntity.ok(adminService.getDashboard());
    }

    @GetMapping("/admin/users")
    public ResponseEntity<List<User>> getUsers() {
        return ResponseEntity.ok(adminService.getUsers());
    }

    @PutMapping("/admin/users/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @Valid @RequestBody UpdateUserRequest request) {
        return ResponseEntity.ok(adminService.updateUser(id, request));
    }

    @DeleteMapping("/admin/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/admin/clubs")
    public ResponseEntity<List<Club>> getClubs() {
        return ResponseEntity.ok(adminService.getClubs());
    }

    @PostMapping("/admin/clubs")
    public ResponseEntity<Club> createClub(@Valid @RequestBody CreateClubRequest request) {
        return ResponseEntity.ok(adminService.createClub(request));
    }

    @PutMapping("/admin/clubs/{id}")
    public ResponseEntity<Club> updateClub(@PathVariable Long id, @Valid @RequestBody ClubRequest request) {
        return ResponseEntity.ok(adminService.updateClub(id, request));
    }

    @DeleteMapping("/admin/clubs/{id}")
    public ResponseEntity<Void> deleteClub(@PathVariable Long id) {
        adminService.deleteClub(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/admin/events")
    public ResponseEntity<List<Event>> getEvents() {
        return ResponseEntity.ok(adminService.getEvents());
    }

    @GetMapping("/admin/memberships")
    public ResponseEntity<List<Membership>> getMemberships() {
        return ResponseEntity.ok(adminService.getMemberships());
    }

    @GetMapping("/admin/registrations")
    public ResponseEntity<List<EventRegistration>> getRegistrations() {
        return ResponseEntity.ok(adminService.getRegistrations());
    }

    @GetMapping("/admin/attendance")
    public ResponseEntity<List<Attendance>> getAttendance() {
        return ResponseEntity.ok(adminService.getAttendance());
    }

    @GetMapping("/admin/announcements")
    public ResponseEntity<List<Announcement>> getAnnouncements() {
        return ResponseEntity.ok(adminService.getAnnouncements());
    }

    @GetMapping("/admin/statistics")
    public ResponseEntity<Map<String, Object>> getStatistics() {
        return ResponseEntity.ok(adminService.getStatistics());
    }
}
