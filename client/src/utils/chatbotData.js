export const getBotResponse = (userInput) => {
    const input = userInput.toLowerCase();

    // Các câu hỏi về tạo event
    if (
      input.includes("tạo event") ||
      input.includes("tạo sự kiện") ||
      input.includes("làm sao tạo") ||
      input.includes("cách tạo")
    ) {
      return `🎯 **Hướng dẫn tạo sự kiện mới:**

1. **Truy cập trang Events** - Nhấp vào "Sự kiện" trong menu
2. **Nhấn nút "Tạo sự kiện mới"** - Thường ở góc trên bên phải
3. **Điền thông tin sự kiện:**
   • Tên sự kiện
   • Mô tả chi tiết
   • Ngày giờ bắt đầu/kết thúc
   • Địa điểm
   • Chương trình sự kiện
   • Ảnh đại diện (nếu có)
4. **Kiểm tra thông tin** và nhấn "Lưu"
5. **Chờ phê duyệt** từ admin (nếu cần)

💡 **Lưu ý:** Hãy điền đầy đủ thông tin để sự kiện được phê duyệt nhanh chóng!`;
    }

    // Các câu hỏi về xem event sắp diễn ra
    if (
      input.includes("sự kiện sắp") ||
      input.includes("event sắp") ||
      input.includes("xem sự kiện") ||
      input.includes("sự kiện nào")
    ) {
      return `📅 **Cách xem sự kiện sắp diễn ra:**

1. **Vào trang chủ** - Sự kiện nổi bật hiển thị ngay
2. **Truy cập "Sự kiện"** - Xem danh sách đầy đủ
3. **Sử dụng bộ lọc:**
   • Lọc theo ngày
   • Lọc theo loại sự kiện
   • Tìm kiếm theo tên
4. **Xem chi tiết** - Nhấp vào sự kiện để xem đầy đủ

📊 **Thông tin bạn sẽ thấy:**
• Tên và mô tả sự kiện
• Thời gian và địa điểm
• Số lượng người tham gia
• Trạng thái đăng ký`;
    }

    // Các câu hỏi về tham gia event
    if (
      input.includes("tham gia") ||
      input.includes("đăng ký") ||
      input.includes("join") ||
      input.includes("register")
    ) {
      return `✅ **Cách tham gia sự kiện:**

1. **Chọn sự kiện** - Từ danh sách hoặc trang chi tiết
2. **Nhấn "Tham gia"** hoặc "Đăng ký"
3. **Xác nhận thông tin:**
   • Tên người tham gia
   • Email liên hệ
   • Ghi chú (nếu có)
4. **Hoàn tất đăng ký**

📧 **Sau khi đăng ký:**
• Nhận email xác nhận
• Thông báo nhắc nhở trước sự kiện
• Link tham gia (nếu online)

⚠️ **Lưu ý:** Một số sự kiện có giới hạn số lượng, hãy đăng ký sớm!`;
    }

    // Các câu hỏi về bài báo
    if (
      input.includes("bài báo") ||
      input.includes("nghiên cứu") ||
      input.includes("paper") ||
      input.includes("research")
    ) {
      return `📚 **Xem bài báo nghiên cứu:**

1. **Truy cập "Nghiên cứu"** - Trong menu chính
2. **Duyệt danh mục:**
   • Bài báo mới nhất
   • Theo lĩnh vực
   • Theo tác giả
   • Theo năm xuất bản
3. **Tìm kiếm nâng cao:**
   • Từ khóa
   • Tên tác giả
   • Tên tạp chí

📖 **Thông tin bài báo:**
• Tóm tắt (Abstract)
• Tác giả và đơn vị
• Tạp chí xuất bản
• Link download PDF
• Trích dẫn

🔍 **Mẹo:** Sử dụng từ khóa cụ thể để tìm bài báo phù hợp!`;
    }

    // Câu hỏi về hệ thống tổng quát
    if (
      input.includes("hướng dẫn") ||
      input.includes("help") ||
      input.includes("giúp") ||
      input.includes("làm sao")
    ) {
      return `🎯 **Các chức năng chính của hệ thống:**

**1. Quản lý Sự kiện 📅**
• Tạo/chỉnh sửa sự kiện
• Xem danh sách sự kiện
• Đăng ký tham gia

**2. Nghiên cứu Khoa học 📚**
• Xem bài báo nghiên cứu
• Tìm kiếm theo chủ đề
• Download tài liệu

**3. Quản lý Người dùng 👥**
• Thông tin cá nhân
• Lịch sử tham gia
• Cài đặt tài khoản

Hãy hỏi cụ thể về chức năng nào bạn muốn biết!`;
    }

    // Lời chào và các câu hỏi chung
    if (
      input.includes("xin chào") ||
      input.includes("hello") ||
      input.includes("hi") ||
      input.includes("chào")
    ) {
      return `👋 Xin chào! Tôi rất vui được hỗ trợ bạn sử dụng hệ thống quản lý NCKH.

Bạn có thể hỏi tôi về:
• Cách tạo sự kiện mới
• Xem các sự kiện sắp diễn ra  
• Tham gia sự kiện
• Tìm bài báo nghiên cứu

Hãy đặt câu hỏi cụ thể nhé!`;
    }

    // Trường hợp không hiểu
    return `🤔 Xin lỗi, tôi chưa hiểu rõ câu hỏi của bạn.

**Tôi có thể giúp bạn về:**
• Tạo sự kiện: "Làm sao tạo event?"
• Xem sự kiện: "Sự kiện nào sắp diễn ra?"  
• Tham gia: "Cách tham gia sự kiện?"
• Bài báo: "Xem bài báo nghiên cứu?"

Hãy hỏi rõ hơn để tôi có thể hỗ trợ bạn tốt nhất! 😊`;
  };
