package com.wms.service;

import com.wms.dto.OrderRequest;
import com.wms.model.Order;
import com.wms.model.OrderItem;
import com.wms.model.OrderStatus;
import com.wms.model.OrderType;
import com.wms.model.Product;
import com.wms.model.StockHistory;
import com.wms.model.Supplier;
import com.wms.model.User;
import com.wms.repository.OrderRepository;
import com.wms.repository.ProductRepository;
import com.wms.repository.StockHistoryRepository;
import com.wms.repository.SupplierRepository;
import com.wms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final SupplierRepository supplierRepository;
    private final UserRepository userRepository;
    private final StockHistoryRepository stockHistoryRepository;

    public List<Order> getAll() {
        return orderRepository.findAll();
    }

    public Order getById(Long id) {
        return orderRepository.findById(id)
            .orElseThrow(() -> new NoSuchElementException("Order not found: " + id));
    }

    @Transactional
    public Order create(OrderRequest req, String createdByUsername) {
        User creator = userRepository.findByUsername(createdByUsername).orElse(null);
        Supplier supplier = null;
        if (req.getSupplierId() != null) {
            supplier = supplierRepository.findById(req.getSupplierId())
                .orElseThrow(() -> new NoSuchElementException("Supplier not found"));
        }
        Order order = Order.builder()
            .orderType(req.getOrderType())
            .status(OrderStatus.PENDING)
            .supplier(supplier)
            .customerName(req.getCustomerName())
            .createdBy(creator)
            .notes(req.getNotes())
            .build();

        List<OrderItem> items = new ArrayList<>();
        for (OrderRequest.OrderItemRequest itemReq : req.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                .orElseThrow(() -> new NoSuchElementException("Product not found: " + itemReq.getProductId()));
            OrderItem item = OrderItem.builder()
                .order(order)
                .product(product)
                .quantity(itemReq.getQuantity())
                .unitPrice(itemReq.getUnitPrice())
                .build();
            items.add(item);
        }
        order.setItems(items);
        return orderRepository.save(order);
    }

    @Transactional
    public Order updateStatus(Long id, OrderStatus newStatus, String username) {
        Order order = getById(id);
        OrderStatus oldStatus = order.getStatus();
        order.setStatus(newStatus);

        if (newStatus == OrderStatus.COMPLETED && oldStatus != OrderStatus.COMPLETED) {
            User user = userRepository.findByUsername(username).orElse(null);
            for (OrderItem item : order.getItems()) {
                Product product = item.getProduct();
                int delta;
                if (order.getOrderType() == OrderType.INBOUND) {
                    product.setQuantity(product.getQuantity() + item.getQuantity());
                    delta = item.getQuantity();
                } else {
                    if (product.getQuantity() < item.getQuantity()) {
                        throw new IllegalStateException("Insufficient stock for product: " + product.getName());
                    }
                    product.setQuantity(product.getQuantity() - item.getQuantity());
                    delta = -item.getQuantity();
                }
                productRepository.save(product);
                stockHistoryRepository.save(StockHistory.builder()
                    .product(product)
                    .delta(delta)
                    .reason("Order #" + id + " completed (" + order.getOrderType() + ")")
                    .performedBy(user)
                    .build());
            }
        }
        return orderRepository.save(order);
    }

    @Transactional
    public void delete(Long id) {
        if (!orderRepository.existsById(id)) {
            throw new NoSuchElementException("Order not found: " + id);
        }
        orderRepository.deleteById(id);
    }
}
