package com.example.server.controller.ResearchGroup;

import com.example.server.DTO.request.CreateResearchGroupDocumentRequest;
import com.example.server.DTO.request.CreateResearchGroupRequest;
import com.example.server.DTO.request.UpdateResearchGroupRequest;
import com.example.server.DTO.response.ResearchGroupDocumentDTO;
import com.example.server.DTO.response.ResearchGroupDTO;
import com.example.server.DTO.SuccessResponseDTO;
import com.example.server.domain.ResearchGroupMember;
import com.example.server.exception.ExcelValidationException;
import com.example.server.repository.ResearchGroupMemberRepository;
import com.example.server.service.ResearchGroupService;
import com.example.server.utils.SecurityUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/research-groups")
@RequiredArgsConstructor
public class ResearchGroupController {

    private final ResearchGroupService researchGroupService;
    private final ResearchGroupMemberRepository researchGroupMemberRepository;

    /**
     * User tạo nhóm mới (chờ duyệt)
     */
    @PostMapping("/create")
    public ResponseEntity<SuccessResponseDTO<ResearchGroupDTO>> createGroup(
            @Valid @RequestBody CreateResearchGroupRequest request) {
        Integer userId = SecurityUtils.getCurrentUserId();
        if (userId == null) {
            throw new RuntimeException("Vui lòng đăng nhập");
        }

        ResearchGroupDTO group = researchGroupService.createGroup(userId, request);
        return ResponseEntity.ok(new SuccessResponseDTO<>(group, "Tạo nhóm thành công! Chờ admin duyệt."));
    }
    /**
     * Lấy chi tiết nhóm
     */
    @GetMapping("/{groupId}")
    public ResponseEntity<SuccessResponseDTO<ResearchGroupDTO>> getGroupById(
            @PathVariable Integer groupId) {
        ResearchGroupDTO group = researchGroupService.getGroupById(groupId);
        return ResponseEntity.ok(new SuccessResponseDTO<>(group, "Lấy chi tiết nhóm thành công"));
    }

    @GetMapping("/my-group")
    public ResponseEntity<SuccessResponseDTO<List<ResearchGroupDTO> >> getMyGroup() {
        List<ResearchGroupDTO> groups = new ArrayList<>();
        Integer userId = SecurityUtils.getCurrentUserId();
        List<ResearchGroupMember>  researchGroupMembers = researchGroupMemberRepository.findAllByUserId(userId);
        for(ResearchGroupMember dto : researchGroupMembers){
            ResearchGroupDTO group = researchGroupService.getGroupById(dto.getGroupId());
            groups.add(group);
        }
        return ResponseEntity.ok(new SuccessResponseDTO<>(groups, "Lấy danh sách nhóm thành công"));
    }

    /**
     * Lấy danh sách nhóm của user hiện tại
     */
    @GetMapping("/my-groups")
    public ResponseEntity<SuccessResponseDTO<List<ResearchGroupDTO>>> getMyGroups() {
        Integer userId = SecurityUtils.getCurrentUserId();
        if (userId == null) {
            throw new RuntimeException("Vui lòng đăng nhập");
        }

        List<ResearchGroupDTO> groups = researchGroupService.getGroupsByUser(userId);
        return ResponseEntity.ok(new SuccessResponseDTO<>(groups, "Lấy danh sách nhóm thành công"));
    }

    /**
     * Cập nhật thông tin nhóm (Leader hoặc Admin)
     */
    @PutMapping("/{groupId}")
    public ResponseEntity<SuccessResponseDTO<ResearchGroupDTO>> updateGroup(
            @PathVariable Integer groupId,
            @Valid @RequestBody UpdateResearchGroupRequest request) {
        Integer userId = SecurityUtils.getCurrentUserId();
        if (userId == null) {
            throw new RuntimeException("Vui lòng đăng nhập");
        }

        ResearchGroupDTO group = researchGroupService.updateGroup(groupId, userId, request);
        return ResponseEntity.ok(new SuccessResponseDTO<>(group, "Cập nhật nhóm thành công"));
    }

    /**
     * Thêm thành viên vào nhóm (Leader hoặc Admin)
     */
    @PostMapping("/{groupId}/members/{memberId}")
    public ResponseEntity<SuccessResponseDTO<ResearchGroupDTO>> addMember(
            @PathVariable Integer groupId,
            @PathVariable Integer memberId) {
        Integer userId = SecurityUtils.getCurrentUserId();
        if (userId == null) {
            throw new RuntimeException("Vui lòng đăng nhập");
        }

        ResearchGroupDTO group = researchGroupService.addMember(groupId, userId, memberId);
        return ResponseEntity.ok(new SuccessResponseDTO<>(group, "Thêm thành viên thành công"));
    }

    /**
     * Xóa thành viên khỏi nhóm (Leader hoặc Admin)
     */
    @DeleteMapping("/{groupId}/members/{memberId}")
    public ResponseEntity<SuccessResponseDTO<ResearchGroupDTO>> removeMember(
            @PathVariable Integer groupId,
            @PathVariable Integer memberId) {
        Integer userId = SecurityUtils.getCurrentUserId();
        if (userId == null) {
            throw new RuntimeException("Vui lòng đăng nhập");
        }

        ResearchGroupDTO group = researchGroupService.removeMember(groupId, userId, memberId);
        return ResponseEntity.ok(new SuccessResponseDTO<>(group, "Xóa thành viên thành công"));
    }

    /**
     * Cập nhật Google Sheet link (chỉ thành viên nhóm mới có quyền)
     */
    @PutMapping("/{groupId}/google-sheet-link")
    public ResponseEntity<SuccessResponseDTO<ResearchGroupDTO>> updateGoogleSheetLink(
            @PathVariable Integer groupId,
            @RequestBody Map<String, String> request) {
        Integer userId = SecurityUtils.getCurrentUserId();
        if (userId == null) {
            throw new RuntimeException("Vui lòng đăng nhập");
        }

        String googleSheetLink = request.get("link");
        ResearchGroupDTO group = researchGroupService.updateGoogleSheetLink(groupId, userId, googleSheetLink);
        return ResponseEntity.ok(new SuccessResponseDTO<>(group, "Cập nhật link Google Sheet thành công"));
    }

    /**
     * Cập nhật thông tin thành viên (role và participation rate)
     */
    @PutMapping("/{groupId}/members/{memberId}")
    public ResponseEntity<SuccessResponseDTO<ResearchGroupDTO>> updateMemberInfo(
            @PathVariable Integer groupId,
            @PathVariable Integer memberId,
            @RequestBody Map<String, Object> request) {
        Integer userId = SecurityUtils.getCurrentUserId();
        if (userId == null) {
            throw new RuntimeException("Vui lòng đăng nhập");
        }

        String role = request.get("role") != null ? request.get("role").toString() : null;
        Integer participationRate = request.get("participationRate") != null
                ? Integer.parseInt(request.get("participationRate").toString())
                : null;

        ResearchGroupDTO group = researchGroupService.updateMemberInfo(groupId, userId, memberId, role,
                participationRate);
        return ResponseEntity.ok(new SuccessResponseDTO<>(group, "Cập nhật thông tin thành viên thành công"));
    }

    /**
     * Import thành viên từ Excel
     */

    @GetMapping("/export-template")
    public ResponseEntity<Resource> exportTemplate() {
        try {

            byte[] excelData = researchGroupService.exportTemplate();
            ByteArrayResource resource = new ByteArrayResource(excelData);

            HttpHeaders headers = new HttpHeaders();
                headers.setContentDispositionFormData("attachment", "[Template]Import thành viên.xlsx");
            headers.setContentType(
                    MediaType.parseMediaType(
                            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));

            return ResponseEntity.ok()
                    .headers(headers)
                    .contentLength(excelData.length)
                    .body(resource);
        } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }


    @PostMapping("/{groupId}/members/import")
    public ResponseEntity<?> importMembersFromExcel(
            @PathVariable Integer groupId,
            @RequestParam("file") MultipartFile file) {
        try {
            Integer userId = SecurityUtils.getCurrentUserId();
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Vui lòng đăng nhập để thực hiện chức năng này");
            }

            if (file == null || file.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body("File Excel không được để trống");
            }

            ResearchGroupDTO group = researchGroupService.importMembersFromExcel(groupId, userId, file);

            return ResponseEntity.ok(new SuccessResponseDTO<>(group, "Import thành viên thành công"));

        } catch (ExcelValidationException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=error_details.xlsx")
                    .body(e.getMessage());
        } catch (java.nio.file.NoSuchFileException e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi hệ thống: File tạm đã bị xóa trước khi xử lý. Vui lòng thử lại.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Đã xảy ra lỗi không mong muốn: " + e.getMessage());
        }
    }

    /**
     * Lấy danh sách documents của nhóm (chỉ thành viên nhóm mới xem được)
     */
    @GetMapping("/{groupId}/documents")
    public ResponseEntity<SuccessResponseDTO<List<ResearchGroupDocumentDTO>>> getDocuments(
            @PathVariable Integer groupId) {
        Integer userId = SecurityUtils.getCurrentUserId();
        if (userId == null) {
            throw new RuntimeException("Vui lòng đăng nhập");
        }

        List<ResearchGroupDocumentDTO> documents = researchGroupService.getDocumentsByGroupId(groupId, userId);
        return ResponseEntity.ok(new SuccessResponseDTO<>(documents, "Lấy danh sách documents thành công"));
    }

    /**
     * Tạo document mới (chỉ thành viên nhóm mới upload được)
     */
    @PostMapping("/{groupId}/documents")
    public ResponseEntity<SuccessResponseDTO<ResearchGroupDocumentDTO>> createDocument(
            @PathVariable Integer groupId,
            @RequestParam("documentName") String documentName,
            @RequestParam("documentType") String documentType,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam("file") MultipartFile file) {
        Integer userId = SecurityUtils.getCurrentUserId();
        if (userId == null) {
            throw new RuntimeException("Vui lòng đăng nhập");
        }

        CreateResearchGroupDocumentRequest request = new CreateResearchGroupDocumentRequest();
        request.setDocumentName(documentName);
        request.setDocumentType(documentType);
        request.setDescription(description);

        ResearchGroupDocumentDTO document = researchGroupService.createDocument(groupId, userId, request, file);
        return ResponseEntity.ok(new SuccessResponseDTO<>(document, "Tạo document thành công"));
    }

    /**
     * Cập nhật document (chỉ thành viên nhóm mới cập nhật được)
     */
    @PutMapping("/{groupId}/documents/{documentId}")
    public ResponseEntity<SuccessResponseDTO<ResearchGroupDocumentDTO>> updateDocument(
            @PathVariable Integer groupId,
            @PathVariable Integer documentId,
            @RequestParam(value = "documentName", required = false) String documentName,
            @RequestParam(value = "documentType", required = false) String documentType,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "file", required = false) MultipartFile file) {
        Integer userId = SecurityUtils.getCurrentUserId();
        if (userId == null) {
            throw new RuntimeException("Vui lòng đăng nhập");
        }

        CreateResearchGroupDocumentRequest request = new CreateResearchGroupDocumentRequest();
        request.setDocumentName(documentName);
        request.setDocumentType(documentType);
        request.setDescription(description);

        ResearchGroupDocumentDTO document = researchGroupService.updateDocument(groupId, documentId, userId, request, file);
        return ResponseEntity.ok(new SuccessResponseDTO<>(document, "Cập nhật document thành công"));
    }

    /**
     * Xóa document (chỉ thành viên nhóm mới xóa được)
     */
    @DeleteMapping("/{groupId}/documents/{documentId}")
    public ResponseEntity<SuccessResponseDTO<String>> deleteDocument(
            @PathVariable Integer groupId,
            @PathVariable Integer documentId) {
        Integer userId = SecurityUtils.getCurrentUserId();
        if (userId == null) {
            throw new RuntimeException("Vui lòng đăng nhập");
        }

        researchGroupService.deleteDocument(groupId, documentId, userId);
        return ResponseEntity.ok(new SuccessResponseDTO<>("Xóa document thành công", "Xóa document thành công"));
    }
}
