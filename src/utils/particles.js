/**
 * Particles & Interactive Starfield Canvas
 */

export class Starfield {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.stars = [];
    this.animationFrameId = null;
    this.resizeHandler = this.resize.bind(this);

    this.init();
  }

  init() {
    window.addEventListener('resize', this.resizeHandler);
    this.resize();
    this.createStars(80);
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createStars(count) {
    this.stars = [];
    for (let i = 0; i < count; i++) {
      this.stars.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        radius: Math.random() * 1.5 + 0.5,
        alpha: Math.random(),
        speed: Math.random() * 0.02 + 0.005,
        direction: Math.random() > 0.5 ? 1 : -1
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let star of this.stars) {
      star.alpha += star.speed * star.direction;
      if (star.alpha >= 1) {
        star.alpha = 1;
        star.direction = -1;
      } else if (star.alpha <= 0.1) {
        star.alpha = 0.1;
        star.direction = 1;
      }

      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(255, 243, 176, ${star.alpha * 0.7})`;
      this.ctx.shadowBlur = 4;
      this.ctx.shadowColor = 'rgba(255, 183, 3, 0.5)';
      this.ctx.fill();
    }

    this.animationFrameId = requestAnimationFrame(this.animate.bind(this));
  }

  destroy() {
    window.removeEventListener('resize', this.resizeHandler);
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
}
