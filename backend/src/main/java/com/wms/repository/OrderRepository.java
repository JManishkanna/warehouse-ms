package com.wms.repository;

import com.wms.model.Order;
import com.wms.model.OrderStatus;
import com.wms.model.OrderType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.time.LocalDateTime;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByOrderType(OrderType type);
    List<Order> findByStatus(OrderStatus status);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.status = 'PENDING'")
    long countPending();

    @Query("SELECT COUNT(o) FROM Order o WHERE o.createdAt >= :since")
    long countSince(LocalDateTime since);
}
