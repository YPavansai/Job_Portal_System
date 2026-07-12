package com.jobportal.backend.controller;

import com.jobportal.backend.config.UserDetailsImpl;
import com.jobportal.backend.dto.JobRequest;
import com.jobportal.backend.dto.JobResponse;
import com.jobportal.backend.entity.JobType;
import com.jobportal.backend.entity.User;
import com.jobportal.backend.exception.BadRequestException;
import com.jobportal.backend.repository.UserRepository;
import com.jobportal.backend.service.JobService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin
@RestController
@RequestMapping("/api/jobs")
public class JobController {

    @Autowired
    private JobService jobService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<JobResponse>> searchJobs(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String jobType,
            @RequestParam(required = false) String experienceLevel) {
        JobType jt = null;
        if (jobType != null && !jobType.trim().isEmpty()) {
            try {
                jt = JobType.valueOf(jobType.toUpperCase());
            } catch (IllegalArgumentException e) {
                // Ignore invalid enum and default to null (no filter on job type)
            }
        }
        List<JobResponse> jobs = jobService.searchJobs(title, location, jt, experienceLevel);
        return ResponseEntity.ok(jobs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobResponse> getJobById(@PathVariable Long id) {
        JobResponse job = jobService.getJobById(id);
        return ResponseEntity.ok(job);
    }

    @PostMapping
    @PreAuthorize("hasRole('RECRUITER') or hasRole('ADMIN')")
    public ResponseEntity<JobResponse> createJob(
            @Valid @RequestBody JobRequest jobRequest,
            @AuthenticationPrincipal UserDetailsImpl userPrincipal) {
        User user = getCurrentUser(userPrincipal);
        JobResponse createdJob = jobService.createJob(jobRequest, user);
        return new ResponseEntity<>(createdJob, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('RECRUITER') or hasRole('ADMIN')")
    public ResponseEntity<JobResponse> updateJob(
            @PathVariable Long id,
            @Valid @RequestBody JobRequest jobRequest,
            @AuthenticationPrincipal UserDetailsImpl userPrincipal) {
        User user = getCurrentUser(userPrincipal);
        JobResponse updatedJob = jobService.updateJob(id, jobRequest, user);
        return ResponseEntity.ok(updatedJob);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('RECRUITER') or hasRole('ADMIN')")
    public ResponseEntity<?> deleteJob(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl userPrincipal) {
        User user = getCurrentUser(userPrincipal);
        jobService.deleteJob(id, user);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Job listing deleted successfully!");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/my-postings")
    @PreAuthorize("hasRole('RECRUITER') or hasRole('ADMIN')")
    public ResponseEntity<List<JobResponse>> getMyJobs(
            @AuthenticationPrincipal UserDetailsImpl userPrincipal) {
        User user = getCurrentUser(userPrincipal);
        List<JobResponse> jobs = jobService.getMyJobs(user);
        return ResponseEntity.ok(jobs);
    }

    private User getCurrentUser(UserDetailsImpl userPrincipal) {
        if (userPrincipal == null) {
            throw new BadRequestException("Unauthorized access.");
        }
        return userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new BadRequestException("User context not found."));
    }
}
