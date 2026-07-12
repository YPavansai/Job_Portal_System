package com.jobportal.backend.service;

import com.jobportal.backend.dto.ProfileRequest;
import com.jobportal.backend.dto.ProfileResponse;
import com.jobportal.backend.entity.User;

public interface CandidateProfileService {
    ProfileResponse getProfileByUserId(Long userId);
    ProfileResponse updateProfile(ProfileRequest profileRequest, User user);
}
