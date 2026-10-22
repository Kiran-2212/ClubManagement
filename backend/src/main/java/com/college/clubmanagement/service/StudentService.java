package com.college.clubmanagement.service;

import com.college.clubmanagement.dto.FeedbackRequest;
import com.college.clubmanagement.entity.*;
import com.college.clubmanagement.exception.BadRequestException;
import com.college.clubmanagement.exception.ResourceNotFoundException;
import com.college.clubmanagement.repository.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class StudentService {
    private final UserService userService;
    private final ClubRepository clubRepository;
    private final MembershipRepository membershipRepository;
    private final EventRepository eventRepository;
    private final EventRegistrationRepository eventRegistrationRepository;
    private final AnnouncementRepository announcementRepository;
    private final FeedbackRepository feedbackRepository;
    private final AttendanceRepository attendanceRepository;

    public StudentService(UserService userService,
                          ClubRepository clubRepository,
                          MembershipRepository membershipRepository,
                          EventRepository eventRepository,
                          EventRegistrationRepository eventRegistrationRepository,
                          AnnouncementRepository announcementRepository,
                          FeedbackRepository feedbackRepository,
                          AttendanceRepository attendanceRepository) {
        this.userService = userService;
        this.clubRepository = clubRepository;
        this.membershipRepository = membershipRepository;
        this.eventRepository = eventRepository;
        this.eventRegistrationRepository = eventRegistrationRepository;
        this.announcementRepository = announcementRepository;
        this.feedbackRepository = feedbackRepository;
        this.attendanceRepository = attendanceRepository;
    }

    public Map<String, Object> getDashboard() {
        User student = userService.getCurrentUser();
        List<Membership> memberships = membershipRepository.findByStudent(student);
        long joinedClubs = memberships.stream().filter(m -> m.getStatus() == MembershipStatus.APPROVED).count();

        List<Event> upcomingEvents = eventRepository.findAll().stream()
                .filter(event -> event.getStatus() != EventStatus.CANCELLED)
                .sorted((a, b) -> a.getDate().compareTo(b.getDate()))
                .limit(5)
                .toList();

        List<EventRegistration> registrations = eventRegistrationRepository.findByStudent(student);
        List<Announcement> announcements = getAnnouncementFeed(student);

        Map<String, Object> dashboard = new HashMap<>();
        dashboard.put("welcome", "Welcome, " + student.getName());
        dashboard.put("joinedClubs", joinedClubs);
        dashboard.put("upcomingEvents", upcomingEvents);
        dashboard.put("registeredEvents", registrations.size());
        dashboard.put("announcements", announcements);
        dashboard.put("participationSummary", getParticipationSummary(student));
        return dashboard;
    }

    public List<Club> getAllClubs() {
        return clubRepository.findByActiveTrue();
    }

    public Club getClubById(Long id) {
        return clubRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Club not found with id: " + id));
    }

    public List<Membership> getMemberships() {
        return membershipRepository.findByStudent(userService.getCurrentUser());
    }

    public Membership requestMembership(Long clubId) {
        User student = userService.getCurrentUser();
        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new ResourceNotFoundException("Club not found with id: " + clubId));
        if (!club.isActive()) {
            throw new BadRequestException("This club is not accepting membership requests");
        }

        if (membershipRepository.existsByStudentAndClub(student, club)) {
            throw new BadRequestException("You already have a membership request or membership for this club");
        }

        Membership membership = new Membership(student, club);
        membership.setStatus(MembershipStatus.PENDING);
        return membershipRepository.save(membership);
    }

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public Event getEventById(Long id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));
    }

    public EventRegistration registerForEvent(Long eventId) {
        User student = userService.getCurrentUser();
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));
        if (event.getStatus() == EventStatus.CANCELLED || event.getStatus() == EventStatus.COMPLETED) {
            throw new BadRequestException("Registration is closed for this event");
        }

        if (eventRegistrationRepository.existsByEventAndStudent(event, student)) {
            throw new BadRequestException("You are already registered for this event");
        }

        long registeredCount = eventRegistrationRepository.findByEvent(event).size();
        if (event.getCapacity() != null && registeredCount >= event.getCapacity()) {
            throw new BadRequestException("Event capacity has been reached");
        }

        return eventRegistrationRepository.save(new EventRegistration(event, student));
    }

    public List<EventRegistration> getRegisteredEvents() {
        return eventRegistrationRepository.findByStudent(userService.getCurrentUser());
    }

    public List<Map<String, Object>> getParticipationSummary(User student) {
        List<Map<String, Object>> summary = new ArrayList<>();
        List<EventRegistration> registrations = eventRegistrationRepository.findByStudent(student);

        for (EventRegistration registration : registrations) {
            Map<String, Object> entry = new HashMap<>();
            entry.put("eventId", registration.getEvent().getId());
            entry.put("title", registration.getEvent().getTitle());
            entry.put("status", registration.getStatus());
            summary.add(entry);
        }
        return summary;
    }

    public List<Map<String, Object>> getParticipationRecords() {
        return getParticipationSummary(userService.getCurrentUser());
    }

    public List<Announcement> getAnnouncements() {
        return getAnnouncementFeed(userService.getCurrentUser());
    }

    public List<Announcement> getAnnouncementFeed(User student) {
        List<Announcement> allAnnouncements = new ArrayList<>();
        List<Membership> memberships = membershipRepository.findByStudent(student);
        for (Membership membership : memberships) {
            if (membership.getStatus() == MembershipStatus.APPROVED) {
                allAnnouncements.addAll(announcementRepository.findByClubOrderByCreatedAtDesc(membership.getClub()));
            }
        }
        allAnnouncements.sort((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()));
        return allAnnouncements;
    }

    public Feedback submitFeedback(Long eventId, FeedbackRequest request) {
        User student = userService.getCurrentUser();
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));

        if (!eventRegistrationRepository.existsByEventAndStudent(event, student)) {
            throw new BadRequestException("You can only provide feedback for events you registered for");
        }

        if (feedbackRepository.findByEventAndStudent(event, student).isPresent()) {
            throw new BadRequestException("You have already submitted feedback for this event");
        }

        Feedback feedback = new Feedback(event, student, request.rating(), request.comment());
        return feedbackRepository.save(feedback);
    }

    public List<Feedback> getParticipationHistory() {
        return feedbackRepository.findByStudent(userService.getCurrentUser());
    }

    public List<Map<String, Object>> getAttendanceRecords() {
        User student = userService.getCurrentUser();
        List<Attendance> attendance = attendanceRepository.findByStudent(student);
        List<Map<String, Object>> records = new ArrayList<>();
        for (Attendance item : attendance) {
            Map<String, Object> record = new HashMap<>();
            record.put("eventId", item.getEvent().getId());
            record.put("eventTitle", item.getEvent().getTitle());
            record.put("status", item.getStatus().name());
            record.put("markedAt", item.getMarkedAt());
            records.add(record);
        }
        return records;
    }
}
