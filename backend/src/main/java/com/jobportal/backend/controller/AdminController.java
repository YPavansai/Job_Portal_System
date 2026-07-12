package com.jobportal.backend.controller;

import com.jobportal.backend.entity.Role;
import com.jobportal.backend.entity.User;
import com.jobportal.backend.entity.Job;
import com.jobportal.backend.entity.JobApplication;
import com.jobportal.backend.entity.CandidateProfile;
import com.jobportal.backend.repository.UserRepository;
import com.jobportal.backend.repository.JobRepository;
import com.jobportal.backend.repository.JobApplicationRepository;
import com.jobportal.backend.repository.CandidateProfileRepository;
import com.jobportal.backend.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private JobApplicationRepository jobApplicationRepository;

    @Autowired
    private CandidateProfileRepository candidateProfileRepository;

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }

    @DeleteMapping("/users/{id}")
    @Transactional
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        // Prevent self-deletion
        if (user.getRole() == Role.ADMIN) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Cannot delete Admin accounts!");
            return ResponseEntity.badRequest().body(response);
        }

        // 1. Cascade candidate deletion
        if (user.getRole() == Role.CANDIDATE) {
            // Delete candidate's job applications
            List<JobApplication> applications = jobApplicationRepository.findByCandidateOrderByAppliedAtDesc(user);
            jobApplicationRepository.deleteAll(applications);

            // Delete candidate's profile
            candidateProfileRepository.findByUser(user).ifPresent(profile -> {
                candidateProfileRepository.delete(profile);
            });
        } 
        // 2. Cascade recruiter deletion
        else if (user.getRole() == Role.RECRUITER) {
            // Find all jobs posted by this recruiter
            List<Job> jobs = jobRepository.findByPostedBy(user);
            for (Job job : jobs) {
                // Delete job applications associated with each job
                List<JobApplication> applications = jobApplicationRepository.findByJobOrderByAppliedAtDesc(job);
                jobApplicationRepository.deleteAll(applications);
            }
            // Delete the jobs themselves
            jobRepository.deleteAll(jobs);
        }

        // 3. Delete the user record
        userRepository.delete(user);

        Map<String, String> response = new HashMap<>();
        response.put("message", "User account and all related data deleted successfully!");
        return ResponseEntity.ok(response);
    }
}
