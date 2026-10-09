import gsap from 'gsap';
import { sound } from '../utils/audio.js';
import { launchHeartShower } from '../utils/confettiHelper.js';

export class EnvelopeScreen {
  constructor(container, config, onNext) {
    this.container = container;
    this.config = config;
    this.onNext = onNext;
    this.isOpened = false;
    this.isTypingSkipped = false;
    this.typingTimeout = null;

    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="letter-stage-wrapper">
        <h1 class="display-title" id="letter-stage-title">Bức Thư Bí Mật</h1>
        <p class="subtitle-text" id="letter-stage-hint">Hãy chạm vào con dấu sáp để mở phong thư...</p>

        <!-- 3D Envelope -->
        <div class="envelope-scene" id="envelope-scene-element" role="button" aria-label="Mở phong bì thư" tabindex="0">
          <div class="envelope-wrapper" id="envelope-wrapper-element">
            <div class="envelope-flap"></div>
            <div class="wax-seal" id="wax-seal-element">❤️</div>
            <div class="envelope-pocket-left"></div>
            <div class="envelope-pocket-right"></div>
            <div class="envelope-pocket-bottom"></div>
          </div>
        </div>

        <!-- The Letter (Vintage Paper) -->
        <div class="letter-paper-modal" id="letter-paper-element">
          <div class="letter-decor-border"></div>

          <div class="letter-header">
            <span class="letter-title">${this.config.letter.title}</span>
            <span class="letter-date">${this.config.letter.date}</span>
          </div>

          <div class="letter-salutation">${this.config.letter.salutation}</div>

          <div class="letter-body" id="letter-body-content">
            <!-- Paragraphs typed dynamically -->
          </div>

          <div class="letter-signature-box" id="letter-signature-element">
            <div class="letter-closing">${this.config.letter.closing}</div>
            <div class="letter-signature">${this.config.letter.signature}</div>
          </div>

          <div class="letter-controls">
            <button class="btn-secondary" id="btn-skip-typing">Đọc Nhanh ⚡</button>
            <button class="btn-primary" id="btn-goto-gallery" style="display: none;">
              <span>${this.config.letter.nextButtonText}</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    const envelopeScene = this.container.querySelector('#envelope-scene-element');
    const envelopeWrapper = this.container.querySelector('#envelope-wrapper-element');
    const letterPaper = this.container.querySelector('#letter-paper-element');
    const btnSkip = this.container.querySelector('#btn-skip-typing');
    const btnNext = this.container.querySelector('#btn-goto-gallery');

    const handleOpenEnvelope = () => {
      if (this.isOpened) return;
      this.isOpened = true;

      sound.playChime();
      launchHeartShower();
      envelopeWrapper.classList.add('opened');

      // Hide title & hint
      gsap.to(['#letter-stage-title', '#letter-stage-hint'], {
        opacity: 0,
        height: 0,
        margin: 0,
        duration: 0.4
      });

      // Slide envelope down and show letter
      setTimeout(() => {
        gsap.to(envelopeScene, {
          scale: 0.8,
          opacity: 0,
          duration: 0.5,
          onComplete: () => {
            envelopeScene.style.display = 'none';
            letterPaper.classList.add('active');
            gsap.fromTo(letterPaper, 
              { opacity: 0, y: 30, scale: 0.95 },
              { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power2.out', onComplete: () => {
                this.startTypewriter();
              }}
            );
          }
        });
      }, 700);
    };

    envelopeScene.addEventListener('click', handleOpenEnvelope);
    envelopeScene.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleOpenEnvelope();
      }
    });

    btnSkip.addEventListener('click', () => {
      this.isTypingSkipped = true;
      if (this.typingTimeout) clearTimeout(this.typingTimeout);
      this.revealFullLetter();
    });

    btnNext.addEventListener('click', () => {
      gsap.to(this.container.querySelector('.letter-stage-wrapper'), {
        opacity: 0,
        scale: 0.95,
        duration: 0.6,
        ease: 'power2.inOut',
        onComplete: () => {
          if (this.onNext) this.onNext();
        }
      });
    });
  }

  startTypewriter() {
    const bodyContent = this.container.querySelector('#letter-body-content');
    const paragraphs = this.config.letter.paragraphs;
    let pIndex = 0;
    let charIndex = 0;

    bodyContent.innerHTML = '';
    const currentP = document.createElement('p');
    currentP.className = 'letter-paragraph';
    bodyContent.appendChild(currentP);

    const cursor = document.createElement('span');
    cursor.className = 'typing-cursor';
    bodyContent.appendChild(cursor);

    const typeNextChar = () => {
      if (this.isTypingSkipped) return;

      if (pIndex < paragraphs.length) {
        const text = paragraphs[pIndex];
        if (charIndex < text.length) {
          currentP.textContent += text[charIndex];
          charIndex++;
          if (charIndex % 3 === 0) sound.playTypewriter();
          this.typingTimeout = setTimeout(typeNextChar, 25);
        } else {
          // Xong 1 đoạn
          pIndex++;
          charIndex = 0;
          if (pIndex < paragraphs.length) {
            const nextP = document.createElement('p');
            nextP.className = 'letter-paragraph';
            bodyContent.insertBefore(nextP, cursor);
            currentP = nextP;
            this.typingTimeout = setTimeout(typeNextChar, 250);
          } else {
            // Xong tất cả các đoạn
            cursor.remove();
            this.finishLetter();
          }
        }
      }
    };

    typeNextChar();
  }

  revealFullLetter() {
    const bodyContent = this.container.querySelector('#letter-body-content');
    bodyContent.innerHTML = '';
    for (const p of this.config.letter.paragraphs) {
      const pElement = document.createElement('p');
      pElement.className = 'letter-paragraph';
      pElement.textContent = p;
      bodyContent.appendChild(pElement);
    }
    this.finishLetter();
  }

  finishLetter() {
    const signatureBox = this.container.querySelector('#letter-signature-element');
    const btnSkip = this.container.querySelector('#btn-skip-typing');
    const btnNext = this.container.querySelector('#btn-goto-gallery');

    signatureBox.style.opacity = '1';
    btnSkip.style.display = 'none';
    btnNext.style.display = 'inline-flex';
    gsap.fromTo(btnNext, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.7)' });
  }
}
