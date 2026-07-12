package com.jobportal.backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StatsResponse {
    private long totalJobs;
    private long totalApplications;
    private long appliedCount;
    private long underReviewCount;
    private long shortlistedCount;
    private long rejectedCount;
    private long acceptedCount;
}
