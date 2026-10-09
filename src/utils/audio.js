/**
 * Sound Engine: Web Audio API Synthesizer & BGM Manager
 * Không phụ thuộc file âm thanh ngoài cho các hiệu ứng tương tác (chimes, pops, blow, sparkles, typewriter).
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.bgmAudio = null;
    this.isMuted = false;
    this.isPlayingBgm = false;
  }

  // Khởi tạo AudioContext sau tương tác đầu tiên của người dùng
  initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Khởi tạo và phát BGM
  initBgm(url) {
    if (!url) return;
    try {
      this.bgmAudio = new Audio(url);
      this.bgmAudio.loop = true;
      this.bgmAudio.volume = 0.5;
    } catch (e) {
      console.warn("Could not load BGM audio file", e);
    }
  }

  playBgm() {
    if (this.bgmAudio && !this.isMuted) {
      this.bgmAudio.play().then(() => {
        this.isPlayingBgm = true;
      }).catch(err => {
        console.log("Autoplay was prevented, will play on next user gesture", err);
      });
    }
  }

  pauseBgm() {
    if (this.bgmAudio) {
      this.bgmAudio.pause();
      this.isPlayingBgm = false;
    }
  }

  duckBgm(vol = 0.05) {
    if (this.bgmAudio) {
      this.bgmAudio.volume = vol;
    }
  }

  restoreBgm(vol = 0.5) {
    if (this.bgmAudio) {
      this.bgmAudio.volume = vol;
    }
  }

  toggleBgm() {
    if (this.isPlayingBgm) {
      this.pauseBgm();
      return false;
    } else {
      this.playBgm();
      return true;
    }
  }

  setMute(muted) {
    this.isMuted = muted;
    if (this.bgmAudio) {
      this.bgmAudio.muted = muted;
    }
  }

  // SFX 1: Tiếng chuông ma thuật khi mở hộp quà (Magic Chime)
  playChime() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.08);

      gain.gain.setValueAtTime(0, this.ctx.currentTime + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.2, this.ctx.currentTime + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.08 + 0.8);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime + idx * 0.08);
      osc.stop(this.ctx.currentTime + idx * 0.08 + 0.8);
    });
  }

  // SFX 2: Tiếng hơi thở / gió thổi nến (Candle Blow Out)
  playBlowSound() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    // Tạo tiếng gió bằng Buffer Noise + Lowpass Filter Sweep
    const bufferSize = this.ctx.sampleRate * 1.0;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.8);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.35, this.ctx.currentTime + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.9);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start();
    noise.stop(this.ctx.currentTime + 0.9);
  }

  // SFX 3: Tiếng pháo giấy / nổ bóng bay (Pop)
  playPopSound() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(400, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(60, this.ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.12);
  }

  // SFX 4: Tiếng lấp lánh (Sparkle)
  playSparkle() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const pitches = [1318.51, 1567.98, 1760.00, 2093.00]; // E6, G6, A6, C7
    pitches.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.05);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.05 + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime + idx * 0.05);
      osc.stop(this.ctx.currentTime + idx * 0.05 + 0.3);
    });
  }

  // SFX 5: Tiếng phím gõ máy chữ khi đọc thư
  playTypewriter() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    // Đổi tần số ngẫu nhiên nhẹ để tự nhiên
    const freq = 1200 + Math.random() * 400;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.03);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.03);
  }

  // SFX 6: Tiếng thả đèn trời bay lên không gian (Ascending Lantern)
  playLanternLaunch() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(261.63, this.ctx.currentTime); // C4
    osc.frequency.exponentialRampToValueAtTime(1046.50, this.ctx.currentTime + 1.2); // C6

    gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.15, this.ctx.currentTime + 0.4);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.3);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 1.3);
  }

  // SFX 7: Tiếng chuông rạp hát báo hiệu mở màn (Theater Curtain Chime)
  playStageChime() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const bells = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    bells.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.18);

      gain.gain.setValueAtTime(0, this.ctx.currentTime + idx * 0.18);
      gain.gain.linearRampToValueAtTime(0.25, this.ctx.currentTime + idx * 0.18 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.18 + 1.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime + idx * 0.18);
      osc.stop(this.ctx.currentTime + idx * 0.18 + 1.2);
    });
  }

  // SFX 8: Tiếng rèm nhung xào xạc trượt mở (Curtain Swoosh)
  playCurtainOpen() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const bufferSize = this.ctx.sampleRate * 1.5;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, this.ctx.currentTime);
    filter.frequency.linearRampToValueAtTime(900, this.ctx.currentTime + 0.6);
    filter.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 1.4);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.3, this.ctx.currentTime + 0.4);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.4);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start();
    noise.stop(this.ctx.currentTime + 1.4);
  }

  // SFX 9: Tiếng rèm nhung khép lại (Curtain Close)
  playCurtainClose() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const bufferSize = this.ctx.sampleRate * 1.6;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 1.5);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.25, this.ctx.currentTime + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.5);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start();
    noise.stop(this.ctx.currentTime + 1.5);
  }

  // SFX 10: Tiếng vỗ tay rạp hát tán thưởng (Audience Applause)
  playApplause() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const duration = 2.4;
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      // Simulate clapping bursts
      const t = i / this.ctx.sampleRate;
      const burst = Math.sin(t * 30) > 0.6 ? 1.4 : 0.6;
      data[i] = (Math.random() * 2 - 1) * burst;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, this.ctx.currentTime);
    filter.Q.setValueAtTime(1.5, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.3, this.ctx.currentTime + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start();
    noise.stop(this.ctx.currentTime + duration);
  }

  // BẢN NHẠC HỢP XƯỚNG MỪNG SINH NHẬT (Grand Choir & Orchestra Birthday Music)
  playChoirMusic() {
    this.initContext();
    if (!this.ctx) return;

    this.stopChoirMusic();
    this.isChoirPlaying = true;
    this.choirNodes = [];

    // Tạm dừng BGM nền để dàn hợp xướng biểu diễn trọn vẹn
    this.pauseBgm();
    this.playApplause();

    // Giai điệu Happy Birthday (Note, Duration in beats, Chord freq)
    // Tempo: 1 beat = 0.45s
    const beatSec = 0.45;
    const melody = [
      // Phrase 1: "Happy birthday to you"
      { f: 392.00, d: 0.75, chord: 261.63 }, // G4
      { f: 392.00, d: 0.25, chord: 261.63 }, // G4
      { f: 440.00, d: 1.00, chord: 261.63 }, // A4
      { f: 392.00, d: 1.00, chord: 261.63 }, // G4
      { f: 523.25, d: 1.00, chord: 329.63 }, // C5
      { f: 493.88, d: 2.00, chord: 392.00 }, // B4

      // Phrase 2: "Happy birthday to you"
      { f: 392.00, d: 0.75, chord: 293.66 }, // G4
      { f: 392.00, d: 0.25, chord: 293.66 }, // G4
      { f: 440.00, d: 1.00, chord: 293.66 }, // A4
      { f: 392.00, d: 1.00, chord: 293.66 }, // G4
      { f: 587.33, d: 1.00, chord: 293.66 }, // D5
      { f: 523.25, d: 2.00, chord: 261.63 }, // C5

      // Phrase 3: "Happy birthday dear friend"
      { f: 392.00, d: 0.75, chord: 261.63 }, // G4
      { f: 392.00, d: 0.25, chord: 261.63 }, // G4
      { f: 783.99, d: 1.00, chord: 349.23 }, // G5
      { f: 659.25, d: 1.00, chord: 349.23 }, // E5
      { f: 523.25, d: 1.00, chord: 261.63 }, // C5
      { f: 493.88, d: 1.00, chord: 261.63 }, // B4
      { f: 440.00, d: 2.00, chord: 349.23 }, // A4

      // Phrase 4: "Happy birthday to you!"
      { f: 698.46, d: 0.75, chord: 349.23 }, // F5
      { f: 698.46, d: 0.25, chord: 349.23 }, // F5
      { f: 659.25, d: 1.00, chord: 261.63 }, // E5
      { f: 523.25, d: 1.00, chord: 261.63 }, // C5
      { f: 587.33, d: 1.00, chord: 293.66 }, // D5
      { f: 523.25, d: 2.50, chord: 261.63 }  // C5 (tổ khúc kết)
    ];

    const playMelodyCycle = () => {
      if (!this.isChoirPlaying || !this.ctx) return;

      const startTime = this.ctx.currentTime + 0.1;
      let curTime = startTime;

      melody.forEach(item => {
        const dur = item.d * beatSec;

        // 1. Lead Melody Note (Warm rich choir lead: sine + filtered saw harmonic)
        const leadOsc = this.ctx.createOscillator();
        const harmOsc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();

        leadOsc.type = 'triangle';
        leadOsc.frequency.setValueAtTime(item.f, curTime);

        harmOsc.type = 'sine';
        harmOsc.frequency.setValueAtTime(item.f * 2, curTime); // 1 octave above sparkle

        // Warm Choir envelope
        noteGain.gain.setValueAtTime(0, curTime);
        noteGain.gain.linearRampToValueAtTime(0.22, curTime + 0.05);
        noteGain.gain.exponentialRampToValueAtTime(0.12, curTime + dur * 0.7);
        noteGain.gain.exponentialRampToValueAtTime(0.001, curTime + dur * 0.98);

        leadOsc.connect(noteGain);
        harmOsc.connect(noteGain);
        noteGain.connect(this.ctx.destination);

        leadOsc.start(curTime);
        harmOsc.start(curTime);
        leadOsc.stop(curTime + dur);
        harmOsc.stop(curTime + dur);

        this.choirNodes.push(leadOsc, harmOsc, noteGain);

        // 2. Harmony / Chord accompaniment (Cello & Choir Pad)
        if (item.chord) {
          const chordOsc = this.ctx.createOscillator();
          const chordGain = this.ctx.createGain();

          chordOsc.type = 'sine';
          chordOsc.frequency.setValueAtTime(item.chord, curTime);

          chordGain.gain.setValueAtTime(0, curTime);
          chordGain.gain.linearRampToValueAtTime(0.09, curTime + 0.08);
          chordGain.gain.exponentialRampToValueAtTime(0.001, curTime + dur * 0.95);

          chordOsc.connect(chordGain);
          chordGain.connect(this.ctx.destination);

          chordOsc.start(curTime);
          chordOsc.stop(curTime + dur);

          this.choirNodes.push(chordOsc, chordGain);
        }

        curTime += dur;
      });

      const totalCycleDuration = (curTime - startTime) * 1000;
      this.choirTimer = setTimeout(() => {
        if (this.isChoirPlaying) {
          playMelodyCycle();
        }
      }, totalCycleDuration + 400);
    };

    playMelodyCycle();
  }

  stopChoirMusic() {
    this.isChoirPlaying = false;
    if (this.choirTimer) {
      clearTimeout(this.choirTimer);
      this.choirTimer = null;
    }

    if (this.choirNodes && this.choirNodes.length > 0) {
      this.choirNodes.forEach(node => {
        try {
          if (node.stop) node.stop();
          if (node.disconnect) node.disconnect();
        } catch (e) {}
      });
      this.choirNodes = [];
    }
  }
}

export const sound = new SoundEngine();
