package com.jobportal.backend.dto;

import com.jobportal.backend.entity.JobType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobRequest {
    @NotBlank
    private String title;

    @NotBlank
    private String description;

    private String requirements;

    @NotBlank
    private String location;

    private String salaryRange;

    @NotNull
    private JobType jobType;

    @NotBlank
    private String experienceLevel;
}
