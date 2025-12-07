package com.example.server.controller.ResearchGroup;

import com.example.server.DTO.SuccessResponseDTO;
import com.example.server.DTO.response.ResearchGroupDTO;
import com.example.server.service.ResearchGroupService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/research-groups")
@RequiredArgsConstructor
public class ResearchGroupAdminController {

    private final ResearchGroupService researchGroupService;

    /**
     * Admin duyệt nhóm
     */
    @PutMapping("/{groupId}/approve")
    public ResponseEntity<SuccessResponseDTO<ResearchGroupDTO>> approveGroup(
            @PathVariable Integer groupId
    ) {
        ResearchGroupDTO group = researchGroupService.approveGroup(groupId);
        return ResponseEntity.ok(new SuccessResponseDTO<>(group, "Duyệt nhóm thành công"));
    }

    /**
     * Admin từ chối nhóm
     */
    @PutMapping("/{groupId}/reject")
    public ResponseEntity<SuccessResponseDTO<ResearchGroupDTO>> rejectGroup(
            @PathVariable Integer groupId,
            @RequestParam(required = false) String reason
    ) {
        ResearchGroupDTO group = researchGroupService.rejectGroup(groupId, reason);
        return ResponseEntity.ok(new SuccessResponseDTO<>(group, "Từ chối nhóm thành công"));
    }

    /**
     * Admin xóa nhóm
     */
    @DeleteMapping("/{groupId}")
    public ResponseEntity<SuccessResponseDTO<Void>> deleteGroup(
            @PathVariable Integer groupId
    ) {
        researchGroupService.deleteGroup(groupId);
        return ResponseEntity.ok(new SuccessResponseDTO<>(null, "Xóa nhóm thành công"));
    }
}
