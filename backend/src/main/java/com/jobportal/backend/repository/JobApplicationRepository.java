package com.jobportal.backend.repository;

import com.jobportal.backend.entity.Job;
import com.jobportal.backend.entity.JobApplication;
import com.jobportal.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {
    
    List<JobApplication> findByCandidateOrderByAppliedAtDesc(User candidate);
    
    List<JobApplication> findByJobOrderByAppliedAtDesc(Job job);
    
    List<JobApplication> findByJobPostedByOrderByAppliedAtDesc(User recruiter);
    
    Optional<JobApplication> findByJobIdAndCandidateId(Long jobId, Long candidateId);
    
    boolean existsByJobIdAndCandidateId(Long jobId, Long candidateId);
}
