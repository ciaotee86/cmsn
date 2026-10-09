import confetti from 'canvas-confetti';

/**
 * Confetti Presets for Birthday Celebration
 */
export const launchBirthdayFireworks = () => {
  const duration = 3.5 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(function() {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    // Bắn từ 2 bên mép màn hình vào giữa
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      colors: ['#f43f5e', '#ffb703', '#fb8500', '#fef08a', '#ec4899', '#38bdf8']
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      colors: ['#f43f5e', '#ffb703', '#fb8500', '#fef08a', '#ec4899', '#38bdf8']
    });
  }, 250);
};

export const launchCandleBlowBurst = () => {
  // Bắn confetti hình trái tim và sao từ chính giữa tâm bánh kem
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#ffb703', '#fb8500', '#f43f5e', '#ffe4e6', '#fef08a'],
    zIndex: 1000
  });
};

export const launchHeartShower = () => {
  confetti({
    particleCount: 40,
    angle: 60,
    spread: 55,
    origin: { x: 0 },
    colors: ['#f43f5e', '#fda4af', '#f472b6']
  });
  confetti({
    particleCount: 40,
    angle: 120,
    spread: 55,
    origin: { x: 1 },
    colors: ['#f43f5e', '#fda4af', '#f472b6']
  });
};
