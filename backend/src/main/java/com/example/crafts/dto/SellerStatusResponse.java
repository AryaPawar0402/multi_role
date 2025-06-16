package com.example.crafts.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SellerStatusResponse {
    private String name;
    private String email;
    private String status;
}
