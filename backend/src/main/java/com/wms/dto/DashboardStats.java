package com.wms.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
@Builder
public class DashboardStats {
    private long totalProducts;
    private long lowStockCount;
    private long pendingOrders;
    private long totalSuppliers;
    private long unreadAlerts;
    private long todayOrders;
    private List<Map<String, Object>> stockTrend;
    private List<Map<String, Object>> ordersByStatus;
    private List<Map<String, Object>> topProducts;
}
