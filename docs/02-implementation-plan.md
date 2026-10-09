# Kế Hoạch Triển Khai (Implementation Plan)
## Dự án: Birthday Celebration Interactive Web (CMSN)

---

## 1. Lộ trình Cấp cao (High-Level Roadmap)

| Phase | Tên giai đoạn | Thời lượng | Mục tiêu cốt lõi | Sản phẩm bàn giao |
|:---|:---|:---|:---|:---|
| **Phase 1** | Project Setup & Assets | 0.5 ngày | Khung dự án, hệ thống Tokens CSS & Sound/FX Assets | Project base, audio/icon assets, `:root` design tokens |
| **Phase 2** | Interactive Stage 1: Welcome & Cake | 1.0 ngày | Intro đếm ngược, bánh kem SVG/CSS, tương tác thổi nến | Màn hình Intro + Cake blowing scene + Confetti FX |
| **Phase 3** | Interactive Stage 2: Letter & Gallery | 1.0 ngày | Mở phong thư 3D, chữ viết tay gõ máy, Polaroid gallery | 3D Envelope, Typewriter text, Draggable photo gallery |
| **Phase 4** | Sound Engine & Personalization | 0.5 ngày | Tích hợp Web Audio, Sound FX, Config JSON cá nhân hóa | Audio controller, `config.js` loader, URL params |
| **Phase 5** | Polish, Mobile Audit & Release | 0.5 ngày | Tinh chỉnh 60fps, responsive mobile touch, đóng gói | Production build, zero-lag mobile test, hướng dẫn deploy |

---

## 2. Chi tiết Công việc theo Thẻ (Task Breakdown Checklist Cards)

### Phase 1: Khởi tạo & Hệ thống Token Thiết kế (Project Setup & Assets)

- [ ] **[T1.1] Khởi tạo cấu trúc dự án & Bundler Vite** (1h)
  - **Module/Files**: `package.json`, `index.html`, `src/main.js`, `vite.config.js`
  - **Dependencies**: Không
  - **Details**: Thiết lập Vite Vanilla JS hoặc React (theo người dùng chọn), cấu trúc thư mục `src/assets`, `src/styles`, `src/components`, `src/audio`.
  - **DoD**: Dự án chạy `npm run dev` hiển thị trang chào cơ bản mượt mà không lỗi console.

- [ ] **[T1.2] Xây dựng Typography & Color Design System Tokens** (1.5h)
  - **Module/Files**: `src/styles/variables.css`, `src/styles/global.css`
  - **Dependencies**: T1.1
  - **Details**: Khởi tạo toàn bộ CSS `:root` variables cho bảng màu (Midnight Blue, Candle Warm, Rose Pink), scale font chữ (12, 14, 16, 20, 24, 32, 48px), 2 font family (1 Display tay cầm cảm xúc, 1 Body sans-serif nét).
  - **DoD**: Mọi style sau này chỉ dùng `var(--...)`, không hardcode font-size hoặc mã màu.

- [ ] **[T1.3] Chuẩn bị kho Asset Âm thanh & Hiệu ứng Hạt** (1.5h)
  - **Module/Files**: `public/audio/*`, `public/images/*`, `src/utils/particles.js`
  - **Dependencies**: T1.1
  - **Details**: Thu thập bài nhạc mừng sinh nhật du dương (lo-fi / acoustic), sound effects (sparkle, balloon pop, candle blow, applause). Thiết lập canvas-confetti.
  - **DoD**: Kiểm thử trigger âm thanh và hạt pháo hoa hoạt động trên trình duyệt.

---

### Phase 2: Màn Chào & Sân Khấu Bánh Kem (Welcome & Cake Stage)

- [ ] **[T2.1] Thiết kế Màn hình Mở đầu & Nút Kích hoạt Trải nghiệm** (2h)
  - **Module/Files**: `src/components/IntroScreen.js`, `src/styles/intro.css`
  - **Dependencies**: T1.2, T1.3
  - **Details**: Màn hình rèm nhung hoặc hộp quà bí ẩn mời người nhận click "Bắt đầu khám phá" (giải quyết chính sách chặn autoplay audio của trình duyệt).
  - **DoD**: Khi click, nhạc nền êm dịu cất lên, màn hình chuyển cảnh fade/curtain sang cảnh bánh kem.

- [ ] **[T2.2] Thiết kế Bánh Sinh Nhật & Ngọn Nến Lung Linh** (3h)
  - **Module/Files**: `src/components/BirthdayCake.js`, `src/styles/cake.css`
  - **Dependencies**: T2.1
  - **Details**: Vẽ bánh sinh nhật đa tầng bằng CSS/SVG với ngọn nến có animation ngọn lửa chuyển động chân thực (flame flicker & glow).
  - **DoD**: Ngọn lửa bập bùng sống động, có ánh sáng ấm phản chiếu lên mặt bánh.

- [ ] **[T2.3] Tương tác Thổi Nến & Bắn Pháo Hoa Mừng Rỡ** (3h)
  - **Module/Files**: `src/components/CandleInteraction.js`, `src/utils/confetti.js`
  - **Dependencies**: T2.2
  - **Details**: Hỗ trợ 2 chế độ: Click/giữ vào ngọn nến để thổi hoặc nhận diện âm thanh microphone (nếu được cấp quyền). Khi nến tắt: phát âm thanh tiếng thổi, tạo làn khói mong manh bay lên, sau đó pháo hoa confetti nổ bung ngập màn hình kèm giai điệu Happy Birthday cao trào.
  - **DoD**: Nến tắt mượt mà, làn khói xuất hiện, pháo giấy bay rực rỡ và chuyển sang nút mở thư.

---

### Phase 3: Thiệp Thư 3D & Kho Ảnh Kỷ Niệm (Letter & Gallery)

- [ ] **[T3.1] Phong Bì Thư 3D & Hiệu ứng Mở Nắp** (3h)
  - **Module/Files**: `src/components/EnvelopeModal.js`, `src/styles/envelope.css`
  - **Dependencies**: T2.3
  - **Details**: Thiết kế phong thư 3D bằng CSS transform. Khi click vào tem niêm phong hình trái tim, nắp phong thư mở ra và bức thư từ từ nhô lên phóng to toàn màn hình.
  - **DoD**: Hiệu ứng mở nắp 3D chuyển động mượt 60fps, không giật lag.

- [ ] **[T3.2] Lá Thư Chúc Mừng với Hiệu ứng Typewriter** (2h)
  - **Module/Files**: `src/components/LetterContent.js`, `src/styles/letter.css`
  - **Dependencies**: T3.1
  - **Details**: Thư trải dài phong cách giấy vintage/pastel, từng dòng chữ yêu thương được gõ tự động theo nhịp kèm âm thanh lách cách máy đánh chữ cổ điển hoặc êm ái.
  - **DoD**: Đọc mượt, có nút "Bỏ qua hiệu ứng gõ" để đọc ngay toàn bộ thư.

- [ ] **[T3.3] Bộ Sưu Tập Ảnh Kỷ Niệm Polaroid Lơ Lửng** (3h)
  - **Module/Files**: `src/components/PolaroidGallery.js`, `src/styles/gallery.css`
  - **Dependencies**: T3.2
  - **Details**: Các khung ảnh Polaroid viền trắng có ghi chú chữ viết tay bên dưới, bố trí so le tự nhiên, có thể kéo thả (draggable), xoay nhẹ góc khi hover hoặc click để phóng to xem chi tiết.
  - **DoD**: Hỗ trợ chạm kéo trên điện thoại, ảnh hiển thị sắc nét.

---

### Phase 4: Bộ Điều Khiển Âm Thanh & Động Cơ Cá Nhân Hóa (Audio & Config)

- [ ] **[T4.1] Trình Điều Khiển Nhạc Nền & Hiệu Ứng Âm Thanh** (2h)
  - **Module/Files**: `src/utils/soundManager.js`, `src/components/AudioBar.js`
  - **Dependencies**: T1.3
  - **Details**: Nút đĩa than quay nhẹ ở góc màn hình hiển thị trạng thái phát/tắt nhạc, hỗ trợ đổi bài hát hoặc tắt hẳn SFX nếu người nhận muốn không gian yên tĩnh.
  - **DoD**: Điều khiển bật/tắt tức thì, không bị chồng chéo luồng âm thanh.

- [ ] **[T4.2] Bộ Cấu Hình Dễ Dàng Cho Người Dùng (`config.js`)** (2h)
  - **Module/Files**: `src/config.js`
  - **Dependencies**: T3.2, T3.3
  - **Details**: Tách toàn bộ nội dung cá nhân (Tên người sinh nhật, ngày sinh, danh sách ảnh, lời nhắn, link nhạc) vào 1 file `config.js` có chú thích tiếng Việt cực kỳ rõ ràng để bất kỳ ai cũng có thể thay thế trong 2 phút.
  - **DoD**: Thay đổi dữ liệu trong `config.js`, trang web tự động cập nhật ngay lập tức.

---

### Phase 5: Tối Ưu Hóa & Đóng Gói (Polish & Release)

- [ ] **[T5.1] Tối ưu Hiệu Năng & Trải Nghiệm Cảm Ứng Di Động (Mobile Touch)** (2h)
  - **Module/Files**: Toàn bộ CSS/JS
  - **Dependencies**: T4.2
  - **Details**: Kiểm tra trên các kích thước màn hình (iPhone, iPad, Desktop), tối ưu cảm ứng chạm (touch event), ngăn cuộn trang ngoài ý muốn, đảm bảo 60fps trên thiết bị cấu hình trung bình.
  - **DoD**: Điểm Performance Lighthouse > 90, không bị vỡ layout trên mobile.

- [ ] **[T5.2] Đóng gói & Soạn Tài Liệu Hướng Dẫn Cá Nhân Hóa** (1h)
  - **Module/Files**: `README.md`, `dist/`
  - **Dependencies**: T5.1
  - **Details**: Viết hướng dẫn chi tiết cách thay ảnh, sửa lời chúc và cách đưa lên mạng miễn phí (Vercel / GitHub Pages / Netlify).
  - **DoD**: Tài liệu dễ hiểu, có thể hoàn tất việc tặng quà sau vài bước.

---

## 3. Tiêu Chí Nghiệm Thu Từng Giai Đoạn (Phase Exit Criteria)

1. **Phase 1 Exit**: Design system variables đầy đủ, asset âm thanh nạp thành công, cấu trúc thư mục chuẩn.
2. **Phase 2 Exit**: Khách truy cập bấm "Bắt đầu", nến sáng lung linh, thổi nến thành công bung confetti rực rỡ kèm âm thanh.
3. **Phase 3 Exit**: Phong thư mở nắp 3D, chữ gõ tự động đầy cảm xúc, ảnh Polaroid kéo thả mượt mà.
4. **Phase 4 Exit**: Chỉ cần sửa `config.js` là đổi được toàn bộ tên, thư và ảnh của người khác.
5. **Phase 5 Exit**: Không lỗi console, tương thích 100% trên điện thoại (iOS Safari & Android Chrome), sẵn sàng chia sẻ.
