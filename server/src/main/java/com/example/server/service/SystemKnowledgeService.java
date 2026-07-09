package com.example.server.service;



import org.springframework.stereotype.Service;

import com.example.server.utils.Constants;

import java.text.Normalizer;

import java.util.ArrayList;

import java.util.List;

import java.util.Locale;

import java.util.Optional;



@Service

public class SystemKnowledgeService {



    private static class KnowledgeRule {

        private final List<String> keywords;

        private final int minMatches;

        private final String answer;



        private KnowledgeRule(List<String> keywords, int minMatches, String answer) {

            this.keywords = keywords;

            this.minMatches = minMatches;

            this.answer = answer;

        }

    }



    private final List<KnowledgeRule> rules = buildRules();



    public Optional<String> answer(String question) {

        if (question == null || question.isBlank()) {

            return Optional.empty();

        }



        String normalized = normalize(question);

        if (!isSystemRelated(normalized)) {

            return Optional.empty();

        }



        for (KnowledgeRule rule : rules) {

            int matched = 0;

            for (String keyword : rule.keywords) {

                if (normalized.contains(keyword)) {

                    matched++;

                }

            }

            if (matched >= rule.minMatches) {

                return Optional.of(rule.answer);

            }

        }



        // Cau hoi co lien quan he thong nhung khong du confident -> fallback Gemini.

        return Optional.empty();

    }



    private boolean isSystemRelated(String normalized) {

        String[] markers = {

                "he thong", "nckh", "dinh muc", "tieu chi", "phuong an", "su kien",

                "nhom nghien cuu", "research group", "import excel", "ai scan",

                "chatbot", "quyen", "admin", "duyet", "khai bao", "bao cao",

                "ho so", "dang nhap", "quen mat khau", "menu", "trang",

                "year quota", "group quota", "approval", "plan statistics",

                "research", "news", "tin tuc", "user manager", "profile", "excel",

                "api", "rest", "endpoint",

                "assistant", "tro ly", "ban la ai", "ten cua ban",

                "dashboard", "cong tac", "contributor", "minh chung", "nop ho so",

                "wos", "scopus", "bai bao", "hoi thao", "seminar", "de tai",

                "year quota", "cau hinh dinh muc", "pl2", "phu luc",

                "chat phai", "token", "jwt", "bao mat"

        };

        for (String marker : markers) {

            if (normalized.contains(marker)) {

                return true;

            }

        }

        return false;

    }



    private List<KnowledgeRule> buildRules() {

        List<KnowledgeRule> list = new ArrayList<>();



        list.add(new KnowledgeRule(

                List.of("assistant", "tro ly nckh", "tro li nckh", "ban la ai", "ten cua ban",

                        "chatbot la gi", "ai la ban"),

                1,

                """

                Tôi là **%s** (vai trò hội thoại: `%s`) — trợ lý NCKH tích hợp trên hệ thống này.

                Tôi hỗ trợ bạn tìm đường dẫn chức năng, cách khai báo hoạt động, định mức, phương án năm, nhóm nghiên cứu, sự kiện, tin tức và các thao tác người dùng thường gặp. Khi phù hợp, hệ thống trả lời trước bằng tri thức nội bộ; các câu phức tạp hơn có thể được bổ trợ thêm bởi mô hình AI.

                Lưu ý: **%s** không thay thế quy định hay quyết định của đơn vị — vui lòng xác nhận với cán bộ quản lý NCKH khi cần.

                """.formatted(Constants.CHAT_ASSISTANT_DISPLAY_NAME, Constants.CHAT_ASSISTANT_ROLE,

                        Constants.CHAT_ASSISTANT_DISPLAY_NAME)

        ));



        list.add(new KnowledgeRule(

                List.of("chuc nang", "co nhung gi", "module", "menu", "he thong nckh"),

                1,

                """

                Các phần **người dùng thường** hay dùng trên giao diện web:

                - **Tổng quan hoạt động NCKH**: `/activity/user`

                - **Khai báo hoạt động** (các loại): `/activity/declarations/...`

                - **Định mức theo phương á** (xem theo chức danh & PA đã chọn): `/activity/standards`

                - **Định mức nhóm** (NCM / Xuất sắc / Tinh hoa): `/activity/group-quota`

                - **Danh sách & tạo nhóm nghiên cứu**: `/research-groups`

                - **Hồ sơ / tài liệu nhóm**: `/research-groups/profile`

                - **Sự kiện** (xem, đăng ký…): `/events` và tạo mới `/events/create`

                - **Tin tức** (đọc): `/news`, chi tiết `/news/details/{id}`

                - **Hồ sơ cá nhân**: `/profile`

                - **Trợ lí NCKH** (ô chat nổi; cần đăng nhập; API: `POST /api/chatbot/chat`)



                Các màn hình **chỉ dành cho tài khoản quản trị** (duyệt hồ sơ, thống kê riêng admin, cấu hình định mức năm…) không liệt kê ở đây — tài khoản thường không thấy trong menu.

                """

        ));



        list.add(new KnowledgeRule(

                List.of("api", "rest", "endpoint", "http", "backend"),

                1,

                """

                Backend đặt REST dưới tiền tố **`/api`** (theo `spring.mvc.servlet.path`). Các nhóm **thường dùng cho người dùng nghiệp vụ** (không phải quản trị viên):

                - **Đăng nhập**: `POST /api/auth/login`, `POST /api/auth/logout`

                - **Hồ sơ**: `GET /api/users/profile`, `POST /api/users/update-profile`

                - **Hoạt động NCKH**: ví dụ `GET/POST /api/nckh/activities`, `GET /api/nckh/activity-options`, `GET /api/nckh/activities/my`, `GET /api/nckh/dashboard`, `POST /api/nckh/activities/{id}/submit`, cộng tác viên…

                - **Phương án năm**: `GET /api/nckh/plan/window`, `GET /api/nckh/plan/current`, `POST /api/nckh/plan/select`, `GET /api/nckh/plan/statistics`

                - **Xem định mức tiêu chí (đọc)**: `GET /api/nckh/tieu-chi-dinh-muc` (tham số năm, phương án, chức danh)

                - **Định mức nhóm**: `GET /api/research-groups/quota/my-quota`, `GET /api/research-groups/quota/my-stats`, `POST /api/research-groups/quota/my-calculate`, …

                - **Nhóm NC (người dùng)**: `GET /api/research-groups`, `POST /api/research-groups/create`, chi tiết `GET /api/research-groups/{id}`, …

                - **Sự kiện công khai**: `GET /api/events`, `GET /api/events/search`, …

                - **Tin tức công khai**: `GET /api/public/news`, `GET /api/public/news/{id}`

                - **Trợ lí NCKH (chat, đã đăng nhập)**: `POST /api/chatbot/chat`



                Các đường **quản trị** (duyệt tin, quản lý phòng, danh sách user toàn hệ thống, …) thuộc controller `admin` — không nằm trong danh sách dành cho user thường.

                """

        ));



        list.add(new KnowledgeRule(

                List.of("quen mat khau", "reset mat khau", "doi mat khau", "dang nhap"),

                1,

                """

                Bạn có thể reset mật khẩu theo các bước:

                - Vào trang **Đăng nhập**.

                - Chọn **Quên mật khẩu**.

                - Nhập email đã đăng ký.

                - Mở email để lấy link reset và đặt mật khẩu mới.



                Nếu không nhận được email, vui lòng kiểm tra thư rác hoặc liên hệ admin khoa.

                """

        ));



        list.add(new KnowledgeRule(

                List.of("tao su kien", "them su kien", "event", "seminar", "hoi thao", "events/create"),

                2,

                """

                Để tạo sự kiện nghiên cứu:

                - Vào menu **Sự kiện** -> **Tạo sự kiện** hoặc vào `/events/create`.

                - Nhập thông tin cơ bản: tên, loại sự kiện, thời gian, địa điểm.

                - Thêm thành viên/khách mời.

                - Upload tài liệu minh chứng.

                - Lưu và chờ duyệt (nếu quy trình của đơn vị yêu cầu phê duyệt).



                Nếu bạn không thấy nút tạo sự kiện, tài khoản có thể chưa đủ quyền.

                """

        ));



        list.add(new KnowledgeRule(

                List.of("quan ly su kien", "duyet su kien", "events/manage", "event dashboard"),

                1,

                """

                Duyệt sự kiện, thống kê và quản lý toàn bộ danh sách sự kiện là **chức năng dành cho cán bộ quản trị được phân công**.

                Người dùng thường: xem lịch tại `/events`, đăng ký/tham gia theo hướng dẫn từng sự kiện, hoặc tạo sự kiện mới tại `/events/create` nếu được cấp quyền.

                """

        ));



        list.add(new KnowledgeRule(

                List.of("nhom nghien cuu", "research group", "tao nhom", "thanh vien nhom"),

                2,

                """

                Chức năng nhóm nghiên cứu hỗ trợ:

                - Xem danh sách nhóm được công bố.

                - Đăng ký tạo nhóm (chờ duyệt nếu quy trình có bước này).

                - Theo dõi thành viên, tài liệu, hồ sơ nhóm.



                Trên web: **`/research-groups`** (danh sách, thao tác của bạn) và **`/research-groups/profile`** (hồ sơ nhóm / tài liệu).

                """

        ));



        list.add(new KnowledgeRule(

                List.of("ho so nhom", "research-groups/profile", "tai lieu nhom", "google sheet"),

                1,

                """

                Hồ sơ nhóm nghiên cứu nằm tại: `/research-groups/profile`.

                Chức năng chính:

                - Xem thông tin nhóm của bạn.

                - Quản lý tài liệu nhóm (thông báo, hồ sơ, quyết định...).

                - Cập nhật link Google Sheet (nếu nhóm có sử dụng).

                """

        ));



        list.add(new KnowledgeRule(

                List.of("dinh muc theo nam", "year quota", "chinh sua tieu chi", "import excel hang loat"),

                2,

                """

                Với **người dùng tra cứu định mức** (không nhập liệu hành chính):

                - Xem bảng định mức theo phương án đã chọn: **`/activity/standards`**

                - Xem định mức theo nhóm (NCM / Xuất sắc / Tinh hoa): **`/activity/group-quota`**



                Việc **cấu hình định mức theo năm**, import Excel hàng loạt hoặc chỉnh sửa dữ liệu gốc là nghiệp vụ **dành cho cán bộ quản trị** được giao — không nằm trong luồng user thường.

                """

        ));



        list.add(new KnowledgeRule(

                List.of("ai scan", "quet ai", "import ai", "pdf", "anh", "dinh muc"),

                2,

                """

                **Quét AI** (ảnh/PDF → bảng định mức) phục vụ **nhập liệu hàng loạt** do cán bộ phụ trách cấu hình thực hiện.

                **Người dùng thường** không cần bước này: hãy xem định mức đã ban hành tại **`/activity/standards`** (cá nhân) hoặc **`/activity/group-quota`** (nhóm).



                Mẹo cho bên vận hành: ảnh rõ nét, bảng không bị cắt sẽ cho kết quả quét đầy đủ hơn.

                """

        ));



        list.add(new KnowledgeRule(

                List.of("duyet khai bao", "approval", "admin/approval", "tu choi", "phe duyet"),

                1,

                """

                **Phê duyệt / từ chối khai báo NCKH** do **cán bộ được phân quyền** thực hiện trên cổng quản trị NCKH.

                Người dùng thường: lập và nộp khai báo từ các trang `/activity/declarations/...`, theo dõi trạng thái tại **`/activity/user`** hoặc dashboard cá nhân.

                """

        ));



        list.add(new KnowledgeRule(

                List.of("thong ke phuong an", "plan statistics", "admin/plan-statistics"),

                1,

                """

                **Thống kê tổng hợp theo phương án** (báo cáo theo năm, export nội bộ…) thường dành cho **quản trị / lãnh đạo đơn vị**.

                Ở phía user nghiệp vụ, bạn chọn phương án trong khung đăng ký qua luồng **`/activity/standards`** và API **`GET /api/nckh/plan/window`**, **`/api/nckh/plan/current`**, **`POST /api/nckh/plan/select`** — không cần màn hình thống kê tổng.

                """

        ));



        list.add(new KnowledgeRule(

                List.of("khai bao", "declaration", "activity/declarations", "nckh activity"),

                1,

                """

                Khai báo hoạt động NCKH nằm ở các route:

                - `/activity/declarations/seminar`

                - `/activity/declarations/conference`

                - `/activity/declarations/international-paper`

                - `/activity/declarations/vietnamese-paper`

                - `/activity/declarations/proceeding`

                - `/activity/declarations/review-paper`

                - `/activity/declarations/tech-consult`

                - `/activity/declarations/tech-procedure`

                - `/activity/declarations/proposal`

                - `/activity/declarations/approved-task`

                - `/activity/declarations/council`

                - `/activity/declarations/expert-invite`

                - `/activity/declarations/other-activity`



                Cách làm: chọn đúng loại khai báo -> nhập thông tin + minh chứng -> lưu/nộp duyệt.

                """

        ));



        list.add(new KnowledgeRule(

                List.of("ncm", "xuat sac", "tinh hoa", "group quota", "dinh muc nhom"),

                2,

                """

                Chức năng **Định mức nhóm nghiên cứu** hỗ trợ:

                - Nhóm NCM, Xuất sắc, Tinh hoa.

                - Xem bảng hệ số theo chức danh.

                - Tính giờ quy đổi cá nhân theo nhóm.

                - Xem hệ số từng thành viên.



                Đường dẫn giao diện: **`/activity/group-quota`**.

                REST gợi ý: **`/api/research-groups/quota/my-quota`**, **`my-stats`**, …

                """

        ));



        list.add(new KnowledgeRule(

                List.of("tin tuc", "news", "news/manager", "news/details"),

                1,

                """

                Với **người đọc tin**:

                - Danh sách: **`/news`**

                - Chi tiết: **`/news/details/{id}`**

                - API: **`GET /api/public/news`**, **`GET /api/public/news/{id}`**



                Đăng bài / quản lý kho tin là nghiệp vụ **quản trị** — không mô tả API đó trong phần dành cho user thường.

                """

        ));



        list.add(new KnowledgeRule(

                List.of("ho so", "profile", "thong tin ca nhan", "doi mat khau ca nhan"),

                1,

                """

                Hồ sơ cá nhân ở route: **`/profile`**.

                Bạn có thể:

                - Cập nhật thông tin cá nhân.

                - Đổi mật khẩu.

                - Cập nhật avatar/hồ sơ liên quan.



                API: chủ yếu **`GET /api/users/profile`**, **`POST /api/users/update-profile`**.

                """

        ));



        list.add(new KnowledgeRule(

                List.of("quan ly nguoi dung", "user manager", "user/manager", "nhan su"),

                1,

                """

                **Quản lý toàn bộ người dùng** (tìm user, khóa, phân quyền hệ thống) là chức năng **quản trị** — không nằm trong tài liệu API dành cho user thường.

                Bạn có thể **tự cập nhật hồ sơ của chính mình** tại **`/profile`** với **`/api/users/profile`** và **`/api/users/update-profile`**.

                """

        ));



        list.add(new KnowledgeRule(

                List.of("quyen", "phan quyen", "admin", "truong khoa", "pho khoa", "can bo", "sinh vien"),

                2,

                """

                Hệ thống có phân quyền theo vai trò:

                - **Role hệ thống** (trên tài khoản): **admin** (quản trị) → **assistant** (**Trợ lí NCKH**, vận hành NCKH, sau admin) → **user** (người dùng thường).

                - **Trưởng khoa** (vai trò/chức danh): quyền nghiệp vụ cao trong đơn vị.

                - **Phó khoa**: quản lý/phê duyệt theo phạm vi.

                - **Cán bộ khoa**: tạo khai báo, thao tác nghiệp vụ phù hợp.

                - **Sinh viên**: quyền xem/tham gia theo được cấp.



                Nếu thiếu quyền thao tác, vui lòng liên hệ admin để cấp đúng role/power.

                """

        ));



        list.add(new KnowledgeRule(

                List.of("dang nhap", "chat", "tro ly", "chatbot", "hoi chat"),

                2,

                """

                **Trợ lí NCKH (chatbot)** chỉ hoạt động khi bạn **đã đăng nhập**.

                - Đăng nhập tại **`/login`** (email + mật khẩu).

                - Sau khi đăng nhập, mở ô chat góc dưới phải màn hình (biểu tượng tên lửa).

                - API: **`POST /api/chatbot/chat`** (kèm header `Authorization: Bearer <token>`).

                - Chưa đăng nhập: không gửi được tin; hệ thống trả **401** hoặc hiện nút **Đăng nhập** trong khung chat.

                """

        ));



        list.add(new KnowledgeRule(

                List.of("phuong an", "chon pa", "plan", "dang ky phuong an", "window"),

                2,

                """

                **Phương án (PA) theo năm** — mỗi năm học bạn chọn một phương án (Bảng 1–6) để áp định mức cá nhân:

                - Xem / chọn phương án: **`/activity/standards`** (khung chọn năm + phương án).

                - Trang tổng hợp NCKH user: **`/activity/user`**.

                - API gợi ý:

                  - `GET /api/nckh/plan/window` — khung thời gian được phép đăng ký.

                  - `GET /api/nckh/plan/current` — phương án hiện tại.

                  - `POST /api/nckh/plan/select` — chọn / đổi phương án.

                  - `GET /api/nckh/plan/statistics` — thống kê (thường dành cán bộ).

                Định mức số liệu theo **chức danh** (GS/PGS, TS, ThS, KS/CN) lấy từ bảng tiêu chí năm đã cấu hình.

                """

        ));



        list.add(new KnowledgeRule(

                List.of("activity/user", "tong quan nckh", "hub nckh", "chuc nang nckh user"),

                1,

                """

                Trang **`/activity/user`** là **cổng NCKH cho người dùng**, gồm các lối tắt:

                - **Định mức hoạt động** → `/activity/standards`

                - **Định mức nhóm** (NCM / Xuất sắc / Tinh hoa) → `/activity/group-quota`

                - **Hồ sơ nhóm** → `/research-groups/profile`

                - **Danh sách nhóm** → `/research-groups`

                - Khai báo từng loại hoạt động → `/activity/declarations/...`

                """

        ));



        list.add(new KnowledgeRule(

                List.of("dinh muc ca nhan", "activity/standards", "doi chieu", "tieu chi nam"),

                2,

                """

                **`/activity/standards`** — Định mức & đối chiếu **cá nhân**:

                - Chọn **năm** và **phương án** đã đăng ký.

                - Bảng tiêu chí: định mức tối thiểu, giờ quy đổi/đơn vị, tiến độ thực tế từ hoạt động **đã duyệt**.

                - Nếu bạn thuộc nhóm NCM/Xuất sắc/Tinh hoa, có thêm panel **Định mức nhóm** (tóm tắt); chi tiết tại `/activity/group-quota`.

                - API đọc định mức: `GET /api/nckh/tieu-chi-dinh-muc` (lọc năm, phương án, chức danh).

                """

        ));



        list.add(new KnowledgeRule(

                List.of("gio quy doi", "dat dinh muc nhom", "phan tram", "bang 2", "tinh hoa", "xuat sac"),

                2,

                """

                **Định mức nhóm** (`/activity/group-quota`) — áp dụng khi bạn là thành viên nhóm loại **NCM**, **Xuất sắc** hoặc **Tinh hoa** (nhóm **đã duyệt**):

                - Hệ thống tổng hợp từ hoạt động NCKH **đã duyệt** (giờ, số lượng theo tiêu chí).

                - **Giờ cá nhân** (thành viên nhóm định mức): phần chia đều giờ nhóm + phần tự làm vượt định mức nhóm (tránh cộng trùng seminar/hội thảo chung).

                - **% hoàn thành nhóm**: trung bình tiến độ các chỉ tiêu (gồm chỉ tiêu Bảng 2 với nhóm NCM).

                - Trưởng nhóm có thêm phần đánh giá / tổng hợp (nếu được phân quyền).

                - API: `GET /api/research-groups/quota/my-quota`, `my-stats`, `POST .../my-calculate`.

                """

        ));



        list.add(new KnowledgeRule(

                List.of("nop", "duyet", "cho duyet", "tu choi", "trang thai", "submit", "draft"),

                2,

                """

                **Quy trình khai báo NCKH** (người dùng):

                1. Vào đúng form khai báo (`/activity/declarations/...`).

                2. Nhập thông tin, đính kèm **minh chứng** (file/ảnh).

                3. Thêm **cộng tác viên** nếu có (chia tỷ lệ đóng góp).

                4. **Lưu nháp** hoặc **Nộp** để chờ duyệt.

                5. Theo dõi trạng thái tại **`/activity/user`** hoặc danh sách hoạt động của bạn.

                **Duyệt / từ chối** do cán bộ có quyền (`/activity/admin/approval` hoặc cổng admin NCKH).

                """

        ));



        list.add(new KnowledgeRule(

                List.of("cong tac", "contributor", "dong tac gia", "ty le dong gop"),

                2,

                """

                **Cộng tác viên** khi khai báo hoạt động NCKH:

                - Thêm người cùng thực hiện và **tỷ lệ %** đóng góp (tổng thường = 100%).

                - Giờ / số lượng quy đổi có thể chia theo tỷ lệ khi tính định mức.

                - Chỉnh sửa khi hồ sơ còn ở trạng thái cho phép sửa (nháp hoặc bị trả về).

                """

        ));



        list.add(new KnowledgeRule(

                List.of("loai khai bao", "seminar", "bai bao", "wos", "scopus", "de xuat", "hoi dong"),

                2,

                """

                **Bản đồ loại khai báo** (route chính):

                | Loại | Route |

                |------|--------|

                | Seminar | `/activity/declarations/seminar` |

                | Hội thảo / tham luận | `/activity/declarations/conference` |

                | Bài báo quốc tế | `/activity/declarations/international-paper` |

                | Bài báo tiếng Việt | `/activity/declarations/vietnamese-paper` |

                | Kỷ yếu / proceeding | `/activity/declarations/proceeding` |

                | Bài tổng quan | `/activity/declarations/review-paper` |

                | Tư vấn kỹ thuật | `/activity/declarations/tech-consult` |

                | Quy trình / tiêu chuẩn KT | `/activity/declarations/tech-procedure` |

                | Đề xuất đề tài | `/activity/declarations/proposal` |

                | Đề tài đã duyệt / nghiệm thu | `/activity/declarations/approved-task` |

                | Hội đồng | `/activity/declarations/council` |

                | Mời chuyên gia | `/activity/declarations/expert-invite` |

                | Hoạt động khác | `/activity/declarations/other-activity` |

                """

        ));



        list.add(new KnowledgeRule(

                List.of("tro ly nckh", "nckh staff", "activity/admin", "cau hinh dinh muc", "year-quota"),

                2,

                """

                **Cán bộ vận hành NCKH** (role **assistant** / **admin** hoặc lãnh đạo khoa) — các màn thường gặp:

                - **`/activity/admin`** — cổng quản trị NCKH.

                - **`/activity/admin/approval`** — duyệt / từ chối khai báo.

                - **`/activity/admin/year-quota`** — cấu hình **định mức theo năm** (import Excel, **quét AI** PDF/ảnh).

                - **`/activity/admin/config`** — cấu hình bổ sung.

                - **`/activity/admin/plan-statistics`** — thống kê phương án.

                - **`/admin/chat-analysis`** — phân tích lịch sử chatbot (AI).

                - **`/research-groups/manager`** — duyệt / quản lý nhóm NC.

                - **`/user/manager`** — quản lý user (thường **admin** thuần, không phải Trợ lí NCKH).

                **Quét AI định mức**: upload PDF/ảnh bảng PA + Phụ lục 2 → AI gán `pl2GroupKey` → hệ thống ghép và lưu tiêu chí.

                """

        ));



        list.add(new KnowledgeRule(

                List.of("import excel", "excel dinh muc", "ai scan", "quet file", "pdf dinh muc"),

                2,

                """

                **Nhập định mức năm** (cán bộ, tại `/activity/admin/year-quota`):

                - **Import Excel** theo mẫu hệ thống (hàng loạt tiêu chí × phương án × chức danh).

                - **Quét AI**: tải PDF/ảnh quy định định mức; AI trích xuất Bảng 1–6 + Phụ lục 2.

                - AI gán **`pl2GroupKey`** để ghép dòng PA với dòng quy đổi giờ (không cần khớp chữ tên thủ công).

                - Xem trước bảng → chỉnh sửa → lưu vào năm đang chọn.

                User thường **không** vào màn này; chỉ xem kết quả tại `/activity/standards`.

                """

        ));



        list.add(new KnowledgeRule(

                List.of("phan tich chat", "chat analysis", "lich su chat", "hanh vi nguoi dung"),

                2,

                """

                **Phân tích chatbot** (admin, `/admin/chat-analysis`):

                - Danh sách user đã từng chat với Trợ lí NCKH.

                - Xem **lịch sử chat phân trang** (server trả từng trang, không tải hết một lần).

                - **Phân tích AI cá nhân** — vấn đề & gợi ý theo từng user.

                - **Phân tích tổng quan** — chủ đề phổ biến, pain point, đề xuất cải thiện hệ thống.

                API: `/api/v1/admin/chat-analysis/...`

                """

        ));



        list.add(new KnowledgeRule(

                List.of("dashboard", "thong ke ca nhan", "activities/my", "tien do"),

                2,

                """

                **Theo dõi tiến độ NCKH cá nhân**:

                - Trang định mức: **`/activity/standards`** (đối chiếu chỉ tiêu vs thực tế).

                - API dashboard: `GET /api/nckh/dashboard`, `GET /api/nckh/activities/my`.

                - Hoạt động chỉ tính vào định mức khi ở trạng thái **đã duyệt** (tùy cấu hình workflow).

                """

        ));



        list.add(new KnowledgeRule(

                List.of("quan ly nhom", "research-groups/manager", "duyet nhom", "loai nhom"),

                2,

                """

                **Nhóm nghiên cứu** — hai luồng:

                **Người dùng**

                - `/research-groups` — xem, đăng ký tạo nhóm.

                - `/research-groups/profile` — hồ sơ, tài liệu, link Google Sheet.

                **Cán bộ quản lý**

                - `/research-groups/manager` — duyệt nhóm, chỉnh loại (**NCM** / **Xuất sắc** / **Tinh hoa** / thường).

                Nhóm **đã duyệt** + đúng loại mới tính **định mức nhóm** tại `/activity/group-quota`.

                """

        ));



        list.add(new KnowledgeRule(

                List.of("loi", "khong gui duoc", "401", "403", "loi he thong", "bao loi"),

                2,

                """

                **Xử lý lỗi thường gặp**:

                - **401 / bị đăng xuất**: token hết hạn → đăng nhập lại tại `/login`.

                - **403 / không đủ quyền**: tài khoản thiếu role (admin / assistant / lãnh đạo) → liên hệ quản trị.

                - **Chatbot không trả lời**: kiểm tra đã đăng nhập; thử tải lại trang; kiểm tra mạng.

                - **Quét AI thiếu dòng**: file mờ/cắt bảng → chụp lại rõ hoặc import Excel.

                - **Định mức nhóm = 0**: chưa có hoạt động duyệt hoặc chưa thuộc nhóm đúng loại.

                Hỗ trợ kỹ thuật: **cntt@vnua.edu.vn**

                """

        ));



        return list;

    }



    private String normalize(String text) {

        String lower = text.toLowerCase(Locale.ROOT);

        String noAccent = Normalizer.normalize(lower, Normalizer.Form.NFD)

                .replaceAll("\\p{M}", "");

        return noAccent.replaceAll("[^a-z0-9\\s/_-]", " ").replaceAll("\\s+", " ").trim();

    }

}


