package com.example.server.utils;

import com.example.server.domain.ResearchGroup;
import com.example.server.domain.ResearchGroupMember;
import com.example.server.domain.User;

/** Vai trò thành viên trong nhóm nghiên cứu (cột {@code research_group_members.role}). */
public final class ResearchGroupMemberRoles {

    public static final String LEADER = "Trưởng nhóm";
    public static final String SECRETARY = "Thư ký";
    public static final String MEMBER = "Thành viên";

    private ResearchGroupMemberRoles() {
    }

    public static boolean isLeaderRole(String role) {
        return role != null && LEADER.equalsIgnoreCase(role.trim());
    }

    public static boolean isSecretaryRole(String role) {
        return role != null && SECRETARY.equalsIgnoreCase(role.trim());
    }

    /** Trưởng nhóm hoặc thư ký nhóm — được tạo seminar / hội thảo. */
    public static boolean isLeaderOrSecretary(ResearchGroup group, ResearchGroupMember member, User user) {
        if (group == null || user == null) {
            return false;
        }
        if (group.isLeader(user)) {
            return true;
        }
        return member != null && isSecretaryRole(member.getRole());
    }
}
