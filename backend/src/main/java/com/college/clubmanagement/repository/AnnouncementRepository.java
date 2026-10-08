package com.college.clubmanagement.repository;

import com.college.clubmanagement.entity.Announcement;
import com.college.clubmanagement.entity.Club;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {
    List<Announcement> findByClubOrderByCreatedAtDesc(Club club);
    List<Announcement> findByClub(Club club);
}
