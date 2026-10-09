import gsap from 'gsap';
import { sound } from '../utils/audio.js';
import { launchBirthdayFireworks } from '../utils/confettiHelper.js';

export class SplitStageScreen {
  constructor(container, config, onReplay, onChoir) {
    this.container = container;
    this.config = config;
    this.onReplay = onReplay;
    this.onChoir = onChoir;

    this.render();
  }

  render() {
    // Generate hanging polaroid cards
    const photosHtml = this.config.photos.map((photo, idx) => {
      const swayClass = `sway-${(idx % 4) + 1}`;
      return `
        <div class="hanging-polaroid-item ${swayClass}" data-photo-idx="${idx}" role="button" tabindex="0" aria-label="Xem ảnh ${photo.caption}">
          <!-- Wooden Clothespin -->
          <div class="wooden-clothespin"></div>
          
          <div class="hanging-photo-box">
            <img src="${photo.src}" alt="${photo.caption}" class="hanging-photo-img" loading="lazy">
          </div>
          <div class="hanging-photo-caption">${photo.caption}</div>
        </div>
      `;
    }).join('');

    const savedWish = localStorage.getItem('cmsn_birthday_wish') || '';

    // Render full letter paragraphs directly (No slow typewriter, no skip button)
    const letterParagraphsHtml = this.config.letter.paragraphs.map(p => `
      <p class="letter-paragraph-item">${p}</p>
    `).join('');

    this.container.innerHTML = `
      <div class="split-screen-wrapper">
        <div class="split-stage-container" id="split-stage-root">
          <!-- LEFT COLUMN: THE HANDWRITTEN LETTER (FULL REVEAL) -->
          <section class="split-letter-column" aria-label="Bức thư chúc mừng">
            <div class="vintage-letter-card">
              <div class="letter-dashed-border"></div>

              <div class="letter-top-meta">
                <span class="letter-title-text">${this.config.letter.title}</span>
                <span class="letter-date-text">${this.config.letter.date}</span>
              </div>

              <div class="letter-salutation-text">${this.config.letter.salutation}</div>

              <div class="letter-body-prose" id="split-letter-prose">
                ${letterParagraphsHtml}
              </div>

              <div class="letter-bottom-signature" id="split-signature-box">
                <div class="letter-closing-text">${this.config.letter.closing}</div>
                <div class="letter-sign-name">${this.config.letter.signature}</div>
              </div>
            </div>
          </section>

          <!-- RIGHT COLUMN: HANGING CLOTHESLINE PHOTOS -->
          <section class="split-photos-column" aria-label="Dây treo ảnh kỷ niệm">
            <div class="hanging-gallery-wrapper">
              <!-- Glowing Fairy Light Rope -->
              <div class="hanging-rope-line">
                <div class="fairy-dots-container">
                  <div class="fairy-dot"></div>
                  <div class="fairy-dot"></div>
                  <div class="fairy-dot"></div>
                  <div class="fairy-dot"></div>
                  <div class="fairy-dot"></div>
                  <div class="fairy-dot"></div>
                </div>
              </div>

              <!-- Hanging Polaroids 2x2 Grid -->
              <div class="hanging-polaroids-grid">
                ${photosHtml}
              </div>
            </div>
          </section>
        </div>

        <!-- COMPACT ON-STAGE FOOTER: SLIM WISH PILL & QUICK ACTIONS ON 1 LINE -->
        <footer class="compact-stage-footer">
          <form id="split-wish-form" class="slim-wish-form">
            <span class="slim-wish-icon">🏮</span>
            <input 
              type="text" 
              id="split-wish-input" 
              class="slim-wish-input" 
              placeholder="Gửi điều ước lên ngàn sao..." 
              value="${savedWish}"
              required
            />
            <button type="submit" class="btn-primary slim-wish-btn" id="btn-split-wish">
              <span>Thả Đèn ✨</span>
            </button>
          </form>

          <div class="slim-action-buttons">
            <button class="btn-secondary slim-btn" id="btn-split-fireworks" title="Bắn pháo hoa">
              <span>🎆 Pháo Hoa</span>
            </button>
            <button class="btn-secondary slim-btn" id="btn-split-replay" title="Xem lại từ đầu">
              <span>↺ Xem Lại</span>
            </button>
          </div>
        </footer>
      </div>

      <!-- Lightbox Modal for Photo Inspection -->
      <div class="lightbox-modal" id="split-lightbox">
        <div class="lightbox-card">
          <button class="lightbox-close" id="split-lightbox-close">&times;</button>
          <img src="" alt="" id="split-lightbox-img">
          <div class="lightbox-caption" id="split-lightbox-caption"></div>
          <div class="lightbox-date" id="split-lightbox-date"></div>
        </div>
      </div>
    `;

    this.bindEvents();
    this.playLetterEntrance();
  }

  playLetterEntrance() {
    sound.playSparkle();

    const titleMeta = this.container.querySelector('.letter-top-meta');
    const salutation = this.container.querySelector('.letter-salutation-text');
    const paragraphs = this.container.querySelectorAll('.letter-paragraph-item');
    const signature = this.container.querySelector('#split-signature-box');

    const tl = gsap.timeline();

    tl.fromTo(titleMeta, 
      { opacity: 0, y: -10 }, 
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
    )
    .fromTo(salutation, 
      { opacity: 0, x: -12 }, 
      { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' }, 
      '-=0.2'
    )
    .fromTo(paragraphs, 
      { opacity: 0, y: 14 }, 
      { opacity: 1, y: 0, duration: 0.65, stagger: 0.16, ease: 'power2.out' }, 
      '-=0.2'
    )
    .fromTo(signature, 
      { opacity: 0, y: 10, scale: 0.95 }, 
      { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.6)' }, 
      '-=0.1'
    );
  }

  bindEvents() {
    // 1. Hanging Polaroids click -> Lightbox
    const cards = this.container.querySelectorAll('.hanging-polaroid-item');
    const lightbox = this.container.querySelector('#split-lightbox');
    const lightboxImg = this.container.querySelector('#split-lightbox-img');
    const lightboxCaption = this.container.querySelector('#split-lightbox-caption');
    const lightboxDate = this.container.querySelector('#split-lightbox-date');
    const lightboxClose = this.container.querySelector('#split-lightbox-close');

    cards.forEach(card => {
      const openCard = () => {
        const idx = card.getAttribute('data-photo-idx');
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

    const closeLightbox = () => lightbox.classList.remove('active');
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    // 2. Wish form submission
    const wishForm = this.container.querySelector('#split-wish-form');
    const wishInput = this.container.querySelector('#split-wish-input');

    wishForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = wishInput.value.trim();
      if (!text) return;

      localStorage.setItem('cmsn_birthday_wish', text);
      sound.playLanternLaunch();
      this.launchSkyLantern(text);

      const btnWish = this.container.querySelector('#btn-split-wish');
      if (btnWish) {
        btnWish.innerHTML = '<span>Đã Bay Lên! 🌟</span>';
      }
      launchBirthdayFireworks();

      // Theatrical transition: Fade out letter and polaroids, then bring in Choir & Orchestra!
      const splitWrapper = this.container.querySelector('.split-screen-wrapper');
      if (splitWrapper) {
        gsap.to(splitWrapper, {
          opacity: 0,
          y: -30,
          scale: 0.94,
          duration: 0.9,
          delay: 0.8,
          ease: 'power2.inOut',
          onComplete: () => {
            if (this.onChoir) {
              this.onChoir();
            }
          }
        });
      }
    });

    // 3. Fireworks button
    const btnFireworks = this.container.querySelector('#btn-split-fireworks');
    btnFireworks.addEventListener('click', () => {
      sound.playSparkle();
      launchBirthdayFireworks();
    });

    // 4. Replay button
    const btnReplay = this.container.querySelector('#btn-split-replay');
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
        onComplete: () => lantern.remove()
      }
    );
  }
}
