package com.jobportal.backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfileRequest {
    private String phone;
    private String title;
    private String bio;
    private String skills;      // comma-separated
    private String education;   // text or JSON
    private String experience;  // text or JSON
    private String resumeUrl;
}
