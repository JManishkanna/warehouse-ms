package com.wms.controller;

import com.wms.dto.ApiResponse;
import com.wms.model.Task;
import com.wms.model.TaskStatus;
import com.wms.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {
    private final TaskService taskService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Task>>> getAll() {
        return ResponseEntity.ok(ApiResponse.ok(taskService.getAll()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Task>> create(@RequestBody Map<String, Object> body, Authentication auth) {
        String title = (String) body.get("title");
        String description = (String) body.get("description");
        Long assignedToId = body.get("assignedToId") != null && !body.get("assignedToId").toString().isEmpty()
                ? Long.valueOf(body.get("assignedToId").toString())
                : null;
        LocalDate dueDate = body.get("dueDate") != null && !body.get("dueDate").toString().isEmpty()
                ? LocalDate.parse(body.get("dueDate").toString())
                : null;
        return ResponseEntity.ok(ApiResponse.ok("Task created",
                taskService.create(title, description, assignedToId, dueDate, auth.getName())));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Task>> updateStatus(@PathVariable Long id, @RequestParam TaskStatus status) {
        return ResponseEntity.ok(ApiResponse.ok("Status updated", taskService.updateStatus(id, status)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        taskService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("Task deleted", null));
    }
}
