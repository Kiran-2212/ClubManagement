package com.college.clubmanagement.repository;

import com.college.clubmanagement.entity.Attendance;
import com.college.clubmanagement.entity.AttendanceStatus;
import com.college.clubmanagement.entity.Event;
import com.college.clubmanagement.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findByEvent(Event event);
    List<Attendance> findByStudent(User student);
    Optional<Attendance> findByEventAndStudent(Event event, User student);
    long countByEventAndStatus(Event event, AttendanceStatus status);
}
