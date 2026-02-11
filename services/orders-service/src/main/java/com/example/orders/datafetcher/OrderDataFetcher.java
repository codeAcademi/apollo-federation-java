package com.example.orders.datafetcher;

import com.example.orders.model.Order;
import com.example.orders.model.OrderItem;
import com.example.orders.model.Product;
import com.example.orders.model.Customer;
import com.example.orders.repository.OrderRepository;
import com.netflix.graphql.dgs.*;
import lombok.RequiredArgsConstructor;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@DgsComponent
@RequiredArgsConstructor
public class OrderDataFetcher {
    
    private final OrderRepository orderRepository;
    
    @DgsQuery
    public List<Order> orders() {
        return orderRepository.findAll();
    }
    
    @DgsQuery
    public Order order(@InputArgument String id) {
        return orderRepository.findById(id);
    }
    
    @DgsQuery
    public List<Order> ordersByStatus(@InputArgument String status) {
        return orderRepository.findByStatus(status);
    }
    
    @DgsQuery
    public List<Order> recentOrders(@InputArgument Integer limit) {
        return orderRepository.findRecentOrders(limit != null ? limit : 10);
    }
    
    @DgsMutation
    public Order updateOrderStatus(@InputArgument String orderId, @InputArgument String status) {
        return orderRepository.updateStatus(orderId, status);
    }
    
    @DgsMutation
    public Order createOrder(@InputArgument String customerId, @InputArgument List<OrderItemInput> items) {
        List<OrderItem> orderItems = items.stream()
            .map(input -> new OrderItem(input.getProductId(), input.getQuantity(), input.getPrice()))
            .collect(Collectors.toList());
        return orderRepository.createOrder(customerId, orderItems);
    }
    
    /**
     * Federation: Entity resolver for Order
     */
    @DgsEntityFetcher(name = "Order")
    public Order order(Map<String, Object> values) {
        return orderRepository.findById((String) values.get("id"));
    }
    
    /**
     * Federation: Entity resolver for Customer
     * Returns a stub Customer object that federation can use
     */
    @DgsEntityFetcher(name = "Customer")
    public Customer customer(Map<String, Object> values) {
        return new Customer((String) values.get("id"));
    }
    
    /**
     * Federation: Extend Product with orders field
     */
    @DgsData(parentType = "Product", field = "orders")
    public List<Order> ordersForProduct(DgsDataFetchingEnvironment dfe) {
        Product product = dfe.getSource();
        String productId = product.getId();
        return orderRepository.findAll().stream()
            .filter(order -> order.getItems().stream()
                .anyMatch(item -> item.getProductId().equals(productId)))
            .collect(Collectors.toList());
    }
    
    /**
     * Federation: Extend Customer with orders field
     */
    @DgsData(parentType = "Customer", field = "orders")
    public List<Order> ordersForCustomer(DgsDataFetchingEnvironment dfe) {
        Customer customer = dfe.getSource();
        return orderRepository.findByCustomerId(customer.getId());
    }
}
