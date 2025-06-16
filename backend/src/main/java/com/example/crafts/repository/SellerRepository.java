package com.example.crafts.repository;

import com.example.crafts.entity.Seller;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SellerRepository extends JpaRepository<Seller, Integer> {
    Optional<Seller> findByEmail(String email);
    List<Seller> findByStatus(String status); // For PENDING or APPROVED
}
