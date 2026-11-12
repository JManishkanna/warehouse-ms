package com.wms.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "shelves")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Shelf {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 5)
    private String aisle;

    @Column(nullable = false)
    private int rowNum;

    @Column(nullable = false)
    private int colNum;

    @Column(nullable = false, unique = true, length = 20)
    private String label; // e.g. A-1-2

    private int capacity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "warehouse_id")
    private Warehouse warehouse;
}
