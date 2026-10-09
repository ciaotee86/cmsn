import { sound } from '../utils/audio.js';
import { launchBirthdayFireworks } from '../utils/confettiHelper.js';

export class AudioControls {
  constructor(container, config) {
    this.container = container;
    this.config = config;
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <button class="floating-fireworks-btn" id="btn-quick-fireworks" title="Bắn pháo hoa">
        <span>🎆</span>
        <span>Pháo hoa</span>
      </button>

      <div class="floating-controls">
        <button class="disc-btn" id="btn-toggle-music" aria-label="Bật/tắt nhạc" title="Bật/tắt nhạc nền">
          <div class="disc-center"></div>
          <span class="music-status-tooltip" id="music-tooltip-text">Phát nhạc 🎵</span>
        </button>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    const btnMusic = this.container.querySelector('#btn-toggle-music');
    const tooltip = this.container.querySelector('#music-tooltip-text');
    const btnFireworks = this.container.querySelector('#btn-quick-fireworks');

    btnMusic.addEventListener('click', () => {
      const isPlaying = sound.toggleBgm();
      if (isPlaying) {
        btnMusic.classList.add('spinning');
        tooltip.textContent = 'Tạm dừng ⏸️';
      } else {
        btnMusic.classList.remove('spinning');
        tooltip.textContent = 'Phát nhạc 🎵';
      }
    });

    btnFireworks.addEventListener('click', () => {
      sound.playSparkle();
      launchBirthdayFireworks();
    });

    // Check periodically if BGM started
    setInterval(() => {
      if (sound.isPlayingBgm && !btnMusic.classList.contains('spinning')) {
        btnMusic.classList.add('spinning');
        tooltip.textContent = 'Tạm dừng ⏸️';
      }
    }, 1000);
  }
}
