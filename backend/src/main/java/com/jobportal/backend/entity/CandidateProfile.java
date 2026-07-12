package com.jobportal.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "candidate_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CandidateProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    private String phone;

    private String title;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String bio;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String skills;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String education;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String experience;

    @Column(name = "resume_url")
    private String resumeUrl;
}
