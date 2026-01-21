# 📤 Hướng dẫn Upload File/Ảnh lên Cloudinary

## ✅ Đã hoàn tất setup

### Backend
- ✅ Config Cloudinary trong `application.yml`
- ✅ `CloudinaryService.java` - Service upload file
- ✅ `FileUploadController.java` - API endpoint
- ✅ Đã sửa `NewsController`, `EventPublicRestController`, `FileController`

### Frontend
- ✅ `uploadService.js` - Function upload từ FE
- ✅ `constants/index.js` - Helper `getImageUrl()`
- ✅ Đã sửa `EventDashboard`, `ResearchGroupProfile`

---

## 🚀 Cách sử dụng

### 1. Upload file từ Frontend

```javascript
import uploadToCloudinary from '@/services/uploadService';

// Upload file/ảnh
const handleFileChange = async (e) => {
  const file = e.target.files[0];
  
  try {
    // Upload và nhận URL
    const fileUrl = await uploadToCloudinary(file, 'events');
    console.log('File URL:', fileUrl);
    // fileUrl = "https://res.cloudinary.com/doslcoy82/image/upload/..."
    
    // Dùng URL này để lưu vào database
    setFormData({ ...formData, image: fileUrl });
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
```

### 2. Upload với progress tracking

```javascript
import { uploadWithProgress } from '@/services/uploadService';

const handleUpload = async (file) => {
  try {
    const url = await uploadWithProgress(
      file, 
      'events',
      (progress) => {
        console.log(`Progress: ${progress}%`);
        setUploadProgress(progress);
      }
    );
    console.log('Uploaded:', url);
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
```

### 3. Hiển thị ảnh

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

**Tại sao dùng `getImageUrl()`?**
- Tự động detect URL Cloudinary (https://...) và return luôn
- Với path cũ (local), tự động convert sang API URL
- Backward compatible với data cũ

---

## 📋 API Endpoint

```
POST /api/upload
Content-Type: multipart/form-data

Body:
- file: File (required)
- folder: String (optional, default: "uploads")

Response:
{
  "url": "https://res.cloudinary.com/doslcoy82/...",
  "fileName": "image.jpg"
}
```

### Test với cURL

```bash
curl -X POST http://localhost:8080/api/upload \
  -F "file=@/path/to/image.jpg" \
  -F "folder=events"
```

---

## 💡 Ví dụ Component React

```jsx
import { useState } from 'react';
import uploadToCloudinary from '@/services/uploadService';
import { getImageUrl } from '@/constants';

export default function ImageUploader() {
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    try {
      const url = await uploadToCloudinary(file, 'images');
      setImageUrl(url);
      alert('Upload thành công!');
    } catch (error) {
      alert('Lỗi: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input 
        type="file" 
        accept="image/*"
        onChange={handleUpload}
        disabled={loading}
      />
      
      {loading && <p>Đang tải lên...</p>}
      
      {imageUrl && (
        <div>
          <p>URL: {imageUrl}</p>
          <img 
            src={getImageUrl(imageUrl)} 
            alt="Uploaded" 
            style={{maxWidth: '300px'}} 
          />
        </div>
      )}
    </div>
  );
}
```

---

## 📝 Các folders thường dùng

```javascript
'events'     // Banner sự kiện
'news'       // Ảnh tin tức
'documents'  // Tài liệu PDF, DOC
'avatars'    // Avatar người dùng
'general'    // File chung (mặc định)
```

---

## ⚠️ Lưu ý

1. **File được lưu trên Cloudinary** - Không bị mất khi deploy
2. **Miễn phí 25GB/năm** - Đủ cho hầu hết dự án
3. **URL trực tiếp** - Không cần serve static files
4. **Tối ưu tự động** - Cloudinary tự động nén và tối ưu ảnh
5. **CDN global** - Load nhanh ở mọi nơi

---

## 🎯 Quy trình hoàn chỉnh

```
1. User chọn file
   ↓
2. Upload lên Cloudinary (uploadToCloudinary)
   ↓
3. Nhận URL từ Cloudinary
   ↓
4. Lưu URL vào database (qua API backend)
   ↓
5. Hiển thị ảnh/file bằng getImageUrl(url)
```

---

## 🔍 Troubleshooting

### Lỗi upload
```javascript
try {
  const url = await uploadToCloudinary(file, 'events');
} catch (error) {
  if (error.response?.status === 400) {
    console.error('File không hợp lệ');
  } else if (error.response?.status === 500) {
    console.error('Lỗi server hoặc Cloudinary');
  } else {
    console.error('Lỗi kết nối:', error.message);
  }
}
```

### Ảnh không hiển thị
1. Check URL trong database (phải là URL đầy đủ)
2. Check console log xem có lỗi CORS không
3. Dùng `getImageUrl()` thay vì concat string

---

**Hoàn tất! 🎉** 

Xem chi tiết migration trong [MIGRATION_SUMMARY.md](MIGRATION_SUMMARY.md)
