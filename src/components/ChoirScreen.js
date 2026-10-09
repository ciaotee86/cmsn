import gsap from 'gsap';
import { sound } from '../utils/audio.js';
import { launchBirthdayFireworks } from '../utils/confettiHelper.js';

export class ChoirScreen {
  constructor(container, config, onFinish) {
    this.container = container;
    this.config = config;
    this.onFinish = onFinish;
    this.hasStopped = false;

    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="choir-stage-wrapper" id="choir-stage-root">
        <!-- Stage Spotlight Beam -->
        <div class="choir-spotlight-beam"></div>

        <!-- Theatrical Header -->
        <div class="choir-header-group" id="choir-header">
          <div class="choir-badge">✨ Royal Birthday Philharmonic ✨</div>
          <h1 class="choir-title">Dàn Hợp Xướng Mừng Sinh Nhật</h1>
          <p class="choir-subtitle">
            Khúc ca chúc phúc ngọt ngào dành tặng ${this.config.recipient.fullName}
          </p>
        </div>

        <!-- The Choir & Orchestra Podium -->
        <div class="choir-podium-arena" id="choir-podium">
          <!-- Floating Musical Notes -->
          <div class="musical-notes-field">
            <span class="floating-music-note note-n1">♪</span>
            <span class="floating-music-note note-n2">♫</span>
            <span class="floating-music-note note-n3">♬</span>
            <span class="floating-music-note note-n4">♩</span>
            <span class="floating-music-note note-n5">♪</span>
          </div>

          <!-- Orchestra Section (Instruments) -->
          <div class="orchestra-section-row">
            <div class="musician-unit">
              <span class="musician-character">🎻</span>
              <span class="musician-label">Violin</span>
            </div>
            <div class="musician-unit">
              <span class="musician-character">🎺</span>
              <span class="musician-label">Trumpet</span>
            </div>
            <div class="musician-unit">
              <span class="musician-character">🎷</span>
              <span class="musician-label">Saxophone</span>
            </div>
            <div class="musician-unit">
              <span class="musician-character">🎹</span>
              <span class="musician-label">Piano</span>
            </div>
            <div class="musician-unit">
              <span class="musician-character">🪕</span>
              <span class="musician-label">Cello</span>
            </div>
          </div>

          <!-- Choir Vocalists (Singers) -->
          <div class="choir-vocalists-row">
            <div class="choir-singer-unit">
              <span class="singer-avatar">👩‍🎤</span>
              <span class="singer-songbook">📖</span>
              <span class="singer-role-tag">Soprano</span>
            </div>
            <div class="choir-singer-unit">
              <span class="singer-avatar">👨‍🎤</span>
              <span class="singer-songbook">📖</span>
              <span class="singer-role-tag">Tenor</span>
            </div>
            <div class="choir-singer-unit">
              <span class="singer-avatar">👩‍🎤</span>
              <span class="singer-songbook">📖</span>
              <span class="singer-role-tag">Alto</span>
            </div>
            <div class="choir-singer-unit">
              <span class="singer-avatar">👨‍🎤</span>
              <span class="singer-songbook">📖</span>
              <span class="singer-role-tag">Bass</span>
            </div>
          </div>

          <!-- The Conductor -->
          <div class="conductor-podium-area">
            <span class="conductor-avatar">🎼</span>
            <div class="conductor-stand"></div>
          </div>
        </div>

        <!-- Theatrical Stop Button -->
        <div class="choir-controls-row" id="choir-controls">
          <button class="btn-stop-choir" id="btn-stop-choir" type="button" aria-label="Dừng biểu diễn nhạc">
            <span class="stop-icon">⏹</span>
            <span>Dừng Nhạc</span>
          </button>
        </div>

        <!-- The End! Banner (Hidden initially) -->
        <div class="the-end-container" id="the-end-box">
          <h1 class="the-end-title">The End!</h1>
          <p class="the-end-subtitle">
            Cảm ơn vì đã cùng tạo nên những kỷ niệm tuyệt đẹp. Chúc ${this.config.recipient.fullName} một tuổi mới luôn ngập tràn may mắn, bình yên và vạn sự như ý! ✨
          </p>
          <div class="the-end-tassel-ornament">🎭 🌟 🎂 🌟 🎭</div>
        </div>
      </div>
    `;

    this.playEntranceAnimations();
    this.bindEvents();
  }

  playEntranceAnimations() {
    const root = this.container.querySelector('#choir-stage-root');
    const header = this.container.querySelector('#choir-header');
    const podium = this.container.querySelector('#choir-podium');
    const controls = this.container.querySelector('#choir-controls');

    // Start playing grand choir music!
    sound.playChoirMusic();
    launchBirthdayFireworks();

    gsap.fromTo(header,
      { opacity: 0, y: -30, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'back.out(1.5)' }
    );

    gsap.fromTo(podium,
      { opacity: 0, y: 40, scale: 0.92 },
      { opacity: 1, y: 0, scale: 1, duration: 1.0, delay: 0.2, ease: 'power3.out' }
    );

    gsap.fromTo(controls,
      { opacity: 0, scale: 0.85 },
      { opacity: 1, scale: 1, duration: 0.6, delay: 0.6, ease: 'back.out(1.7)' }
    );
  }

  bindEvents() {
    const btnStop = this.container.querySelector('#btn-stop-choir');
    if (!btnStop) return;

    btnStop.addEventListener('click', () => {
      if (this.hasStopped) return;
      this.hasStopped = true;

      // 1. Stop choir music immediately
      sound.stopChoirMusic();
      sound.playApplause();

      // 2. Animate out the band & header
      const header = this.container.querySelector('#choir-header');
      const podium = this.container.querySelector('#choir-podium');
      const controls = this.container.querySelector('#choir-controls');
      const theEndBox = this.container.querySelector('#the-end-box');

      gsap.to([header, podium, controls], {
        opacity: 0,
        y: -25,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power2.inOut',
        onComplete: () => {
          if (header) header.style.display = 'none';
          if (podium) podium.style.display = 'none';
          if (controls) controls.style.display = 'none';

          // 3. Reveal "The End!"
          if (theEndBox) {
            theEndBox.classList.add('active');
            sound.playStageChime();
            launchBirthdayFireworks();

            gsap.fromTo(theEndBox,
              { opacity: 0, scale: 0.75, y: 20 },
              { opacity: 1, scale: 1, y: 0, duration: 0.9, ease: 'back.out(1.6)' }
            );

            // 4. After 2.2 seconds, trigger curtains close!
            setTimeout(() => {
              gsap.to(theEndBox, {
                opacity: 0,
                scale: 0.95,
                duration: 0.6,
                onComplete: () => {
                  if (this.onFinish) {
                    this.onFinish();
                  }
                }
              });
            }, 2200);
          }
        }
      });
    });
  }
}
