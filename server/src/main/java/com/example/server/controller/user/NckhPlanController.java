package com.example.server.controller.user;

import com.example.server.DTO.response.SuccessResponseDTO;
import com.example.server.DTO.nckh.PlanSelectionStatisticsResponse;
import com.example.server.DTO.nckh.PlanSelectionWindowResponse;
import com.example.server.DTO.nckh.SelectPlanRequest;
import com.example.server.domain.nckh.UserPlanYear;
import com.example.server.service.nckh.UserPlanYearService;
import com.example.server.utils.PlanSelectionWindowUtil;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/nckh/plan")
public class NckhPlanController {

    private final UserPlanYearService service;

    public NckhPlanController(UserPlanYearService service) {
        this.service = service;
    }


    @GetMapping("/window")
    public PlanSelectionWindowResponse window() {
        PlanSelectionWindowResponse res = new PlanSelectionWindowResponse();
        res.isOpen         = PlanSelectionWindowUtil.isOpen();
        res.isPastDeadline = PlanSelectionWindowUtil.isPastDeadline();
        res.isOpeningDay   = PlanSelectionWindowUtil.isOpeningDay();
        res.isClosingDay   = PlanSelectionWindowUtil.isClosingDay();

        if (res.isPastDeadline) {
            res.message = "Đã hết thời hạn đăng ký phương án. Hệ thống đã tự động gán PA1.";
        } else if (!res.isOpen) {
            res.message = "Chưa đến thời gian đăng ký phương án. Thời gian đăng ký: 02/01 – 16/01 hàng năm.";
        } else if (res.isClosingDay) {
            res.message = "Hôm nay là ngày cuối cùng đăng ký phương án (16/01). Hãy đăng ký ngay!";
        } else if (res.isOpeningDay) {
            res.message = "Hôm nay là ngày đầu tiên mở đăng ký phương án (02/01).";
        } else {
            res.message = "Đang trong thời gian đăng ký phương án (02/01 – 16/01).";
        }
        return res;
    }
    @GetMapping("/email")
    public String window2() {

         service.sendReminderEmails(2026, false);
        return "OK";
    }

    @PostMapping("/select")
    public UserPlanYear select(@RequestBody SelectPlanRequest req, @RequestParam Integer userId) {
        return service.selectAndLock(userId, req.planId, req.academicYear);
    }

    @GetMapping("/current")
    public ResponseEntity<?> current(@RequestParam Integer userId, @RequestParam Integer year) {
        UserPlanYear userPlanYear = service.getPlanCurrent(userId, year);
        if (userPlanYear != null)  return ResponseEntity.ok(new SuccessResponseDTO<>(userPlanYear, "Lấy thành công thông tin phương án năm " + year));
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Bạn chưa chọn phương án cho năm này");
    }

    @GetMapping("/statistics")
    public PlanSelectionStatisticsResponse statistics(@RequestParam Integer year) {
        return service.getPlanStatistics(year);
    }

    @GetMapping("/statistics/export-excel")
    public ResponseEntity<Resource> exportStatisticsExcel(@RequestParam Integer year) {
        byte[] excelData = service.exportPlanStatisticsExcel(year);
        ByteArrayResource resource = new ByteArrayResource(excelData);

        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd-MM-yyyy"));
        String fileName = "ThongKePhuongAnNCKH_" + year + "_" + timestamp + ".xlsx";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentDispositionFormData("attachment", fileName);
        headers.setContentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));

        return ResponseEntity.ok()
                .headers(headers)
                .contentLength(excelData.length)
                .body(resource);
    }
}
