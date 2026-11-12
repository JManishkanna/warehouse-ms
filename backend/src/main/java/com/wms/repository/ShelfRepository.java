package com.wms.repository;

import com.wms.model.Shelf;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Optional;

public interface ShelfRepository extends JpaRepository<Shelf, Long> {
    Optional<Shelf> findByLabel(String label);
    List<Shelf> findByWarehouseId(Long warehouseId);

    @Query("SELECT s FROM Shelf s LEFT JOIN Product p ON p.shelf = s WHERE p.id IS NULL")
    List<Shelf> findEmptyShelves();
}
