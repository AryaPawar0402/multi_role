package com.example.crafts.controller;

import com.example.crafts.dto.LoginRequest;
import com.example.crafts.dto.RegisterRequest;
import com.example.crafts.dto.UpdateProfileRequest;
import com.example.crafts.entity.Admin;
import com.example.crafts.entity.Seller;
import com.example.crafts.security.JwtService;
import com.example.crafts.service.AdminService;
import com.example.crafts.service.SellerService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private SellerService sellerService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // ✅ REGISTER
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
        Admin admin = new Admin();
        admin.setName(request.getName());
        admin.setEmail(request.getEmail());
        admin.setPassword(request.getPassword()); // raw password, will be encoded in service

        try {
            String message = adminService.registerAdmin(admin);
            return ResponseEntity.ok(message);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest request) {
        Admin admin = adminService.getAdminByEmail(request.getEmail());
        if (admin != null && passwordEncoder.matches(request.getPassword(), admin.getPassword())) {
            return ResponseEntity.ok(jwtService.generateToken(admin.getEmail(), "ADMIN"));
        }
        return ResponseEntity.status(401).body("Invalid credentials");
    }

    @GetMapping("/profile")
    public ResponseEntity<Admin> getProfile(HttpServletRequest request) {
        String email = jwtService.extractEmailFromRequest(request);
        return ResponseEntity.ok(adminService.getAdminByEmail(email));
    }

    @PutMapping("/profile")
    public ResponseEntity<String> updateProfile(HttpServletRequest request, @RequestBody UpdateProfileRequest updateRequest) {
        String email = jwtService.extractEmailFromRequest(request);
        Admin updatedAdmin = new Admin();
        updatedAdmin.setName(updateRequest.getName());
        // Pass raw password only, do NOT encode here
        updatedAdmin.setPassword(updateRequest.getPassword());
        adminService.updateProfile(email, updatedAdmin);
        return ResponseEntity.ok("Profile updated");
    }

    @GetMapping("/pending-sellers")
    public ResponseEntity<List<Seller>> getPendingSellers() {
        return ResponseEntity.ok(sellerService.getPendingSellers());
    }

    @GetMapping("/approved-sellers")
    public ResponseEntity<List<Seller>> getApprovedSellers() {
        return ResponseEntity.ok(sellerService.getApprovedSellers());
    }

    @PutMapping("/approve/{id}")
    public ResponseEntity<String> approveSeller(@PathVariable int id) {
        if (sellerService.approveSeller(id)) {
            return ResponseEntity.ok("Seller approved");
        }
        return ResponseEntity.status(404).body("Seller not found or already approved");
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request) {
        String token = jwtService.extractToken(request);
        jwtService.invalidateToken(token);
        return ResponseEntity.ok("Logged out");
    }
}
