package com.example.server.repository;

import com.example.server.domain.TimeConversion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TimeConversionRepository extends JpaRepository<TimeConversion, Integer> {
}