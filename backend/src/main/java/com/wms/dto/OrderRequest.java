package com.wms.dto;

import com.wms.model.OrderType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class OrderRequest {
    @NotNull
    private OrderType orderType;

    private Long supplierId;
    private String customerName;
    private String notes;

    @NotEmpty
    private List<OrderItemRequest> items;

    @Data
    public static class OrderItemRequest {
        @NotNull
        private Long productId;

        @Min(1)
        private int quantity;

        @NotNull
        @DecimalMin("0.00")
        private BigDecimal unitPrice;
    }
}
