package com.jobportal.backend.service.impl;

import com.jobportal.backend.config.JwtUtils;
import com.jobportal.backend.config.UserDetailsImpl;
import com.jobportal.backend.dto.AuthRequest;
import com.jobportal.backend.dto.AuthResponse;
import com.jobportal.backend.dto.RegisterRequest;
import com.jobportal.backend.entity.CandidateProfile;
import com.jobportal.backend.entity.Role;
import com.jobportal.backend.entity.User;
import com.jobportal.backend.exception.BadRequestException;
import com.jobportal.backend.repository.CandidateProfileRepository;
import com.jobportal.backend.repository.UserRepository;
import com.jobportal.backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CandidateProfileRepository candidateProfileRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    @Override
    public AuthResponse authenticateUser(AuthRequest authRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authRequest.getEmail(), authRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        // Fetch company name if recruiter
        String companyName = null;
        User user = userRepository.findByEmail(userDetails.getUsername()).orElse(null);
        if (user != null && user.getRole() == Role.RECRUITER) {
            companyName = user.getCompanyName();
        }

        return AuthResponse.builder()
                .token(jwt)
                .id(userDetails.getId())
                .email(userDetails.getUsername())
                .name(userDetails.getName())
                .role(userDetails.getRole())
                .companyName(companyName)
                .build();
    }

    @Override
    @Transactional
    public void registerUser(RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new BadRequestException("Email is already registered!");
        }

        if (registerRequest.getRole() == Role.RECRUITER && 
            (registerRequest.getCompanyName() == null || registerRequest.getCompanyName().trim().isEmpty())) {
            throw new BadRequestException("Company name is required for Recruiters!");
        }

        User user = User.builder()
                .name(registerRequest.getName())
                .email(registerRequest.getEmail())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .role(registerRequest.getRole())
                .companyName(registerRequest.getRole() == Role.RECRUITER ? registerRequest.getCompanyName() : null)
                .build();

        User savedUser = userRepository.save(user);

        // Pre-create blank profile for Candidate
        if (savedUser.getRole() == Role.CANDIDATE) {
            CandidateProfile profile = CandidateProfile.builder()
                    .user(savedUser)
                    .phone("")
                    .title("")
                    .bio("")
                    .skills("")
                    .education("")
                    .experience("")
                    .resumeUrl("")
                    .build();
            candidateProfileRepository.save(profile);
        }
    }
}
