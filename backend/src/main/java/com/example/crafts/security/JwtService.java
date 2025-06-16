package com.example.crafts.security;

import com.example.crafts.service.TokenBlacklistService;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}") // in milliseconds (e.g., 86400000 = 1 day)
    private long jwtExpiration;

    @Autowired
    private TokenBlacklistService tokenBlacklistService;

    private Key getSigningKey() {
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        if (keyBytes.length < 32) {
            throw new IllegalArgumentException("JWT secret key must be at least 256 bits (32 bytes)");
        }
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // ✅ Generate token with email and role
    public String generateToken(String email, String role) {
        return Jwts.builder()
                .setSubject(email)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // ✅ Extract email (subject) from token
    public String extractUsername(String token) {
        try {
            return extractAllClaims(token).getSubject();
        } catch (Exception e) {
            System.out.println("❌ Error extracting username: " + e.getMessage());
            return null;
        }
    }

    // ✅ Extract role from token
    public String extractRole(String token) {
        try {
            return extractAllClaims(token).get("role", String.class);
        } catch (Exception e) {
            System.out.println("❌ Error extracting role: " + e.getMessage());
            return null;
        }
    }

    // ✅ Validate token with blacklist check
    public boolean validateToken(String token, org.springframework.security.core.userdetails.UserDetails userDetails) {
        final String username = extractUsername(token);
        return username != null &&
                username.equals(userDetails.getUsername()) &&
                !isTokenExpired(token) &&
                !tokenBlacklistService.isTokenBlacklisted(token);
    }

    private boolean isTokenExpired(String token) {
        try {
            return extractAllClaims(token).getExpiration().before(new Date());
        } catch (Exception e) {
            System.out.println("❌ Error checking token expiry: " + e.getMessage());
            return true;
        }
    }

    private Claims extractAllClaims(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (JwtException e) {
            System.out.println("❌ Failed to parse token claims: " + e.getMessage());
            throw e; // optional: rethrow or return empty claims
        }
    }

    // ✅ Extract token from header
    public String extractToken(HttpServletRequest request) {
        final String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        return null;
    }

    // ✅ Extract email from token inside request
    public String extractEmailFromRequest(HttpServletRequest request) {
        String token = extractToken(request);
        if (token != null) {
            String email = extractUsername(token);
            System.out.println("📨 Email extracted from JWT: " + email);
            return email;
        } else {
            System.out.println("⚠️ No token found in Authorization header");
            return null;
        }
    }

    // ✅ Invalidate token
    public void invalidateToken(String token) {
        if (token != null) {
            tokenBlacklistService.blacklistToken(token);
            System.out.println("🗑️ Token blacklisted successfully");
        }
    }
}
