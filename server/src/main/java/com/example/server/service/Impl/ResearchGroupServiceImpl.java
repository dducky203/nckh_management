package com.example.server.service.Impl;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.*;
import java.util.*;
import java.util.stream.Collectors;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.example.server.DTO.request.*;
import com.example.server.DTO.response.ResearchGroupDTO;
import com.example.server.DTO.response.ResearchGroupDocumentDTO;
import com.example.server.domain.*;
import com.example.server.repository.*;
import com.example.server.service.CloudinaryService;
import com.example.server.service.ResearchGroupService;
import com.example.server.utils.SecurityUtils;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class ResearchGroupServiceImpl implements ResearchGroupService {

    private final ResearchGroupRepository groupRepository;
    private final UserRepository userRepository;
    private final ResearchGroupMemberRepository memberRepository;
    private final ResearchGroupDocumentRepository documentRepository;
    private final CloudinaryService cloudinaryService;

    @Value("${upload.dir}")
    private String uploadDir;

    private static final String RESEARCH_GROUP_CLOUDINARY_FOLDER = "research-groups";

    @Override
    @Transactional
    public ResearchGroupDTO createGroup(Integer userId, CreateResearchGroupRequest request) {
        User leader = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        User advisor = userRepository.findById(request.getAdvisorId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người hướng dẫn"));

        // Validate: phải có ít nhất 2 thành viên (bao gồm leader)
        if (request.getMemberIds() == null || request.getMemberIds().size() < 1) {
            throw new RuntimeException("Nhóm phải có ít nhất 2 thành viên (bao gồm trưởng nhóm)");
        }

        // Validate member IDs tồn tại
        for (Integer memberId : request.getMemberIds()) {
            userRepository.findById(memberId)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy thành viên với ID: " + memberId));
        }

        String groupCategory = request.getType() != null ? request.getType() : "student";
        String quotaScheme = normalizeGroupType(request.getGroupType());
        validateGroupTypePair(groupCategory, quotaScheme);

        // Nhóm SV → chờ giảng viên duyệt trước; Nhóm GV → chờ Admin duyệt
        ResearchGroup.GroupStatus initialStatus = "student".equals(groupCategory)
                ? ResearchGroup.GroupStatus.PENDING_ADVISOR
                : ResearchGroup.GroupStatus.PENDING;

        // Tạo nhóm mới
        ResearchGroup group = ResearchGroup.builder()
                .groupName(request.getGroupName())
                .topicName(request.getTopicName())
                .description(request.getDescription())
                .type(groupCategory)
                .groupType(quotaScheme)
                .status(initialStatus)
                .leader(leader)
                .advisor(advisor)
                .build();

        ResearchGroup savedGroup = groupRepository.save(group);

        // Tạo ResearchGroupMember cho tất cả members (bao gồm leader)
        Set<Integer> allMemberIds = new HashSet<>(request.getMemberIds());
        allMemberIds.add(leader.getId());

        for (Integer memberId : allMemberIds) {
            ResearchGroupMember memberInfo = ResearchGroupMember.builder()
                .groupId(savedGroup.getId())
                .userId(memberId)
                .role(memberId.equals(leader.getId()) ? "Trưởng nhóm" : "Thành viên")
                .participationRate(100)
                .build();
            memberRepository.save(memberInfo);
        }

        return getGroupById(savedGroup.getId());
    }

    @Override
    @Transactional
    public ResearchGroupDTO approveGroup(Integer groupId) {
        ResearchGroup group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhóm"));

        // Admin chỉ được duyệt nhóm đang PENDING hoặc PENDING_ADMIN
        if (group.getStatus() == ResearchGroup.GroupStatus.PENDING_ADVISOR) {
            throw new RuntimeException("Nhóm này đang chờ giảng viên hướng dẫn xét duyệt trước khi Admin duyệt.");
        }
        if (group.getStatus() == ResearchGroup.GroupStatus.APPROVED) {
            throw new RuntimeException("Nhóm này đã được duyệt rồi.");
        }
        if (group.getStatus() == ResearchGroup.GroupStatus.REJECTED) {
            throw new RuntimeException("Nhóm này đã bị từ chối.");
        }

        group.setStatus(ResearchGroup.GroupStatus.APPROVED);
        ResearchGroup savedGroup = groupRepository.save(group);
        return getGroupById(savedGroup.getId());
    }

    @Override
    @Transactional
    public ResearchGroupDTO advisorApproveGroup(Integer groupId, Integer advisorId) {
        ResearchGroup group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhóm"));

        // Kiểm tra người dùng hiện tại có phải advisor của nhóm này không
        if (group.getAdvisor() == null || !group.getAdvisor().getId().equals(advisorId)) {
            throw new RuntimeException("Bạn không phải là giảng viên hướng dẫn của nhóm này.");
        }

        if (group.getStatus() != ResearchGroup.GroupStatus.PENDING_ADVISOR) {
            throw new RuntimeException("Nhóm này không ở trạng thái chờ giảng viên duyệt.");
        }

        group.setStatus(ResearchGroup.GroupStatus.PENDING_ADMIN);
        ResearchGroup savedGroup = groupRepository.save(group);
        return getGroupById(savedGroup.getId());
    }

    @Override
    @Transactional
    public ResearchGroupDTO advisorRejectGroup(Integer groupId, Integer advisorId, String reason) {
        ResearchGroup group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhóm"));

        // Kiểm tra advisor
        if (group.getAdvisor() == null || !group.getAdvisor().getId().equals(advisorId)) {
            throw new RuntimeException("Bạn không phải là giảng viên hướng dẫn của nhóm này.");
        }

        if (group.getStatus() != ResearchGroup.GroupStatus.PENDING_ADVISOR) {
            throw new RuntimeException("Nhóm này không ở trạng thái chờ giảng viên duyệt.");
        }

        group.setStatus(ResearchGroup.GroupStatus.REJECTED);
        if (reason != null && !reason.isEmpty()) {
            String currentDesc = group.getDescription() != null ? group.getDescription() : "";
            group.setDescription(currentDesc + "\n\n[GV Từ chối]: " + reason);
        }
        ResearchGroup savedGroup = groupRepository.save(group);
        return getGroupById(savedGroup.getId());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ResearchGroupDTO> getGroupsForAdvisor(Integer advisorId, String status) {
        User advisor = userRepository.findById(advisorId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy giảng viên"));

        List<ResearchGroup> groups;
        if (status != null && !status.isBlank() && !"ALL".equalsIgnoreCase(status)) {
            ResearchGroup.GroupStatus groupStatus = ResearchGroup.GroupStatus.valueOf(status.toUpperCase());
            groups = groupRepository.findByAdvisorAndStatus(advisor, groupStatus);
        } else {
            groups = groupRepository.findByAdvisor(advisor);
        }

        return groups.stream()
                .map(group -> {
                    List<ResearchGroupMember> memberInfos = memberRepository.findByGroupId(group.getId());
                    return ResearchGroupDTO.fromEntity(group, memberInfos);
                })
                .collect(Collectors.toList());
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
        return getGroupById(savedGroup.getId());
    }

    @Transactional
    public ResearchGroupDTO updateGroup(Integer groupId, Integer userId, UpdateResearchGroupRequest request) {
        ResearchGroup group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhóm"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        // Kiểm tra quyền: chỉ leader hoặc admin mới được cập nhật
        if (!group.isLeader(user) && !SecurityUtils.isAdmin(user)) {
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
        if (request.getGroupType() != null) {
            String quotaScheme = normalizeGroupType(request.getGroupType());
            validateGroupTypePair(group.getType(), quotaScheme);
            group.setGroupType(quotaScheme);
        }
        if (request.getAdvisorId() != null) {
            User advisor = userRepository.findById(request.getAdvisorId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy người hướng dẫn"));
            group.setAdvisor(advisor);
        }
        if (request.getMemberIds() != null) {
            Set<Integer> desiredMemberIds = new HashSet<>(request.getMemberIds());
            desiredMemberIds.add(group.getLeader().getId()); // Luôn giữ leader

            // Validate users tồn tại
            for (Integer memberId : desiredMemberIds) {
                userRepository.findById(memberId)
                        .orElseThrow(() -> new RuntimeException("Không tìm thấy thành viên"));
            }

            // Current members
            List<ResearchGroupMember> currentInfos = memberRepository.findByGroupId(groupId);
            Set<Integer> currentMemberIds = currentInfos.stream()
                    .map(ResearchGroupMember::getUserId)
                    .collect(Collectors.toSet());

            // Delete removed members (không xóa leader)
            for (Integer currentMemberId : currentMemberIds) {
                if (!currentMemberId.equals(group.getLeader().getId()) && !desiredMemberIds.contains(currentMemberId)) {
                    memberRepository.deleteByGroupIdAndUserId(groupId, currentMemberId);
                }
            }

            // Add new members
            for (Integer desiredMemberId : desiredMemberIds) {
                if (!currentMemberIds.contains(desiredMemberId)) {
                    memberRepository.save(ResearchGroupMember.builder()
                            .groupId(groupId)
                            .userId(desiredMemberId)
                            .role(desiredMemberId.equals(group.getLeader().getId()) ? "Trưởng nhóm" : "Thành viên")
                            .participationRate(100)
                            .build());
                }
            }

            // Ensure leader row exists + role đúng
            ResearchGroupMember leaderInfo = memberRepository.findByGroupIdAndUserId(groupId, group.getLeader().getId())
                    .orElse(ResearchGroupMember.builder()
                            .groupId(groupId)
                            .userId(group.getLeader().getId())
                            .build());
            leaderInfo.setRole("Trưởng nhóm");
            if (leaderInfo.getParticipationRate() == null) {
                leaderInfo.setParticipationRate(100);
            }
            memberRepository.save(leaderInfo);
        }

        ResearchGroup savedGroup = groupRepository.save(group);
        return getGroupById(savedGroup.getId());
    }

    @Override
    @Transactional
    public void deleteGroup(Integer groupId) {
        ResearchGroup group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhóm"));

        // Delete child rows first to avoid FK constraint violations
        documentRepository.deleteByResearchGroupId(groupId);
        memberRepository.deleteByGroupId(groupId);

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
        if (!group.isLeader(user) && !SecurityUtils.isAdmin(user)) {
            throw new RuntimeException("Chỉ trưởng nhóm hoặc admin mới có thể thêm thành viên");
        }

        userRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thành viên"));

        if (memberRepository.findByGroupIdAndUserId(groupId, memberId).isPresent()) {
            throw new RuntimeException("Thành viên đã tồn tại trong nhóm");
        }

        // Tạo ResearchGroupMember với role và participationRate mặc định
        ResearchGroupMember memberInfo = ResearchGroupMember.builder()
                .groupId(groupId)
                .userId(memberId)
                .role("Thành viên")
                .participationRate(100)
                .build();
        memberRepository.save(memberInfo);

        return getGroupById(groupId);
    }

    @Override
    @Transactional
    public ResearchGroupDTO removeMember(Integer groupId, Integer userId, Integer memberId) {
        ResearchGroup group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhóm"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        // Kiểm tra quyền
        if (!group.isLeader(user) && !SecurityUtils.isAdmin(user)) {
            throw new RuntimeException("Chỉ trưởng nhóm hoặc admin mới có thể xóa thành viên");
        }

        // Không cho phép xóa leader
        if (group.getLeader().getId().equals(memberId)) {
            throw new RuntimeException("Không thể xóa trưởng nhóm");
        }

        if (memberRepository.findByGroupIdAndUserId(groupId, memberId).isEmpty()) {
            throw new RuntimeException("Thành viên không tồn tại trong nhóm");
        }

        // Xóa ResearchGroupMember
        memberRepository.deleteByGroupIdAndUserId(groupId, memberId);

        return getGroupById(groupId);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ResearchGroupDTO> getAllGroups(String keyword, String status, String type, Date startDate, Date endDate, Pageable pageable) {
        ResearchGroup.GroupStatus groupStatus = null;
        if (status != null && !status.isEmpty() && !"ALL".equalsIgnoreCase(status)) {
            groupStatus = ResearchGroup.GroupStatus.valueOf(status.toUpperCase());
        }

        Page<ResearchGroup> groups;
        if(startDate != null & endDate != null){
           groups = groupRepository.searchWithFilters(keyword, type, groupStatus, startDate, endDate, pageable);
        }else{
            groups = groupRepository.searchWithFilters(keyword, type, groupStatus, pageable);
        }

        List<Integer> groupIds = groups.getContent().stream().map(ResearchGroup::getId).collect(Collectors.toList());
        List<ResearchGroupMember> allMembers = groupIds.isEmpty() ? Collections.emptyList() : memberRepository.findByGroupIdIn(groupIds);
        Map<Integer, List<ResearchGroupMember>> membersByGroupId = allMembers.stream().collect(Collectors.groupingBy(ResearchGroupMember::getGroupId));

        return groups.map(group -> {
            List<ResearchGroupMember> memberInfos = membersByGroupId.getOrDefault(group.getId(), Collections.emptyList());
            return ResearchGroupDTO.fromEntity(group, memberInfos);
        });
    }

    @Override
    @Transactional(readOnly = true)
    public ResearchGroupDTO getGroupById(Integer groupId) {
        ResearchGroup group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhóm"));
        List<ResearchGroupMember> memberInfos = memberRepository.findByGroupId(groupId);
        return ResearchGroupDTO.fromEntity(group, memberInfos);
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

        List<Integer> groupIds = allGroups.stream().map(ResearchGroup::getId).collect(Collectors.toList());
        List<ResearchGroupMember> allMembers = groupIds.isEmpty() ? java.util.Collections.emptyList() : memberRepository.findByGroupIdIn(groupIds);
        java.util.Map<Integer, List<ResearchGroupMember>> membersByGroupId = allMembers.stream().collect(java.util.stream.Collectors.groupingBy(ResearchGroupMember::getGroupId));

        return allGroups.stream()
                .map(group -> {
                    List<ResearchGroupMember> memberInfos = membersByGroupId.getOrDefault(group.getId(), java.util.Collections.emptyList());
                    return ResearchGroupDTO.fromEntity(group, memberInfos);
                })
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

    @Override
    @Transactional
    public ResearchGroupDTO updateGoogleSheetLink(Integer groupId, Integer userId, String googleSheetLink) {
        ResearchGroup group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhóm"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        // Kiểm tra quyền: chỉ leader, advisor hoặc member mới được cập nhật
        boolean isLeader = group.isLeader(user);
        boolean isAdvisor = group.getAdvisor() != null && group.getAdvisor().getId().equals(userId);
        boolean isMember = memberRepository.findByGroupIdAndUserId(groupId, userId).isPresent();
        boolean isAdmin = SecurityUtils.isAdmin(user);

        if (!isLeader && !isAdvisor && !isMember && !isAdmin) {
            throw new RuntimeException("Chỉ thành viên nhóm mới có quyền cập nhật link Google Sheet");
        }

        group.setGoogleSheetLink(googleSheetLink);
        ResearchGroup savedGroup = groupRepository.save(group);
        return getGroupById(groupId);
    }

    @Override
    @Transactional
    public ResearchGroupDTO updateMemberInfo(Integer groupId, Integer userId, Integer memberId, String role,
                                             Integer participationRate) {
        ResearchGroup group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhóm"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        // Kiểm tra quyền: chỉ leader hoặc admin mới được cập nhật
        if (!group.isLeader(user) && !SecurityUtils.isAdmin(user)) {
            throw new RuntimeException("Bạn không có quyền cập nhật thông tin thành viên");
        }

        // Không cho phép thay đổi role của leader
        if (group.getLeader().getId().equals(memberId) && role != null && !"Trưởng nhóm".equals(role)) {
            throw new RuntimeException("Không thể thay đổi role của trưởng nhóm");
        }

        // Tìm hoặc tạo ResearchGroupMember
        ResearchGroupMember memberInfo = memberRepository.findByGroupIdAndUserId(groupId, memberId)
                .orElse(ResearchGroupMember.builder()
                        .groupId(groupId)
                        .userId(memberId)
                        .role("Thành viên")
                        .participationRate(100)
                        .build());

        if (role != null && !role.isEmpty()) {
            memberInfo.setRole(role);
        }
        if (participationRate != null && participationRate >= 0 && participationRate <= 100) {
            memberInfo.setParticipationRate(participationRate);
        }

        memberRepository.save(memberInfo);
        return getGroupById(groupId);
    }

    @Override
    public byte[] exportTemplate() {
        try {
            ClassPathResource templateResource = new ClassPathResource(
                    "templates/research-group/template_import_user_research.xlsx");

            if (!templateResource.exists()) {
                throw new RuntimeException("Không tìm thấy template tại resources/templates/research-group/template_import_user_research.xlsx");
            }

            try (InputStream inputStream = templateResource.getInputStream()) {
                return inputStream.readAllBytes();
            }
        } catch (IOException e) {
            throw new RuntimeException("Lỗi khi đọc file template Excel: " + e.getMessage(), e);
        }
    }


    @Override
    @Transactional
    public ResearchGroupDTO importMembersFromExcel(Integer groupId, Integer userId,
                                                   MultipartFile file) throws IOException {
        ResearchGroup group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhóm"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        // Kiểm tra quyền: chỉ leader hoặc admin mới được import
        if (!group.isLeader(user) && !SecurityUtils.isAdmin(user)) {
            throw new RuntimeException("Bạn không có quyền import thành viên");
        }

        String filename = file.getOriginalFilename();
        if (filename == null || (!filename.toLowerCase().endsWith(".xlsx") && !filename.toLowerCase().endsWith(".xls"))) {
            throw new RuntimeException("File phải có định dạng Excel (.xlsx hoặc .xls)");
        }

        try (InputStream inputStream = file.getInputStream();
             Workbook workbook = new XSSFWorkbook(inputStream)) {

            Sheet sheet = workbook.getSheetAt(0);

            // Định nghĩa index các cột cố định
            final int COL_HO_TEN = 0;
            final int COL_MA_CAN_BO = 1;
            final int COL_EMAIL = 2;
            final int COL_DON_VI = 3;
            final int COL_NHIEM_VU = 4;
            final int COL_TY_LE_THAM_GIA = 5;

            // Validate role constants
            final String ROLE_TRUONG_NHOM = "Trưởng nhóm";
            final String ROLE_THU_KY = "Thư ký";
            final String ROLE_THANH_VIEN = "Thành viên";

            int successCount = 0;
            int errorCount = 0;
            StringBuilder errors = new StringBuilder();

            // Track số lượng role để validate
            int countTruongNhom = 0;
            int countThuKy = 0;

            // Đọc dữ liệu từ dòng 1 (bỏ qua header dòng 0)
            int rowIndex = 1;
            while (true) {
                Row row = sheet.getRow(rowIndex);
                
                // Dừng khi gặp dòng null hoặc dòng trống (cột mã cán bộ trống)
                if (row == null) {
                    break;
                }

                String username = getStingValue(row, COL_MA_CAN_BO);
                
                // Dừng khi gặp dòng trống (mã cán bộ trống)
                if (username == null || username.isBlank()) {
                    break;
                }

                try {
                    // Đọc dữ liệu từ Excel theo index cột
                    String donVi = getStingValue(row, COL_DON_VI);
                    String nhiemVu = getStingValue(row, COL_NHIEM_VU);
                    Integer tyLeThamGia = getCellValueAsInteger(row, COL_TY_LE_THAM_GIA);


                    // Tìm user theo username (Mã cán bộ) trong DB
                    User member = userRepository.findByUsername(username);
                    if (member == null) {
                        errorCount++;
                        errors.append("Dòng ").append(rowIndex + 1)
                              .append(": Không tìm thấy người dùng với mã cán bộ '")
                              .append(username).append("'\n");
                        rowIndex++;
                        continue;
                    }

                    if (donVi == null || donVi.isBlank()) {
                        donVi = member.getIdResume().getAddress();
                    }

                    // Validate nhiệm vụ
                    if (nhiemVu == null || nhiemVu.isBlank()) {
                        nhiemVu = ROLE_THANH_VIEN;
                    } else {
                        nhiemVu = nhiemVu.trim();
                        // Kiểm tra nhiệm vụ chỉ được là 1 trong 3 giá trị
                        if (!nhiemVu.equalsIgnoreCase(ROLE_TRUONG_NHOM) &&
                            !nhiemVu.equalsIgnoreCase(ROLE_THU_KY) &&
                            !nhiemVu.equalsIgnoreCase(ROLE_THANH_VIEN)) {
                            errorCount++;
                            errors.append("Dòng ").append(rowIndex + 1)
                                  .append(": Nhiệm vụ không hợp lệ.");
                            rowIndex++;
                            continue;
                        }

                        // Validate số lượng Trưởng nhóm
                        if (nhiemVu.equals(ROLE_TRUONG_NHOM)) {
                            countTruongNhom++;
                            if (countTruongNhom > 1) {
                                errorCount++;
                                errors.append("Dòng ").append(rowIndex + 1)
                                      .append(": Mỗi nhóm chỉ được có 1 Trưởng nhóm\n");
                                rowIndex++;
                                continue;
                            }
                        }

                        // Validate số lượng Thư ký
                        if (nhiemVu.equals(ROLE_THU_KY)) {
                            countThuKy++;
                            if (countThuKy > 1) {
                                errorCount++;
                                errors.append("Dòng ").append(rowIndex + 1)
                                      .append(": Mỗi nhóm chỉ được có 1 Thư ký\n");
                                rowIndex++;
                                continue;
                            }
                        }
                    }

                    // Tỷ lệ tham gia lấy từ Excel, mặc định 100 nếu trống hoặc không hợp lệ
                    if (tyLeThamGia == null || tyLeThamGia < 0 || tyLeThamGia > 100) {
                        tyLeThamGia = 100;
                    }

                    // Tạo hoặc cập nhật ResearchGroupMember
                    ResearchGroupMember memberInfo = memberRepository.findByGroupIdAndUserId(groupId, member.getId())
                            .orElse(ResearchGroupMember.builder()
                                    .groupId(groupId)
                                    .userId(member.getId())
                                    .role("Thành viên")
                                    .participationRate(100)
                                    .build());

                    memberInfo.setRole(nhiemVu);
                    memberInfo.setParticipationRate(tyLeThamGia);

                    memberRepository.save(memberInfo);
                    successCount++;

                } catch (Exception e) {
                    errorCount++;
                    errors.append("Dòng ").append(rowIndex + 1)
                          .append(": ").append(e.getMessage()).append("\n");
                }

                rowIndex++;
            }

            groupRepository.save(group);

            if (errorCount > 0) {
                throw new RuntimeException("Import hoàn tất với " + successCount + " thành công, " + errorCount
                        + " lỗi:\n" + errors.toString());
            }

            return getGroupById(groupId);

        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi import file Excel: " + e.getMessage(), e);
        }
    }

    private String getStingValue(Row row, Integer columnIndex) {
        if (columnIndex == null)
            return null;
        Cell cell = row.getCell(columnIndex);
        if (cell == null)
            return null;

        CellType cellType = cell.getCellType();
        if (cellType == CellType.STRING) {
            return cell.getStringCellValue().trim();
        } else if (cellType == CellType.NUMERIC) {
            if (org.apache.poi.ss.usermodel.DateUtil.isCellDateFormatted(cell)) {
                return cell.getDateCellValue().toString();
            } else {
                return String.valueOf((long) cell.getNumericCellValue());
            }
        } else if (cellType == CellType.BOOLEAN) {
            return String.valueOf(cell.getBooleanCellValue());
        } else {
            return null;
        }
    }

    private Integer getCellValueAsInteger(Row row, Integer columnIndex) {
        if (columnIndex == null)
            return null;
        Cell cell = row.getCell(columnIndex);
        if (cell == null)
            return null;

        CellType cellType = cell.getCellType();
        if (cellType == CellType.NUMERIC) {
            return (int) cell.getNumericCellValue();
        } else if (cellType == CellType.STRING) {
            try {
                return Integer.parseInt(cell.getStringCellValue().trim());
            } catch (NumberFormatException e) {
                return null;
            }
        } else {
            return null;
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<ResearchGroupDocumentDTO> getDocumentsByGroupId(Integer groupId, Integer userId) {
        ResearchGroup group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhóm"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        // Kiểm tra quyền: chỉ thành viên nhóm mới được xem documents
        boolean isLeader = group.isLeader(user);
        boolean isAdvisor = group.getAdvisor() != null && group.getAdvisor().getId().equals(userId);
        boolean isMember = memberRepository.findByGroupIdAndUserId(groupId, userId).isPresent();
        boolean isAdmin = SecurityUtils.isAdmin(user);

        if (!isLeader && !isAdvisor && !isMember && !isAdmin) {
            throw new RuntimeException("Chỉ thành viên nhóm mới có quyền xem documents");
        }

        List<ResearchGroupDocument> documents = documentRepository.findByResearchGroupId(groupId);
        return documents.stream()
                .map(ResearchGroupDocumentDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ResearchGroupDocumentDTO createDocument(Integer groupId, Integer userId,
                                                   CreateResearchGroupDocumentRequest request, MultipartFile file) {
        ResearchGroup group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhóm"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        // Kiểm tra quyền: chỉ thành viên nhóm mới được upload documents
        boolean isLeader = group.isLeader(user);
        boolean isAdvisor = group.getAdvisor() != null && group.getAdvisor().getId().equals(userId);
        boolean isMember = memberRepository.findByGroupIdAndUserId(groupId, userId).isPresent();
        boolean isAdmin = SecurityUtils.isAdmin(user);

        if (!isLeader && !isAdvisor && !isMember && !isAdmin) {
            throw new RuntimeException("Chỉ thành viên nhóm mới có quyền upload documents");
        }

        if (file == null || file.isEmpty()) {
            throw new RuntimeException("File không được để trống");
        }

        String fileUrl;
        try {
            fileUrl = cloudinaryService.uploadFile(
                    file, RESEARCH_GROUP_CLOUDINARY_FOLDER + "/" + groupId);
        } catch (IOException e) {
            throw new RuntimeException("Lỗi khi tải file lên Cloudinary: " + e.getMessage(), e);
        }

        // Tạo document
        ResearchGroupDocument document = ResearchGroupDocument.builder()
                .documentName(request.getDocumentName())
                .documentType(request.getDocumentType())
                .fileUrl(fileUrl)
                .description(request.getDescription())
                .researchGroup(group)
                .build();

        ResearchGroupDocument savedDocument = documentRepository.save(document);
        return ResearchGroupDocumentDTO.fromEntity(savedDocument);
    }

    @Override
    @Transactional
    public ResearchGroupDocumentDTO updateDocument(Integer groupId, Integer documentId, Integer userId,
                                                   CreateResearchGroupDocumentRequest request, MultipartFile file) {
        ResearchGroupDocument document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy document"));

        if (!document.getResearchGroup().getId().equals(groupId)) {
            throw new RuntimeException("Document không thuộc nhóm này");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        // Kiểm tra quyền: chỉ thành viên nhóm mới được cập nhật documents
        ResearchGroup group = document.getResearchGroup();
        boolean isLeader = group.isLeader(user);
        boolean isAdvisor = group.getAdvisor() != null && group.getAdvisor().getId().equals(userId);
        boolean isMember = memberRepository.findByGroupIdAndUserId(groupId, userId).isPresent();
        boolean isAdmin = SecurityUtils.isAdmin(user);

        if (!isLeader && !isAdvisor && !isMember && !isAdmin) {
            throw new RuntimeException("Chỉ thành viên nhóm mới có quyền cập nhật documents");
        }

        // Cập nhật thông tin
        if (request.getDocumentName() != null) {
            document.setDocumentName(request.getDocumentName());
        }
        if (request.getDocumentType() != null) {
            document.setDocumentType(request.getDocumentType());
        }
        if (request.getDescription() != null) {
            document.setDescription(request.getDescription());
        }

        // Cập nhật file nếu có
        if (file != null && !file.isEmpty()) {
            try {
                deleteStoredDocumentFile(document.getFileUrl());
                String newUrl = cloudinaryService.uploadFile(
                        file, RESEARCH_GROUP_CLOUDINARY_FOLDER + "/" + groupId);
                document.setFileUrl(newUrl);
            } catch (IOException e) {
                throw new RuntimeException("Lỗi khi tải file lên Cloudinary: " + e.getMessage(), e);
            }
        }

        ResearchGroupDocument savedDocument = documentRepository.save(document);
        return ResearchGroupDocumentDTO.fromEntity(savedDocument);
    }

    @Override
    @Transactional
    public void deleteDocument(Integer groupId, Integer documentId, Integer userId) {
        ResearchGroupDocument document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy document"));

        if (!document.getResearchGroup().getId().equals(groupId)) {
            throw new RuntimeException("Document không thuộc nhóm này");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        // Kiểm tra quyền: chỉ thành viên nhóm mới được xóa documents
        ResearchGroup group = document.getResearchGroup();
        boolean isLeader = group.isLeader(user);
        boolean isAdvisor = group.getAdvisor() != null && group.getAdvisor().getId().equals(userId);
        boolean isMember = memberRepository.findByGroupIdAndUserId(groupId, userId).isPresent();
        boolean isAdmin = SecurityUtils.isAdmin(user);

        if (!isLeader && !isAdvisor && !isMember && !isAdmin) {
            throw new RuntimeException("Chỉ thành viên nhóm mới có quyền xóa documents");
        }

        deleteStoredDocumentFile(document.getFileUrl());
        documentRepository.delete(document);
    }

    /** Xóa file Cloudinary hoặc file local cũ (đường dẫn tương đối). */
    private void deleteStoredDocumentFile(String fileUrl) {
        if (fileUrl == null || fileUrl.isBlank()) {
            return;
        }
        try {
            if (fileUrl.startsWith("http://") || fileUrl.startsWith("https://")) {
                cloudinaryService.deleteFileByUrl(fileUrl);
            } else {
                Path filePath = Paths.get(uploadDir, fileUrl);
                if (Files.exists(filePath)) {
                    Files.delete(filePath);
                }
            }
        } catch (Exception e) {
            System.err.println("Lỗi khi xóa file hồ sơ nhóm: " + e.getMessage());
        }
    }

    private static String normalizeGroupType(String groupType) {
        if (groupType == null || groupType.isBlank()) {
            return null;
        }
        return groupType.trim().toUpperCase();
    }

    private static void validateGroupTypePair(String category, String quotaScheme) {
        boolean lecturer = category != null && "lecturer".equalsIgnoreCase(category.trim());
        if (quotaScheme != null && !lecturer) {
            throw new RuntimeException("groupType chỉ áp dụng cho nhóm giảng viên (type = lecturer)");
        }
    }
}
