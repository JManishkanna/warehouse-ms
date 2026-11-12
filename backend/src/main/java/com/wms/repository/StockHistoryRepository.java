package com.wms.repository;

import com.wms.model.StockHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.time.LocalDateTime;
import java.util.List;

public interface StockHistoryRepository extends JpaRepository<StockHistory, Long> {
    List<StockHistory> findByProductIdOrderByCreatedAtDesc(Long productId);

    @Query("SELECT sh FROM StockHistory sh WHERE sh.createdAt >= :since ORDER BY sh.createdAt DESC")
    List<StockHistory> findRecentHistory(LocalDateTime since);
}
