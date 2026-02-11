package com.example.customers;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class CustomersServiceApplication {
    public static void main(String[] args) {
        System.out.println("\n╔══════════════════════════════════════════╗");
        System.out.println("║  👤  Customers Service (Subgraph)       ║");
        System.out.println("╚══════════════════════════════════════════╝\n");
        SpringApplication.run(CustomersServiceApplication.class, args);
    }
}
