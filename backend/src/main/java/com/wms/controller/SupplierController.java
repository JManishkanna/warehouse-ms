package com.wms.controller;

import com.wms.dto.ApiResponse;
import com.wms.model.Supplier;
import com.wms.service.SupplierService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/suppliers")
@RequiredArgsConstructor
public class SupplierController {
    private final SupplierService supplierService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Supplier>>> getAll() {
        return ResponseEntity.ok(ApiResponse.ok(supplierService.getAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Supplier>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(supplierService.getById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Supplier>> create(@RequestBody Supplier supplier) {
        return ResponseEntity.ok(ApiResponse.ok("Supplier created", supplierService.create(supplier)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Supplier>> update(@PathVariable Long id, @RequestBody Supplier supplier) {
        return ResponseEntity.ok(ApiResponse.ok("Supplier updated", supplierService.update(id, supplier)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        supplierService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("Supplier deleted", null));
    }
}
