package com.example.customers.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Customer {
    private String id;
    private String name;
    private String email;
    private String phone;
    private Address address;
    private String tier; // BRONZE, SILVER, GOLD, PLATINUM
    private Integer loyaltyPoints;
}
