package com.example.server.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "wards")
public class Ward {

    @Id
    @Column(name = "code", length = 20, nullable = false)
    private String code;

    @Column(name = "name", length = 255)
    private String name;

    @Column(name = "name_en", length = 255)
    private String nameEn;

    @Column(name = "full_name", length = 255)
    private String fullName;

    @Column(name = "full_name_en", length = 255)
    private String fullNameEn;

    @Column(name = "code_name", length = 255)
    private String codeName;

    @Column(name = "province_code", length = 20)
    private String provinceCode;

    @Column(name = "administrative_unit_id")
    private Integer administrativeUnitId;
}
