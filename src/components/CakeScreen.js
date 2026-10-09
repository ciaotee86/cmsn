import gsap from 'gsap';
import { sound } from '../utils/audio.js';
import { launchCandleBlowBurst, launchBirthdayFireworks } from '../utils/confettiHelper.js';

export class CakeScreen {
  constructor(container, config, onNext) {
    this.container = container;
    this.config = config;
    this.onNext = onNext;
    this.isBlown = false;
    this.micStream = null;
    this.audioContext = null;
    this.analyser = null;
    this.balloonInterval = null;
    this.isCleanedUp = false;
    this.blowThresholdCounter = 0;
    this.micStartTime = 0;
    this.ambientBaseline = 25;

    // Duck background music to prevent it from feeding back into microphone
    sound.duckBgm(0.08);

    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="cake-stage-wrapper">
        <!-- Title with Staggered Entrance Animation -->
        <div class="cake-title-group" id="cake-title-group">
          <h1 class="cake-main-title">
            Chúc Mừng Sinh Nhật
            <span class="recipient-highlight">${this.config.recipient.fullName}</span>
          </h1>
          <p class="cake-instruction-sub" id="cake-instruction-text">
            ${this.config.cakeStage.instruction}
          </p>
        </div>

        <!-- Exquisite Decorated Birthday Cake with 5 Candles -->
        <div class="cake-scene" id="cake-scene-element">
          <!-- Multi-Candles Row -->
          <div class="candles-row" id="candles-row" role="button" aria-label="Nến sinh nhật" tabindex="0">
            <div class="candle-unit c1" data-candle="1">
              <div class="candle-flame"></div>
              <div class="smoke-wisp"></div>
              <div class="candle-wick"></div>
              <div class="candle-stick"></div>
            </div>
            <div class="candle-unit c2" data-candle="2">
              <div class="candle-flame"></div>
              <div class="smoke-wisp"></div>
              <div class="candle-wick"></div>
              <div class="candle-stick"></div>
            </div>
            <div class="candle-unit c3" data-candle="3">
              <div class="candle-flame"></div>
              <div class="smoke-wisp"></div>
              <div class="candle-wick"></div>
              <div class="candle-stick"></div>
            </div>
            <div class="candle-unit c4" data-candle="4">
              <div class="candle-flame"></div>
              <div class="smoke-wisp"></div>
              <div class="candle-wick"></div>
              <div class="candle-stick"></div>
            </div>
            <div class="candle-unit c5" data-candle="5">
              <div class="candle-flame"></div>
              <div class="smoke-wisp"></div>
              <div class="candle-wick"></div>
              <div class="candle-stick"></div>
            </div>
          </div>

          <!-- Fresh Strawberries Topping -->
          <div class="strawberries-row">
            <div class="strawberry-item"></div>
            <div class="strawberry-item"></div>
            <div class="strawberry-item"></div>
            <div class="strawberry-item"></div>
          </div>

          <!-- Top Cake Tier -->
          <div class="cake-tier-top">
            <div class="cream-drips-top"></div>
            <div class="cream-pearls-row">
              <div class="cream-pearl"></div>
              <div class="cream-pearl"></div>
              <div class="cream-pearl"></div>
              <div class="cream-pearl"></div>
              <div class="cream-pearl"></div>
            </div>
          </div>

          <!-- Bottom Cake Tier -->
          <div class="cake-tier-bottom">
            <div class="cream-drips-bottom"></div>
            <div class="cream-pearls-row" style="bottom: 6px;">
              <div class="cream-pearl"></div>
              <div class="cream-pearl"></div>
              <div class="cream-pearl"></div>
              <div class="cream-pearl"></div>
              <div class="cream-pearl"></div>
              <div class="cream-pearl"></div>
            </div>
          </div>

          <!-- Silver Pedestal Plate -->
          <div class="cake-pedestal"></div>
        </div>

        <!-- Real Microphone Breath Prompt Card (NO FAKE BLOW BUTTON!) -->
        <div class="breath-prompt-card" id="breath-prompt-card">
          <div class="breath-status-line">
            <span class="mic-icon-pulse">🎙️</span>
            <span id="breath-status-text">Thổi thật mạnh vào Micro để tắt nến...</span>
          </div>

          <!-- Realtime Breath Volume / Intensity Bar -->
          <div class="breath-meter-track">
            <div class="breath-meter-fill" id="breath-meter-fill"></div>
          </div>

          <span class="breath-sub-tip" id="breath-sub-tip">
            (Thổi luồng gió "phùuu" vào gần micro hoặc chạm nhẹ vào nến)
          </span>
        </div>

        <!-- Interactive Envelope on Stage (Click directly to open letter!) -->
        <div class="cake-proceed-zone" id="cake-proceed-zone">
          <div class="interactive-envelope-trigger" id="interactive-envelope-trigger" role="button" tabindex="0" aria-label="Mở bức thư sinh nhật">
            <div class="envelope-mini-podium">
              <div class="envelope-mini-flap" id="mini-envelope-flap"></div>
              <div class="envelope-mini-seal" id="mini-wax-seal">❤</div>
            </div>
            <div class="envelope-mini-hint">Chạm vào phong bì để mở ra 💌</div>
          </div>
        </div>
      </div>
      <div id="balloon-container"></div>
    `;

    this.playEntranceAnimations();
    this.initMicrophone();
    this.bindEvents();
  }

  playEntranceAnimations() {
    // 1. Animated reveal for Title
    const titleGroup = this.container.querySelector('#cake-title-group');
    const cakeScene = this.container.querySelector('#cake-scene-element');
    const breathCard = this.container.querySelector('#breath-prompt-card');

    gsap.fromTo(titleGroup, 
      { opacity: 0, y: -40, scale: 0.9, filter: 'blur(8px)' },
      { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 1.2, ease: 'back.out(1.7)' }
    );

    // 2. Gentle bouncy rise for Cake
    gsap.fromTo(cakeScene,
      { opacity: 0, y: 50, scale: 0.85 },
      { opacity: 1, y: 0, scale: 1, duration: 1.0, delay: 0.3, ease: 'power3.out' }
    );

    // 3. Fade in for Breath Meter
    gsap.fromTo(breathCard,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, delay: 0.7, ease: 'power2.out' }
    );
  }

  bindEvents() {
    const candlesRow = this.container.querySelector('#candles-row');
    const breathCard = this.container.querySelector('#breath-prompt-card');

    // Click on candles or breath card as natural fallback
    const manualBlowHandler = () => {
      if (!this.isBlown) {
        this.extinguishAllCandles();
      }
    };

    candlesRow.addEventListener('click', manualBlowHandler);
    breathCard.addEventListener('click', () => {
      if (!this.micStream) {
        this.requestMicAccess();
      }
    });

    const envelopeTrigger = this.container.querySelector('#interactive-envelope-trigger');
    const handleEnvelopeOpen = () => {
      if (this.hasOpenedEnvelope) return;
      this.hasOpenedEnvelope = true;

      sound.playPopSound();
      sound.playChime();

      if (envelopeTrigger) envelopeTrigger.classList.add('opening');
      const seal = this.container.querySelector('#mini-wax-seal');
      if (seal) {
        gsap.to(seal, { scale: 1.4, opacity: 0, duration: 0.3 });
      }

      setTimeout(() => {
        this.cleanup();
        gsap.to(this.container.querySelector('.cake-stage-wrapper'), {
          opacity: 0,
          y: -30,
          scale: 0.95,
          duration: 0.7,
          ease: 'power2.inOut',
          onComplete: () => {
            if (this.onNext) this.onNext();
          }
        });
      }, 550);
    };

    if (envelopeTrigger) {
      envelopeTrigger.addEventListener('click', handleEnvelopeOpen);
      envelopeTrigger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleEnvelopeOpen();
      });
    }
  }

  async initMicrophone() {
    try {
      await this.requestMicAccess();
    } catch (e) {
      console.log('Mic auto-request was postponed or blocked', e);
      const tip = this.container.querySelector('#breath-sub-tip');
      if (tip) tip.textContent = '(Bấm vào đây để bật Micro hoặc chạm nhẹ vào nến để thổi)';
    }
  }

  async requestMicAccess() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;

    this.micStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioContext = new AudioContext();
    const source = this.audioContext.createMediaStreamSource(this.micStream);
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 256;
    source.connect(this.analyser);

    const statusText = this.container.querySelector('#breath-status-text');
    if (statusText) statusText.textContent = 'Micro đã bật! Thổi "phùuu" vào micro nào... 💨';

    // Set start time for warm-up grace period
    this.micStartTime = Date.now();
    this.ambientBaseline = 25;
    this.blowThresholdCounter = 0;

    this.startBreathListening();
  }

  startBreathListening() {
    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const meterFill = this.container.querySelector('#breath-meter-fill');
    const flames = this.container.querySelectorAll('.candle-flame');

    const checkBreath = () => {
      if (this.isBlown || !this.analyser) return;

      this.analyser.getByteFrequencyData(dataArray);

      // 1. Calculate low-frequency wind turbulence (bins 0-12, ~0-1100Hz)
      const lowBins = Math.min(12, bufferLength);
      let lowSum = 0;
      for (let i = 0; i < lowBins; i++) {
        lowSum += dataArray[i];
      }
      const lowEnergy = lowSum / lowBins;

      // 2. Calculate overall audio volume
      let totalSum = 0;
      for (let i = 0; i < bufferLength; i++) {
        totalSum += dataArray[i];
      }
      const overallEnergy = totalSum / bufferLength;

      // 3. WARM-UP GRACE PERIOD: Trong 2.0 giây đầu khi vừa vào cảnh:
      // Tuyệt đối KHÔNG thổi tắt nến, hấp thụ mọi xung âm thanh và học mức ồn môi trường
      const timeSinceStart = Date.now() - this.micStartTime;
      if (timeSinceStart < 2000) {
        this.ambientBaseline = this.ambientBaseline * 0.9 + overallEnergy * 0.1;
        requestAnimationFrame(checkBreath);
        return;
      }

      // Tự động thích ứng mức ồn môi trường liên tục (kể cả khi nhạc nền thay đổi âm lượng)
      if (this.blowThresholdCounter === 0) {
        this.ambientBaseline = this.ambientBaseline * 0.98 + overallEnergy * 0.02;
      }

      // ĐẶC TRƯNG ÂM HỌC CỦA HƠI THỞ:
      // Luồng gió thổi vào màng micro tạo ra xung động áp suất tần số cực thấp (wind turbulence < 400Hz).
      // Âm nhạc và tiếng nói luôn có dải âm trung và cao cân bằng.
      // Do đó, chỉ gió thổi thực sự mới có lowEnergy vượt trội so với overallEnergy!
      const isTurbulence = lowEnergy > 58 && (lowEnergy >= overallEnergy * 1.02);
      const netBlowTurbulence = Math.max(0, lowEnergy - this.ambientBaseline);
      const breathScore = isTurbulence ? netBlowTurbulence : Math.max(0, netBlowTurbulence * 0.4);

      // Cập nhật thanh đo hơi thở trực quan (0% - 100%)
      const intensity = Math.min(100, Math.round((breathScore / 40) * 100));
      if (meterFill) {
        meterFill.style.width = `${intensity}%`;
      }

      // Ngọn lửa chao đảo khi luồng gió bắt đầu thổi
      if (breathScore > 18) {
        flames.forEach(f => f.classList.add('wavering'));
      } else {
        flames.forEach(f => f.classList.remove('wavering'));
      }

      // Chỉ thổi tắt khi có luồng gió thực sự mạnh và kéo dài liên tục ít nhất 18 frames (~300ms)
      const isStrongBlow = isTurbulence && netBlowTurbulence > 28 && lowEnergy > 65;
      if (isStrongBlow) {
        this.blowThresholdCounter++;
        if (this.blowThresholdCounter >= 18) {
          this.extinguishAllCandles();
          return;
        }
      } else {
        // Giảm nhanh bộ đếm nếu luồng thổi ngắt quãng
        this.blowThresholdCounter = Math.max(0, this.blowThresholdCounter - 2);
      }

      requestAnimationFrame(checkBreath);
    };

    checkBreath();
  }

  extinguishAllCandles() {
    if (this.isBlown) return;
    this.isBlown = true;
    this.stopMicrophone();

    // Sound effect & restore BGM
    sound.playBlowSound();
    sound.restoreBgm(0.5);
    setTimeout(() => sound.playSparkle(), 350);

    // Extinguish flames one by one in a fast wave
    const flames = this.container.querySelectorAll('.candle-flame');
    const smokes = this.container.querySelectorAll('.smoke-wisp');

    flames.forEach((flame, idx) => {
      setTimeout(() => {
        flame.classList.remove('wavering');
        flame.classList.add('extinguished');
        if (smokes[idx]) smokes[idx].classList.add('active');
      }, idx * 70);
    });

    // Fireworks & Confetti
    launchCandleBlowBurst();
    launchBirthdayFireworks();

    // Spawn floating balloons
    this.startSpawningBalloons();

    // Update instruction text
    const instructionText = this.container.querySelector('#cake-instruction-text');
    if (instructionText) {
      instructionText.textContent = this.config.cakeStage.blwonMessage;
      instructionText.style.color = 'var(--color-text-gold)';
      instructionText.style.fontWeight = 'var(--weight-semibold)';
    }

    // Hide breath prompt card
    const breathCard = this.container.querySelector('#breath-prompt-card');
    if (breathCard) {
      gsap.to(breathCard, { opacity: 0, y: -10, duration: 0.4, onComplete: () => breathCard.remove() });
    }

    // Reveal Interactive Envelope on Stage (User clicks directly on it to open!)
    const proceedZone = this.container.querySelector('#cake-proceed-zone');
    if (proceedZone) {
      proceedZone.classList.add('active');
      gsap.fromTo(proceedZone, 
        { scale: 0.85, opacity: 0, y: 25 }, 
        { scale: 1, opacity: 1, y: 0, duration: 0.8, delay: 0.5, ease: 'back.out(1.6)' }
      );
    }
  }

  stopMicrophone() {
    if (this.micStream) {
      this.micStream.getTracks().forEach(track => track.stop());
      this.micStream = null;
    }
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    this.analyser = null;
  }

  startSpawningBalloons() {
    const balloonContainer = this.container.querySelector('#balloon-container');
    if (!balloonContainer) return;

    const colors = ['#f43f5e', '#ec4899', '#ffb703', '#fb8500', '#38bdf8', '#a855f7'];

    const spawn = () => {
      if (this.isCleanedUp) return;
      const balloon = document.createElement('div');
      balloon.className = 'balloon-wrapper';
      const color = colors[Math.floor(Math.random() * colors.length)];
      const leftPos = Math.random() * 85 + 5;
      const duration = Math.random() * 4 + 6;

      balloon.style.left = `${leftPos}%`;
      balloon.style.animationDuration = `${duration}s`;
      balloon.innerHTML = `
        <div class="balloon-body" style="background: radial-gradient(circle at 35% 35%, #fff 0%, ${color} 50%, #000 100%);"></div>
        <div class="balloon-string"></div>
      `;

      balloon.addEventListener('click', (e) => {
        e.stopPropagation();
        sound.playPopSound();
        balloon.remove();
      });

      balloonContainer.appendChild(balloon);
      setTimeout(() => {
        if (balloon.parentNode) balloon.remove();
      }, duration * 1000);
    };

    for (let i = 0; i < 8; i++) {
      setTimeout(spawn, i * 400);
    }
    this.balloonInterval = setInterval(spawn, 1200);
  }

  cleanup() {
    this.isCleanedUp = true;
    this.stopMicrophone();
    if (this.balloonInterval) {
      clearInterval(this.balloonInterval);
    }
    const balloonContainer = this.container.querySelector('#balloon-container');
    if (balloonContainer) {
      balloonContainer.innerHTML = '';
    }
  }
}
