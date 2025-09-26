package com.example.server.repository;

import com.example.server.domain.OperatingStandard;
import com.example.server.domain.OperatingStandards2;
import com.example.server.domain.RoleOfEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoleOfEventRepository extends JpaRepository<RoleOfEvent, Integer> {
    // find by idOS2
    @Query(value = "select * from role_of_event where id_operating_standard_2=?",nativeQuery = true)
    List<RoleOfEvent> findByOperatingStandard_2(Integer operatingStandard_2);

    List<RoleOfEvent> findByOperatingStandards2(OperatingStandards2 operatingStandards2);
}
