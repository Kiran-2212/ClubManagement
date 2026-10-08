package com.college.clubmanagement.service;

import com.college.clubmanagement.dto.AuthResponse;
import com.college.clubmanagement.dto.LoginRequest;
import com.college.clubmanagement.dto.RegisterRequest;
import com.college.clubmanagement.dto.UserResponse;
import com.college.clubmanagement.entity.Role;
import com.college.clubmanagement.entity.User;
import com.college.clubmanagement.exception.BadRequestException;
import com.college.clubmanagement.repository.UserRepository;
import com.college.clubmanagement.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    public UserResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email().trim())) {
            throw new BadRequestException("Email already in use");
        }

        User user = new User();
        user.setName(request.name().trim());
        user.setEmail(request.email().trim());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setDepartment(request.department().trim());
        user.setYear(request.year());
        user.setRole(Role.STUDENT);
        user.setEnabled(true);

        return UserResponse.from(userRepository.save(user));
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email().trim())
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email().trim(), request.password())
        );

        String token = jwtTokenProvider.generateToken(authentication);
        return new AuthResponse(token, UserResponse.from(user));
    }
}
