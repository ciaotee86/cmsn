# Changelog

All notable changes to the **Birthday Celebration Interactive Web (CMSN)** project will be documented in this file.

## [1.6.3] - 2026-10-09 - Royal Midnight Navy & Gold Curtain Theme

### Changed
- **Chuyển đổi màu sắc rèm sân khấu sang Xanh Dương Hoàng Gia & Vàng Kim (Royal Midnight Navy & Gold)**:
  - Cập nhật hệ màu nhung vải: chuyển từ sắc đỏ rượu vang sang dải chuyển màu xanh đêm hoàng gia sâu thẳm (`#030816` → `#091a40` → `#12347a` → `#1e4fc2` → `#38bdf8`).
  - Đồng bộ toàn bộ các chi tiết sân khấu: dải yếm lượn sóng (`swags`), cánh buồm rủ bên hông (`jabots`), 8 nếp gấp nhung phập phồng tự nhiên (`curtain-fold`) và nút mở màn sân khấu.
  - Tương phản hoàn hảo với viền tua rua vàng kim (`#fbbf24`), tạo cảm giác lộng lẫy, huyền bí và sang trọng như một nhà hát opera châu Âu danh giá.

## [1.6.2] - 2026-10-09 - Update Polaroid Photos with Custom Personal Images

### Changed
- **Thay thế ảnh Polaroid theo yêu cầu**:
  - Ảnh số 1 (góc trên bên trái): Thay bằng bức ảnh váy trắng cầu thang lung linh (`/images/photo1.png`).
  - Ảnh số 4 (góc dưới bên phải): Thay bằng bức ảnh nụ cười rạng rỡ cầm hoa (`/images/photo4.png`).
  - Tối ưu đường dẫn tĩnh và tự động đồng bộ vào thư mục `public/images/` để đảm bảo hiển thị sắc nét, tương thích hoàn hảo cả khi phát triển (dev) lẫn khi đóng gói (production build).

## [1.6.1] - 2026-10-09 - Personalize to Mỹ Huyền with Thoughtful, Elegant Tone

### Changed
- **Cập nhật người nhận thành Mỹ Huyền**:
  - Toàn bộ tên hiển thị trên bánh sinh nhật, bức thư, dàn hợp xướng và các thông điệp được đồng bộ về **Mỹ Huyền**.
- **Viết lại toàn bộ nội dung bức thư theo văn phong sâu sắc, chừng mực**:
  - Điều chỉnh sắc thái lời chúc: thay thế các từ ngữ quá sến hay thân thiết ("yêu thương vô điều kiện", "mảnh ghép ấm áp") bằng văn phong thanh lịch, chân thành, sâu sắc về sự trưởng thành, kiên định và an yên trong tâm hồn.
  - Lời mở đầu: `Gửi Mỹ Huyền,` (trang trọng, ấm áp).
  - Lời kết: `Thân chúc,` - Chữ ký: `Từ một người bạn ✨`.
  - Cập nhật các chú thích ảnh Polaroid phù hợp với mối quan hệ bạn bè/đồng nghiệp lịch thiệp.

## [1.6.0] - 2026-10-09 - Royal Choir Performance, The End, Grand Curtain Close & Replay Flow

### Added
- **Màn Hợp Xướng & Dàn Nhạc Hoàng Gia (`ChoirScreen`)**:
  - Khi người dùng gửi điều ước và thả đèn trời (`SplitStageScreen`), toàn bộ nội dung (bức thư, dây ảnh, thanh thả đèn) mượt mà biến mất.
  - Sân khấu xuất hiện dàn hợp xướng rạp hát với ánh đèn spotlight, các nhạc công (Violin, Trumpet, Saxophone, Piano, Cello), ca sĩ hợp xướng (Soprano, Tenor, Alto, Bass), nhạc trưởng (Conductor) và các nốt nhạc lung linh bay bổng.
  - Tự động hòa tấu giai điệu sinh nhật Happy Birthday hoành tráng bằng Web Audio API polyphonic synthesizer không phụ thuộc file ngoài.
  - Nút **"Dừng Nhạc"** rạp hát nổi bật: khi bấm, dàn hợp xướng dừng nhạc, nhận tiếng vỗ tay tán thưởng và mờ dần.
  - Hiển thị dòng chữ nghệ thuật tráng lệ **"The End!"** cùng lời chúc vàng kim phát sáng.
- **Quy Trình Đóng Rèm & Mở Rèm Thổi Bánh Lại (`Curtain Flow Loop`)**:
  - Sau khi kết thúc lời chúc "The End!", 2 cánh rèm nhung rạp hát khép kín hoàn toàn cùng hiệu ứng âm thanh kéo rèm chân thực.
  - Khi rèm khép kín, người dùng chỉ cần **chạm/click trực tiếp vào rèm** (không cần nút bấm trung gian).
  - Hai cánh rèm trượt mở hai bên, đèn spotlight bật sáng và đưa người nhận quay trở lại bước đầu tiên: **thổi nến trên bánh sinh nhật (`CakeScreen`)**.
  - Toàn bộ 5 ngọn nến được thắp sáng lại, đồng thời hệ thống tự động hạ nhỏ BGM (`duckBgm(0.08)`) và lọc nhiễu gió độc quyền để triệt tiêu hoàn toàn hiện tượng nến tự tắt do âm thanh từ loa ngoài dội vào micro.



### Fixed
- **Khắc phục lỗi tự động thổi nến khi vừa vào màn hình (Premature Auto-Blow)**:
  - Khắc phục triệt để lỗi nến tự tắt do xung tín hiệu phần cứng âm thanh hoặc tiếng nhạc nền khi micro vừa kết nối.
  - Bổ sung thời gian đệm Warm-up 1.5 giây: trong 1.5 giây đầu, hệ thống chỉ hiệu chuẩn và hấp thụ mức ồn nền môi trường (`ambientBaseline`), tuyệt đối không kích hoạt tắt nến.
  - Nâng ngưỡng nhận diện: yêu cầu luồng gió thổi tần số thấp phải duy trì liên tục ít nhất 14 frames (~250ms), loại bỏ hoàn toàn các âm thanh thoáng qua, tiếng gõ phím hay tiếng nhạc loa ngoài.
  - Giữ nguyên 100% thiết kế giao diện thẻ micro ban đầu theo yêu cầu.

## [1.5.4] - 2026-10-09 - Direct Interactive Envelope Click & Seamless Stage Flow

### Enhanced
- **Tương Tác Bấm Trực Tiếp Vào Phong Bì Để Mở (Direct Envelope Interaction)**:
  - Gỡ bỏ hoàn toàn nút bấm nhân tạo "Xem Bức Thư & Kỷ Niệm".
  - Sau khi thổi tắt 5 ngọn nến, một chiếc **Phong Bì Thư Cổ Điển 3D (Vintage Envelope)** với con dấu sáp đỏ trái tim rực sáng xuất hiện lơ lửng ngay trên sàn sân khấu.
  - Người nhận **chạm / click trực tiếp vào chiếc phong bì**: con dấu sáp đỏ bung nở, nắp phong bì mở ra trong không gian 3D và bức thư bay lên, nhẹ nhàng chuyển sang bố cục Bức Thư bên trái và Dây Ảnh Treo bên phải.
