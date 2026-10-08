package com.college.clubmanagement.repository;

import com.college.clubmanagement.entity.Event;
import com.college.clubmanagement.entity.Feedback;
import com.college.clubmanagement.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findByEvent(Event event);
    List<Feedback> findByStudent(User student);
    Optional<Feedback> findByEventAndStudent(Event event, User student);
}
