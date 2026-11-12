package com.wms.controller;

import com.wms.dto.ApiResponse;
import com.wms.model.Shelf;
import com.wms.model.Warehouse;
import com.wms.service.WarehouseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/warehouse")
@RequiredArgsConstructor
public class WarehouseController {
    private final WarehouseService warehouseService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Warehouse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.ok(warehouseService.getAllWarehouses()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Warehouse>> create(@RequestBody Map<String, Object> body) {
        String name = (String) body.get("name");
        String address = (String) body.get("address");
        int capacity = body.get("capacity") != null ? Integer.parseInt(body.get("capacity").toString()) : 100;
        return ResponseEntity.ok(ApiResponse.ok("Warehouse created", warehouseService.createWarehouse(name, address, capacity)));
    }

    @GetMapping("/{id}/shelves")
    public ResponseEntity<ApiResponse<List<Shelf>>> getShelves(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(warehouseService.getShelvesForWarehouse(id)));
    }

    @GetMapping("/shelves")
    public ResponseEntity<ApiResponse<List<Shelf>>> getAllShelves() {
        return ResponseEntity.ok(ApiResponse.ok(warehouseService.getAllShelves()));
    }

    @PostMapping("/{id}/shelves")
    public ResponseEntity<ApiResponse<Shelf>> createShelf(@PathVariable Long id,
                                                          @RequestBody Map<String, Object> body) {
        String aisle = (String) body.get("aisle");
        int rowNum = Integer.parseInt(body.get("rowNum").toString());
        int colNum = Integer.parseInt(body.get("colNum").toString());
        int capacity = body.get("capacity") != null ? Integer.parseInt(body.get("capacity").toString()) : 50;
        return ResponseEntity.ok(ApiResponse.ok("Shelf created", warehouseService.createShelf(aisle, rowNum, colNum, capacity, id)));
    }

    @GetMapping("/{id}/map")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getMap(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(warehouseService.getWarehouseMapData(id)));
    }
}
