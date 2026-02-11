package com.example.customers.repository;

import com.example.customers.model.Address;
import com.example.customers.model.Customer;
import org.springframework.stereotype.Repository;
import jakarta.annotation.PostConstruct;
import java.util.*;
import java.util.stream.Collectors;

@Repository
public class CustomerRepository {
    
    private final Map<String, Customer> customers = new HashMap<>();
    
    @PostConstruct
    public void init() {
        customers.put("1", new Customer("1", "Alice Johnson", "alice.johnson@email.com", "+1-555-0101",
            new Address("123 Main St", "Seattle", "WA", "98101", "USA"),
            "GOLD", 2500));
        
        customers.put("2", new Customer("2", "Bob Smith", "bob.smith@email.com", "+1-555-0102",
            new Address("456 Oak Ave", "Portland", "OR", "97201", "USA"),
            "PLATINUM", 5000));
        
        customers.put("3", new Customer("3", "Carol Davis", "carol.davis@email.com", "+1-555-0103",
            new Address("789 Pine Rd", "San Francisco", "CA", "94102", "USA"),
            "SILVER", 1200));
        
        customers.put("4", new Customer("4", "David Wilson", "david.wilson@email.com", "+1-555-0104",
            new Address("321 Elm St", "Los Angeles", "CA", "90001", "USA"),
            "BRONZE", 500));
        
        customers.put("5", new Customer("5", "Emma Martinez", "emma.martinez@email.com", "+1-555-0105",
            new Address("654 Maple Dr", "Austin", "TX", "78701", "USA"),
            "GOLD", 3200));
        
        System.out.println("👤 Customers Service: Loaded " + customers.size() + " customers");
    }
    
    public List<Customer> findAll() {
        System.out.println("👤 Customers Service: Fetching all customers");
        return new ArrayList<>(customers.values());
    }
    
    public Customer findById(String id) {
        System.out.println("👤 Customers Service: Fetching customer " + id);
        return customers.get(id);
    }
    
    public List<Customer> findByTier(String tier) {
        System.out.println("👤 Customers Service: Fetching customers in tier: " + tier);
        return customers.values().stream()
            .filter(c -> c.getTier().equalsIgnoreCase(tier))
            .collect(Collectors.toList());
    }
    
    public List<Customer> searchByName(String query) {
        System.out.println("👤 Customers Service: Searching customers by name: " + query);
        String lowerQuery = query.toLowerCase();
        return customers.values().stream()
            .filter(c -> c.getName().toLowerCase().contains(lowerQuery))
            .collect(Collectors.toList());
    }
    
    public Customer updateLoyaltyPoints(String customerId, Integer points) {
        System.out.println("👤 Customers Service: Updating loyalty points for customer " + customerId);
        Customer customer = customers.get(customerId);
        if (customer != null) {
            customer.setLoyaltyPoints(customer.getLoyaltyPoints() + points);
            
            // Auto-upgrade tier based on points
            int totalPoints = customer.getLoyaltyPoints();
            if (totalPoints >= 5000) {
                customer.setTier("PLATINUM");
            } else if (totalPoints >= 2500) {
                customer.setTier("GOLD");
            } else if (totalPoints >= 1000) {
                customer.setTier("SILVER");
            } else {
                customer.setTier("BRONZE");
            }
        }
        return customer;
    }
    
    public Customer updateProfile(String customerId, String name, String email, String phone) {
        System.out.println("👤 Customers Service: Updating profile for customer " + customerId);
        Customer customer = customers.get(customerId);
        if (customer != null) {
            if (name != null) customer.setName(name);
            if (email != null) customer.setEmail(email);
            if (phone != null) customer.setPhone(phone);
        }
        return customer;
    }
}
