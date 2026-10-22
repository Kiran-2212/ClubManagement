package com.college.clubmanagement.config;

import com.college.clubmanagement.entity.*;
import com.college.clubmanagement.repository.*;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;

@Component
public class DataSeeder implements ApplicationRunner {

    private final UserRepository userRepository;
    private final ClubRepository clubRepository;
    private final MembershipRepository membershipRepository;
    private final EventRepository eventRepository;
    private final AnnouncementRepository announcementRepository;
    private final EventRegistrationRepository eventRegistrationRepository;
    private final AttendanceRepository attendanceRepository;
    private final FeedbackRepository feedbackRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${SEED_ADMIN_PASSWORD:}")
    private String adminPassword;

    @Value("${SEED_ADMIN_2_PASSWORD:}")
    private String secondAdminPassword;

    @Value("${SEED_ADMIN_3_PASSWORD:}")
    private String thirdAdminPassword;

    @Value("${SEED_CLUB_ADMIN_PASSWORD:}")
    private String clubAdminPassword;

    @Value("${SEED_STUDENT_PASSWORD:}")
    private String studentPassword;

    public DataSeeder(UserRepository userRepository,
                      ClubRepository clubRepository,
                      MembershipRepository membershipRepository,
                      EventRepository eventRepository,
                      AnnouncementRepository announcementRepository,
                      EventRegistrationRepository eventRegistrationRepository,
                      AttendanceRepository attendanceRepository,
                      FeedbackRepository feedbackRepository,
                      PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.clubRepository = clubRepository;
        this.membershipRepository = membershipRepository;
        this.eventRepository = eventRepository;
        this.announcementRepository = announcementRepository;
        this.eventRegistrationRepository = eventRegistrationRepository;
        this.attendanceRepository = attendanceRepository;
        this.feedbackRepository = feedbackRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(ApplicationArguments args) {
        // Demo accounts are opt-in so known default passwords are never installed implicitly.
        if (adminPassword.isBlank()) {
            return;
        }

        createOrConfigureSystemAdmin("System Admin", "admin@college.com", adminPassword);
        if (!secondAdminPassword.isBlank()) {
            createOrConfigureSystemAdmin("System Admin 2", "admin2@college.com", secondAdminPassword);
        }
        if (!thirdAdminPassword.isBlank()) {
            createOrConfigureSystemAdmin("System Admin 3", "admin3@college.com", thirdAdminPassword);
        }

        if (clubAdminPassword.isBlank() || studentPassword.isBlank()) {
            return;
        }

        User clubAdmin = createSeedUser("Club Admin", "clubadmin@college.com", clubAdminPassword, Role.CLUB_ADMIN, "Computer Science", 2024);

        User student = createSeedUser("College Student", "student@college.com", studentPassword, Role.STUDENT, "Computer Science", 2025);

        if (clubRepository.count() == 0) {
            Club techClub = clubRepository.save(new Club("Tech Innovation Club", "Build projects and attend hackathons.", "Technology", "Dr. Sharma", "", clubAdmin));
            Club artsClub = clubRepository.save(new Club("Cultural Club", "Celebrate events, talent, and creativity.", "Arts", "Dr. Rao", "", clubAdmin));

            Membership membership = membershipRepository.findByStudentAndClub(student, techClub).orElseGet(() -> {
                Membership m = new Membership(student, techClub);
                m.setStatus(MembershipStatus.APPROVED);
                return membershipRepository.save(m);
            });

            membership.setStatus(MembershipStatus.APPROVED);
            membershipRepository.save(membership);

            if (eventRepository.count() == 0) {
                Event event1 = eventRepository.save(new Event(techClub, "Hackathon 2025", "Student innovation challenge", LocalDate.now().plusDays(4), LocalTime.of(10, 0), "Innovation Lab", 60));
                Event event2 = eventRepository.save(new Event(artsClub, "Cultural Fest", "Annual cultural festival", LocalDate.now().plusDays(8), LocalTime.of(14, 30), "Main Auditorium", 80));

                EventRegistration registration = eventRegistrationRepository.findByEventAndStudent(event1, student).orElseGet(() -> eventRegistrationRepository.save(new EventRegistration(event1, student)));
                if (registration != null) {
                    eventRegistrationRepository.save(registration);
                }

                Attendance attendance = attendanceRepository.findByEventAndStudent(event1, student).orElseGet(() -> new Attendance(event1, student, AttendanceStatus.PRESENT));
                attendance.setStatus(AttendanceStatus.PRESENT);
                attendanceRepository.save(attendance);

                if (feedbackRepository.findByEventAndStudent(event1, student).isEmpty()) {
                    feedbackRepository.save(new Feedback(event1, student, 5, "Great event and wonderful experience."));
                }
            }

            if (announcementRepository.count() == 0) {
                announcementRepository.save(new Announcement(techClub, "Welcome New Members", "Join our next workshop and meet the club team."));
                announcementRepository.save(new Announcement(artsClub, "Festival Preparations", "Volunteer registration is open for the upcoming annual fest."));
            }
        }
    }

    private User createSeedUser(String name, String email, String password, Role role, String department, Integer year) {
        return userRepository.findByEmail(email).orElseGet(() -> {
            User user = new User(name, email, passwordEncoder.encode(password), role, department, year);
            return userRepository.save(user);
        });
    }

    private User createOrConfigureSystemAdmin(String name, String email, String password) {
        User admin = userRepository.findByEmail(email).orElseGet(User::new);
        admin.setName(name);
        admin.setEmail(email);
        admin.setPassword(passwordEncoder.encode(password));
        admin.setRole(Role.SYSTEM_ADMIN);
        admin.setDepartment("Administration");
        admin.setYear(2025);
        admin.setEnabled(true);
        return userRepository.save(admin);
    }
}
