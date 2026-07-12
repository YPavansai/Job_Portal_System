package com.jobportal.backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfileResponse {
    private Long id;
    private Long userId;
    private String email;
    private String name;
    private String phone;
    private String title;
    private String bio;
    private String skills;
    private String education;
    private String experience;
    private String resumeUrl;
}
