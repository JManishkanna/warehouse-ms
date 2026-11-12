package com.wms.service;

import com.wms.model.Role;
import com.wms.model.User;
import com.wms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public List<User> getAll() {
        return userRepository.findAll();
    }

    public User getById(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new NoSuchElementException("User not found: " + id));
    }

    @Transactional
    public User updateRole(Long id, Role role) {
        User user = getById(id);
        user.setRole(role);
        return userRepository.save(user);
    }

    @Transactional
    public User toggleActive(Long id) {
        User user = getById(id);
        user.setActive(!user.isActive());
        return userRepository.save(user);
    }

    @Transactional
    public void delete(Long id) {
        if (!userRepository.existsById(id)) {
            throw new NoSuchElementException("User not found: " + id);
        }
        userRepository.deleteById(id);
    }
}
