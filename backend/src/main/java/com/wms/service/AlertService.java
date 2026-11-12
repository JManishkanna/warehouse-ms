package com.wms.service;

import com.wms.model.Alert;
import com.wms.repository.AlertRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class AlertService {

    private final AlertRepository alertRepository;

    public List<Alert> getAll() {
        return alertRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Alert> getUnread() {
        return alertRepository.findByIsReadFalseOrderByCreatedAtDesc();
    }

    public long countUnread() {
        return alertRepository.countByIsReadFalse();
    }

    @Transactional
    public Alert markRead(Long id) {
        Alert alert = alertRepository.findById(id)
            .orElseThrow(() -> new NoSuchElementException("Alert not found: " + id));
        alert.setRead(true);
        return alertRepository.save(alert);
    }

    @Transactional
    public void markAllRead() {
        alertRepository.findByIsReadFalseOrderByCreatedAtDesc()
            .forEach(a -> {
                a.setRead(true);
                alertRepository.save(a);
            });
    }
}
