package com.example.server.repository;

import com.example.server.domain.TypeOfCriterion;
import com.example.server.utils.SQL;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TypeOfCriterionRepository extends JpaRepository<TypeOfCriterion, Integer> {
    // get all
    @Query(value = "select * from type_of_criteria",nativeQuery = true)
    List<TypeOfCriterion> getAllTypeOfCriterion();

    // find type of criteria by idOs
    @Query(value = SQL.FIND_TYPE_O_C_BY_OS,nativeQuery = true)
    TypeOfCriterion getTypeOfCriterionByOS(Integer idOperatingStandard);

    List<TypeOfCriterion> findAllByIsEvent(boolean isEvent);
}