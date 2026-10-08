package com.college.clubmanagement.controller;

import com.college.clubmanagement.dto.FeedbackRequest;
import com.college.clubmanagement.entity.Club;
import com.college.clubmanagement.entity.Event;
import com.college.clubmanagement.entity.EventRegistration;
import com.college.clubmanagement.entity.Feedback;
import com.college.clubmanagement.entity.Membership;
import com.college.clubmanagement.entity.Announcement;
import com.college.clubmanagement.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class StudentController {
    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @PreAuthorize("hasRole('STUDENT')")
    @GetMapping("/student/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboard() {
        return ResponseEntity.ok(studentService.getDashboard());
    }

    @GetMapping("/clubs")
    public ResponseEntity<List<Club>> getAllClubs() {
        return ResponseEntity.ok(studentService.getAllClubs());
    }

    @GetMapping("/clubs/{id}")
    public ResponseEntity<Club> getClubById(@PathVariable Long id) {
        return ResponseEntity.ok(studentService.getClubById(id));
    }

    @PreAuthorize("hasRole('STUDENT')")
    @PostMapping("/clubs/{id}/membership")
    public ResponseEntity<Membership> createMembershipRequest(@PathVariable Long id) {
        return ResponseEntity.ok(studentService.requestMembership(id));
    }

    @PreAuthorize("hasRole('STUDENT')")
    @GetMapping("/student/memberships")
    public ResponseEntity<List<Membership>> getStudentMemberships() {
        return ResponseEntity.ok(studentService.getMemberships());
    }

    @GetMapping("/events")
    public ResponseEntity<List<Event>> getEvents() {
        return ResponseEntity.ok(studentService.getAllEvents());
    }

    @GetMapping("/events/{id}")
    public ResponseEntity<Event> getEventById(@PathVariable Long id) {
        return ResponseEntity.ok(studentService.getEventById(id));
    }

    @PreAuthorize("hasRole('STUDENT')")
    @PostMapping("/events/{id}/register")
    public ResponseEntity<EventRegistration> registerForEvent(@PathVariable Long id) {
        return ResponseEntity.ok(studentService.registerForEvent(id));
    }

    @PreAuthorize("hasRole('STUDENT')")
    @GetMapping("/student/events")
    public ResponseEntity<List<EventRegistration>> getStudentEvents() {
        return ResponseEntity.ok(studentService.getRegisteredEvents());
    }

    @PreAuthorize("hasRole('STUDENT')")
    @GetMapping("/student/feedback")
    public ResponseEntity<List<Feedback>> getStudentFeedback() {
        return ResponseEntity.ok(studentService.getParticipationHistory());
    }

    @PreAuthorize("hasRole('STUDENT')")
    @GetMapping("/student/attendance")
    public ResponseEntity<List<Map<String, Object>>> getStudentAttendance() {
        return ResponseEntity.ok(studentService.getAttendanceRecords());
    }

    @PreAuthorize("hasRole('STUDENT')")
    @GetMapping("/student/participation")
    public ResponseEntity<List<Map<String, Object>>> getParticipation() {
        return ResponseEntity.ok(studentService.getParticipationRecords());
    }

    @PreAuthorize("hasRole('STUDENT')")
    @GetMapping("/student/announcements")
    public ResponseEntity<List<Announcement>> getAnnouncements() {
        return ResponseEntity.ok(studentService.getAnnouncements());
    }

    @PreAuthorize("hasRole('STUDENT')")
    @PostMapping("/events/{id}/feedback")
    public ResponseEntity<Feedback> submitFeedback(@PathVariable Long id, @Valid @RequestBody FeedbackRequest request) {
        return ResponseEntity.ok(studentService.submitFeedback(id, request));
    }
}
