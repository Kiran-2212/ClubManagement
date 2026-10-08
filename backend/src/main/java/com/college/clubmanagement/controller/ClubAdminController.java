package com.college.clubmanagement.controller;

import com.college.clubmanagement.dto.*;
import com.college.clubmanagement.entity.*;
import com.college.clubmanagement.service.ClubAdminService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@PreAuthorize("hasRole('CLUB_ADMIN')")
public class ClubAdminController {
    private final ClubAdminService clubAdminService;

    public ClubAdminController(ClubAdminService clubAdminService) {
        this.clubAdminService = clubAdminService;
    }

    @GetMapping("/club-admin/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboard() {
        return ResponseEntity.ok(clubAdminService.getDashboard());
    }

    @GetMapping("/club-admin/clubs")
    public ResponseEntity<List<Club>> getManagedClubs() {
        return ResponseEntity.ok(clubAdminService.getManagedClubs());
    }

    @GetMapping("/club-admin/memberships")
    public ResponseEntity<List<Membership>> getMembershipRequests() {
        return ResponseEntity.ok(clubAdminService.getMembershipRequests());
    }

    @PutMapping("/club-admin/memberships/{id}/approve")
    public ResponseEntity<Membership> approveMembership(@PathVariable Long id) {
        return ResponseEntity.ok(clubAdminService.approveMembership(id));
    }

    @PutMapping("/club-admin/memberships/{id}/reject")
    public ResponseEntity<Membership> rejectMembership(@PathVariable Long id) {
        return ResponseEntity.ok(clubAdminService.rejectMembership(id));
    }

    @PostMapping("/club-admin/events")
    public ResponseEntity<Event> createEvent(@RequestParam Long clubId, @Valid @RequestBody EventRequest request) {
        return ResponseEntity.ok(clubAdminService.createEvent(request, clubId));
    }

    @GetMapping("/club-admin/events")
    public ResponseEntity<List<Event>> getEvents() {
        return ResponseEntity.ok(clubAdminService.getEvents());
    }

    @PutMapping("/club-admin/events/{id}")
    public ResponseEntity<Event> updateEvent(@PathVariable Long id, @Valid @RequestBody EventRequest request) {
        return ResponseEntity.ok(clubAdminService.updateEvent(id, request));
    }

    @DeleteMapping("/club-admin/events/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        clubAdminService.deleteEvent(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/club-admin/events/{id}/registrations")
    public ResponseEntity<List<EventRegistration>> getRegistrations(@PathVariable Long id) {
        return ResponseEntity.ok(clubAdminService.getRegistrations(id));
    }

    @GetMapping("/club-admin/events/{id}/attendance")
    public ResponseEntity<List<Attendance>> getAttendance(@PathVariable Long id) {
        return ResponseEntity.ok(clubAdminService.getAttendance(id));
    }

    @PostMapping("/club-admin/events/{id}/attendance")
    public ResponseEntity<List<Attendance>> markAttendance(@PathVariable Long id, @RequestBody List<AttendanceRequest> requests) {
        return ResponseEntity.ok(clubAdminService.markAttendance(id, requests));
    }

    @PostMapping("/club-admin/announcements")
    public ResponseEntity<Announcement> createAnnouncement(@RequestParam Long clubId, @Valid @RequestBody AnnouncementRequest request) {
        return ResponseEntity.ok(clubAdminService.createAnnouncement(clubId, request));
    }

    @GetMapping("/club-admin/announcements")
    public ResponseEntity<List<Announcement>> getAnnouncements() {
        return ResponseEntity.ok(clubAdminService.getAnnouncements());
    }

    @PutMapping("/club-admin/announcements/{id}")
    public ResponseEntity<Announcement> updateAnnouncement(@PathVariable Long id, @Valid @RequestBody AnnouncementRequest request) {
        return ResponseEntity.ok(clubAdminService.updateAnnouncement(id, request));
    }

    @DeleteMapping("/club-admin/announcements/{id}")
    public ResponseEntity<Void> deleteAnnouncement(@PathVariable Long id) {
        clubAdminService.deleteAnnouncement(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/club-admin/feedback")
    public ResponseEntity<List<Feedback>> getFeedback() {
        return ResponseEntity.ok(clubAdminService.getFeedback());
    }

    @GetMapping("/club-admin/statistics")
    public ResponseEntity<Map<String, Object>> getStatistics() {
        return ResponseEntity.ok(clubAdminService.getStatistics());
    }
}
