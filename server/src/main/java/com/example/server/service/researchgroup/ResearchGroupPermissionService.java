package com.example.server.service.researchgroup;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.example.server.domain.ResearchGroup;
import com.example.server.domain.ResearchGroupMember;
import com.example.server.domain.User;
import com.example.server.repository.ResearchGroupMemberRepository;
import com.example.server.repository.ResearchGroupRepository;
import com.example.server.repository.UserRepository;
import com.example.server.utils.ResearchGroupMemberRoles;
import com.example.server.utils.SecurityUtils;

@Service
public class ResearchGroupPermissionService {

    private final ResearchGroupRepository groupRepo;
    private final ResearchGroupMemberRepository memberRepo;
    private final UserRepository userRepo;

    public ResearchGroupPermissionService(
            ResearchGroupRepository groupRepo,
            ResearchGroupMemberRepository memberRepo,
            UserRepository userRepo) {
        this.groupRepo = groupRepo;
        this.memberRepo = memberRepo;
        this.userRepo = userRepo;
    }

    /** Admin / Trợ lí NCKH hoặc trưởng nhóm / thư ký nhóm đã duyệt. */
    public boolean canCreateSeminarOrConference(Integer userId) {
        if (userId == null) {
            return false;
        }
        User user = userRepo.findById(userId).orElse(null);
        if (user != null && SecurityUtils.hasNckhStaffAccess(user)) {
            return true;
        }
        return isLeaderOrSecretaryOfApprovedGroup(userId);
    }

    public boolean isLeaderOrSecretaryOfApprovedGroup(Integer userId) {
        if (userId == null) {
            return false;
        }
        User user = userRepo.findById(userId).orElse(null);
        if (user == null) {
            return false;
        }
        for (ResearchGroupMember membership : memberRepo.findAllByUserId(userId)) {
            ResearchGroup group = groupRepo.findById(membership.getGroupId()).orElse(null);
            if (group == null || group.getStatus() != ResearchGroup.GroupStatus.APPROVED) {
                continue;
            }
            if (ResearchGroupMemberRoles.isLeaderOrSecretary(group, membership, user)) {
                return true;
            }
        }
        return false;
    }

    public boolean isLeaderOfGroup(Integer userId, Integer groupId) {
        if (userId == null || groupId == null) {
            return false;
        }
        ResearchGroup group = groupRepo.findById(groupId).orElse(null);
        if (group == null) {
            return false;
        }
        User user = userRepo.findById(userId).orElse(null);
        return user != null && group.isLeader(user);
    }

    public Map<String, Object> getMyPermissions(Integer userId) {
        Map<String, Object> data = new LinkedHashMap<>();
        User user = userId != null ? userRepo.findById(userId).orElse(null) : null;
        boolean staff = user != null && SecurityUtils.hasNckhStaffAccess(user);
        boolean seminarCreator = staff || isLeaderOrSecretaryOfApprovedGroup(userId);
        data.put("canCreateSeminar", seminarCreator);
        data.put("isNckhStaff", staff);
        data.put("isGroupLeaderOrSecretary", !staff && isLeaderOrSecretaryOfApprovedGroup(userId));
        return data;
    }
}
