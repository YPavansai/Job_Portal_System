package com.jobportal.backend.service;

import com.jobportal.backend.dto.AuthRequest;
import com.jobportal.backend.dto.AuthResponse;
import com.jobportal.backend.dto.RegisterRequest;
import com.jobportal.backend.entity.User;

import java.util.List;

public interface AuthService {
    AuthResponse authenticateUser(AuthRequest authRequest);
    void registerUser(RegisterRequest registerRequest);
    List<User> getAllUsers();
}
