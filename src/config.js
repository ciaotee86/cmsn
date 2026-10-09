/**
 * CẤU HÌNH THÔNG TIN CHÚC MỪNG SINH NHẬT
 * Bạn có thể dễ dàng thay đổi tên, ngày sinh, lời chúc và danh sách ảnh ở đây!
 */
export const birthdayConfig = {
  // Thông tin người nhận
  recipient: {
    nickname: "Mỹ Huyền",             // Biệt danh / Tên thân mật
    fullName: "Mỹ Huyền",             // Tên đầy đủ
    birthDate: "10/10",               // Ngày sinh
    ageText: "Tuổi Mới Thật Rực Rỡ",   // Lời chúc tuổi
  },

  // Màn hình mở đầu (Sân khấu rèm che)
  intro: {
    badge: "Special Birthday Performance",
    greeting: "Chào Mỹ Huyền, chúc mừng ngày đặc biệt của bạn!",
    hint: "Vở kịch đặc biệt sắp bắt đầu. Chạm vào rèm để mở màn sân khấu...",
    buttonText: "Kéo Rèm Mở Màn Sân Khấu 🎭",
  },

  // Sân khấu Bánh Sinh Nhật & Thổi Nến
  cakeStage: {
    title: "Happy Birthday To You!",
    instruction: "Hãy nhắm mắt lại, ước một điều ước thật đẹp...",
    blowButtonText: "Thổi Tắt Ngọn Nến Nào! 🎂",
    blwonMessage: "Chúc những điều ước của bạn sẽ sớm thành hiện thực! ✨",
    nextButtonText: "Đọc Bức Thư Bí Mật 💌",
    candlesCount: 1, // Số nến trên bánh
  },

  // Bức thư chúc mừng sinh nhật
  letter: {
    title: "Thư Chúc Mừng Sinh Nhật",
    date: "Ngày đặc biệt trong năm",
    salutation: "Gửi Mỹ Huyền,",
    paragraphs: [
      "Chào Mỹ Huyền, hôm nay là một ngày đặc biệt đánh dấu thêm một cột mốc ý nghĩa trên hành trình trưởng thành của bạn.",
      "Bước sang tuổi mới, chúc bạn luôn giữ được sự an yên trong tâm hồn và nguồn năng lượng tích cực. Mong rằng mỗi chặng đường phía trước bạn đi đều sẽ có thêm nhiều trải nghiệm đáng quý, công việc thuận lợi và những nỗ lực của bạn đều sớm gặt hái được thành quả xứng đáng.",
      "Dù cuộc sống đôi khi không tránh khỏi những bộn bề, hy vọng bạn vẫn luôn giữ được sự kiên định, vững vàng và tìm thấy niềm vui trong từng khoảnh khắc giản dị thường ngày.",
      "Rất vui vì có dịp được quen biết và đồng hành cùng bạn. Chúc Mỹ Huyền có một ngày sinh nhật thật ấm áp, trọn vẹn và một tuổi mới ngập tràn may mắn!"
    ],
    closing: "Thân chúc,",
    signature: "Từ một người bạn ✨",
    nextButtonText: "Xem Lại Những Khoảnh Khắc Đẹp 📸"
  },

  // Bộ sưu tập ảnh Polaroid kỷ niệm (dùng link ảnh online hoặc đường dẫn file nội bộ)
  photos: [
    {
      src: "./images/photo1.png",
      caption: "Khoảnh khắc dịu dàng ✨",
      date: "Kỷ niệm đáng nhớ"
    },
    {
      src: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&auto=format&fit=crop&q=80",
      caption: "Bóng bay & Những ước mơ 🎈",
      date: "Khoảnh khắc vui vẻ"
    },
    {
      src: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600&auto=format&fit=crop&q=80",
      caption: "Bánh ngọt cho ngày đặc biệt 🍰",
      date: "Tiệc sinh nhật ấm cúng"
    },
    {
      src: "./images/photo4.png",
      caption: "Nụ cười rạng rỡ của bạn 🌸",
      date: "Tuổi mới an yên"
    }
  ],

  // Cấu hình âm nhạc & hiệu ứng
  audio: {
    bgmUrl: "https://actions.google.com/sounds/v1/holidays/happy_birthday_music_box.ogg",
    trackName: "Happy Birthday Music Box",
    enableBgm: true,
  }
};
