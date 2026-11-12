package com.wms.controller;

import com.wms.dto.ApiResponse;
import com.wms.model.Role;
import com.wms.model.User;
import com.wms.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class UserController {
    private final UserService userService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<User>>> getAll() {
        return ResponseEntity.ok(ApiResponse.ok(userService.getAll()));
    }

    @PatchMapping("/{id}/role")
    public ResponseEntity<ApiResponse<User>> updateRole(@PathVariable Long id, @RequestParam Role role) {
        return ResponseEntity.ok(ApiResponse.ok("Role updated", userService.updateRole(id, role)));
    }

    @PatchMapping("/{id}/toggle-active")
    public ResponseEntity<ApiResponse<User>> toggleActive(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Status toggled", userService.toggleActive(id)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        userService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("User deleted", null));
    }
}
