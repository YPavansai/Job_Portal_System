package com.jobportal.backend.service;

import com.jobportal.backend.dto.ApplicationRequest;
import com.jobportal.backend.dto.ApplicationResponse;
import com.jobportal.backend.dto.StatsResponse;
import com.jobportal.backend.entity.JobApplicationStatus;
import com.jobportal.backend.entity.User;

import java.util.List;

public interface JobApplicationService {
    ApplicationResponse applyToJob(Long jobId, ApplicationRequest applicationRequest, User candidate);
    List<ApplicationResponse> getCandidateApplications(User candidate);
    List<ApplicationResponse> getJobApplications(Long jobId, User recruiter);
    List<ApplicationResponse> getRecruiterApplications(User recruiter);
    ApplicationResponse updateApplicationStatus(Long applicationId, JobApplicationStatus status, User recruiter);
    StatsResponse getStats(User user);
}
