package com.wms.service;

import com.wms.model.Task;
import com.wms.model.TaskStatus;
import com.wms.model.User;
import com.wms.repository.TaskRepository;
import com.wms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public List<Task> getAll() {
        return taskRepository.findAll();
    }

    public List<Task> getByUser(Long userId) {
        return taskRepository.findByAssignedToId(userId);
    }

    @Transactional
    public Task create(String title, String description, Long assignedToId, LocalDate dueDate, String createdByUsername) {
        User assignedTo = assignedToId != null ? userRepository.findById(assignedToId).orElse(null) : null;
        User createdBy = userRepository.findByUsername(createdByUsername).orElse(null);
        return taskRepository.save(Task.builder()
            .title(title)
            .description(description)
            .assignedTo(assignedTo)
            .status(TaskStatus.TODO)
            .createdBy(createdBy)
            .dueDate(dueDate)
            .build());
    }

    @Transactional
    public Task updateStatus(Long id, TaskStatus status) {
        Task task = taskRepository.findById(id)
            .orElseThrow(() -> new NoSuchElementException("Task not found: " + id));
        task.setStatus(status);
        return taskRepository.save(task);
    }

    @Transactional
    public Task update(Long id, String title, String description, Long assignedToId, LocalDate dueDate, TaskStatus status) {
        Task task = taskRepository.findById(id)
            .orElseThrow(() -> new NoSuchElementException("Task not found: " + id));
        task.setTitle(title);
        task.setDescription(description);
        task.setDueDate(dueDate);
        task.setStatus(status);
        if (assignedToId != null) {
            task.setAssignedTo(userRepository.findById(assignedToId).orElse(null));
        }
        return taskRepository.save(task);
    }

    @Transactional
    public void delete(Long id) {
        if (!taskRepository.existsById(id)) {
            throw new NoSuchElementException("Task not found: " + id);
        }
        taskRepository.deleteById(id);
    }
}
