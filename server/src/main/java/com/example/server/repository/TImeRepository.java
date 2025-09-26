package com.example.server.repository;

import com.example.server.domain.Time;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TImeRepository extends JpaRepository<Time, Integer> {
}
