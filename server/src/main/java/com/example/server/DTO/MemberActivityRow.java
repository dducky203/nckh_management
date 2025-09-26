package com.example.server.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MemberActivityRow {
    private String fullName;
    private String role;
    private Map<String, Double> activityNorms; // key: activity name, value: norm (0.0 nếu không có)

    public MemberActivityRow(String name, Integer roleOfTeam, Map<String, Double> activityMap) {
    }
}

