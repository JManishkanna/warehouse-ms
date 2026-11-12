package com.wms.service;

import com.wms.model.Supplier;
import com.wms.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class SupplierService {

    private final SupplierRepository supplierRepository;

    public List<Supplier> getAll() {
        return supplierRepository.findAll();
    }

    public Supplier getById(Long id) {
        return supplierRepository.findById(id)
            .orElseThrow(() -> new NoSuchElementException("Supplier not found: " + id));
    }

    public Supplier create(Supplier supplier) {
        return supplierRepository.save(supplier);
    }

    public Supplier update(Long id, Supplier updated) {
        Supplier existing = getById(id);
        existing.setName(updated.getName());
        existing.setContactPerson(updated.getContactPerson());
        existing.setEmail(updated.getEmail());
        existing.setPhone(updated.getPhone());
        existing.setAddress(updated.getAddress());
        existing.setRating(updated.getRating());
        return supplierRepository.save(existing);
    }

    public void delete(Long id) {
        if (!supplierRepository.existsById(id)) {
            throw new NoSuchElementException("Supplier not found: " + id);
        }
        supplierRepository.deleteById(id);
    }

    public List<Supplier> search(String name) {
        return supplierRepository.findByNameContainingIgnoreCase(name);
    }
}
