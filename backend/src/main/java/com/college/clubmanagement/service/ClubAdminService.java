package com.college.clubmanagement.service;

import com.college.clubmanagement.dto.*;
import com.college.clubmanagement.entity.*;
import com.college.clubmanagement.exception.BadRequestException;
import com.college.clubmanagement.exception.ResourceNotFoundException;
import com.college.clubmanagement.repository.*;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ClubAdminService {
    private final UserService userService;
    private final ClubRepository clubRepository;
    private final MembershipRepository membershipRepository;
    private final EventRepository eventRepository;
    private final EventRegistrationRepository eventRegistrationRepository;
    private final AttendanceRepository attendanceRepository;
    private final AnnouncementRepository announcementRepository;
    private final FeedbackRepository feedbackRepository;

    public ClubAdminService(UserService userService,
                           ClubRepository clubRepository,
                           MembershipRepository membershipRepository,
                           EventRepository eventRepository,
                           EventRegistrationRepository eventRegistrationRepository,
                           AttendanceRepository attendanceRepository,
                           AnnouncementRepository announcementRepository,
                           FeedbackRepository feedbackRepository) {
        this.userService = userService;
        this.clubRepository = clubRepository;
        this.membershipRepository = membershipRepository;
        this.eventRepository = eventRepository;
        this.eventRegistrationRepository = eventRegistrationRepository;
        this.attendanceRepository = attendanceRepository;
        this.announcementRepository = announcementRepository;
        this.feedbackRepository = feedbackRepository;
    }

    public List<Club> getManagedClubs() {
        User admin = userService.getCurrentUser();
        return clubRepository.findByClubAdmin(admin);
    }

    public Map<String, Object> getDashboard() {
        User admin = userService.getCurrentUser();
        List<Club> clubs = clubRepository.findByClubAdmin(admin);
        List<Membership> pendingRequests = new ArrayList<>();
        List<Event> upcomingEvents = new ArrayList<>();
        long memberCount = 0;

        for (Club club : clubs) {
            memberCount += membershipRepository.findByClub(club).stream()
                    .filter(m -> m.getStatus() == MembershipStatus.APPROVED)
                    .count();
            pendingRequests.addAll(membershipRepository.findByClubAndStatus(club, MembershipStatus.PENDING));
            upcomingEvents.addAll(eventRepository.findByClub(club).stream()
                    .filter(event -> event.getStatus() != EventStatus.CANCELLED)
                    .toList());
        }

        Map<String, Object> dashboard = new HashMap<>();
        dashboard.put("clubs", clubs);
        dashboard.put("memberCount", memberCount);
        dashboard.put("pendingRequests", pendingRequests.size());
        dashboard.put("upcomingEvents", upcomingEvents);
        dashboard.put("statistics", getStatistics());
        return dashboard;
    }

    public List<Membership> getMembershipRequests() {
        User admin = userService.getCurrentUser();
        List<Membership> pending = new ArrayList<>();
        for (Club club : clubRepository.findByClubAdmin(admin)) {
            pending.addAll(membershipRepository.findByClubAndStatus(club, MembershipStatus.PENDING));
        }
        return pending;
    }

    public Membership approveMembership(Long id) {
        Membership membership = membershipRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Membership not found with id: " + id));
        verifyManagedClub(membership.getClub());
        if (membership.getStatus() != MembershipStatus.PENDING) {
            throw new BadRequestException("Only pending membership requests can be approved");
        }
        membership.setStatus(MembershipStatus.APPROVED);
        membership.setJoinedAt(LocalDateTime.now());
        return membershipRepository.save(membership);
    }

    public Membership rejectMembership(Long id) {
        Membership membership = membershipRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Membership not found with id: " + id));
        verifyManagedClub(membership.getClub());
        if (membership.getStatus() != MembershipStatus.PENDING) {
            throw new BadRequestException("Only pending membership requests can be rejected");
        }
        membership.setStatus(MembershipStatus.REJECTED);
        return membershipRepository.save(membership);
    }

    public Event createEvent(EventRequest request, Long clubId) {
        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new ResourceNotFoundException("Club not found with id: " + clubId));
        verifyManagedClub(club);

        Event event = new Event(club, request.title(), request.description(), request.date(), request.time(), request.venue(), request.capacity());
        event.setStatus(parseEventStatus(request.status()));
        return eventRepository.save(event);
    }

    public List<Event> getEvents() {
        User admin = userService.getCurrentUser();
        List<Event> events = new ArrayList<>();
        for (Club club : clubRepository.findByClubAdmin(admin)) {
            events.addAll(eventRepository.findByClub(club));
        }
        return events;
    }

    public Event updateEvent(Long eventId, EventRequest request) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));
        verifyManagedClub(event.getClub());

        event.setTitle(request.title());
        event.setDescription(request.description());
        event.setDate(request.date());
        event.setTime(request.time());
        event.setVenue(request.venue());
        event.setCapacity(request.capacity());
        event.setStatus(parseEventStatus(request.status()));
        return eventRepository.save(event);
    }

    @Transactional
    public void deleteEvent(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));
        verifyManagedClub(event.getClub());
        eventRegistrationRepository.deleteAll(eventRegistrationRepository.findByEvent(event));
        attendanceRepository.deleteAll(attendanceRepository.findByEvent(event));
        feedbackRepository.deleteAll(feedbackRepository.findByEvent(event));
        eventRepository.delete(event);
    }

    public List<EventRegistration> getRegistrations(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));
        verifyManagedClub(event.getClub());
        return eventRegistrationRepository.findByEvent(event);
    }

    public List<Attendance> getAttendance(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));
        verifyManagedClub(event.getClub());
        return attendanceRepository.findByEvent(event);
    }

    public List<Attendance> markAttendance(Long eventId, List<AttendanceRequest> attendanceRequests) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));
        verifyManagedClub(event.getClub());

        List<Attendance> saved = new ArrayList<>();
        for (AttendanceRequest request : attendanceRequests) {
            User student = userService.findById(request.studentId());
            AttendanceStatus status;
            try {
                status = AttendanceStatus.valueOf(request.status().trim().toUpperCase());
            } catch (IllegalArgumentException ex) {
                throw new BadRequestException("Invalid attendance status: " + request.status());
            }
            Attendance attendance = attendanceRepository.findByEventAndStudent(event, student)
                    .orElseGet(() -> new Attendance(event, student, status));
            attendance.setStatus(status);
            saved.add(attendanceRepository.save(attendance));
        }
        return saved;
    }

    public Announcement createAnnouncement(Long clubId, AnnouncementRequest request) {
        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new ResourceNotFoundException("Club not found with id: " + clubId));
        verifyManagedClub(club);
        Announcement announcement = new Announcement(club, request.title(), request.message());
        return announcementRepository.save(announcement);
    }

    public List<Announcement> getAnnouncements() {
        User admin = userService.getCurrentUser();
        List<Announcement> announcements = new ArrayList<>();
        for (Club club : clubRepository.findByClubAdmin(admin)) {
            announcements.addAll(announcementRepository.findByClub(club));
        }
        return announcements;
    }

    public Announcement updateAnnouncement(Long announcementId, AnnouncementRequest request) {
        Announcement announcement = announcementRepository.findById(announcementId)
                .orElseThrow(() -> new ResourceNotFoundException("Announcement not found with id: " + announcementId));
        verifyManagedClub(announcement.getClub());
        announcement.setTitle(request.title());
        announcement.setMessage(request.message());
        return announcementRepository.save(announcement);
    }

    public void deleteAnnouncement(Long announcementId) {
        Announcement announcement = announcementRepository.findById(announcementId)
                .orElseThrow(() -> new ResourceNotFoundException("Announcement not found with id: " + announcementId));
        verifyManagedClub(announcement.getClub());
        announcementRepository.delete(announcement);
    }

    public List<Feedback> getFeedback() {
        User admin = userService.getCurrentUser();
        List<Feedback> feedback = new ArrayList<>();
        for (Club club : clubRepository.findByClubAdmin(admin)) {
            for (Event event : eventRepository.findByClub(club)) {
                feedback.addAll(feedbackRepository.findByEvent(event));
            }
        }
        return feedback;
    }

    public Map<String, Object> getStatistics() {
        User admin = userService.getCurrentUser();
        List<Club> clubs = clubRepository.findByClubAdmin(admin);
        long totalMembers = 0;
        long totalRegistrations = 0;
        long attendanceMarked = 0;
        for (Club club : clubs) {
            List<Membership> memberships = membershipRepository.findByClub(club);
            totalMembers += memberships.stream().filter(m -> m.getStatus() == MembershipStatus.APPROVED).count();
            for (Event event : eventRepository.findByClub(club)) {
                totalRegistrations += eventRegistrationRepository.findByEvent(event).size();
                attendanceMarked += attendanceRepository.findByEvent(event).size();
            }
        }

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalMembers", totalMembers);
        stats.put("totalRegistrations", totalRegistrations);
        stats.put("attendanceMarked", attendanceMarked);
        stats.put("clubsManaged", clubs.size());
        return stats;
    }

    private void verifyManagedClub(Club club) {
        User admin = userService.getCurrentUser();
        if (club.getClubAdmin() == null || !club.getClubAdmin().getId().equals(admin.getId())) {
            throw new AccessDeniedException("You can only manage your own club");
        }
    }

    private EventStatus parseEventStatus(String status) {
        if (status == null || status.isBlank()) {
            return EventStatus.UPCOMING;
        }
        try {
            return EventStatus.valueOf(status.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("Invalid event status: " + status);
        }
    }
}
