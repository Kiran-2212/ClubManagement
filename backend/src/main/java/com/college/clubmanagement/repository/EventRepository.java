package com.college.clubmanagement.repository;

import com.college.clubmanagement.entity.Club;
import com.college.clubmanagement.entity.Event;
import com.college.clubmanagement.entity.EventStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByClub(Club club);
    List<Event> findByStatus(EventStatus status);
}
