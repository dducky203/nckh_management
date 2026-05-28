package com.example.server.repository;

import com.example.server.domain.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {
    boolean existsByUserId(Integer userId);

    Member findByUserIdAndEventId(Integer userId, Integer eventId);
}
