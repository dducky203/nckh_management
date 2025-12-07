package com.example.server.service.Impl;

import com.example.server.DTO.request.CreateResearchGroupRequest;
import com.example.server.DTO.request.UpdateResearchGroupRequest;
import com.example.server.DTO.response.ResearchGroupDTO;
import com.example.server.domain.ResearchGroup;
import com.example.server.domain.User;
//import com.example.server.dto.request.CreateResearchGroupRequest;
//import com.example.server.dto.request.UpdateResearchGroupRequest;
//import com.example.server.dto.response.ResearchGroupDTO;
import com.example.server.repository.ResearchGroupRepository;
import com.example.server.repository.UserRepository;
import com.example.server.service.ResearchGroupService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ResearchGroupServiceImpl implements ResearchGroupService {

    private final ResearchGroupRepository groupRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public ResearchGroupDTO createGroup(Integer userId, CreateResearchGroupRequest request) {
        User leader = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        User advisor = userRepository.findById(request.getAdvisorId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người hướng dẫn"));

        // Validate: phải có ít nhất 2 thành viên (bao gồm leader)
        if (request.getMemberIds().size() < 1) {
            throw new RuntimeException("Nhóm phải có ít nhất 2 thành viên (bao gồm trưởng nhóm)");
        }

        // Lấy danh sách members
        Set<User> members = new HashSet<>();
        members.add(leader); // Thêm leader vào danh sách members

        for (Integer memberId : request.getMemberIds()) {
            User member = userRepository.findById(memberId)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy thành viên với ID: " + memberId));
            members.add(member);
        }

        // Tạo nhóm mới
        ResearchGroup group = ResearchGroup.builder()
                .groupName(request.getGroupName())
                .topicName(request.getTopicName())
                .description(request.getDescription())
                .status(ResearchGroup.GroupStatus.PENDING) // Mặc định chờ duyệt
                .leader(leader)
                .advisor(advisor)
                .members(members)
                .build();

        ResearchGroup savedGroup = groupRepository.save(group);
        return ResearchGroupDTO.fromEntity(savedGroup);
    }

    @Override
    @Transactional
    public ResearchGroupDTO approveGroup(Integer groupId) {
        ResearchGroup group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhóm"));

        group.setStatus(ResearchGroup.GroupStatus.APPROVED);
        ResearchGroup savedGroup = groupRepository.save(group);
        return ResearchGroupDTO.fromEntity(savedGroup);
    }

    @Override
    @Transactional
    public ResearchGroupDTO rejectGroup(Integer groupId, String reason) {
        ResearchGroup group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhóm"));

        group.setStatus(ResearchGroup.GroupStatus.REJECTED);
        // Có thể lưu reason vào description hoặc tạo field riêng
        if (reason != null && !reason.isEmpty()) {
            group.setDescription(group.getDescription() + "\n\nLý do từ chối: " + reason);
        }
        ResearchGroup savedGroup = groupRepository.save(group);
        return ResearchGroupDTO.fromEntity(savedGroup);
    }


    @Transactional
    public ResearchGroupDTO updateGroup(Integer groupId, Integer userId, UpdateResearchGroupRequest request) {
        ResearchGroup group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhóm"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        // Kiểm tra quyền: chỉ leader hoặc admin mới được cập nhật
        if (!group.isLeader(user) && !"ADMIN".equals(user.getIdRole().getName())) {
            throw new RuntimeException("Bạn không có quyền cập nhật nhóm này");
        }

        // Cập nhật thông tin
        if (request.getGroupName() != null) {
            group.setGroupName(request.getGroupName());
        }
        if (request.getTopicName() != null) {
            group.setTopicName(request.getTopicName());
        }
        if (request.getDescription() != null) {
            group.setDescription(request.getDescription());
        }
        if (request.getAdvisorId() != null) {
            User advisor = userRepository.findById(request.getAdvisorId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy người hướng dẫn"));
            group.setAdvisor(advisor);
        }
        if (request.getMemberIds() != null) {
            Set<User> newMembers = new HashSet<>();
            newMembers.add(group.getLeader()); // Giữ leader
            for (Integer memberId : request.getMemberIds()) {
                User member = userRepository.findById(memberId)
                        .orElseThrow(() -> new RuntimeException("Không tìm thấy thành viên"));
                newMembers.add(member);
            }
            group.setMembers(newMembers);
        }

        ResearchGroup savedGroup = groupRepository.save(group);
        return ResearchGroupDTO.fromEntity(savedGroup);
    }

    @Override
    @Transactional
    public void deleteGroup(Integer groupId) {
        ResearchGroup group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhóm"));
        groupRepository.delete(group);
    }

    @Override
    @Transactional
    public ResearchGroupDTO addMember(Integer groupId, Integer userId, Integer memberId) {
        ResearchGroup group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhóm"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        // Kiểm tra quyền
        if (!group.isLeader(user) && !"ADMIN".equals(user.getIdRole().getName())) {
            throw new RuntimeException("Chỉ trưởng nhóm hoặc admin mới có thể thêm thành viên");
        }

        User newMember = userRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thành viên"));

        group.addMember(newMember);
        ResearchGroup savedGroup = groupRepository.save(group);
        return ResearchGroupDTO.fromEntity(savedGroup);
    }

    @Override
    @Transactional
    public ResearchGroupDTO removeMember(Integer groupId, Integer userId, Integer memberId) {
        ResearchGroup group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhóm"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        // Kiểm tra quyền
        if (!group.isLeader(user) && !"ADMIN".equals(user.getIdRole().getName())) {
            throw new RuntimeException("Chỉ trưởng nhóm hoặc admin mới có thể xóa thành viên");
        }

        // Không cho phép xóa leader
        if (group.getLeader().getId().equals(memberId)) {
            throw new RuntimeException("Không thể xóa trưởng nhóm");
        }

        User memberToRemove = userRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thành viên"));

        group.removeMember(memberToRemove);
        ResearchGroup savedGroup = groupRepository.save(group);
        return ResearchGroupDTO.fromEntity(savedGroup);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ResearchGroupDTO> getAllGroups(String keyword, String status, Pageable pageable) {
        Page<ResearchGroup> groups;

        if (status != null && !status.isEmpty() && !"ALL".equalsIgnoreCase(status)) {
            ResearchGroup.GroupStatus groupStatus = ResearchGroup.GroupStatus.valueOf(status.toUpperCase());
            if (keyword != null && !keyword.isEmpty()) {
                groups = groupRepository.searchByKeywordAndStatus(keyword, groupStatus, pageable);
            } else {
                groups = groupRepository.findByStatus(groupStatus, pageable);
            }
        } else {
            if (keyword != null && !keyword.isEmpty()) {
                groups = groupRepository.searchByKeyword(keyword, pageable);
            } else {
                groups = groupRepository.findAll(pageable);
            }
        }

        return groups.map(ResearchGroupDTO::fromEntity);
    }

    @Override
    @Transactional(readOnly = true)
    public ResearchGroupDTO getGroupById(Integer groupId) {
        ResearchGroup group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhóm"));
        return ResearchGroupDTO.fromEntity(group);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ResearchGroupDTO> getGroupsByUser(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        List<ResearchGroup> leaderGroups = groupRepository.findByLeader(user);
        List<ResearchGroup> memberGroups = groupRepository.findGroupsByMemberId(userId);

        // Merge và loại bỏ duplicate
        Set<ResearchGroup> allGroups = new HashSet<>(leaderGroups);
        allGroups.addAll(memberGroups);

        return allGroups.stream()
                .map(ResearchGroupDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public GroupStatistics getStatistics() {
        GroupStatistics stats = new GroupStatistics();
        stats.totalGroups = groupRepository.count();
        stats.pendingGroups = groupRepository.countByStatus(ResearchGroup.GroupStatus.PENDING);
        stats.approvedGroups = groupRepository.countByStatus(ResearchGroup.GroupStatus.APPROVED);
        stats.rejectedGroups = groupRepository.countByStatus(ResearchGroup.GroupStatus.REJECTED);
        return stats;
    }
}
