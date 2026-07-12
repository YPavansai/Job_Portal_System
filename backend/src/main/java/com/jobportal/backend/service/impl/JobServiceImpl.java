package com.jobportal.backend.service.impl;

import com.jobportal.backend.dto.JobRequest;
import com.jobportal.backend.dto.JobResponse;
import com.jobportal.backend.entity.Job;
import com.jobportal.backend.entity.JobType;
import com.jobportal.backend.entity.Role;
import com.jobportal.backend.entity.User;
import com.jobportal.backend.exception.BadRequestException;
import com.jobportal.backend.exception.ResourceNotFoundException;
import com.jobportal.backend.repository.JobRepository;
import com.jobportal.backend.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class JobServiceImpl implements JobService {

    @Autowired
    private JobRepository jobRepository;

    @Override
    @Transactional
    public JobResponse createJob(JobRequest jobRequest, User recruiter) {
        Job job = Job.builder()
                .title(jobRequest.getTitle())
                .description(jobRequest.getDescription())
                .requirements(jobRequest.getRequirements())
                .location(jobRequest.getLocation())
                .salaryRange(jobRequest.getSalaryRange())
                .jobType(jobRequest.getJobType())
                .experienceLevel(jobRequest.getExperienceLevel())
                .postedBy(recruiter)
                .active(true)
                .build();

        Job savedJob = jobRepository.save(job);
        return mapToResponse(savedJob);
    }

    @Override
    @Transactional
    public JobResponse updateJob(Long id, JobRequest jobRequest, User recruiter) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with ID: " + id));

        verifyOwnerOrAdmin(job, recruiter);

        job.setTitle(jobRequest.getTitle());
        job.setDescription(jobRequest.getDescription());
        job.setRequirements(jobRequest.getRequirements());
        job.setLocation(jobRequest.getLocation());
        job.setSalaryRange(jobRequest.getSalaryRange());
        job.setJobType(jobRequest.getJobType());
        job.setExperienceLevel(jobRequest.getExperienceLevel());

        Job updatedJob = jobRepository.save(job);
        return mapToResponse(updatedJob);
    }

    @Override
    @Transactional
    public void deleteJob(Long id, User recruiter) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with ID: " + id));

        verifyOwnerOrAdmin(job, recruiter);
        
        // Soft delete
        job.setActive(false);
        jobRepository.save(job);
    }

    @Override
    @Transactional(readOnly = true)
    public JobResponse getJobById(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with ID: " + id));
        if (!job.isActive()) {
            throw new BadRequestException("This job listing is no longer active.");
        }
        return mapToResponse(job);
    }

    @Override
    @Transactional(readOnly = true)
    public List<JobResponse> searchJobs(String title, String location, JobType jobType, String experienceLevel) {
        List<Job> jobs = jobRepository.searchJobs(
                title != null && title.trim().isEmpty() ? null : title,
                location != null && location.trim().isEmpty() ? null : location,
                jobType,
                experienceLevel != null && experienceLevel.trim().isEmpty() ? null : experienceLevel
        );
        return jobs.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<JobResponse> getMyJobs(User recruiter) {
        List<Job> jobs = jobRepository.findByPostedByAndActive(recruiter, true);
        return jobs.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    private void verifyOwnerOrAdmin(Job job, User user) {
        if (user.getRole() == Role.ADMIN) {
            return;
        }
        if (!job.getPostedBy().getId().equals(user.getId())) {
            throw new BadRequestException("You do not have permission to modify this job posting.");
        }
    }

    private JobResponse mapToResponse(Job job) {
        return JobResponse.builder()
                .id(job.getId())
                .title(job.getTitle())
                .description(job.getDescription())
                .requirements(job.getRequirements())
                .location(job.getLocation())
                .salaryRange(job.getSalaryRange())
                .jobType(job.getJobType())
                .experienceLevel(job.getExperienceLevel())
                .active(job.isActive())
                .createdAt(job.getCreatedAt())
                .updatedAt(job.getUpdatedAt())
                .postedById(job.getPostedBy().getId())
                .postedByName(job.getPostedBy().getName())
                .postedByCompanyName(job.getPostedBy().getCompanyName())
                .build();
    }
}
