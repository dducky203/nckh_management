package com.example.server.repository;

import com.example.server.domain.Province;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProvinceRepository extends JpaRepository<Province, String> {

    List<Province> findAllByOrderByNameAsc();
}
