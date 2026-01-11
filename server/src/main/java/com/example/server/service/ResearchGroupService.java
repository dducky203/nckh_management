package com.example.server.service;

import com.example.server.DTO.request.CreateResearchGroupDocumentRequest;
import com.example.server.DTO.request.CreateResearchGroupRequest;
import com.example.server.DTO.request.UpdateResearchGroupRequest;
import com.example.server.DTO.response.ResearchGroupDocumentDTO;
import com.example.server.DTO.response.ResearchGroupDTO;
import com.example.server.domain.ResearchGroup;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ResearchGroupService {

    // User tạo nhóm (chờ duyệt)
    ResearchGroupDTO createGroup(Integer userId, CreateResearchGroupRequest request);

    // Admin duyệt nhóm
    ResearchGroupDTO approveGroup(Integer groupId);

    // Admin từ chối nhóm
    ResearchGroupDTO rejectGroup(Integer groupId, String reason);

    // Cập nhật thông tin nhóm (Leader hoặc Admin)
    ResearchGroupDTO updateGroup(Integer groupId, Integer userId, UpdateResearchGroupRequest request);

    // Xóa nhóm (Admin)
    void deleteGroup(Integer groupId);

    // Thêm thành viên (Leader hoặc Admin)
    ResearchGroupDTO addMember(Integer groupId, Integer userId, Integer memberId);

    // Xóa thành viên (Leader hoặc Admin)
    ResearchGroupDTO removeMember(Integer groupId, Integer userId, Integer memberId);

    // Lấy danh sách nhóm (có phân trang, filter)
    Page<ResearchGroupDTO> getAllGroups(String keyword, String status, Pageable pageable);

    // Lấy chi tiết nhóm
    ResearchGroupDTO getGroupById(Integer groupId);

    // Lấy danh sách nhóm của user
    List<ResearchGroupDTO> getGroupsByUser(Integer userId);

    // Lấy thống kê
    GroupStatistics getStatistics();

    // Cập nhật Google Sheet link (chỉ thành viên nhóm mới có quyền)
    ResearchGroupDTO updateGoogleSheetLink(Integer groupId, Integer userId, String googleSheetLink);

    // Cập nhật thông tin thành viên (role và participation rate)
    ResearchGroupDTO updateMemberInfo(Integer groupId, Integer userId, Integer memberId, String role,
            Integer participationRate);

    // Import thành viên từ Excel
    ResearchGroupDTO importMembersFromExcel(Integer groupId, Integer userId,
            org.springframework.web.multipart.MultipartFile file);

    // Document management methods
    List<ResearchGroupDocumentDTO> getDocumentsByGroupId(Integer groupId, Integer userId);
    ResearchGroupDocumentDTO createDocument(Integer groupId, Integer userId, CreateResearchGroupDocumentRequest request, MultipartFile file);
    ResearchGroupDocumentDTO updateDocument(Integer groupId, Integer documentId, Integer userId, CreateResearchGroupDocumentRequest request, MultipartFile file);
    void deleteDocument(Integer groupId, Integer documentId, Integer userId);

    class GroupStatistics {
        public long totalGroups;
        public long pendingGroups;
        public long approvedGroups;
        public long rejectedGroups;
    }
}
