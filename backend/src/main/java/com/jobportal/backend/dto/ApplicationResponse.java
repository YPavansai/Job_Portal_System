package com.jobportal.backend.dto;

import com.jobportal.backend.entity.JobApplicationStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicationResponse {
    private Long id;
    private Long jobId;
    private String jobTitle;
    private String jobLocation;
    private String jobType;
    private String companyName;
    private Long candidateId;
    private String candidateName;
    private String candidateEmail;
    private String resumeUrl;
    private String coverLetter;
    private JobApplicationStatus status;
    private LocalDateTime appliedAt;
    private LocalDateTime updatedAt;
}
