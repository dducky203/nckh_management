package com.example.server.repository;

import com.example.server.domain.Event;
import com.example.server.domain.Member;
import com.example.server.domain.User;

import com.example.server.utils.SQL;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Set;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {
    boolean existsByUserId(Integer userId);

    Member findByUserIdAndEventId(Integer userId, Integer eventId);
}
