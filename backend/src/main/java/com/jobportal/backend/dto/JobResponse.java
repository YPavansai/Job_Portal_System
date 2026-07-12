package com.jobportal.backend.dto;

import com.jobportal.backend.entity.JobType;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobResponse {
    private Long id;
    private String title;
    private String description;
    private String requirements;
    private String location;
    private String salaryRange;
    private JobType jobType;
    private String experienceLevel;
    private boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long postedById;
    private String postedByName;
    private String postedByCompanyName;
}
