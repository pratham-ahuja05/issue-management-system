package com.issue_management.config;

import com.issue_management.model.Role;
import com.issue_management.model.RoleType;
import com.issue_management.repository.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializationConfig {

    @Bean
    public CommandLineRunner initRoles(RoleRepository roleRepository) {
        return args -> {
            // Initialize roles if they don't exist
            if (roleRepository.findByName(RoleType.ADMIN).isEmpty()) {
                roleRepository.save(new Role(RoleType.ADMIN));
            }
            if (roleRepository.findByName(RoleType.MANAGER).isEmpty()) {
                roleRepository.save(new Role(RoleType.MANAGER));
            }
            if (roleRepository.findByName(RoleType.ANALYST).isEmpty()) {
                roleRepository.save(new Role(RoleType.ANALYST));
            }
            if (roleRepository.findByName(RoleType.VIEWER).isEmpty()) {
                roleRepository.save(new Role(RoleType.VIEWER));
            }
        };
    }
}
