package com.wms.config;

import com.wms.model.*;
import com.wms.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final WarehouseRepository warehouseRepository;
    private final ShelfRepository shelfRepository;
    private final ProductRepository productRepository;
    private final SupplierRepository supplierRepository;

    @Override
    public void run(String... args) {
        // Create default admin user
        if (!userRepository.existsByUsername("admin")) {
            userRepository.save(User.builder()
                .username("admin")
                .email("admin@warehouse.local")
                .passwordHash(passwordEncoder.encode("admin123"))
                .role(Role.ADMIN)
                .active(true)
                .build());
            log.info("Default admin user created: admin / admin123");
        }

        // Create default manager & worker accounts
        if (!userRepository.existsByUsername("manager")) {
            userRepository.save(User.builder()
                .username("manager")
                .email("manager@warehouse.local")
                .passwordHash(passwordEncoder.encode("manager123"))
                .role(Role.MANAGER)
                .active(true)
                .build());
            log.info("Default manager user created: manager / manager123");
        }

        if (!userRepository.existsByUsername("worker")) {
            userRepository.save(User.builder()
                .username("worker")
                .email("worker@warehouse.local")
                .passwordHash(passwordEncoder.encode("worker123"))
                .role(Role.WORKER)
                .active(true)
                .build());
            log.info("Default worker user created: worker / worker123");
        }

        // Create a default warehouse and shelves
        if (warehouseRepository.count() == 0) {
            Warehouse w = warehouseRepository.save(Warehouse.builder()
                .name("Main Central Distribution Hub")
                .address("100 Logistics Blvd, Dock A")
                .capacity(1000)
                .build());

            String[] aisles = {"A", "B", "C"};
            for (String aisle : aisles) {
                for (int row = 1; row <= 4; row++) {
                    for (int col = 1; col <= 3; col++) {
                        String label = aisle + "-" + row + "-" + col;
                        shelfRepository.save(Shelf.builder()
                            .aisle(aisle)
                            .rowNum(row)
                            .colNum(col)
                            .label(label)
                            .capacity(50)
                            .warehouse(w)
                            .build());
                    }
                }
            }
            log.info("Default warehouse and 36 shelves initialized");

            // Seed initial supplier
            Supplier sup = supplierRepository.save(Supplier.builder()
                .name("Apex Industrial Supplies")
                .contactPerson("Marcus Vance")
                .email("marcus@apexsupplies.com")
                .phone("+1-555-0199")
                .address("740 Industrial Way, Sector 4")
                .rating(5)
                .build());

            // Seed initial products onto shelves
            Shelf shelfA11 = shelfRepository.findByLabel("A-1-1").orElse(null);
            Shelf shelfA12 = shelfRepository.findByLabel("A-1-2").orElse(null);
            Shelf shelfB11 = shelfRepository.findByLabel("B-1-1").orElse(null);

            if (shelfA11 != null && productRepository.count() == 0) {
                productRepository.save(Product.builder()
                    .sku("SKU-EL-001")
                    .name("Industrial Thermal Sensor")
                    .description("Precision thermal monitoring sensor for HVAC")
                    .category("Sensors")
                    .quantity(45)
                    .unitPrice(new BigDecimal("124.50"))
                    .reorderLevel(15)
                    .shelf(shelfA11)
                    .expiryDate(LocalDate.now().plusMonths(24))
                    .build());

                productRepository.save(Product.builder()
                    .sku("SKU-HW-002")
                    .name("M12 Stainless Hex Bolt (Pack of 100)")
                    .description("High-tensile Grade 8.8 corrosion resistant bolts")
                    .category("Hardware")
                    .quantity(8) // low stock trigger
                    .unitPrice(new BigDecimal("18.75"))
                    .reorderLevel(20)
                    .shelf(shelfA12)
                    .expiryDate(null)
                    .build());

                productRepository.save(Product.builder()
                    .sku("SKU-PKG-003")
                    .name("Reinforced Corrugated Box 40x40x40")
                    .description("Heavy duty double-wall shipping carton")
                    .category("Packaging")
                    .quantity(220)
                    .unitPrice(new BigDecimal("3.40"))
                    .reorderLevel(50)
                    .shelf(shelfB11)
                    .expiryDate(null)
                    .build());
                log.info("Default products and initial inventory seeded");
            }
        }
    }
}
