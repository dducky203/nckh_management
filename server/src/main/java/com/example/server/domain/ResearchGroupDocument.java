package com.example.server.domain;

import com.example.server.domain.EntityBase;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "research_group_document")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResearchGroupDocument extends EntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 500)
    private String documentName;

    @Column(nullable = false, length = 100)
    private String documentType; // Thông báo, Hồ Sơ Thanh Toán, Quyết Định, Tài liệu khác

    @Column(nullable = false, length = 500)
    private String fileUrl; // Đường dẫn file

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "research_group_id", nullable = false)
    private ResearchGroup researchGroup;

    @Column(length = 1000)
    private String description; // Mô tả thêm (tùy chọn)
}

