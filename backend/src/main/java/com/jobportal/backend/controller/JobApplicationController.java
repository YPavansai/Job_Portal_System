package com.jobportal.backend.controller;

import com.jobportal.backend.config.UserDetailsImpl;
import com.jobportal.backend.dto.ApplicationRequest;
import com.jobportal.backend.dto.ApplicationResponse;
import com.jobportal.backend.dto.StatsResponse;
import com.jobportal.backend.dto.StatusUpdateRequest;
import com.jobportal.backend.entity.User;
import com.jobportal.backend.exception.BadRequestException;
import com.jobportal.backend.repository.UserRepository;
import com.jobportal.backend.service.JobApplicationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/api/applications")
public class JobApplicationController {

    @Autowired
    private JobApplicationService jobApplicationService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/apply/{jobId}")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<ApplicationResponse> applyToJob(
            @PathVariable Long jobId,
            @Valid @RequestBody ApplicationRequest applicationRequest,
            @AuthenticationPrincipal UserDetailsImpl userPrincipal) {
        User user = getCurrentUser(userPrincipal);
        ApplicationResponse response = jobApplicationService.applyToJob(jobId, applicationRequest, user);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/my-applications")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<List<ApplicationResponse>> getCandidateApplications(
            @AuthenticationPrincipal UserDetailsImpl userPrincipal) {
        User user = getCurrentUser(userPrincipal);
        List<ApplicationResponse> applications = jobApplicationService.getCandidateApplications(user);
        return ResponseEntity.ok(applications);
    }

    @GetMapping("/job/{jobId}")
    @PreAuthorize("hasRole('RECRUITER') or hasRole('ADMIN')")
    public ResponseEntity<List<ApplicationResponse>> getJobApplications(
            @PathVariable Long jobId,
            @AuthenticationPrincipal UserDetailsImpl userPrincipal) {
        User user = getCurrentUser(userPrincipal);
        List<ApplicationResponse> applications = jobApplicationService.getJobApplications(jobId, user);
        return ResponseEntity.ok(applications);
    }

    @GetMapping("/my-received")
    @PreAuthorize("hasRole('RECRUITER') or hasRole('ADMIN')")
    public ResponseEntity<List<ApplicationResponse>> getRecruiterApplications(
            @AuthenticationPrincipal UserDetailsImpl userPrincipal) {
        User user = getCurrentUser(userPrincipal);
        List<ApplicationResponse> applications = jobApplicationService.getRecruiterApplications(user);
        return ResponseEntity.ok(applications);
    }

    @PutMapping("/{applicationId}/status")
    @PreAuthorize("hasRole('RECRUITER') or hasRole('ADMIN')")
    public ResponseEntity<ApplicationResponse> updateApplicationStatus(
            @PathVariable Long applicationId,
            @Valid @RequestBody StatusUpdateRequest statusUpdateRequest,
            @AuthenticationPrincipal UserDetailsImpl userPrincipal) {
        User user = getCurrentUser(userPrincipal);
        ApplicationResponse response = jobApplicationService.updateApplicationStatus(
                applicationId, statusUpdateRequest.getStatus(), user);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/stats")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<StatsResponse> getStats(
            @AuthenticationPrincipal UserDetailsImpl userPrincipal) {
        User user = getCurrentUser(userPrincipal);
        StatsResponse stats = jobApplicationService.getStats(user);
        return ResponseEntity.ok(stats);
    }

    private User getCurrentUser(UserDetailsImpl userPrincipal) {
        if (userPrincipal == null) {
            throw new BadRequestException("Unauthorized access.");
        }
        return userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new BadRequestException("User context not found."));
    }
}
