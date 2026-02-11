package com.example.products.repository;

import com.example.products.model.Product;
import org.springframework.stereotype.Repository;
import jakarta.annotation.PostConstruct;
import java.util.*;
import java.util.stream.Collectors;

@Repository
public class ProductRepository {
    
    private final Map<String, Product> products = new HashMap<>();
    
    @PostConstruct
    public void init() {
        products.put("1", new Product("1", "Laptop Pro", "Electronics", 1299.99, 15, "ELEC-001"));
        products.put("2", new Product("2", "Wireless Mouse", "Electronics", 29.99, 150, "ELEC-002"));
        products.put("3", new Product("3", "Mechanical Keyboard", "Electronics", 149.99, 45, "ELEC-003"));
        products.put("4", new Product("4", "Desk Chair", "Furniture", 249.99, 8, "FURN-001"));
        products.put("5", new Product("5", "Standing Desk", "Furniture", 599.99, 5, "FURN-002"));
        products.put("6", new Product("6", "Monitor 27\"", "Electronics", 349.99, 22, "ELEC-004"));
        products.put("7", new Product("7", "USB-C Hub", "Electronics", 79.99, 88, "ELEC-005"));
        products.put("8", new Product("8", "Desk Lamp", "Furniture", 45.99, 35, "FURN-003"));
        
        System.out.println("📦 Products Service: Loaded " + products.size() + " products into catalog");
    }
    
    public List<Product> findAll() {
        System.out.println("📦 Products Service: Fetching all products");
        return new ArrayList<>(products.values());
    }
    
    public Product findById(String id) {
        System.out.println("📦 Products Service: Fetching product " + id);
        return products.get(id);
    }
    
    public List<Product> findByCategory(String category) {
        System.out.println("📦 Products Service: Fetching products in category: " + category);
        return products.values().stream()
            .filter(p -> p.getCategory().equalsIgnoreCase(category))
            .collect(Collectors.toList());
    }
    
    public List<Product> findUnderPrice(Double maxPrice) {
        System.out.println("📦 Products Service: Fetching products under $" + maxPrice);
        return products.values().stream()
            .filter(p -> p.getPrice() <= maxPrice)
            .collect(Collectors.toList());
    }
    
    public List<Product> search(String query) {
        System.out.println("📦 Products Service: Searching for: " + query);
        String lowerQuery = query.toLowerCase();
        return products.values().stream()
            .filter(p -> p.getName().toLowerCase().contains(lowerQuery) ||
                        p.getCategory().toLowerCase().contains(lowerQuery) ||
                        p.getSku().toLowerCase().contains(lowerQuery))
            .collect(Collectors.toList());
    }
    
    public Product updateStock(String productId, Integer quantity) {
        System.out.println("📦 Products Service: Updating stock for product " + productId);
        Product product = products.get(productId);
        if (product != null) {
            product.setStock(product.getStock() + quantity);
        }
        return product;
    }
}
