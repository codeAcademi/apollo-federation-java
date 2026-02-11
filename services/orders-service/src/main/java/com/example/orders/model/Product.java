package com.example.orders.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Product entity reference for Federation
 * This is a stub that refers to the Product type in the products-service
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Product {
    private String id;
}
