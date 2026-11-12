package com.wms.service;

import com.wms.dto.ProductRequest;
import com.wms.model.Alert;
import com.wms.model.AlertType;
import com.wms.model.Product;
import com.wms.model.Shelf;
import com.wms.model.StockHistory;
import com.wms.model.User;
import com.wms.repository.AlertRepository;
import com.wms.repository.ProductRepository;
import com.wms.repository.ShelfRepository;
import com.wms.repository.StockHistoryRepository;
import com.wms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final ShelfRepository shelfRepository;
    private final StockHistoryRepository stockHistoryRepository;
    private final AlertRepository alertRepository;
    private final UserRepository userRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getById(Long id) {
        return productRepository.findById(id)
            .orElseThrow(() -> new NoSuchElementException("Product not found: " + id));
    }

    public List<Product> search(String query) {
        return productRepository.findByNameContainingIgnoreCaseOrSkuContainingIgnoreCase(query, query);
    }

    @Transactional
    public Product create(ProductRequest req, String performedByUsername) {
        if (productRepository.existsBySku(req.getSku())) {
            throw new IllegalArgumentException("SKU already exists: " + req.getSku());
        }
        Shelf shelf = null;
        if (req.getShelfId() != null) {
            shelf = shelfRepository.findById(req.getShelfId())
                .orElseThrow(() -> new NoSuchElementException("Shelf not found"));
        }
        Product product = Product.builder()
            .sku(req.getSku())
            .name(req.getName())
            .description(req.getDescription())
            .category(req.getCategory())
            .quantity(req.getQuantity())
            .unitPrice(req.getUnitPrice())
            .reorderLevel(req.getReorderLevel())
            .shelf(shelf)
            .expiryDate(req.getExpiryDate())
            .build();
        product = productRepository.save(product);
        if (req.getQuantity() > 0) {
            User user = userRepository.findByUsername(performedByUsername).orElse(null);
            stockHistoryRepository.save(StockHistory.builder()
                .product(product)
                .delta(req.getQuantity())
                .reason("Initial stock")
                .performedBy(user)
                .build());
        }
        checkAndCreateAlerts(product);
        return product;
    }

    @Transactional
    public Product update(Long id, ProductRequest req) {
        Product product = getById(id);
        if (!product.getSku().equals(req.getSku()) && productRepository.existsBySku(req.getSku())) {
            throw new IllegalArgumentException("SKU already exists: " + req.getSku());
        }
        Shelf shelf = null;
        if (req.getShelfId() != null) {
            shelf = shelfRepository.findById(req.getShelfId())
                .orElseThrow(() -> new NoSuchElementException("Shelf not found"));
        }
        product.setSku(req.getSku());
        product.setName(req.getName());
        product.setDescription(req.getDescription());
        product.setCategory(req.getCategory());
        product.setQuantity(req.getQuantity());
        product.setUnitPrice(req.getUnitPrice());
        product.setReorderLevel(req.getReorderLevel());
        product.setShelf(shelf);
        product.setExpiryDate(req.getExpiryDate());
        product = productRepository.save(product);
        checkAndCreateAlerts(product);
        return product;
    }

    @Transactional
    public void delete(Long id) {
        if (!productRepository.existsById(id)) {
            throw new NoSuchElementException("Product not found: " + id);
        }
        productRepository.deleteById(id);
    }

    public List<Product> getLowStock() {
        return productRepository.findLowStockProducts();
    }

    public List<String> getCategories() {
        return productRepository.findAllCategories();
    }

    private void checkAndCreateAlerts(Product product) {
        if (product.getQuantity() <= product.getReorderLevel()) {
            alertRepository.save(Alert.builder()
                .product(product)
                .alertType(AlertType.LOW_STOCK)
                .message("Product '" + product.getName() + "' (SKU: " + product.getSku() +
                    ") is at or below reorder level. Current stock: " + product.getQuantity())
                .isRead(false)
                .build());
        }
        if (product.getExpiryDate() != null && product.getExpiryDate().isBefore(LocalDate.now().plusDays(30))) {
            alertRepository.save(Alert.builder()
                .product(product)
                .alertType(AlertType.EXPIRY_WARNING)
                .message("Product '" + product.getName() + "' expires on " + product.getExpiryDate())
                .isRead(false)
                .build());
        }
    }
}
