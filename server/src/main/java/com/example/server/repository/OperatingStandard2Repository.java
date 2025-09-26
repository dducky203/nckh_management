package com.example.server.repository;

import com.example.server.domain.OperatingStandards2;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface OperatingStandard2Repository extends JpaRepository<OperatingStandards2,Integer> {
    // find by id
    @Query(value = "select * from operating_standards_2 where id=?",nativeQuery = true)
    OperatingStandards2 findOperatingStandards2ById(Integer idOperatingStandards2);
}
