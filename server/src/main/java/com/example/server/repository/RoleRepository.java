package com.example.server.repository;

import com.example.server.domain.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Integer> {

    Optional<Role> findFirstByNameIgnoreCase(String name);
}