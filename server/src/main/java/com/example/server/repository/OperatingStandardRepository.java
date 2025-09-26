package com.example.server.repository;

import com.example.server.domain.OperatingStandard;
import com.example.server.utils.SQL;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface OperatingStandardRepository extends JpaRepository<OperatingStandard, Integer> {
    // get all distinct
//    @Query(value = SQL.GET_CRITERIA_IN_OS,nativeQuery = true)
//    List<IOperatingStandard> findByCriteria();

    // get all os by criteria
    @Query(value = SQL.FIND_OS_BY_ID_CRITERIA,nativeQuery = true)
    List<OperatingStandard> findByCriteria(int idCriteria);

}