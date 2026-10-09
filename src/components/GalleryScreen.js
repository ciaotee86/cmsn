import gsap from 'gsap';
import { sound } from '../utils/audio.js';
import { launchBirthdayFireworks } from '../utils/confettiHelper.js';

export class GalleryScreen {
  constructor(container, config, onReplay) {
    this.container = container;
    this.config = config;
    this.onReplay = onReplay;
    this.render();
  }

  render() {
    const photosHtml = this.config.photos.map((photo, idx) => `
      <div class="polaroid-card" data-index="${idx}" role="button" tabindex="0" aria-label="Xem ảnh ${photo.caption}">
        <div class="polaroid-pin"></div>
        <div class="polaroid-photo-wrapper">
          <img src="${photo.src}" alt="${photo.caption}" class="polaroid-photo" loading="lazy">
        </div>
        <div class="polaroid-caption">${photo.caption}</div>
      </div>
    `).join('');

    const savedWish = localStorage.getItem('cmsn_birthday_wish') || '';

    this.container.innerHTML = `
      <div class="gallery-stage-wrapper">
        <h1 class="display-title">Khoảnh Khắc Kỷ Niệm</h1>
        <p class="subtitle-text">Từng nụ cười, từng bức hình đều là những viên ngọc quý lưu giữ thời gian...</p>

        <!-- Polaroid Photos -->
        <div class="polaroid-grid">
          ${photosHtml}
        </div>

        <!-- Sky Lantern & Make a Wish Section -->
        <div class="wish-section">
          <h2 class="wish-section-title">🏮 Thả Đèn Trời & Ước Nguyện</h2>
          <p class="subtitle-text" style="margin-bottom: var(--space-xs); font-size: var(--font-sm);">
            Viết điều ước bí mật của bạn vào chiếc đèn trời này nhé!
          </p>

          <form id="wish-form" class="wish-input-group">
            <input 
              type="text" 
              id="wish-input" 
              class="wish-input" 
              placeholder="Nhập điều ước của bạn vào đây..." 
              value="${savedWish}"
              required
            />
            <button type="submit" class="btn-primary" id="btn-submit-wish">
              <span>Thả Đèn ✨</span>
            </button>
          </form>
          <p id="wish-status-text" style="margin-top: var(--space-xs); font-size: var(--font-xs); color: var(--color-text-gold); display: none;">
            Đèn trời đã bay cao mang theo điều ước của bạn lên vũ trụ! 🌟
          </p>
        </div>

        <!-- Footer Actions -->
        <div class="gallery-footer-actions">
          <button class="btn-secondary" id="btn-fireworks-again">
            <span>Bắn Thêm Pháo Hoa 🎆</span>
          </button>
          <button class="btn-primary" id="btn-replay-all">
            <span>Xem Lại Từ Đầu ↺</span>
          </button>
        </div>
      </div>

      <!-- Lightbox Modal -->
      <div class="lightbox-modal" id="gallery-lightbox">
        <div class="lightbox-card">
          <button class="lightbox-close" id="lightbox-btn-close">&times;</button>
          <img src="" alt="" id="lightbox-img">
          <div class="lightbox-caption" id="lightbox-caption"></div>
          <div class="lightbox-date" id="lightbox-date"></div>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    // Polaroid click -> Lightbox
    const cards = this.container.querySelectorAll('.polaroid-card');
    const lightbox = this.container.querySelector('#gallery-lightbox');
    const lightboxImg = this.container.querySelector('#lightbox-img');
    const lightboxCaption = this.container.querySelector('#lightbox-caption');
    const lightboxDate = this.container.querySelector('#lightbox-date');
    const lightboxClose = this.container.querySelector('#lightbox-btn-close');

    cards.forEach(card => {
      const openCard = () => {
        const idx = card.getAttribute('data-index');
        const photo = this.config.photos[idx];
        if (photo) {
          sound.playSparkle();
          lightboxImg.src = photo.src;
          lightboxCaption.textContent = photo.caption;
          lightboxDate.textContent = photo.date || '';
          lightbox.classList.add('active');
        }
      };
      card.addEventListener('click', openCard);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') openCard();
      });
    });

    const closeLightbox = () => {
      lightbox.classList.remove('active');
    };
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    // Wish form submission
    const wishForm = this.container.querySelector('#wish-form');
    const wishInput = this.container.querySelector('#wish-input');
    const wishStatus = this.container.querySelector('#wish-status-text');

    wishForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = wishInput.value.trim();
      if (!text) return;

      localStorage.setItem('cmsn_birthday_wish', text);
      sound.playLanternLaunch();
      this.launchSkyLantern(text);

      wishStatus.style.display = 'block';
      launchBirthdayFireworks();
    });

    // Fireworks button
    const btnFireworks = this.container.querySelector('#btn-fireworks-again');
    btnFireworks.addEventListener('click', () => {
      sound.playSparkle();
      launchBirthdayFireworks();
    });

    // Replay button
    const btnReplay = this.container.querySelector('#btn-replay-all');
    btnReplay.addEventListener('click', () => {
      if (this.onReplay) this.onReplay();
    });
  }

  launchSkyLantern(wishText) {
    const lantern = document.createElement('div');
    lantern.className = 'sky-lantern';
    lantern.textContent = '🌟 ' + wishText.slice(0, 15) + (wishText.length > 15 ? '...' : '');

    const startX = window.innerWidth / 2 - 35 + (Math.random() * 80 - 40);
    lantern.style.left = `${startX}px`;

    document.body.appendChild(lantern);

    gsap.fromTo(lantern, 
      { y: 0, scale: 0.8, opacity: 0.9 },
      { 
        y: -window.innerHeight - 150, 
        x: startX + (Math.random() * 120 - 60),
        scale: 0.3, 
        opacity: 0, 
        duration: 7, 
        ease: 'power1.out',
        onComplete: () => {
          lantern.remove();
        }
      }
    );
  }
}
