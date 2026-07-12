package com.jobportal.backend.repository;

import com.jobportal.backend.entity.Job;
import com.jobportal.backend.entity.JobType;
import com.jobportal.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {
    
    List<Job> findByPostedByAndActive(User postedBy, boolean active);
    
    List<Job> findByPostedBy(User postedBy);

    @Query("SELECT j FROM Job j WHERE j.active = true AND " +
           "(:title IS NULL OR LOWER(j.title) LIKE LOWER(CONCAT('%', :title, '%'))) AND " +
           "(:location IS NULL OR LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
           "(:jobType IS NULL OR j.jobType = :jobType) AND " +
           "(:experienceLevel IS NULL OR LOWER(j.experienceLevel) = LOWER(:experienceLevel)) " +
           "ORDER BY j.createdAt DESC")
    List<Job> searchJobs(
            @Param("title") String title,
            @Param("location") String location,
            @Param("jobType") JobType jobType,
            @Param("experienceLevel") String experienceLevel
    );
}
