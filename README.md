# 🎂 Birthday Celebration Interactive Web (CMSN)

Trang web chúc mừng sinh nhật tương tác lung linh, giàu cảm xúc, hoàn toàn chạy Client-side (không cần máy chủ/database).

---

## ✨ Điểm Nổi Bật & Các Tương Tác Thú Vị

1. **Bầu Trời Đêm Kỳ Diệu & Hộp Quà 3D (Stage 1)**:
   - Nền trời sao lấp lánh (Canvas Starfield) với hiệu ứng ánh sáng mờ ảo.
   - Hộp quà 3D buộc ruy băng vàng kim, rung rinh mời gọi người nhận mở quà kèm âm thanh chuông ma thuật (Web Audio synthesized).
2. **Sân Khấu Bánh Kem & Thổi Nến (Stage 2)**:
   - Bánh kem 2 tầng trang nhã, ngọn nến lung linh có animation bập bùng chân thực.
   - **Tương tác Thổi Nến Độc Đáo**:
     - Nhấn nút hoặc chạm trực tiếp vào ngọn nến để thổi.
     - **Hỗ trợ Micro**: Tích hợp nhận diện hơi thở qua microphone thật!
   - Khi nến tắt: làn khói mờ ảo uốn lượn bay lên, bùng nổ pháo hoa Confetti rực rỡ và bóng bay ngập tràn màn hình (có thể bấm "Bốp" từng quả bóng bay kèm âm thanh).
3. **Phong Bì Thư 3D & Thư Viết Tay Đánh Chữ (Stage 3)**:
   - Phong bì thư cổ điển với tem niêm phong sáp đỏ hình trái tim.
   - Chạm vào tem: nắp phong bì mở 3D, bức thư bằng giấy vintage nhô lên.
   - Hiệu ứng máy đánh chữ (Typewriter) gõ từng câu chữ ấm áp kèm âm thanh phím gõ tinh tế (có nút đọc nhanh).
4. **Bộ Sưu Tập Polaroid & Thả Đèn Trời Ước Nguyện (Stage 4)**:
   - Các khung ảnh Polaroid kỷ niệm nghiêng góc nghệ thuật, hover/click phóng to xem chi tiết (Lightbox).
   - **Hộp ước nguyện Đèn Trời**: Người nhận viết điều ước, bấm "Thả Đèn" -> chiếc đèn trời phát sáng từ từ bay vút lên bầu trời đêm, tự động lưu vào trình duyệt (`localStorage`).
5. **Âm Thanh & Điều Khiển**:
   - Đĩa than quay tròn ở góc màn hình để bật/tắt nhạc nền.
   - Nút bắn pháo hoa nhanh bất kỳ lúc nào.
   - Tự tạo âm thanh (Chime, Blow, Pop, Sparkle, Typewriter, Lantern) qua Web Audio API không lo chết link.

---

## 🚀 Hướng Dẫn Chạy & Thử Nghiệm

### 1. Khởi động môi trường phát triển (Dev Server):
```bash
npm run dev
# Mở trình duyệt tại: http://localhost:3000
```

### 2. Đóng gói bản Production:
```bash
npm run build
# Toàn bộ mã nguồn hoàn chỉnh sẽ nằm trong thư mục: dist/
```

---

## 🎨 Hướng Dẫn Tùy Biến Cho Người Nhận

### Cách 1: Thay đổi trực tiếp trong file [`src/config.js`](file:///d:/SourceCode/WEB/cmsn/src/config.js)
Mở file `src/config.js`, bạn chỉ cần sửa các dòng chữ tiếng Việt có sẵn:
- **Tên người nhận**: `recipient.fullName`, `recipient.nickname`
- **Lời chúc trên bánh kem**: `cakeStage.instruction`, `cakeStage.blwonMessage`
- **Nội dung bức thư**: Thay đổi các đoạn văn trong mảng `letter.paragraphs`
- **Danh sách ảnh kỷ niệm**: Thay link ảnh của bạn vào mảng `photos` (có thể dùng link ảnh trên mạng hoặc đặt ảnh vào thư mục `public/` rồi điền `/anh1.jpg`).
- **Nhạc nền**: Đổi link file nhạc trong `audio.bgmUrl`.

### Cách 2: Tùy biến nhanh qua đường dẫn URL
Bạn có thể gửi kèm tên qua link:
`https://link-trang-web.com/?name=Ngọc+Ánh&nick=Bé+Mèo`
Trang web sẽ tự động điền tên người đó vào toàn bộ màn hình và bức thư!
