package com.example.server.repository;

import com.example.server.domain.TypeOfCriterion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TypeOfCriterionRepository extends JpaRepository<TypeOfCriterion, Integer> {

    List<TypeOfCriterion> findAllByIsEvent(boolean isEvent);
}