# AI Agent Code Standards & Rules cho NCKH Management System

Bạn là AI Agent chuyên code và bảo trì dự án **Quản lý NCKH**. 
YÊU CẦU BẮT BUỘC: Khi tạo tính năng mới hoặc sửa code, bạn PHẢI tuân thủ 100% các quy tắc (rules) và pattern code thực tế đã có trong hệ thống dưới đây. Không được sáng tạo ra các chuẩn mới.

---

## Phần 1: BACKEND RULES (Spring Boot)

### 1. Cấu trúc Controller & Response Chuẩn
Mọi API thành công phải được bọc trong `SuccessResponseDTO` và trả về qua `ResponseEntity.ok()`.
KHÔNG trả về Entity trực tiếp.

**Pattern mẫu (như `NewsPublicRestController`):**
```java
@RestController
@RequestMapping("/api/v1/your-feature")
@CrossOrigin(origins = "*") // Bắt buộc có CrossOrigin
public class YourFeatureController {
    
    @Autowired
    private YourService yourService;

    @GetMapping
    public ResponseEntity<?> getAllData(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        try {
            Map<String, Object> response = yourService.getDataWithPagination(search, page, size);
            // BẮT BUỘC dùng SuccessResponseDTO
            return ResponseEntity.ok(
                    new SuccessResponseDTO<>(response, "Lấy danh sách thành công"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Có lỗi xảy ra: " + e.getMessage());
        }
    }
}
```

### 2. Xử lý Exception Tập trung (GlobalExceptionHandler)
Khi logic gặp lỗi (VD: không tìm thấy, validate sai), service PHẢI ném ra Exception. `GlobalExceptionHandler` sẽ tự động bắt và format thành `Map<String, Object>`.
**KHÔNG TỰ FORMAT LỖI TRONG CONTROLLER** (ngoại trừ try-catch cơ bản ở trên).

**Các Exception đã có sẵn để tái sử dụng:**
- `ErrorException(message, HttpStatus)`
- `LoginFailedException(message)`
- `ExpiredTokenException(message)`, `InvalidTokenException`, `MissingTokenException`.
- `MethodArgumentNotValidException` (cho `@Valid` trong DTO).

**Format JSON trả về khi lỗi (do GlobalExceptionHandler tự động làm):**
```json
{
  "success": false,
  "path": "/api/.../...",
  "message": "Nội dung lỗi",
  "timestamp": "2026-...",
  "status": 401 
}
```

### 3. DTO & Validation
- Request Payload phải được map vào các class trong thư mục `DTO/request/`.
- Phản hồi từ Database phải map qua `DTO/response/` trước khi gửi ra Controller.
- Dùng các annotation validation như `@NotBlank`, `@NotNull`, `@Min` trong Request DTO.

---

## Phần 2: FRONTEND RULES (React + Vite)

### 1. Gọi API (Services & Axios Interceptor)
Mọi call API PHẢI sử dụng instance `api` được export từ `src/services/api.js`. 
- Trong `api.js`, token lấy từ `getAuthToken()` (cookieUtils) đã được nhét sẵn vào header Authorization.
- Interceptor đã tự động unwrap `response.data`, do đó khi gọi service, kết quả nhận được chính là data gốc.

**Pattern tạo Service (VD: `src/services/yourService.js`):**
```javascript
import api from "./api";

const yourService = {
  // Lấy danh sách (GET)
  getData: async (search = "", page = 0, size = 12) => {
    // Không cần .data ở đây vì interceptor đã lo
    return await api.get("/api/v1/your-feature", {
      params: { search, page, size },
    });
  },

  // Tạo mới (POST)
  createData: async (payload) => {
    return await api.post("/api/v1/your-feature", payload);
  }
};

export default yourService;
```

### 2. UI Components & Styling (Tailwind + MUI)
- **Layout & Structure**: Sử dụng 100% Tailwind CSS class. VD: `flex flex-col items-center gap-4 min-h-screen bg-[#f8f9fa] max-w-7xl mx-auto`.
- **Màu sắc chủ đạo (Theme Color)**: BẮT BUỘC sử dụng màu `mainColor` đã được cấu hình sẵn trong dự án cho các UI chính (nút bấm, trạng thái active, hover, viền...). Thay vì hardcode mã màu, hãy dùng các class Tailwind như: `bg-mainColor`, `text-mainColor`, `border-mainColor`, `hover:bg-mainColor/90`...
- **Icons**: Phải dùng `@mui/icons-material`. KHÔNG dùng FontAwesome hay thư viện khác. VD: `<Search sx={{ fontSize: 18 }} />`.
- **Complex UI**: Nếu cần bảng, form phức tạp hay modal, cân nhắc dùng components của `@mui/material`.

**Pattern viết Page Component (VD: `News.jsx`):**
```javascript
import { useState, useEffect, useCallback } from "react";
import { Search, NotificationsActive } from "@mui/icons-material";
import yourService from "../../services/yourService";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { usePagination } from "../../hooks/usePagination"; // Sử dụng custom hook phân trang có sẵn

const YourFeaturePage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hook pagination của dự án
  const { currentPage, updatePaginationData } = usePagination(0, 10);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await yourService.getData("", currentPage, 10);
      // Dựa vào cấu trúc DTO: response.data là dữ liệu
      setData(response?.data?.list || []); 
      updatePaginationData(response?.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, updatePaginationData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="min-h-screen bg-[#f8f9fa] p-8">
      {/* Code giao diện dùng Tailwind thuần kết hợp MUI Icons */}
      <h1 className="text-2xl font-bold text-gray-800">Tiêu đề trang</h1>
      {loading ? <LoadingSpinner /> : (
         /* Render data */
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">...</div>
      )}
    </div>
  );
};
export default YourFeaturePage;
```

### 3. State Management & Utils
- Không xài Redux nếu không thật sự cần, dùng Context API (`src/context/`) cho Global State (VD: Auth, Theme).
- Tách các hàm format (ngày giờ, xử lý file) vào thư mục `src/utils/`.

---

## Phần 3: NGUYÊN TẮC TÁI SỬ DỤNG CODE (DRY - Don't Repeat Yourself)

**Đây là yêu cầu BẮT BUỘC đối với AI Agent để giữ source code luôn sạch và dễ bảo trì:**
1. **Kiểm tra trước khi code**: Trước khi tạo mới một UI Component, Custom Hook (Frontend), hoặc một Helper, Utils, Mapper (Backend), **PHẢI** tìm kiếm xem trong dự án đã có thứ tương tự hay chưa. (VD: Nút bấm chuẩn, Loading spinner, Table, hàm format ngày tháng, hàm upload file...).
2. **Viết hàm dùng chung (Shared Functions / Common Components)**: Nếu bạn phát hiện một đoạn logic (tính toán, xử lý chuỗi) hoặc một khối giao diện (UI) đang được sử dụng ở từ **2 nơi trở lên**, bạn **BẮT BUỘC** phải tách nó ra thành:
   - *Frontend*: Bỏ vào thư mục `src/components/common/`, `src/hooks/` hoặc `src/utils/`. (VD: Khi tạo một Button Component dùng chung, hãy tự động style nó với `bg-mainColor`).
   - *Backend*: Bỏ vào các class `@Component` hoặc `@Service` dùng chung trong thư mục `helpers/`, `utils/`, hoặc tạo Base Class.
3. **Cấm tuyệt đối Copy/Paste**: KHÔNG sao chép một cục code dài từ file này sang file khác. Hãy Extract Function hoặc Extract Component.

---

**LƯU Ý CUỐI:**
Khi thực hiện task, hãy luôn nhìn vào code của các file anh em (VD: sửa News thì xem Events, sửa User thì xem Admin) để sao chép đúng pattern. Giữ vững tính nhất quán của `SuccessResponseDTO` và cấu trúc `api.js`.
