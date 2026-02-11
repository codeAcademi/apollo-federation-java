package com.example.products;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ProductsServiceApplication {
    public static void main(String[] args) {
        System.out.println("\n╔══════════════════════════════════════════╗");
        System.out.println("║  📦  Products Service (Subgraph)        ║");
        System.out.println("╚══════════════════════════════════════════╝\n");
        SpringApplication.run(ProductsServiceApplication.class, args);
    }
}
