package com.wms.service;

import com.wms.dto.DashboardStats;
import com.wms.model.OrderStatus;
import com.wms.model.StockHistory;
import com.wms.repository.AlertRepository;
import com.wms.repository.OrderRepository;
import com.wms.repository.ProductRepository;
import com.wms.repository.StockHistoryRepository;
import com.wms.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final SupplierRepository supplierRepository;
    private final AlertRepository alertRepository;
    private final StockHistoryRepository stockHistoryRepository;

    public DashboardStats getStats() {
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
        LocalDateTime todayStart = LocalDate.now().atStartOfDay();

        List<StockHistory> recentHistory = stockHistoryRepository.findRecentHistory(sevenDaysAgo);

        // Build daily stock trend for past 7 days
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("MM/dd");
        Map<String, Integer> dailyDelta = new LinkedHashMap<>();
        for (int i = 6; i >= 0; i--) {
            String day = LocalDate.now().minusDays(i).format(fmt);
            dailyDelta.put(day, 0);
        }
        for (StockHistory sh : recentHistory) {
            String day = sh.getCreatedAt().toLocalDate().format(fmt);
            dailyDelta.merge(day, sh.getDelta(), Integer::sum);
        }
        List<Map<String, Object>> stockTrend = new ArrayList<>();
        for (Map.Entry<String, Integer> e : dailyDelta.entrySet()) {
            Map<String, Object> m = new HashMap<>();
            m.put("date", e.getKey());
            m.put("delta", e.getValue());
            stockTrend.add(m);
        }

        // Orders by status
        List<Map<String, Object>> ordersByStatus = new ArrayList<>();
        for (OrderStatus status : OrderStatus.values()) {
            Map<String, Object> m = new HashMap<>();
            m.put("status", status.name());
            m.put("count", orderRepository.findByStatus(status).size());
            ordersByStatus.add(m);
        }

        // Top 5 products by quantity (descending)
        List<Map<String, Object>> topProducts = new ArrayList<>();
        productRepository.findAll().stream()
            .sorted((a, b) -> Integer.compare(b.getQuantity(), a.getQuantity()))
            .limit(5)
            .forEach(p -> {
                Map<String, Object> m = new HashMap<>();
                m.put("id", p.getId());
                m.put("name", p.getName());
                m.put("sku", p.getSku());
                m.put("quantity", p.getQuantity());
                m.put("category", p.getCategory());
                topProducts.add(m);
            });

        return DashboardStats.builder()
            .totalProducts(productRepository.count())
            .lowStockCount(productRepository.findLowStockProducts().size())
            .pendingOrders(orderRepository.countPending())
            .totalSuppliers(supplierRepository.count())
            .unreadAlerts(alertRepository.countByIsReadFalse())
            .todayOrders(orderRepository.countSince(todayStart))
            .stockTrend(stockTrend)
            .ordersByStatus(ordersByStatus)
            .topProducts(topProducts)
            .build();
    }
}
