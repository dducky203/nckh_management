package com.example.server.DTO.nckh;

import java.time.LocalDate;

public class CreateActivityRequest {
    public Integer academicYear;
    public Integer researchGroupId; // nullable
    public String catalogCode; // bắt buộc: nhận trực tiếp tieuChiCode từ FE
    public String activityType; // SEMINAR, CONFERENCE, INTL_PAPER, VN_PAPER, PROCEEDING, REVIEW_PAPER, TECH_CONSULT, TECH_PROCEDURE, PROPOSAL

    // Các lựa chọn để map ra type_code (catalogCode)
    public String conferenceRole; // ORG, PRES
    public String conferenceLevel; // INTL, NAT, ACAD
    public String intlPaperCategory; // WOS, SCOPUS, ENG_ACAD, OTHER, CITATION
    public String vnPaperCategory; // ACADEMY, OTHER
    public String proceedingLevel; // INTL, NAT, ACAD
    public String proposalLevel; // NAT, MINISTRY

    public Double qty; // nullable -> default 1
    public String title;
    public String description;

    // Trường chung cho 9 chức năng khai báo
    public String publicationName; // tên tạp chí/kỷ yếu/nơi công bố
    public LocalDate activityDate; // ngày xuất bản/trình bày/hoàn thành/cấp
    public String venue; // địa điểm/cơ quan/đơn vị thụ hưởng
    public String identifierCode; // ISSN/DOI/ISBN/số quyết định
    public String externalLink; // link bài báo/tài liệu tham khảo
    public String proofFileUrl; // file minh chứng (pdf/doc...)
    public String proofImageUrl; // hình minh chứng
    public String detailsJson; // dữ liệu mở rộng theo chức năng, lưu JSON text
}
