package com.jobportal.backend.service.impl;

import com.jobportal.backend.dto.ApplicationRequest;
import com.jobportal.backend.dto.ApplicationResponse;
import com.jobportal.backend.dto.StatsResponse;
import com.jobportal.backend.entity.*;
import com.jobportal.backend.exception.BadRequestException;
import com.jobportal.backend.exception.ResourceNotFoundException;
import com.jobportal.backend.repository.JobApplicationRepository;
import com.jobportal.backend.repository.JobRepository;
import com.jobportal.backend.service.JobApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class JobApplicationServiceImpl implements JobApplicationService {

    @Autowired
    private JobApplicationRepository jobApplicationRepository;

    @Autowired
    private JobRepository jobRepository;

    @Override
    @Transactional
    public ApplicationResponse applyToJob(Long jobId, ApplicationRequest applicationRequest, User candidate) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with ID: " + jobId));

        if (!job.isActive()) {
            throw new BadRequestException("This job listing is no longer active.");
        }

        if (jobApplicationRepository.existsByJobIdAndCandidateId(jobId, candidate.getId())) {
            throw new BadRequestException("You have already applied for this job!");
        }

        JobApplication application = JobApplication.builder()
                .job(job)
                .candidate(candidate)
                .resumeUrl(applicationRequest.getResumeUrl())
                .coverLetter(applicationRequest.getCoverLetter())
                .status(JobApplicationStatus.APPLIED)
                .build();

        JobApplication savedApplication = jobApplicationRepository.save(application);
        return mapToResponse(savedApplication);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ApplicationResponse> getCandidateApplications(User candidate) {
        List<JobApplication> applications = jobApplicationRepository.findByCandidateOrderByAppliedAtDesc(candidate);
        return applications.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ApplicationResponse> getJobApplications(Long jobId, User recruiter) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with ID: " + jobId));

        verifyJobOwner(job, recruiter);

        List<JobApplication> applications = jobApplicationRepository.findByJobOrderByAppliedAtDesc(job);
        return applications.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ApplicationResponse> getRecruiterApplications(User recruiter) {
        List<JobApplication> applications = jobApplicationRepository.findByJobPostedByOrderByAppliedAtDesc(recruiter);
        return applications.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ApplicationResponse updateApplicationStatus(Long applicationId, JobApplicationStatus status, User recruiter) {
        JobApplication application = jobApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Job Application not found with ID: " + applicationId));

        verifyJobOwner(application.getJob(), recruiter);

        application.setStatus(status);
        JobApplication updatedApplication = jobApplicationRepository.save(application);
        return mapToResponse(updatedApplication);
    }

    @Override
    @Transactional(readOnly = true)
    public StatsResponse getStats(User user) {
        long totalJobs = 0;
        long totalApplications = 0;
        long appliedCount = 0;
        long underReviewCount = 0;
        long shortlistedCount = 0;
        long rejectedCount = 0;
        long acceptedCount = 0;

        if (user.getRole() == Role.ADMIN) {
            totalJobs = jobRepository.count();
            List<JobApplication> allApps = jobApplicationRepository.findAll();
            totalApplications = allApps.size();
            for (JobApplication app : allApps) {
                switch (app.getStatus()) {
                    case APPLIED:
                        appliedCount++;
                        break;
                    case UNDER_REVIEW:
                        underReviewCount++;
                        break;
                    case SHORTLISTED:
                        shortlistedCount++;
                        break;
                    case REJECTED:
                        rejectedCount++;
                        break;
                    case ACCEPTED:
                        acceptedCount++;
                        break;
                }
            }
        } else if (user.getRole() == Role.RECRUITER) {
            List<Job> myJobs = jobRepository.findByPostedByAndActive(user, true);
            totalJobs = myJobs.size();
            List<JobApplication> myApps = jobApplicationRepository.findByJobPostedByOrderByAppliedAtDesc(user);
            totalApplications = myApps.size();
            for (JobApplication app : myApps) {
                switch (app.getStatus()) {
                    case APPLIED:
                        appliedCount++;
                        break;
                    case UNDER_REVIEW:
                        underReviewCount++;
                        break;
                    case SHORTLISTED:
                        shortlistedCount++;
                        break;
                    case REJECTED:
                        rejectedCount++;
                        break;
                    case ACCEPTED:
                        acceptedCount++;
                        break;
                }
            }
        } else if (user.getRole() == Role.CANDIDATE) {
            List<JobApplication> myApps = jobApplicationRepository.findByCandidateOrderByAppliedAtDesc(user);
            totalApplications = myApps.size();
            totalJobs = jobRepository.count(); // available active jobs
            for (JobApplication app : myApps) {
                switch (app.getStatus()) {
                    case APPLIED:
                        appliedCount++;
                        break;
                    case UNDER_REVIEW:
                        underReviewCount++;
                        break;
                    case SHORTLISTED:
                        shortlistedCount++;
                        break;
                    case REJECTED:
                        rejectedCount++;
                        break;
                    case ACCEPTED:
                        acceptedCount++;
                        break;
                }
            }
        }

        return StatsResponse.builder()
                .totalJobs(totalJobs)
                .totalApplications(totalApplications)
                .appliedCount(appliedCount)
                .underReviewCount(underReviewCount)
                .shortlistedCount(shortlistedCount)
                .rejectedCount(rejectedCount)
                .acceptedCount(acceptedCount)
                .build();
    }

    private void verifyJobOwner(Job job, User recruiter) {
        if (recruiter.getRole() == Role.ADMIN) {
            return;
        }
        if (!job.getPostedBy().getId().equals(recruiter.getId())) {
            throw new BadRequestException("You do not have permission to access applications for this job.");
        }
    }

    private ApplicationResponse mapToResponse(JobApplication app) {
        return ApplicationResponse.builder()
                .id(app.getId())
                .jobId(app.getJob().getId())
                .jobTitle(app.getJob().getTitle())
                .jobLocation(app.getJob().getLocation())
                .jobType(app.getJob().getJobType().name())
                .companyName(app.getJob().getPostedBy().getCompanyName())
                .candidateId(app.getCandidate().getId())
                .candidateName(app.getCandidate().getName())
                .candidateEmail(app.getCandidate().getEmail())
                .resumeUrl(app.getResumeUrl())
                .coverLetter(app.getCoverLetter())
                .status(app.getStatus())
                .appliedAt(app.getAppliedAt())
                .updatedAt(app.getUpdatedAt())
                .build();
    }
}
