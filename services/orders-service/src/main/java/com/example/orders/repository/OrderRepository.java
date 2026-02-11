package com.example.orders.repository;

import com.example.orders.model.Order;
import com.example.orders.model.OrderItem;
import org.springframework.stereotype.Repository;
import jakarta.annotation.PostConstruct;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Repository
public class OrderRepository {
    
    private final Map<String, Order> orders = new HashMap<>();
    
    @PostConstruct
    public void init() {
        LocalDateTime now = LocalDateTime.now();
        
        orders.put("ORD-001", new Order("ORD-001", "1", 
            Arrays.asList(
                new OrderItem("1", 1, 1299.99),
                new OrderItem("2", 2, 29.99)
            ), 1359.97, "DELIVERED", now.minusDays(30), now.minusDays(25)));
        
        orders.put("ORD-002", new Order("ORD-002", "2", 
            Arrays.asList(
                new OrderItem("4", 1, 249.99),
                new OrderItem("5", 1, 599.99)
            ), 849.98, "DELIVERED", now.minusDays(20), now.minusDays(15)));
        
        orders.put("ORD-003", new Order("ORD-003", "1", 
            Arrays.asList(
                new OrderItem("6", 2, 349.99)
            ), 699.98, "SHIPPED", now.minusDays(5), now.minusDays(2)));
        
        orders.put("ORD-004", new Order("ORD-004", "3", 
            Arrays.asList(
                new OrderItem("3", 1, 149.99),
                new OrderItem("7", 3, 79.99)
            ), 389.96, "PROCESSING", now.minusDays(2), now.minusDays(2)));
        
        orders.put("ORD-005", new Order("ORD-005", "2", 
            Arrays.asList(
                new OrderItem("8", 2, 45.99)
            ), 91.98, "PENDING", now.minusHours(5), now.minusHours(5)));
        
        System.out.println("🛒 Orders Service: Loaded " + orders.size() + " orders");
    }
    
    public List<Order> findAll() {
        System.out.println("🛒 Orders Service: Fetching all orders");
        return new ArrayList<>(orders.values());
    }
    
    public Order findById(String id) {
        System.out.println("🛒 Orders Service: Fetching order " + id);
        return orders.get(id);
    }
    
    public List<Order> findByCustomerId(String customerId) {
        System.out.println("🛒 Orders Service: Fetching orders for customer " + customerId);
        return orders.values().stream()
            .filter(o -> o.getCustomerId().equals(customerId))
            .collect(Collectors.toList());
    }
    
    public List<Order> findByStatus(String status) {
        System.out.println("🛒 Orders Service: Fetching orders with status: " + status);
        return orders.values().stream()
            .filter(o -> o.getStatus().equalsIgnoreCase(status))
            .collect(Collectors.toList());
    }
    
    public List<Order> findRecentOrders(Integer limit) {
        System.out.println("🛒 Orders Service: Fetching recent orders (limit: " + limit + ")");
        return orders.values().stream()
            .sorted((o1, o2) -> o2.getCreatedAt().compareTo(o1.getCreatedAt()))
            .limit(limit)
            .collect(Collectors.toList());
    }
    
    public Order updateStatus(String orderId, String newStatus) {
        System.out.println("🛒 Orders Service: Updating order " + orderId + " to status: " + newStatus);
        Order order = orders.get(orderId);
        if (order != null) {
            order.setStatus(newStatus);
            order.setUpdatedAt(LocalDateTime.now());
        }
        return order;
    }
    
    public Order createOrder(String customerId, List<OrderItem> items) {
        System.out.println("🛒 Orders Service: Creating new order for customer " + customerId);
        String orderId = "ORD-" + String.format("%03d", orders.size() + 1);
        double totalAmount = items.stream()
            .mapToDouble(item -> item.getPrice() * item.getQuantity())
            .sum();
        
        LocalDateTime now = LocalDateTime.now();
        Order order = new Order(orderId, customerId, items, totalAmount, "PENDING", now, now);
        orders.put(orderId, order);
        return order;
    }
}
