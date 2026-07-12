package com.jobportal.backend.controller;

import com.jobportal.backend.config.UserDetailsImpl;
import com.jobportal.backend.dto.ProfileRequest;
import com.jobportal.backend.dto.ProfileResponse;
import com.jobportal.backend.entity.User;
import com.jobportal.backend.exception.BadRequestException;
import com.jobportal.backend.repository.UserRepository;
import com.jobportal.backend.service.CandidateProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;

@CrossOrigin
@RestController
@RequestMapping("/api/profiles")
public class ProfileController {

    @Autowired
    private CandidateProfileService candidateProfileService;

    @Autowired
    private UserRepository userRepository;

    @Value("${app.upload.dir}")
    private String uploadDir;

    @GetMapping("/candidate/{userId}")
    public ResponseEntity<ProfileResponse> getCandidateProfile(@PathVariable Long userId) {
        ProfileResponse profile = candidateProfileService.getProfileByUserId(userId);
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/candidate")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<ProfileResponse> updateCandidateProfile(
            @RequestBody ProfileRequest profileRequest,
            @AuthenticationPrincipal UserDetailsImpl userPrincipal) {
        User user = getCurrentUser(userPrincipal);
        ProfileResponse profile = candidateProfileService.updateProfile(profileRequest, user);
        return ResponseEntity.ok(profile);
    }

    @PostMapping("/resume/upload")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<?> uploadResume(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal UserDetailsImpl userPrincipal) {
        if (file.isEmpty()) {
            throw new BadRequestException("Please select a file to upload.");
        }

        // Validate file extension
        String originalFilename = file.getOriginalFilename();
        String fileExtension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            fileExtension = originalFilename.substring(originalFilename.lastIndexOf(".")).toLowerCase();
        }

        if (!fileExtension.equals(".pdf") && !fileExtension.equals(".doc") && !fileExtension.equals(".docx")) {
            throw new BadRequestException("Only PDF or DOC/DOCX files are allowed.");
        }

        try {
            // Create uploads directory if it does not exist
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Generate clean and unique filename
            String cleanFileName = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
            String uniqueFileName = UUID.randomUUID().toString() + "_" + cleanFileName.replace(" ", "_");

            Path targetLocation = uploadPath.resolve(uniqueFileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            // Construct download url
            String resumeUrl = "/api/profiles/resume/download/" + uniqueFileName;

            Map<String, String> response = new HashMap<>();
            response.put("resumeUrl", resumeUrl);
            response.put("fileName", cleanFileName);

            return ResponseEntity.ok(response);
        } catch (IOException ex) {
            throw new BadRequestException("Could not upload file: " + ex.getMessage());
        }
    }

    private User getCurrentUser(UserDetailsImpl userPrincipal) {
        if (userPrincipal == null) {
            throw new BadRequestException("Unauthorized access.");
        }
        return userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new BadRequestException("User context not found."));
    }
}
