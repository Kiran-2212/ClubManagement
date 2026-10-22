package com.college.clubmanagement.service;

import com.college.clubmanagement.dto.*;
import com.college.clubmanagement.entity.*;
import com.college.clubmanagement.exception.BadRequestException;
import com.college.clubmanagement.exception.ResourceNotFoundException;
import com.college.clubmanagement.repository.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminService {
    private final UserRepository userRepository;
    private final ClubRepository clubRepository;
    private final MembershipRepository membershipRepository;
    private final EventRepository eventRepository;
    private final EventRegistrationRepository eventRegistrationRepository;
    private final AttendanceRepository attendanceRepository;
    private final AnnouncementRepository announcementRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminService(UserRepository userRepository,
                        ClubRepository clubRepository,
                        MembershipRepository membershipRepository,
                        EventRepository eventRepository,
                        EventRegistrationRepository eventRegistrationRepository,
                        AttendanceRepository attendanceRepository,
                        AnnouncementRepository announcementRepository,
                        PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.clubRepository = clubRepository;
        this.membershipRepository = membershipRepository;
        this.eventRepository = eventRepository;
        this.eventRegistrationRepository = eventRegistrationRepository;
        this.attendanceRepository = attendanceRepository;
        this.announcementRepository = announcementRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Map<String, Object> getDashboard() {
        Map<String, Object> dashboard = new HashMap<>();
        dashboard.put("totalUsers", userRepository.count());
        dashboard.put("totalStudents", userRepository.findByRole(Role.STUDENT).size());
        dashboard.put("totalClubAdmins", userRepository.findByRole(Role.CLUB_ADMIN).size());
        dashboard.put("totalClubs", clubRepository.count());
        dashboard.put("totalEvents", eventRepository.count());
        dashboard.put("totalMemberships", membershipRepository.count());
        dashboard.put("totalRegistrations", eventRegistrationRepository.count());
        dashboard.put("totalAnnouncements", announcementRepository.count());
        return dashboard;
    }

    public List<User> getUsers() {
        return userRepository.findAll();
    }

    public User updateUser(Long userId, UpdateUserRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        userRepository.findByEmail(request.email().trim())
                .filter(existingUser -> !existingUser.getId().equals(userId))
                .ifPresent(existingUser -> {
                    throw new BadRequestException("Email already in use");
                });
        user.setName(request.name());
        user.setEmail(request.email().trim());
        user.setRole(request.role());
        user.setDepartment(request.department());
        user.setYear(request.year());
        if (request.enabled() != null) {
            user.setEnabled(request.enabled());
        }
        return userRepository.save(user);
    }

    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        if (user.getRole() == Role.SYSTEM_ADMIN) {
            throw new BadRequestException("System admin accounts cannot be deleted");
        }
        userRepository.delete(user);
    }

    public List<Club> getClubs() {
        return clubRepository.findAll();
    }

    @Transactional
    public Club createClub(CreateClubRequest request) {
        if (request.clubAdminId() != null && request.newClubAdmin() != null) {
            throw new BadRequestException("Choose an existing club admin or create a new one, not both");
        }

        User clubAdmin;
        if (request.newClubAdmin() != null) {
            NewClubAdminRequest account = request.newClubAdmin();
            String email = account.email().trim();
            if (userRepository.existsByEmail(email)) {
                throw new BadRequestException("An account with that email already exists");
            }

            clubAdmin = new User(
                    account.name().trim(),
                    email,
                    passwordEncoder.encode(account.password()),
                    Role.CLUB_ADMIN,
                    null,
                    null
            );
            clubAdmin.setEnabled(true);
            clubAdmin = userRepository.save(clubAdmin);
        } else if (request.clubAdminId() != null) {
            clubAdmin = userRepository.findById(request.clubAdminId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.clubAdminId()));
            if (clubAdmin.getRole() != Role.CLUB_ADMIN) {
                throw new BadRequestException("Selected club admin user must have CLUB_ADMIN role");
            }
        } else {
            throw new BadRequestException("Select an existing club admin or create a new club admin account");
        }

        Club club = new Club(
                request.name(),
                request.description(),
                request.category(),
                request.facultyCoordinator(),
                request.logo(),
                clubAdmin
        );
        return clubRepository.save(club);
    }

    public Club updateClub(Long clubId, ClubRequest request) {
        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new ResourceNotFoundException("Club not found with id: " + clubId));
        club.setName(request.name());
        club.setDescription(request.description());
        club.setCategory(request.category());
        club.setFacultyCoordinator(request.facultyCoordinator());
        club.setLogo(request.logo());
        if (request.clubAdminId() != null) {
            User clubAdmin = userRepository.findById(request.clubAdminId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.clubAdminId()));
            if (clubAdmin.getRole() != Role.CLUB_ADMIN) {
                throw new BadRequestException("Club admin must have CLUB_ADMIN role");
            }
            club.setClubAdmin(clubAdmin);
        }
        return clubRepository.save(club);
    }

    public void deleteClub(Long clubId) {
        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new ResourceNotFoundException("Club not found with id: " + clubId));
        clubRepository.delete(club);
    }

    public List<Event> getEvents() {
        return eventRepository.findAll();
    }

    public List<Membership> getMemberships() {
        return membershipRepository.findAll();
    }

    public List<EventRegistration> getRegistrations() {
        return eventRegistrationRepository.findAll();
    }

    public List<Attendance> getAttendance() {
        return attendanceRepository.findAll();
    }

    public List<Announcement> getAnnouncements() {
        return announcementRepository.findAll();
    }

    public Map<String, Object> getStatistics() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalStudents", userRepository.findByRole(Role.STUDENT).size());
        stats.put("totalClubAdmins", userRepository.findByRole(Role.CLUB_ADMIN).size());
        stats.put("totalClubs", clubRepository.count());
        stats.put("totalEvents", eventRepository.count());
        stats.put("totalMemberships", membershipRepository.count());
        stats.put("totalRegistrations", eventRegistrationRepository.count());
        stats.put("totalAttendance", attendanceRepository.count());
        return stats;
    }
}
