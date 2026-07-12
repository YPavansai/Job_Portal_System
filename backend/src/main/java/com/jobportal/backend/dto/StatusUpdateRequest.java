package com.jobportal.backend.dto;

import com.jobportal.backend.entity.JobApplicationStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StatusUpdateRequest {
    @NotNull(message = "Status cannot be null")
    private JobApplicationStatus status;
}
