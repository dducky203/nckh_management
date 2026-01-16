package com.example.server.service.Impl;

import com.example.server.DTO.request.CreateResearchGroupDocumentRequest;
import com.example.server.DTO.request.CreateResearchGroupRequest;
import com.example.server.DTO.request.UpdateResearchGroupRequest;
import com.example.server.DTO.response.ResearchGroupDocumentDTO;
import com.example.server.DTO.response.ResearchGroupDTO;
import com.example.server.DTO.users.UserDetailsDTO;
import com.example.server.domain.ResearchGroup;
import com.example.server.domain.ResearchGroupDocument;
import com.example.server.domain.User;

import com.example.server.domain.ResearchGroupMember;
import com.example.server.repository.ResearchGroupDocumentRepository;
import com.example.server.repository.ResearchGroupMemberRepository;
import com.example.server.repository.ResearchGroupRepository;
import com.example.server.repository.UserRepository;

import com.example.server.service.ResearchGroupService;
import com.example.server.utils.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ClassPathResource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Objects;
import java.util.stream.Collectors;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;


@Service
@RequiredArgsConstructor
public class ResearchGroupServiceImpl implements ResearchGroupService {

    private final ResearchGroupRepository groupRepository;
    private final UserRepository userRepository;
    private final ResearchGroupMemberRepository memberRepository;
    private final ResearchGroupDocumentRepository documentRepository;

    @Value("${upload.dir}")
    private String uploadDir;

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

        // Tạo ResearchGroupMember cho tất cả members
        for (User member : members) {
            ResearchGroupMember memberInfo = ResearchGroupMember.builder()
                    .groupId(savedGroup.getId())
                    .userId(member.getId())
                    .role(member.getId().equals(leader.getId()) ? "Trưởng nhóm" : "Thành viên")
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

        group.setStatus(ResearchGroup.GroupStatus.APPROVED);
        ResearchGroup savedGroup = groupRepository.save(group);
        return getGroupById(savedGroup.getId());
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
        if (!group.isLeader(user) && !SecurityUtils.isAdmin(user)) {
            throw new RuntimeException("Chỉ trưởng nhóm hoặc admin mới có thể thêm thành viên");
        }

        User newMember = userRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thành viên"));

        group.addMember(newMember);
        ResearchGroup savedGroup = groupRepository.save(group);

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

        User memberToRemove = userRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thành viên"));

        group.removeMember(memberToRemove);
        ResearchGroup savedGroup = groupRepository.save(group);

        // Xóa ResearchGroupMember
        memberRepository.deleteByGroupIdAndUserId(groupId, memberId);

        return getGroupById(groupId);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ResearchGroupDTO> getAllGroups(String keyword, String status, String type, Pageable pageable) {
        Page<ResearchGroup> groups;

        if (status != null && !status.isEmpty() && !"ALL".equalsIgnoreCase(status)) {
            ResearchGroup.GroupStatus groupStatus = ResearchGroup.GroupStatus.valueOf(status.toUpperCase());
            if (keyword != null && !keyword.isEmpty()) {
                groups = groupRepository.searchByKeywordAndStatus(keyword, type, groupStatus, pageable);
            } else {
                groups = groupRepository.findByStatusAndType(groupStatus, type, pageable);
            }
        } else {
            if (keyword != null && !keyword.isEmpty()) {
                groups = groupRepository.searchByKeyword(keyword, type, pageable);
            } else {
                groups = groupRepository.findAllByType(type,pageable);
            }
        }

        return groups.map(group -> {
            List<ResearchGroupMember> memberInfos = memberRepository.findByGroupId(group.getId());
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

        return allGroups.stream()
                .map(group -> {
                    List<ResearchGroupMember> memberInfos = memberRepository.findByGroupId(group.getId());
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
        boolean isMember = group.isMember(user);
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
                if (username == null || username.trim().isEmpty()) {
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

                    if (donVi == null || donVi.trim().isEmpty()) {
                        donVi = member.getIdResume().getAddress();
                    }

                    // Validate nhiệm vụ
                    if (nhiemVu == null || nhiemVu.trim().isEmpty()) {
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

                    // Kiểm tra xem đã là member chưa
                    if (!group.isMember(member)) {
                        group.addMember(member);
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
        boolean isMember = group.isMember(user);
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
        boolean isMember = group.isMember(user);
        boolean isAdmin = SecurityUtils.isAdmin(user);

        if (!isLeader && !isAdvisor && !isMember && !isAdmin) {
            throw new RuntimeException("Chỉ thành viên nhóm mới có quyền upload documents");
        }

        if (file == null || file.isEmpty()) {
            throw new RuntimeException("File không được để trống");
        }

        // Lưu file
        String fileUrl;
        try {
            Path folderPath = Paths.get(uploadDir, "research-groups", groupId.toString());
            if (!Files.exists(folderPath)) {
                Files.createDirectories(folderPath);
            }

            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path targetLocation = folderPath.resolve(Objects.requireNonNull(fileName));
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            // Lưu relative path
            fileUrl = "research-groups/" + groupId + "/" + fileName;
        } catch (IOException e) {
            throw new RuntimeException("Lỗi khi lưu file: " + e.getMessage(), e);
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
        boolean isMember = group.isMember(user);
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
                // Xóa file cũ (optional)
                if (document.getFileUrl() != null) {
                    Path oldFile = Paths.get(uploadDir, document.getFileUrl());
                    if (Files.exists(oldFile)) {
                        Files.delete(oldFile);
                    }
                }

                // Lưu file mới
                Path folderPath = Paths.get(uploadDir, "research-groups", groupId.toString());
                if (!Files.exists(folderPath)) {
                    Files.createDirectories(folderPath);
                }

                String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
                Path targetLocation = folderPath.resolve(Objects.requireNonNull(fileName));
                Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

                document.setFileUrl("research-groups/" + groupId + "/" + fileName);
            } catch (IOException e) {
                throw new RuntimeException("Lỗi khi lưu file: " + e.getMessage(), e);
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
        boolean isMember = group.isMember(user);
        boolean isAdmin = SecurityUtils.isAdmin(user);

        if (!isLeader && !isAdvisor && !isMember && !isAdmin) {
            throw new RuntimeException("Chỉ thành viên nhóm mới có quyền xóa documents");
        }

        // Xóa file
        try {
            if (document.getFileUrl() != null) {
                Path filePath = Paths.get(uploadDir, document.getFileUrl());
                if (Files.exists(filePath)) {
                    Files.delete(filePath);
                }
            }
        } catch (IOException e) {
            // Log error nhưng vẫn xóa document
            System.err.println("Lỗi khi xóa file: " + e.getMessage());
        }

        documentRepository.delete(document);
    }
}
