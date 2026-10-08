package com.college.clubmanagement.repository;

import com.college.clubmanagement.entity.Club;
import com.college.clubmanagement.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClubRepository extends JpaRepository<Club, Long> {
    List<Club> findByActiveTrue();
    List<Club> findByClubAdmin(User clubAdmin);
}
