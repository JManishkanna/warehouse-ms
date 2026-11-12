package com.wms.controller;

import com.wms.dto.ApiResponse;
import com.wms.dto.OrderRequest;
import com.wms.model.Order;
import com.wms.model.OrderStatus;
import com.wms.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Order>>> getAllOrders() {
        return ResponseEntity.ok(ApiResponse.ok(orderService.getAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Order>> getOrder(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(orderService.getById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Order>> createOrder(
            @Valid @RequestBody OrderRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        Order order = orderService.create(request, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok("Order created", order));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Order>> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal UserDetails userDetails) {
        OrderStatus newStatus = OrderStatus.valueOf(body.get("status"));
        Order order = orderService.updateStatus(id, newStatus, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok("Order status updated", order));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteOrder(@PathVariable Long id) {
        orderService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("Order deleted", null));
    }
}
