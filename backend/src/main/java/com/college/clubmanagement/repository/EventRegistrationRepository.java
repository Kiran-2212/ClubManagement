package com.college.clubmanagement.repository;

import com.college.clubmanagement.entity.Event;
import com.college.clubmanagement.entity.EventRegistration;
import com.college.clubmanagement.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EventRegistrationRepository extends JpaRepository<EventRegistration, Long> {
    List<EventRegistration> findByStudent(User student);
    List<EventRegistration> findByEvent(Event event);
    Optional<EventRegistration> findByEventAndStudent(Event event, User student);
    boolean existsByEventAndStudent(Event event, User student);
}
