package com.example.crafts.service;

import com.example.crafts.entity.Admin;
import com.example.crafts.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public String registerAdmin(Admin admin) {
        if (adminRepository.findByEmail(admin.getEmail()).isPresent()) {
            throw new RuntimeException("Admin already exists");
        }
        // Encode password only during registration
        admin.setPassword(passwordEncoder.encode(admin.getPassword()));
        return adminRepository.save(admin).getName() + " registered successfully!";
    }

    public Admin getAdminByEmail(String email) {
        return adminRepository.findByEmail(email).orElse(null);
    }

    public void updateProfile(String email, Admin updatedAdmin) {
        Admin admin = getAdminByEmail(email);
        if (admin != null) {
            admin.setName(updatedAdmin.getName());

            // Only update password if it's provided and not blank
            if (updatedAdmin.getPassword() != null && !updatedAdmin.getPassword().isBlank()) {
                admin.setPassword(passwordEncoder.encode(updatedAdmin.getPassword()));
            }

            adminRepository.save(admin);
        }
    }
}
