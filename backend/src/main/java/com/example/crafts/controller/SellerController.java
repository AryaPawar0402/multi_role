package com.example.crafts.controller;

import com.example.crafts.dto.LoginRequest;
import com.example.crafts.dto.RegisterRequest;
import com.example.crafts.dto.UpdateProfileRequest;
import com.example.crafts.entity.Seller;
import com.example.crafts.security.JwtService;
import com.example.crafts.service.SellerService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/seller")
@CrossOrigin(origins = "http://localhost:3000") // ✅ Enable frontend access
public class SellerController {

    @Autowired
    private SellerService sellerService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
        Seller seller = new Seller();
        seller.setName(request.getName());
        seller.setEmail(request.getEmail());
        seller.setPassword(request.getPassword()); // ❌ Do NOT encode here
        return ResponseEntity.ok(sellerService.registerSeller(seller)); // ✅ Encoding happens in service
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Seller seller = sellerService.getSellerByEmail(request.getEmail());

        boolean match = seller != null && passwordEncoder.matches(request.getPassword(), seller.getPassword());

        System.out.println("🔐 Login attempt: " + request.getEmail());
        System.out.println("🔒 Raw password: " + request.getPassword());
        System.out.println("🔒 Encoded password in DB: " + (seller != null ? seller.getPassword() : "null"));
        System.out.println("🔍 Match result: " + match);

        if (match) {
            String token = jwtService.generateToken(seller.getEmail(), "SELLER");
            return ResponseEntity.ok(Map.of("token", token)); // ✅ frontend expects token as JSON
        }

        return ResponseEntity.status(401).body(Map.of("message", "Invalid credentials"));
    }

    @GetMapping("/profile")
    public ResponseEntity<Seller> getProfile(HttpServletRequest request) {
        String email = jwtService.extractEmailFromRequest(request);
        return ResponseEntity.ok(sellerService.getSellerByEmail(email));
    }

    @PutMapping("/profile")
    public ResponseEntity<String> updateProfile(HttpServletRequest request, @RequestBody UpdateProfileRequest updateRequest) {
        String email = jwtService.extractEmailFromRequest(request);
        Seller updatedSeller = new Seller();
        updatedSeller.setName(updateRequest.getName());
        updatedSeller.setPassword(updateRequest.getPassword()); // ❌ Let service handle encoding
        sellerService.updateProfile(email, updatedSeller);
        return ResponseEntity.ok("Profile updated");
    }

    @GetMapping("/status")
    public ResponseEntity<String> getStatus(HttpServletRequest request) {
        String email = jwtService.extractEmailFromRequest(request);
        return ResponseEntity.ok(sellerService.getStatus(email));
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request) {
        String token = jwtService.extractToken(request);
        jwtService.invalidateToken(token);
        return ResponseEntity.ok("Logged out");
    }
}
