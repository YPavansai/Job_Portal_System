package com.jobportal.backend.service;

import com.jobportal.backend.dto.JobRequest;
import com.jobportal.backend.dto.JobResponse;
import com.jobportal.backend.entity.JobType;
import com.jobportal.backend.entity.User;

import java.util.List;

public interface JobService {
    JobResponse createJob(JobRequest jobRequest, User recruiter);
    JobResponse updateJob(Long id, JobRequest jobRequest, User recruiter);
    void deleteJob(Long id, User recruiter);
    JobResponse getJobById(Long id);
    List<JobResponse> searchJobs(String title, String location, JobType jobType, String experienceLevel);
    List<JobResponse> getMyJobs(User recruiter);
}
