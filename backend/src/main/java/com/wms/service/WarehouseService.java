package com.wms.service;

import com.wms.model.Product;
import com.wms.model.Shelf;
import com.wms.model.Warehouse;
import com.wms.repository.ProductRepository;
import com.wms.repository.ShelfRepository;
import com.wms.repository.WarehouseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class WarehouseService {

    private final WarehouseRepository warehouseRepository;
    private final ShelfRepository shelfRepository;
    private final ProductRepository productRepository;

    public List<Warehouse> getAllWarehouses() {
        return warehouseRepository.findAll();
    }

    public Warehouse getById(Long id) {
        return warehouseRepository.findById(id)
            .orElseThrow(() -> new NoSuchElementException("Warehouse not found: " + id));
    }

    public Warehouse createWarehouse(String name, String address, int capacity) {
        return warehouseRepository.save(Warehouse.builder()
            .name(name)
            .address(address)
            .capacity(capacity)
            .build());
    }

    public Warehouse updateWarehouse(Long id, String name, String address, int capacity) {
        Warehouse warehouse = getById(id);
        warehouse.setName(name);
        warehouse.setAddress(address);
        warehouse.setCapacity(capacity);
        return warehouseRepository.save(warehouse);
    }

    public void deleteWarehouse(Long id) {
        if (!warehouseRepository.existsById(id)) {
            throw new NoSuchElementException("Warehouse not found: " + id);
        }
        warehouseRepository.deleteById(id);
    }

    public List<Shelf> getShelvesForWarehouse(Long warehouseId) {
        return shelfRepository.findByWarehouseId(warehouseId);
    }

    public List<Shelf> getAllShelves() {
        return shelfRepository.findAll();
    }

    @Transactional
    public Shelf createShelf(String aisle, int rowNum, int colNum, int capacity, Long warehouseId) {
        String label = aisle + "-" + rowNum + "-" + colNum;
        Warehouse warehouse = warehouseRepository.findById(warehouseId)
            .orElseThrow(() -> new NoSuchElementException("Warehouse not found"));
        return shelfRepository.save(Shelf.builder()
            .aisle(aisle)
            .rowNum(rowNum)
            .colNum(colNum)
            .label(label)
            .capacity(capacity)
            .warehouse(warehouse)
            .build());
    }

    public List<Map<String, Object>> getWarehouseMapData(Long warehouseId) {
        List<Shelf> shelves = shelfRepository.findByWarehouseId(warehouseId);
        List<Product> allProducts = productRepository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();
        for (Shelf shelf : shelves) {
            Map<String, Object> entry = new HashMap<>();
            entry.put("shelf", shelf);
            List<Product> products = allProducts.stream()
                .filter(p -> p.getShelf() != null && p.getShelf().getId().equals(shelf.getId()))
                .toList();
            entry.put("products", products);
            String status;
            if (products.isEmpty()) {
                status = "EMPTY";
            } else {
                boolean anyLow = products.stream().anyMatch(p -> p.getQuantity() <= p.getReorderLevel());
                status = anyLow ? "LOW" : "OCCUPIED";
            }
            entry.put("status", status);
            result.add(entry);
        }
        return result;
    }
}
