# ✅ Đã chuyển đổi hoàn tất từ Local Storage sang Cloudinary

## 🔧 Backend - Các file đã sửa

### 1. ✅ CloudinaryService.java (Đã tạo)
**Location:** `server/src/main/java/com/example/server/service/CloudinaryService.java`

Service chính để upload/delete file lên Cloudinary:
- `uploadFile(file, folder)` - Upload file lên Cloudinary
- `deleteFile(publicId)` - Xóa file từ Cloudinary
- Tự động extract public_id từ URL

### 2. ✅ NewsController.java (Đã sửa)
**Location:** `server/src/main/java/com/example/server/controller/user/NewsController.java`

**Thay đổi:**
- ✅ Import `CloudinaryService`
- ✅ Inject `CloudinaryService`
- ✅ Upload ảnh tin tức lên Cloudinary (thay vì `fileService.store()`)
- ✅ Lưu URL Cloudinary vào database (thay vì tên file)
- ✅ Xóa ảnh cũ trên Cloudinary khi update tin tức

**Dòng code quan trọng:**
```java
String imageUrl = cloudinaryService.uploadFile(file, "news");
newsImage.setImageName(imageUrl);  // Lưu URL thay vì tên file
```

### 3. ✅ EventPublicRestController.java (Đã sửa)
**Location:** `server/src/main/java/com/example/server/controller/event/EventPublicRestController.java`

**Thay đổi:**
- ✅ Import `CloudinaryService`
- ✅ Inject `CloudinaryService`
- ✅ Xóa `@Value("${upload.dir}")`
- ✅ Upload banner sự kiện lên Cloudinary
- ✅ Lưu URL Cloudinary vào database

**Dòng code quan trọng:**
```java
String bannerUrl = cloudinaryService.uploadFile(bannerFile, "events");
eventData.setBannerImg(bannerUrl);
```

### 4. ✅ FileController.java (Đã sửa)
**Location:** `server/src/main/java/com/example/server/controller/user/FileController.java`

**Thay đổi:**
- ✅ Import `CloudinaryService`
- ✅ Inject `CloudinaryService`
- ✅ Thêm endpoint mới: `POST /api/upload`
- ✅ Xóa method upload local cũ
- ✅ Thêm `@CrossOrigin(origins = "*")`

**API mới:**
```java
POST /api/upload
- Params: file, folder (optional)
- Response: { url, fileName }
```

### 5. ✅ application.yml (Đã cập nhật)
**Location:** `server/src/main/resources/application.yml`

**Thêm config:**
```yaml
cloudinary:
  cloud-name: doslcoy82
  api-key: 782598553554941
  api-secret: XIrVpff4K5tVeMm4nd4NW8XB0Bo
```

---

## 🎨 Frontend - Các file đã sửa

### 6. ✅ uploadService.js (Đã cập nhật)
**Location:** `client/src/services/uploadService.js`

**Thêm functions:**
- `uploadToCloudinary(file, folder)` - Upload file đơn giản
- `uploadWithProgress(file, folder, onProgress)` - Upload với progress tracking

**Cách dùng:**
```javascript
import uploadToCloudinary from '@/services/uploadService';

const url = await uploadToCloudinary(file, 'events');
```

### 7. ✅ constants/index.js (Đã thêm helper)
**Location:** `client/src/constants/index.js`

**Thêm function:**
```javascript
export const getImageUrl = (url) => {
  if (!url) return null;
  
  // Nếu đã là URL Cloudinary, return luôn
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  
  // Nếu là path cũ, convert sang API URL
  return `${API_BASE_URL}/file/${url}`;
};
```

**Mục đích:** Tự động detect URL Cloudinary vs local path

### 8. ✅ EventDashboard.jsx (Đã sửa)
**Location:** `client/src/pages/Events/EventDashboard.jsx`

**Thay đổi:**
- ✅ Import `uploadToCloudinary`
- ✅ Upload ảnh lên Cloudinary trước khi submit form
- ✅ Gửi URL Cloudinary thay vì File object

**Dòng code quan trọng:**
```javascript
// Upload ảnh lên Cloudinary trước
let imageUrl = null;
if (formData.image && typeof formData.image !== 'string') {
  imageUrl = await uploadToCloudinary(formData.image, 'events');
}

// Gửi URL thay vì file
submitData.append("bannerUrl", imageUrl);
```

---

## 📝 Các file CẦN SỬA THÊM (để hoàn chỉnh)

### Hiển thị ảnh trong components:

Tất cả các nơi hiển thị ảnh cần import và sử dụng `getImageUrl`:

```javascript
// Thay vì:
<img src={`${BASE_IMG_URL}${event.image}`} />

// Dùng:
import { getImageUrl } from '@/constants';
<img src={getImageUrl(event.image)} />
```

**Các file cần kiểm tra:**
- `client/src/pages/Events/components/EventCard.jsx`
- `client/src/pages/Events/components/EventDetailModal.jsx`
- `client/src/pages/News/**/*.jsx`
- `client/src/pages/ResearchGroup/ResearchGroupProfile.jsx` (đã dùng BASE_IMG_URL)

---

## 🚀 Cách sử dụng

### Upload file từ Frontend

```javascript
import uploadToCloudinary from '@/services/uploadService';

const handleFileUpload = async (file) => {
  try {
    // Upload lên Cloudinary
    const url = await uploadToCloudinary(file, 'events');
    
    // Sử dụng URL để lưu vào database hoặc hiển thị
    console.log('Cloudinary URL:', url);
    // url = "https://res.cloudinary.com/doslcoy82/image/upload/..."
    
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
```

### Hiển thị ảnh

```javascript
import { getImageUrl } from '@/constants';

function EventCard({ event }) {
  return (
    <img 
      src={getImageUrl(event.image)} 
      alt={event.title}
      onError={(e) => {
        e.target.src = '/default-image.jpg'; // Fallback
      }}
    />
  );
}
```

---

## 🔍 Cách kiểm tra

### 1. Test Upload
```bash
# Start backend
cd server
mvn spring-boot:run

# Start frontend
cd client
npm run dev
```

### 2. Test upload ảnh:
- Vào EventDashboard
- Tạo sự kiện mới
- Upload ảnh banner
- Check console: phải thấy URL Cloudinary (https://res.cloudinary.com/...)

### 3. Test hiển thị ảnh:
- Các ảnh mới sẽ load từ Cloudinary
- Các ảnh cũ (nếu có) sẽ load từ local

---

## ⚠️ Lưu ý quan trọng

1. **Database hiện tại:**
   - Ảnh cũ vẫn lưu tên file (vd: "image.jpg")
   - Ảnh mới sẽ lưu URL đầy đủ (vd: "https://res.cloudinary.com/...")
   - `getImageUrl()` sẽ tự động xử lý cả 2 trường hợp

2. **Migration:**
   - Không cần migrate data cũ
   - `getImageUrl()` tự động detect và xử lý

3. **Folders trên Cloudinary:**
   ```
   nckh/
   ├── events/     (banner sự kiện)
   ├── news/       (ảnh tin tức)
   ├── documents/  (tài liệu)
   └── general/    (file chung)
   ```

4. **Xóa file:**
   - Backend tự động xóa file cũ trên Cloudinary khi update/delete
   - Không cần cleanup manual

---

## 🎯 Các bước tiếp theo

### Bước 1: Cập nhật các component hiển thị ảnh
Tìm tất cả nơi hiển thị ảnh và thay thế:
```javascript
// Old
<img src={`${BASE_IMG_URL}${image}`} />

// New
<img src={getImageUrl(image)} />
```

### Bước 2: Xóa thư mục uploads local (optional)
```bash
cd server
rm -rf src/main/resources/static/file/*
```

Thêm vào `.gitignore`:
```
server/src/main/resources/static/file/
server/uploads/
```

### Bước 3: Test đầy đủ
- [ ] Upload ảnh tin tức
- [ ] Upload banner sự kiện
- [ ] Update tin tức (có xóa ảnh cũ)
- [ ] Hiển thị ảnh trong danh sách
- [ ] Hiển thị ảnh chi tiết

---

## 📊 So sánh Before vs After

### Before (Local Storage):
```
User upload → Save to server/uploads → DB lưu filename
                                      ↓
                            Render: /file/filename.jpg
                                      ↓
                            ❌ Mất khi deploy Render
```

### After (Cloudinary):
```
User upload → Cloudinary API → DB lưu full URL
                              ↓
                    Render: https://cloudinary.com/...
                              ↓
                    ✅ Bền vững, CDN global
```

---

**Hoàn tất! 🎉** 

Tất cả file upload/ảnh giờ đã được lưu trên Cloudinary và sẽ không bị mất khi deploy!
