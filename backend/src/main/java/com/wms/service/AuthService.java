package com.wms.service;

import com.wms.dto.AuthRequest;
import com.wms.dto.AuthResponse;
import com.wms.dto.RegisterRequest;
import com.wms.model.Role;
import com.wms.model.User;
import com.wms.repository.UserRepository;
import com.wms.security.JwtUtils;
import com.wms.security.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    public AuthResponse login(AuthRequest request) {
        Authentication auth = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        String token = jwtUtils.generateToken(userDetails.getUsername());
        return new AuthResponse(token, userDetails.getUsername(), userDetails.getEmail(),
            userDetails.getRole(), userDetails.getId());
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username already taken");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already in use");
        }
        User user = User.builder()
            .username(request.getUsername())
            .email(request.getEmail())
            .passwordHash(passwordEncoder.encode(request.getPassword()))
            .role(request.getRole() != null ? request.getRole() : Role.WORKER)
            .active(true)
            .build();
        userRepository.save(user);
        String token = jwtUtils.generateToken(user.getUsername());
        return new AuthResponse(token, user.getUsername(), user.getEmail(),
            user.getRole().name(), user.getId());
    }
}
