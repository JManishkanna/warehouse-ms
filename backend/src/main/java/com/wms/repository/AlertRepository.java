package com.wms.repository;

import com.wms.model.Alert;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AlertRepository extends JpaRepository<Alert, Long> {
    List<Alert> findByIsReadFalseOrderByCreatedAtDesc();
    List<Alert> findAllByOrderByCreatedAtDesc();
    long countByIsReadFalse();
}
