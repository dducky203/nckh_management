package com.example.server.repository;

import com.example.server.domain.Ward;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WardRepository extends JpaRepository<Ward, String> {

    List<Ward> findByProvinceCodeOrderByNameAsc(String provinceCode);
}
