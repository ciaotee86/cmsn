import './styles/global.css';
import './styles/intro.css';
import './styles/cake.css';
import './styles/envelope.css';
import './styles/gallery.css';
import './styles/splitStage.css';
import './styles/choir.css';
import './styles/controls.css';

import gsap from 'gsap';
import { birthdayConfig } from './config.js';
import { sound } from './utils/audio.js';
import { Starfield } from './utils/particles.js';
import { launchHeartShower } from './utils/confettiHelper.js';
import { CakeScreen } from './components/CakeScreen.js';
import { SplitStageScreen } from './components/SplitStageScreen.js';
import { ChoirScreen } from './components/ChoirScreen.js';
import { EnvelopeScreen } from './components/EnvelopeScreen.js';
import { GalleryScreen } from './components/GalleryScreen.js';
import { AudioControls } from './components/AudioControls.js';

class BirthdayTheaterApp {
  constructor() {
    this.config = this.parseUrlOverrides(birthdayConfig);
    this.isCurtainsOpen = false;
    this.isWaitingToReopenCake = false;
    this.currentScreen = null;

    this.init();
  }

  parseUrlOverrides(baseConfig) {
    const params = new URLSearchParams(window.location.search);
    const customName = params.get('name');
    const customNick = params.get('nick');

    const config = JSON.parse(JSON.stringify(baseConfig));
    if (customName) {
      config.recipient.fullName = customName;
      config.letter.salutation = `Gửi ${customName},`;
    }
    if (customNick) {
      config.recipient.nickname = customNick;
    }
    return config;
  }

  init() {
    const app = document.querySelector('#app');
    app.innerHTML = `
      <div class="theater-viewport" id="theater-viewport">
        <!-- Canvas Starfield Background behind curtains -->
        <canvas id="starfield-canvas"></canvas>

        <!-- Ambient Spotlights -->
        <div class="theater-spotlight left" id="stage-spotlight-left"></div>
        <div class="theater-spotlight right" id="stage-spotlight-right"></div>
        <div class="stage-spotlight-pool" id="stage-spotlight-pool"></div>

        <!-- Top Pelmet / Valance with Scalloped Swags & Side Jabots -->
        <div class="theater-valance-drape">
          <div class="valance-side-jabot left"></div>
          <div class="valance-side-jabot right"></div>
          <div class="valance-header-band"></div>
          <div class="valance-swags-row">
            <div class="valance-swag-unit">
              <div class="swag-fabric-curve"></div>
              <div class="valance-gold-tassel"></div>
            </div>
            <div class="valance-swag-unit">
              <div class="swag-fabric-curve"></div>
              <div class="valance-gold-tassel"></div>
            </div>
            <div class="valance-swag-unit">
              <div class="swag-fabric-curve"></div>
              <div class="valance-gold-tassel"></div>
            </div>
            <div class="valance-swag-unit">
              <div class="swag-fabric-curve"></div>
              <div class="valance-gold-tassel"></div>
            </div>
            <div class="valance-swag-unit">
              <div class="swag-fabric-curve"></div>
            </div>
          </div>
        </div>

        <!-- Left & Right Grand Velvet Curtains with Soft Organic Folds -->
        <div class="theater-curtain-panel left" id="curtain-panel-left" role="button" aria-label="Kéo rèm trái" tabindex="0">
          <div class="curtain-folds-row">
            <div class="curtain-fold"></div>
            <div class="curtain-fold"></div>
            <div class="curtain-fold"></div>
            <div class="curtain-fold"></div>
            <div class="curtain-fold"></div>
            <div class="curtain-fold"></div>
            <div class="curtain-fold"></div>
            <div class="curtain-fold"></div>
          </div>
          <div class="curtain-bottom-fringe"></div>
          <div class="curtain-center-shadow"></div>
        </div>

        <div class="theater-curtain-panel right" id="curtain-panel-right" role="button" aria-label="Kéo rèm phải" tabindex="0">
          <div class="curtain-folds-row">
            <div class="curtain-fold"></div>
            <div class="curtain-fold"></div>
            <div class="curtain-fold"></div>
            <div class="curtain-fold"></div>
            <div class="curtain-fold"></div>
            <div class="curtain-fold"></div>
            <div class="curtain-fold"></div>
            <div class="curtain-fold"></div>
          </div>
          <div class="curtain-bottom-fringe"></div>
        </div>

        <!-- Gold Tieback Cords on Sides -->
        <div class="theater-tieback-cord left" id="tieback-left">
          <div class="tieback-gold-rope"></div>
          <div class="tieback-gold-tassel"></div>
        </div>
        <div class="theater-tieback-cord right" id="tieback-right">
          <div class="tieback-gold-rope"></div>
          <div class="tieback-gold-tassel"></div>
        </div>

        <!-- Central Stage Arena (PERMANENT STAGE - All scenes live here!) -->
        <main class="stage-arena" id="stage-arena-content">
          <!-- Poster / Cake / Letter / Gallery mount here -->
        </main>

        <!-- Mahogany Stage Floor & Glowing Footlights -->
        <div class="stage-floor-wrapper">
          <div class="stage-footlights-strip">
            <div class="footlight-bulb"></div>
            <div class="footlight-bulb"></div>
            <div class="footlight-bulb"></div>
            <div class="footlight-bulb"></div>
            <div class="footlight-bulb"></div>
            <div class="footlight-bulb"></div>
            <div class="footlight-bulb"></div>
            <div class="footlight-bulb"></div>
            <div class="footlight-bulb"></div>
            <div class="footlight-bulb"></div>
            <div class="footlight-bulb"></div>
          </div>
        </div>

        <!-- Floating Controls (Music disc & Fireworks) -->
        <div id="controls-root"></div>
      </div>
    `;

    // 1. Initialize Starfield background
    const canvas = document.querySelector('#starfield-canvas');
    this.starfield = new Starfield(canvas);

    // 2. Initialize BGM sound engine
    sound.initBgm(this.config.audio.bgmUrl);

    // 3. Initialize Audio Controls
    const controlsRoot = document.querySelector('#controls-root');
    new AudioControls(controlsRoot, this.config);

    // 4. Render Initial Stage Curtain Poster
    this.renderIntroPoster();
    this.bindCurtainEvents();
  }

  renderIntroPoster() {
    this.isCurtainsOpen = false;
    const stageArena = document.querySelector('#stage-arena-content');
    stageArena.innerHTML = `
      <div class="stage-poster-card" id="stage-poster-card">
        <span class="theater-badge">${this.config.intro.badge}</span>
        <h1 class="display-title">${this.config.intro.greeting}</h1>
        <p class="theater-hint">${this.config.intro.hint}</p>

        <button class="btn-open-curtain" id="btn-pull-curtain">
          <span>${this.config.intro.buttonText}</span>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
        </button>
      </div>
    `;

    const btnPull = stageArena.querySelector('#btn-pull-curtain');
    btnPull.addEventListener('click', () => this.openCurtainsAndStart());
  }

  bindCurtainEvents() {
    const curtainLeft = document.querySelector('#curtain-panel-left');
    const curtainRight = document.querySelector('#curtain-panel-right');
    const viewport = document.querySelector('#theater-viewport');

    const handleCurtainClick = () => {
      if (!this.isCurtainsOpen) {
        if (this.isWaitingToReopenCake) {
          this.openCurtainsToCake();
        } else {
          this.openCurtainsAndStart();
        }
      }
    };

    if (curtainLeft) curtainLeft.addEventListener('click', handleCurtainClick);
    if (curtainRight) curtainRight.addEventListener('click', handleCurtainClick);
    if (viewport) {
      viewport.addEventListener('click', () => {
        if (!this.isCurtainsOpen && this.isWaitingToReopenCake) {
          this.openCurtainsToCake();
        }
      });
    }
  }

  openCurtainsAndStart() {
    if (this.isCurtainsOpen) return;
    this.isCurtainsOpen = true;

    // 1. Play theatrical opening sounds
    sound.playStageChime();
    sound.playCurtainOpen();
    sound.playBgm();
    launchHeartShower();

    const poster = document.querySelector('#stage-poster-card');
    const curtainLeft = document.querySelector('#curtain-panel-left');
    const curtainRight = document.querySelector('#curtain-panel-right');
    const tiebackLeft = document.querySelector('#tieback-left');
    const tiebackRight = document.querySelector('#tieback-right');
    const spotlightLeft = document.querySelector('#stage-spotlight-left');
    const spotlightRight = document.querySelector('#stage-spotlight-right');
    const spotlightPool = document.querySelector('#stage-spotlight-pool');

    // 2. Animate out the poster card
    if (poster) {
      gsap.to(poster, {
        scale: 0.9,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.inOut',
        onComplete: () => {
          poster.remove();
        }
      });
    }

    // 3. Turn on stage spotlights
    spotlightLeft.classList.add('active');
    spotlightRight.classList.add('active');
    spotlightPool.classList.add('active');

    // 4. Smoothly draw and gather curtains to both sides AND KEEP THEM OPEN!
    const tl = gsap.timeline({
      onComplete: () => {
        // Mount Cake directly on the stage!
        this.renderCake();
      }
    });

    tl.to(curtainLeft, {
      scaleX: 0.16,
      x: '-6%',
      duration: 2.0,
      ease: 'power2.inOut'
    }, 0.2);

    tl.to(curtainRight, {
      scaleX: 0.16,
      x: '6%',
      duration: 2.0,
      ease: 'power2.inOut'
    }, 0.2);

    tl.to([tiebackLeft, tiebackRight], {
      opacity: 1,
      duration: 0.8
    }, 1.0);
  }

  destroyCurrentScreen() {
    if (this.currentScreen && typeof this.currentScreen.cleanup === 'function') {
      this.currentScreen.cleanup();
    }
    this.currentScreen = null;
  }

  renderCake() {
    this.destroyCurrentScreen();

    // Ensure BGM is ducked during candle stage to prevent speaker-to-mic feedback
    sound.duckBgm(0.08);

    const stageArena = document.querySelector('#stage-arena-content');
    stageArena.innerHTML = `<div id="scene-mount-container" style="width: 100%; display: flex; justify-content: center;"></div>`;
    const container = stageArena.querySelector('#scene-mount-container');

    this.currentScreen = new CakeScreen(container, this.config, () => {
      this.renderSplitStage();
    });

    gsap.fromTo(container, 
      { opacity: 0, y: 30, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power2.out' }
    );
  }

  renderSplitStage() {
    this.destroyCurrentScreen();

    const stageArena = document.querySelector('#stage-arena-content');
    stageArena.innerHTML = `<div id="scene-mount-container" style="width: 100%; max-width: 960px; display: flex; flex-direction: column; align-items: center;"></div>`;
    const container = stageArena.querySelector('#scene-mount-container');

    this.currentScreen = new SplitStageScreen(
      container,
      this.config,
      () => {
        // Replay: close curtains and reset
        this.closeCurtainsAndReset();
      },
      () => {
        // Sky lantern launched -> Choir & Orchestra entrance!
        this.renderChoir();
      }
    );

    gsap.fromTo(container,
      { opacity: 0, y: 30, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power2.out' }
    );
  }

  renderChoir() {
    this.destroyCurrentScreen();

    const stageArena = document.querySelector('#stage-arena-content');
    stageArena.innerHTML = `<div id="scene-mount-container" style="width: 100%; max-width: 960px; display: flex; flex-direction: column; align-items: center;"></div>`;
    const container = stageArena.querySelector('#scene-mount-container');

    this.currentScreen = new ChoirScreen(container, this.config, () => {
      // Choir finished: Close curtains and invite to reopen back to Cake!
      this.closeCurtainsToCakeOption();
    });

    gsap.fromTo(container,
      { opacity: 0, y: 30, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power2.out' }
    );
  }

  renderEnvelope() {
    this.destroyCurrentScreen();

    const stageArena = document.querySelector('#stage-arena-content');
    stageArena.innerHTML = `<div id="scene-mount-container" style="width: 100%; display: flex; justify-content: center;"></div>`;
    const container = stageArena.querySelector('#scene-mount-container');

    this.currentScreen = new EnvelopeScreen(container, this.config, () => {
      this.renderGallery();
    });

    gsap.fromTo(container,
      { opacity: 0, y: 30, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power2.out' }
    );
  }

  renderGallery() {
    this.destroyCurrentScreen();

    const stageArena = document.querySelector('#stage-arena-content');
    stageArena.innerHTML = `<div id="scene-mount-container" style="width: 100%; display: flex; justify-content: center;"></div>`;
    const container = stageArena.querySelector('#scene-mount-container');

    this.currentScreen = new GalleryScreen(container, this.config, () => {
      // Replay all: close curtains and reset!
      this.closeCurtainsAndReset();
    });

    gsap.fromTo(container,
      { opacity: 0, y: 30, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power2.out' }
    );
  }

  closeCurtainsToCakeOption() {
    this.destroyCurrentScreen();

    const curtainLeft = document.querySelector('#curtain-panel-left');
    const curtainRight = document.querySelector('#curtain-panel-right');
    const tiebackLeft = document.querySelector('#tieback-left');
    const tiebackRight = document.querySelector('#tieback-right');
    const spotlightLeft = document.querySelector('#stage-spotlight-left');
    const spotlightRight = document.querySelector('#stage-spotlight-right');
    const spotlightPool = document.querySelector('#stage-spotlight-pool');

    // Play theatrical curtain closing sound
    sound.playCurtainClose();

    // Clear stage arena
    const stageArena = document.querySelector('#stage-arena-content');
    gsap.to(stageArena, {
      opacity: 0,
      duration: 0.4,
      onComplete: () => {
        stageArena.innerHTML = '';
        stageArena.style.opacity = '1';
      }
    });

    // Close grand curtains fully
    gsap.to(curtainLeft, { scaleX: 1, x: '0%', duration: 1.8, ease: 'power2.inOut' });
    gsap.to(curtainRight, { scaleX: 1, x: '0%', duration: 1.8, ease: 'power2.inOut' });
    gsap.to([tiebackLeft, tiebackRight], { opacity: 0, duration: 0.4 });

    spotlightLeft.classList.remove('active');
    spotlightRight.classList.remove('active');
    spotlightPool.classList.remove('active');

    this.isCurtainsOpen = false;
    this.isWaitingToReopenCake = true;
  }

  openCurtainsToCake() {
    if (this.isCurtainsOpen) return;
    this.isCurtainsOpen = true;
    this.isWaitingToReopenCake = false;

    // Play theatrical sounds
    sound.playStageChime();
    sound.playCurtainOpen();
    launchHeartShower();

    const curtainLeft = document.querySelector('#curtain-panel-left');
    const curtainRight = document.querySelector('#curtain-panel-right');
    const tiebackLeft = document.querySelector('#tieback-left');
    const tiebackRight = document.querySelector('#tieback-right');
    const spotlightLeft = document.querySelector('#stage-spotlight-left');
    const spotlightRight = document.querySelector('#stage-spotlight-right');
    const spotlightPool = document.querySelector('#stage-spotlight-pool');

    spotlightLeft.classList.add('active');
    spotlightRight.classList.add('active');
    spotlightPool.classList.add('active');

    const tl = gsap.timeline({
      onComplete: () => {
        // Return straight to step 1: CakeScreen!
        this.renderCake();
      }
    });

    tl.to(curtainLeft, {
      scaleX: 0.16,
      x: '-6%',
      duration: 2.0,
      ease: 'power2.inOut'
    }, 0.2);

    tl.to(curtainRight, {
      scaleX: 0.16,
      x: '6%',
      duration: 2.0,
      ease: 'power2.inOut'
    }, 0.2);

    tl.to([tiebackLeft, tiebackRight], {
      opacity: 1,
      duration: 0.8
    }, 1.0);
  }

  closeCurtainsAndReset() {
    this.destroyCurrentScreen();

    const curtainLeft = document.querySelector('#curtain-panel-left');
    const curtainRight = document.querySelector('#curtain-panel-right');
    const tiebackLeft = document.querySelector('#tieback-left');
    const tiebackRight = document.querySelector('#tieback-right');
    const spotlightLeft = document.querySelector('#stage-spotlight-left');
    const spotlightRight = document.querySelector('#stage-spotlight-right');
    const spotlightPool = document.querySelector('#stage-spotlight-pool');

    sound.playCurtainOpen();

    // Hide scene content
    const stageArena = document.querySelector('#stage-arena-content');
    gsap.to(stageArena, {
      opacity: 0,
      duration: 0.4,
      onComplete: () => {
        stageArena.innerHTML = '';
        stageArena.style.opacity = '1';
        this.renderIntroPoster();
      }
    });

    // Close curtains
    gsap.to(curtainLeft, { scaleX: 1, x: '0%', duration: 1.8, ease: 'power2.inOut' });
    gsap.to(curtainRight, { scaleX: 1, x: '0%', duration: 1.8, ease: 'power2.inOut' });
    gsap.to([tiebackLeft, tiebackRight], { opacity: 0, duration: 0.4 });

    spotlightLeft.classList.remove('active');
    spotlightRight.classList.remove('active');
    spotlightPool.classList.remove('active');

    this.isCurtainsOpen = false;
    this.isWaitingToReopenCake = false;
  }
}

// Khởi chạy ứng dụng
document.addEventListener('DOMContentLoaded', () => {
  new BirthdayTheaterApp();
});
