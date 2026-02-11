package com.example.orders;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class OrdersServiceApplication {
    public static void main(String[] args) {
        System.out.println("\n╔══════════════════════════════════════════╗");
        System.out.println("║  📦  Orders Service (Subgraph)          ║");
        System.out.println("╚══════════════════════════════════════════╝\n");
        SpringApplication.run(OrdersServiceApplication.class, args);
    }
}
