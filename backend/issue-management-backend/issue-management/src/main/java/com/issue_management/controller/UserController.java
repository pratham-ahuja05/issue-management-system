package com.issue_management.controller;

import com.issue_management.dto.UserResponse;
import com.issue_management.model.User;
import com.issue_management.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/users")
public class UserController {

    private final AuthService authService;

    public UserController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserResponse> getCurrentUser() {
        User user = authService.getCurrentUser();
        List<String> roles = user.getRoles().stream()
                .map(role -> role.getName().toString())
                .collect(Collectors.toList());
        
        UserResponse userResponse = new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.isEnabled(),
                roles
        );
        return ResponseEntity.ok(userResponse);
    }
}
