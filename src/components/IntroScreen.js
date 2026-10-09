import gsap from 'gsap';
import { sound } from '../utils/audio.js';
import { launchHeartShower } from '../utils/confettiHelper.js';

export class IntroScreen {
  constructor(container, config, onStart) {
    this.container = container;
    this.config = config;
    this.onStart = onStart;
    this.isOpened = false;

    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="intro-stage-container" id="intro-stage-root">
        <!-- Overhead Spotlights -->
        <div class="stage-spotlight left" id="spotlight-left"></div>
        <div class="stage-spotlight right" id="spotlight-right"></div>

        <!-- Stage Proscenium & Floor -->
        <div class="stage-proscenium">
          <!-- Top Scalloped Valance / Pelmet -->
          <div class="curtain-valance">
            <div class="valance-swag"></div>
            <div class="valance-swag"></div>
            <div class="valance-swag"></div>
            <div class="valance-swag"></div>
            <div class="valance-swag"></div>
          </div>
        </div>

        <!-- Main Left & Right Velvet Curtains -->
        <div class="curtain-panel left" id="curtain-panel-left" role="button" aria-label="Kéo rèm trái"></div>
        <div class="curtain-panel right" id="curtain-panel-right" role="button" aria-label="Kéo rèm phải"></div>

        <!-- Gold Tassel Tiebacks -->
        <div class="curtain-tieback left" id="tieback-left">
          <div class="tieback-rope"></div>
          <div class="tieback-tassel"></div>
        </div>
        <div class="curtain-tieback right" id="tieback-right">
          <div class="tieback-rope"></div>
          <div class="tieback-tassel"></div>
        </div>

        <!-- Stage Poster / Central Title -->
        <div class="theater-poster-card" id="theater-poster">
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

        <!-- Perspective Stage Floor -->
        <div class="stage-floor">
          <div class="stage-footlights"></div>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    const btnPull = this.container.querySelector('#btn-pull-curtain');
    const curtainLeft = this.container.querySelector('#curtain-panel-left');
    const curtainRight = this.container.querySelector('#curtain-panel-right');

    const handleOpenCurtains = () => {
      if (this.isOpened) return;
      this.isOpened = true;

      // Play theatrical sound effects
      sound.playStageChime();
      sound.playCurtainOpen();
      sound.playBgm();
      launchHeartShower();

      const poster = this.container.querySelector('#theater-poster');
      const spotlightLeft = this.container.querySelector('#spotlight-left');
      const spotlightRight = this.container.querySelector('#spotlight-right');
      const tiebackLeft = this.container.querySelector('#tieback-left');
      const tiebackRight = this.container.querySelector('#tieback-right');

      // 1. Fade & zoom out poster card
      gsap.to(poster, {
        scale: 0.9,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.inOut',
        onComplete: () => {
          poster.style.display = 'none';
        }
      });

      // 2. Turn on stage spotlights
      spotlightLeft.classList.add('active');
      spotlightRight.classList.add('active');

      // 3. Smoothly part the heavy velvet curtains to both sides
      const tl = gsap.timeline({
        onComplete: () => {
          // Fade whole intro stage into cake stage
          gsap.to(this.container.querySelector('#intro-stage-root'), {
            opacity: 0,
            duration: 0.7,
            delay: 0.3,
            ease: 'power2.inOut',
            onComplete: () => {
              if (this.onStart) this.onStart();
            }
          });
        }
      });

      tl.to(curtainLeft, {
        scaleX: 0.12,
        x: '-10%',
        duration: 1.8,
        ease: 'power3.inOut'
      }, 0.2);

      tl.to(curtainRight, {
        scaleX: 0.12,
        x: '10%',
        duration: 1.8,
        ease: 'power3.inOut'
      }, 0.2);

      tl.to([tiebackLeft, tiebackRight], {
        opacity: 1,
        duration: 0.8
      }, 0.8);
    };

    btnPull.addEventListener('click', handleOpenCurtains);
    curtainLeft.addEventListener('click', handleOpenCurtains);
    curtainRight.addEventListener('click', handleOpenCurtains);
  }
}
