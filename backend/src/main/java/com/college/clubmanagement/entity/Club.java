package com.college.clubmanagement.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "clubs")
public class Club {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(length = 2000)
    private String description;

    private String category;
    private String facultyCoordinator;
    private String logo;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "club_admin_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private User clubAdmin;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @Column(nullable = false)
    private boolean active = true;

    public Club() {}

    public Club(String name, String description, String category, String facultyCoordinator, String logo, User clubAdmin) {
        this.name = name;
        this.description = description;
        this.category = category;
        this.facultyCoordinator = facultyCoordinator;
        this.logo = logo;
        this.clubAdmin = clubAdmin;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getFacultyCoordinator() { return facultyCoordinator; }
    public void setFacultyCoordinator(String facultyCoordinator) { this.facultyCoordinator = facultyCoordinator; }
    public String getLogo() { return logo; }
    public void setLogo(String logo) { this.logo = logo; }
    public User getClubAdmin() { return clubAdmin; }
    public void setClubAdmin(User clubAdmin) { this.clubAdmin = clubAdmin; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
