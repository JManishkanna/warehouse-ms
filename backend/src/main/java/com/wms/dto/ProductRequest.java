package com.wms.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class ProductRequest {
    @NotBlank
    @Size(max = 50)
    private String sku;

    @NotBlank
    @Size(max = 150)
    private String name;

    private String description;
    private String category;

    @Min(0)
    private int quantity;

    @NotNull
    @DecimalMin("0.00")
    private BigDecimal unitPrice;

    @Min(0)
    private int reorderLevel;

    private Long shelfId;
    private LocalDate expiryDate;
}
