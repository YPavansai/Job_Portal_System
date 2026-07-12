package com.jobportal.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "jobs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String title;

    @NotBlank
    @Lob
    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String requirements;

    @NotBlank
    @Column(nullable = false)
    private String location;

    @Column(name = "salary_range")
    private String salaryRange;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "job_type", nullable = false)
    private JobType jobType;

    @NotBlank
    @Column(name = "experience_level", nullable = false)
    private String experienceLevel;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "posted_by_id", nullable = false)
    private User postedBy;

    @Builder.Default
    private boolean active = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
