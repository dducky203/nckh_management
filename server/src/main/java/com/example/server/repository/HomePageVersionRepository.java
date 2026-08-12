package com.example.server.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.server.domain.HomePageVersion;

public interface HomePageVersionRepository extends JpaRepository<HomePageVersion, Long> {
    Optional<HomePageVersion> findFirstByStatusOrderByCreatedAtDesc(String status);
}
