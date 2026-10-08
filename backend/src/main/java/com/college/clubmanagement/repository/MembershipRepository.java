package com.college.clubmanagement.repository;

import com.college.clubmanagement.entity.Club;
import com.college.clubmanagement.entity.Membership;
import com.college.clubmanagement.entity.MembershipStatus;
import com.college.clubmanagement.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MembershipRepository extends JpaRepository<Membership, Long> {
    List<Membership> findByStudent(User student);
    List<Membership> findByClub(Club club);
    List<Membership> findByClubAndStatus(Club club, MembershipStatus status);
    Optional<Membership> findByStudentAndClub(User student, Club club);
    boolean existsByStudentAndClub(User student, Club club);
}
