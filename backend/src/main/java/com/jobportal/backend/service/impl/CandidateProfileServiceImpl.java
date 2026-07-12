package com.jobportal.backend.service.impl;

import com.jobportal.backend.dto.ProfileRequest;
import com.jobportal.backend.dto.ProfileResponse;
import com.jobportal.backend.entity.CandidateProfile;
import com.jobportal.backend.entity.User;
import com.jobportal.backend.exception.ResourceNotFoundException;
import com.jobportal.backend.repository.CandidateProfileRepository;
import com.jobportal.backend.service.CandidateProfileService;
import com.jobportal.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CandidateProfileServiceImpl implements CandidateProfileService {

    @Autowired
    private CandidateProfileRepository candidateProfileRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    @Transactional
    public ProfileResponse getProfileByUserId(Long userId) {
        CandidateProfile profile = candidateProfileRepository.findByUserId(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new ResourceNotFoundException("Candidate User not found with ID: " + userId));
                    CandidateProfile newProfile = CandidateProfile.builder()
                            .user(user)
                            .phone("")
                            .title("")
                            .bio("")
                            .skills("")
                            .education("")
                            .experience("")
                            .resumeUrl("")
                            .build();
                    return candidateProfileRepository.save(newProfile);
                });
        return mapToResponse(profile);
    }

    @Override
    @Transactional
    public ProfileResponse updateProfile(ProfileRequest profileRequest, User user) {
        CandidateProfile profile = candidateProfileRepository.findByUser(user)
                .orElseGet(() -> CandidateProfile.builder().user(user).build());

        profile.setPhone(profileRequest.getPhone());
        profile.setTitle(profileRequest.getTitle());
        profile.setBio(profileRequest.getBio());
        profile.setSkills(profileRequest.getSkills());
        profile.setEducation(profileRequest.getEducation());
        profile.setExperience(profileRequest.getExperience());
        if (profileRequest.getResumeUrl() != null && !profileRequest.getResumeUrl().trim().isEmpty()) {
            profile.setResumeUrl(profileRequest.getResumeUrl());
        }

        CandidateProfile savedProfile = candidateProfileRepository.save(profile);
        return mapToResponse(savedProfile);
    }

    private ProfileResponse mapToResponse(CandidateProfile profile) {
        return ProfileResponse.builder()
                .id(profile.getId())
                .userId(profile.getUser().getId())
                .email(profile.getUser().getEmail())
                .name(profile.getUser().getName())
                .phone(profile.getPhone())
                .title(profile.getTitle())
                .bio(profile.getBio())
                .skills(profile.getSkills())
                .education(profile.getEducation())
                .experience(profile.getExperience())
                .resumeUrl(profile.getResumeUrl())
                .build();
    }
}
