# 🖼️ ReactQuill - Upload Ảnh lên Cloudinary

## ✅ Đã hoàn tất

Giờ khi upload ảnh trong ReactQuill editor (News, Events), ảnh sẽ **tự động upload lên Cloudinary** và chỉ lưu URL thay vì base64.

---

## 🔧 Files đã tạo/sửa

### 1. ✅ `utils/quillConfig.js` (MỚI)

Custom image handler cho ReactQuill:

- Upload ảnh lên Cloudinary khi user chọn
- Hiển thị "Đang tải ảnh lên..." trong lúc upload
- Chèn URL Cloudinary vào content (thay vì base64)
- Validate file type và size (max 5MB)

### 2. ✅ `pages/News/NewsManager.jsx` (ĐÃ SỬA)

- Import và sử dụng `getQuillModules()` từ quillConfig
- Xóa config cũ (inline modules/formats)

### 3. ✅ `pages/Events/components/EventFormModal.jsx` (ĐÃ SỬA)

- Import và sử dụng `getQuillModules()` và `quillFormats`
- Upload ảnh trong mô tả sự kiện lên Cloudinary

### 4. ✅ `pages/Events/CreateEvent.jsx` (ĐÃ SỬA)

- Import và sử dụng custom image handler
- Upload ảnh trong mô tả sự kiện lên Cloudinary

---

## 📝 Cách hoạt động

### Before (Base64):

```html
<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..." />
<!-- Content rất dài, hàng nghìn ký tự -->
```

### After (Cloudinary URL):

```html
<img
  src="https://res.cloudinary.com/doslcoy82/image/upload/v1234/news-content/abc.jpg"
/>
<!-- Content ngắn gọn, chỉ URL -->
```

---

## 🚀 Cách sử dụng

User chỉ cần:

1. Click icon **Image** trong toolbar ReactQuill
2. Chọn ảnh từ máy tính
3. ✅ Ảnh tự động upload lên Cloudinary
4. ✅ URL được chèn vào content

**Không cần làm gì thêm!**

---

## 💡 Ví dụ tích hợp vào component khác

Nếu bạn có component khác dùng ReactQuill, chỉ cần import config:

```javascript
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { getQuillModules, quillFormats } from "@/utils/quillConfig";

function MyEditor() {
  const [content, setContent] = useState("");
  const quillModules = getQuillModules();

  return (
    <ReactQuill
      theme="snow"
      value={content}
      onChange={setContent}
      modules={quillModules}
      formats={quillFormats}
    />
  );
}
```

---

## ⚙️ Cấu hình

### Thay đổi folder upload:

Mở `utils/quillConfig.js` và sửa:

```javascript
// Upload to Cloudinary
const imageUrl = await uploadToCloudinary(file, "news-content"); // Đổi folder này
```

### Thay đổi max file size:

```javascript
// Validate file size (5MB max)
if (file.size > 5 * 1024 * 1024) {
  // Đổi số này
  alert("Kích thước ảnh không được vượt quá 5MB");
  return;
}
```

### Thêm/bớt toolbar buttons:

```javascript
export const getQuillModules = () => ({
  toolbar: {
    container: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      // Thêm/bớt buttons ở đây
      ["link", "image", "video"],
      ["clean"],
    ],
    handlers: {
      image: imageHandler,
    },
  },
});
```

---

## 🎯 Lợi ích

✅ **Content ngắn gọn** - Không còn base64 dài hàng nghìn ký tự  
✅ **Load nhanh** - Ảnh được serve từ Cloudinary CDN  
✅ **Tiết kiệm database** - Không lưu ảnh base64 trong DB  
✅ **Dễ quản lý** - Tất cả ảnh đều ở Cloudinary  
✅ **Tự động optimize** - Cloudinary tự động nén và optimize

---

## 🔍 Debug

### Xem ảnh có upload thành công không:

1. Mở Console (F12)
2. Upload ảnh trong ReactQuill
3. Xem log: `Uploaded to Cloudinary: https://...`

### Nếu lỗi upload:

Check console xem lỗi gì:

- Network error → Check API endpoint `/api/upload`
- 400 Bad Request → Check file type/size
- 500 Server Error → Check Cloudinary config trong `application.yml`

---

## 📊 So sánh kích thước

### Ví dụ content có 3 ảnh:

**Before (Base64):**

```
Content size: ~250KB (mỗi ảnh ~80KB base64)
Database: Rất chậm khi save/load
```

**After (Cloudinary URL):**

```
Content size: ~2KB (chỉ 3 URLs)
Database: Nhanh, gọn
```

---

**Hoàn tất! 🎉**

Từ giờ mọi ảnh trong ReactQuill sẽ tự động upload lên Cloudinary!
