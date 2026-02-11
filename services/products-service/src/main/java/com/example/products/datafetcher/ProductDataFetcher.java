package com.example.products.datafetcher;

import com.example.products.model.Product;
import com.example.products.repository.ProductRepository;
import com.netflix.graphql.dgs.*;
import lombok.RequiredArgsConstructor;
import java.util.List;
import java.util.Map;

@DgsComponent
@RequiredArgsConstructor
public class ProductDataFetcher {
    
    private final ProductRepository productRepository;
    
    @DgsQuery
    public List<Product> products() {
        return productRepository.findAll();
    }
    
    @DgsQuery
    public Product product(@InputArgument String id) {
        return productRepository.findById(id);
    }
    
    @DgsQuery
    public List<Product> productsByCategory(@InputArgument String category) {
        return productRepository.findByCategory(category);
    }
    
    @DgsQuery
    public List<Product> productsUnderPrice(@InputArgument Double maxPrice) {
        return productRepository.findUnderPrice(maxPrice);
    }
    
    @DgsQuery
    public List<Product> searchProducts(@InputArgument String query) {
        return productRepository.search(query);
    }
    
    @DgsMutation
    public Product updateStock(@InputArgument String productId, @InputArgument Integer quantity) {
        return productRepository.updateStock(productId, quantity);
    }
    
    /**
     * Federation: Entity resolver for Product
     */
    @DgsEntityFetcher(name = "Product")
    public Product product(Map<String, Object> values) {
        return productRepository.findById((String) values.get("id"));
    }
}
