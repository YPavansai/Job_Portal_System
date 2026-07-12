package com.jobportal.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicationRequest {
    @NotBlank(message = "Resume URL/Path is required")
    private String resumeUrl;

    private String coverLetter;
}
