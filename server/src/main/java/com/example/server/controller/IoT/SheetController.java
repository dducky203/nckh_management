package com.example.server.controller.IoT;


import com.example.server.service.EmailService;
import com.example.server.service.IoT.GoogleSheetsService;
import com.example.server.service.IoT.SheetReaderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Controller
public class SheetController {

    @Autowired
    private SheetReaderService sheetReaderService;
    @Autowired
    GoogleSheetsService googleSheetsService;
    @Autowired
    EmailService emailService;
    // data of date 11/5
    //https://docs.google.com/spreadsheets/d/1dL-SakZz19ODWMh7ymrGP-hmf9AACUo8HKrWhJfxP2o/edit?gid=0#gid=0
//    MQ5: ~~600 → mức cảnh báo nhẹ, có thể có khí gas/khí đốt rò rỉ nhẹ.
//    MQ6: 450–470 → vẫn trong mức bình thường/cảnh báo nhẹ.
//    MQ7: >1700 ➜ NGUY HIỂM, hàm lượng khí CO cao có thể gây ảnh hưởng sức khỏe nếu tiếp xúc lâu.

    // data test : https://docs.google.com/spreadsheets/d/1ydaR6ahW4UuZZ9lks1TXLtkmkX2vbhDV_3oiO-08aUk/edit?hl=vi&gid=0#gid=0
    @GetMapping("/sheet")
    public String readSheet(@RequestParam(required = false) String selectedDate,
                            @RequestParam(required = false) String fromTime,
                            @RequestParam(required = false) String toTime,
                            Model model) throws Exception {

        //  Định danh Google Sheet và phạm vi cần đọc
//        String spreadsheetId = "1dL-SakZz19ODWMh7ymrGP-hmf9AACUo8HKrWhJfxP2o";
//        String range = "data_collection_sheet!A2:H";
        //test
        String spreadsheetId = "1ydaR6ahW4UuZZ9lks1TXLtkmkX2vbhDV_3oiO-08aUk";
        String range = "test!A2:H";
        List<List<Object>> sheetData = googleSheetsService.readSheetData(spreadsheetId, range);

        //  Nếu chưa chọn ngày thì lấy ngày hôm nay (ISO format cho input date)
        if (selectedDate == null || selectedDate.isEmpty()) {
            selectedDate = LocalDate.now().toString(); // yyyy-MM-dd
        }

        // Format ngày từ yyyy-MM-dd → dd/MM/yyyy để so khớp với dữ liệu trong Sheet
        DateTimeFormatter inputFormat = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate inputDate = LocalDate.parse(selectedDate, inputFormat);
        String formattedDate = inputDate.format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));

        //  Chuẩn bị danh sách dữ liệu cho biểu đồ
        List<String> labels = new ArrayList<>();
        List<Double> temps = new ArrayList<>();
        List<Double> humidity = new ArrayList<>();
        List<Integer> mq5 = new ArrayList<>();
        List<Integer> mq6 = new ArrayList<>();
        List<Integer> mq7 = new ArrayList<>();

        //  Duyệt từng dòng trong sheet và lọc theo ngày, giờ nếu có
        for (List<Object> row : sheetData) {
            if (row.size() >= 8 && row.get(0).toString().trim().equals(formattedDate)) {
                String time = row.get(1).toString().trim(); // Ví dụ: 9:00:33

                // Lọc theo khung giờ nếu có
                if (fromTime != null && !fromTime.isEmpty() &&
                        toTime != null && !toTime.isEmpty()) {
                    try {
                        LocalTime rowTime = LocalTime.parse(time, DateTimeFormatter.ofPattern("H:mm:ss"));
                        LocalTime from = LocalTime.parse(fromTime);
                        LocalTime to = LocalTime.parse(toTime);

                        if (rowTime.isBefore(from) || rowTime.isAfter(to)) {
                            continue;
                        }
                    } catch (Exception e) {
                        System.out.println("Lỗi khi parse giờ: " + e.getMessage());
                        continue;
                    }
                }

                // Thêm dữ liệu
                labels.add(time);
                temps.add(Double.parseDouble(row.get(3).toString()));
                humidity.add(Double.parseDouble(row.get(4).toString()));
                mq5.add(Integer.parseInt(row.get(5).toString()));
                mq6.add(Integer.parseInt(row.get(6).toString()));
                mq7.add(Integer.parseInt(row.get(7).toString()));
            }
        }

        //  Truyền dữ liệu sang View
        model.addAttribute("labels", labels);
        model.addAttribute("temps", temps);
        model.addAttribute("humidity", humidity);
        model.addAttribute("mq5", mq5);
        model.addAttribute("mq6", mq6);
        model.addAttribute("mq7", mq7);

        model.addAttribute("selectedDate", selectedDate);
        model.addAttribute("fromTime", fromTime);
        model.addAttribute("toTime", toTime);

        //  Nếu không có dữ liệu thì thông báo
        if (labels.isEmpty()) {
            model.addAttribute("noData", true);
        }
        // Kiểm tra giá trị gần nhất nếu có dữ liệu
        if (!mq5.isEmpty()) {
            int lastIndex = mq5.size() - 1;

            int latestMq5 = mq5.get(lastIndex);
            int latestMq6 = mq6.get(lastIndex);
            int latestMq7 = mq7.get(lastIndex);

            boolean isDangerous = latestMq5 > 600 || latestMq6 > 500 || latestMq7 >1700;

            if (isDangerous) {
                // Gửi email cảnh báo
                String subject = "CẢNH BÁO Ô NHIỄM KHÍ";
                String content = "Phát hiện giá trị cảm biến vượt ngưỡng vào lúc " + labels.get(lastIndex) +
                        "\nMQ5(CH4): " + latestMq5 +
                        "\nMQ6: " + latestMq6 +
                        "\nMQ7(CO): " + latestMq7;

                // Gửi tới gmail abc@gmail.com
                emailService.sendSimpleEmail("ngominh041103@gmail.com", subject, content);
            }
        }

        return "/sheet/sheet";
    }






}

