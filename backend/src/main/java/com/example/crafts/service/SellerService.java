package com.example.crafts.service;

import com.example.crafts.entity.Seller;
import com.example.crafts.repository.SellerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SellerService {

    @Autowired
    private SellerRepository sellerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public String registerSeller(Seller seller) {
        if (sellerRepository.findByEmail(seller.getEmail()).isPresent()) {
            throw new RuntimeException("Seller already exists");
        }

        // ✅ Encode password
        seller.setPassword(passwordEncoder.encode(seller.getPassword()));
        seller.setStatus("PENDING");
        sellerRepository.save(seller);
        return seller.getName() + " registered successfully!";
    }

    public Seller getSellerByEmail(String email) {
        return sellerRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Seller not found"));
    }

    public void updateProfile(String email, Seller updatedSeller) {
        Seller seller = getSellerByEmail(email);
        seller.setName(updatedSeller.getName());

        if (updatedSeller.getPassword() != null && !updatedSeller.getPassword().isBlank()) {
            // ✅ Encode new password
            seller.setPassword(passwordEncoder.encode(updatedSeller.getPassword()));
        }

        sellerRepository.save(seller);
    }

    public String getStatus(String email) {
        return getSellerByEmail(email).getStatus();
    }

    public List<Seller> getPendingSellers() {
        return sellerRepository.findByStatus("PENDING");
    }

    public List<Seller> getApprovedSellers() {
        return sellerRepository.findByStatus("APPROVED");
    }

    public boolean approveSeller(int id) {
        return sellerRepository.findById(id).map(seller -> {
            if ("PENDING".equals(seller.getStatus())) {
                seller.setStatus("APPROVED");
                sellerRepository.save(seller);
                return true;
            }
            return false;
        }).orElse(false);
    }
}
