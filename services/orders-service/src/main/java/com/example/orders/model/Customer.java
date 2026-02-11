package com.example.orders.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Customer entity reference for Federation
 * This is a stub that refers to the Customer type in the customers-service
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Customer {
    private String id;
}
