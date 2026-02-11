package com.example.customers.datafetcher;

import com.example.customers.model.Customer;
import com.example.customers.repository.CustomerRepository;
import com.netflix.graphql.dgs.*;
import lombok.RequiredArgsConstructor;
import java.util.List;
import java.util.Map;

@DgsComponent
@RequiredArgsConstructor
public class CustomerDataFetcher {
    
    private final CustomerRepository customerRepository;
    
    @DgsQuery
    public List<Customer> customers() {
        return customerRepository.findAll();
    }
    
    @DgsQuery
    public Customer customer(@InputArgument String id) {
        return customerRepository.findById(id);
    }
    
    @DgsQuery
    public List<Customer> customersByTier(@InputArgument String tier) {
        return customerRepository.findByTier(tier);
    }
    
    @DgsQuery
    public List<Customer> searchCustomers(@InputArgument String query) {
        return customerRepository.searchByName(query);
    }
    
    @DgsMutation
    public Customer updateLoyaltyPoints(@InputArgument String customerId, @InputArgument Integer points) {
        return customerRepository.updateLoyaltyPoints(customerId, points);
    }
    
    @DgsMutation
    public Customer updateCustomerProfile(@InputArgument String customerId, 
                                         @InputArgument String name,
                                         @InputArgument String email,
                                         @InputArgument String phone) {
        return customerRepository.updateProfile(customerId, name, email, phone);
    }
    
    /**
     * Federation: Entity resolver for Customer
     */
    @DgsEntityFetcher(name = "Customer")
    public Customer customer(Map<String, Object> values) {
        return customerRepository.findById((String) values.get("id"));
    }
}
