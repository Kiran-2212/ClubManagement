package com.college.clubmanagement.service;

import com.college.clubmanagement.entity.Club;
import com.college.clubmanagement.entity.Event;
import com.college.clubmanagement.entity.EventRegistration;
import com.college.clubmanagement.entity.User;
import com.college.clubmanagement.repository.AnnouncementRepository;
import com.college.clubmanagement.repository.AttendanceRepository;
import com.college.clubmanagement.repository.EventRegistrationRepository;
import com.college.clubmanagement.repository.EventRepository;
import com.college.clubmanagement.repository.FeedbackRepository;
import com.college.clubmanagement.repository.MembershipRepository;
import com.college.clubmanagement.repository.ClubRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertSame;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class StudentServiceTest {
    @Mock private UserService userService;
    @Mock private ClubRepository clubRepository;
    @Mock private MembershipRepository membershipRepository;
    @Mock private EventRepository eventRepository;
    @Mock private EventRegistrationRepository eventRegistrationRepository;
    @Mock private AnnouncementRepository announcementRepository;
    @Mock private FeedbackRepository feedbackRepository;
    @Mock private AttendanceRepository attendanceRepository;

    @InjectMocks private StudentService studentService;

    @Test
    void allowsStudentToRegisterWithoutClubMembership() {
        User student = new User("Vardhan", "vardhan@example.com", "encoded", null, null, null);
        Club club = new Club("AUMIC", "Club description", "Technology", "Faculty", "", null);
        Event event = new Event(club, "Open workshop", "Workshop", LocalDate.now().plusDays(1),
                LocalTime.of(10, 0), "Campus hall", 50);
        when(userService.getCurrentUser()).thenReturn(student);
        when(eventRepository.findById(7L)).thenReturn(Optional.of(event));
        when(eventRegistrationRepository.existsByEventAndStudent(event, student)).thenReturn(false);
        when(eventRegistrationRepository.findByEvent(event)).thenReturn(List.of());
        when(eventRegistrationRepository.save(any(EventRegistration.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        EventRegistration registration = studentService.registerForEvent(7L);

        assertSame(student, registration.getStudent());
        assertSame(event, registration.getEvent());
        verify(eventRegistrationRepository).save(registration);
        verify(membershipRepository, never()).findByStudentAndClub(any(), any());
    }
}
