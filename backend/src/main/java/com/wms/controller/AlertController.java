package com.wms.controller;

import com.wms.dto.ApiResponse;
import com.wms.model.Alert;
import com.wms.service.AlertService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/alerts")
@RequiredArgsConstructor
public class AlertController {
    private final AlertService alertService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Alert>>> getAll() {
        return ResponseEntity.ok(ApiResponse.ok(alertService.getAll()));
    }

    @GetMapping("/unread")
    public ResponseEntity<ApiResponse<List<Alert>>> getUnread() {
        return ResponseEntity.ok(ApiResponse.ok(alertService.getUnread()));
    }

    @GetMapping("/count")
    public ResponseEntity<ApiResponse<Long>> countUnread() {
        return ResponseEntity.ok(ApiResponse.ok(alertService.countUnread()));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<ApiResponse<Alert>> markRead(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Alert marked as read", alertService.markRead(id)));
    }

    @PostMapping("/read-all")
    public ResponseEntity<ApiResponse<Void>> markAllRead() {
        alertService.markAllRead();
        return ResponseEntity.ok(ApiResponse.ok("All alerts marked as read", null));
    }
}
