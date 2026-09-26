// Breakout (Cyber Breakout) Engine
// 60 FPS Decoupled Physics and Canvas Rendering

import { sound } from './soundEffects';

export const CANVAS_WIDTH = 480;
export const CANVAS_HEIGHT = 640;

export function createInitialBreakoutState() {
  return {
    active: false,
    paused: false,
    inPlay: false, // true when ball has been launched from paddle
    paddle: {
      x: 195,
      y: 590,
      width: 90,
      baseWidth: 90,
      height: 12,
      speed: 8.5,
      vx: 0,
      targetX: null,
    },
    balls: [],
    bricks: [],
    powerups: [],
    lasers: [],
    particles: [],
    popups: [],
    stars: initStarfield(),
    keys: {},
    lives: 3,
    score: 0,
    level: 1,
    combo: 0,
    shake: 0,
    shieldFloor: false,
    laserTimer: 0,
    fireballTimer: 0,
    wideTimer: 0,
    lastLaserShot: 0,
  };
}

export function initStarfield() {
  const stars = [];
  for (let i = 0; i < 45; i++) {
    stars.push({
      x: Math.random() * CANVAS_WIDTH,
      y: Math.random() * CANVAS_HEIGHT,
      speed: 0.2 + Math.random() * 0.6,
      size: 0.8 + Math.random() * 1.5,
      alpha: 0.2 + Math.random() * 0.6,
    });
  }
  return stars;
}

// Generate brick grid for a given level
export function buildLevel(level) {
  const bricks = [];
  const rows = Math.min(5 + level, 8);
  const cols = 8;
  const padding = 5;
  const sideMargin = 12;
  const topOffset = 65;
  const availableWidth = CANVAS_WIDTH - sideMargin * 2 - (cols - 1) * padding;
  const brickWidth = availableWidth / cols;
  const brickHeight = 18;

  const colorPalettes = [
    { name: 'cyan', fill: '#06b6d4', glow: 'rgba(6, 182, 212, 0.5)', points: 100 },
    { name: 'blue', fill: '#3b82f6', glow: 'rgba(59, 130, 246, 0.5)', points: 120 },
    { name: 'emerald', fill: '#10b981', glow: 'rgba(16, 185, 129, 0.5)', points: 150 },
    { name: 'amber', fill: '#f59e0b', glow: 'rgba(245, 158, 11, 0.5)', points: 200 },
    { name: 'purple', fill: '#a855f7', glow: 'rgba(168, 85, 247, 0.5)', points: 250 },
    { name: 'rose', fill: '#f43f5e', glow: 'rgba(244, 63, 94, 0.5)', points: 300 },
  ];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = sideMargin + c * (brickWidth + padding);
      const y = topOffset + r * (brickHeight + padding);

      let tier = 1;
      let type = 'normal';
      let palette = colorPalettes[r % colorPalettes.length];

      if (level === 1) {
        tier = r < 2 ? 2 : 1;
        if (r < 2) palette = colorPalettes[3];
      } else if (level === 2) {
        if ((r === 1 || r === 2) && (c === 2 || c === 5)) {
          type = 'explosive';
        } else if (r <= 2) {
          tier = 2;
          palette = colorPalettes[4];
        }
      } else if (level >= 3) {
        if ((r === 2 || r === 3) && (c === 0 || c === 7)) {
          type = 'unbreakable';
        } else if (r === 1 && (c === 3 || c === 4)) {
          type = 'explosive';
        } else if (r === 0) {
          tier = 3;
          palette = colorPalettes[5];
        } else if (r <= 2) {
          tier = 2;
          palette = colorPalettes[3];
        }
      }

      bricks.push({
        id: `b_${r}_${c}`,
        row: r,
        col: c,
        x,
        y,
        width: brickWidth,
        height: brickHeight,
        tier,
        maxTier: tier,
        type,
        color: palette.fill,
        glow: palette.glow,
        points: palette.points * tier,
        active: true,
        hitFlash: 0,
      });
    }
  }

  return bricks;
}

export function resetBreakoutGame(state, startLevel = 1) {
  state.active = true;
  state.paused = false;
  state.inPlay = false;
  state.level = startLevel;
  state.lives = 3;
  state.score = 0;
  state.combo = 0;
  state.shake = 0;
  state.shieldFloor = false;
  state.laserTimer = 0;
  state.fireballTimer = 0;
  state.wideTimer = 0;
  state.powerups = [];
  state.lasers = [];
  state.particles = [];
  state.popups = [];

  state.paddle.width = state.paddle.baseWidth;
  state.paddle.x = (CANVAS_WIDTH - state.paddle.width) / 2;
  state.paddle.y = 590;
  state.paddle.targetX = null;

  state.bricks = buildLevel(state.level);
  resetBallOnPaddle(state);
}

export function resetBallOnPaddle(state) {
  state.inPlay = false;
  state.balls = [
    {
      x: state.paddle.x + state.paddle.width / 2,
      y: state.paddle.y - 7,
      vx: 0,
      vy: 0,
      speed: 6.0 + Math.min(state.level * 0.4, 2.5),
      radius: 6,
      active: true,
      trail: [],
      isFireball: state.fireballTimer > 0,
    },
  ];
}

export function launchBall(state) {
  if (state.inPlay || state.balls.length === 0) return;
  const ball = state.balls[0];
  const angle = (Math.random() * 0.6 - 0.3) - Math.PI / 2; // slightly randomized upward angle
  ball.vx = ball.speed * Math.cos(angle);
  ball.vy = ball.speed * Math.sin(angle);
  state.inPlay = true;
  sound.playPaddleBounce();
}

export function spawnPowerup(state, x, y) {
  // 24% chance of dropping a powerup
  if (Math.random() > 0.24) return;

  const types = [
    { type: 'multiball', label: '3x', color: '#38bdf8', text: 'Multi-Ball' },
    { type: 'laser', label: '⚡', color: '#ef4444', text: 'Laser Cannon' },
    { type: 'wide', label: '⬌', color: '#10b981', text: 'Wide Paddle' },
    { type: 'fireball', label: '🔥', color: '#f97316', text: 'Fireball' },
    { type: 'shield', label: '🛡', color: '#a855f7', text: 'Safety Floor' },
  ];

  // Extra life if low on lives
  if (state.lives <= 2 && Math.random() < 0.2) {
    types.push({ type: 'life', label: '♥', color: '#ec4899', text: 'Extra Life' });
  }

  const chosen = types[Math.floor(Math.random() * types.length)];
  state.powerups.push({
    x,
    y,
    vy: 2.2,
    radius: 12,
    type: chosen.type,
    label: chosen.label,
    color: chosen.color,
    text: chosen.text,
  });
}

export function fireBreakoutLasers(state) {
  if (state.laserTimer <= 0) return;
  const now = Date.now();
  if (now - state.lastLaserShot < 220) return; // fire rate throttle
  state.lastLaserShot = now;

  sound.playShoot();
  const leftX = state.paddle.x + 8;
  const rightX = state.paddle.x + state.paddle.width - 8;
  const laserY = state.paddle.y - 4;

  state.lasers.push(
    { x: leftX, y: laserY, vy: -12, active: true },
    { x: rightX, y: laserY, vy: -12, active: true }
  );

  // Muzzle flash particles
  for (let i = 0; i < 4; i++) {
    state.particles.push({
      x: leftX,
      y: laserY,
      vx: (Math.random() - 0.5) * 2,
      vy: Math.random() * 2,
      color: '#f87171',
      size: 2,
      alpha: 1,
      decay: 0.1,
    });
    state.particles.push({
      x: rightX,
      y: laserY,
      vx: (Math.random() - 0.5) * 2,
      vy: Math.random() * 2,
      color: '#f87171',
      size: 2,
      alpha: 1,
      decay: 0.1,
    });
  }
}

export function explodeBrick(state, centerBrick) {
  sound.playExplosion(false);
  state.shake = 12;

  // Damage surrounding bricks in 1-brick radius
  state.bricks.forEach((b) => {
    if (!b.active || b.id === centerBrick.id) return;
    const dr = Math.abs(b.row - centerBrick.row);
    const dc = Math.abs(b.col - centerBrick.col);
    if (dr <= 1 && dc <= 1) {
      if (b.type !== 'unbreakable') {
        b.tier -= 1;
        if (b.tier <= 0) {
          b.active = false;
          state.score += b.points;
          spawnShatterParticles(state, b);
        } else {
          b.hitFlash = 6;
        }
      }
    }
  });
}

export function spawnShatterParticles(state, brick) {
  for (let i = 0; i < 14; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 1.5 + Math.random() * 4;
    state.particles.push({
      x: brick.x + brick.width / 2,
      y: brick.y + brick.height / 2,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed + 0.5,
      color: brick.color,
      size: 2 + Math.random() * 3,
      alpha: 1,
      decay: 0.03 + Math.random() * 0.03,
    });
  }
}

// 60 FPS Engine Tick
export function updateBreakoutEngine(state, callbacks) {
  if (!state.active || state.paused) return;

  // Decay screen shake
  if (state.shake > 0) state.shake -= 0.8;

  // Starfield scrolling
  state.stars.forEach((s) => {
    s.y += s.speed;
    if (s.y > CANVAS_HEIGHT) {
      s.y = 0;
      s.x = Math.random() * CANVAS_WIDTH;
    }
  });

  // Power-up timers
  if (state.laserTimer > 0) {
    state.laserTimer -= 1 / 60;
    if (state.laserTimer <= 0) state.laserTimer = 0;
  }
  if (state.fireballTimer > 0) {
    state.fireballTimer -= 1 / 60;
    state.balls.forEach((b) => {
      b.isFireball = true;
    });
    if (state.fireballTimer <= 0) {
      state.fireballTimer = 0;
      state.balls.forEach((b) => {
        b.isFireball = false;
      });
    }
  }
  if (state.wideTimer > 0) {
    state.wideTimer -= 1 / 60;
    state.paddle.width = state.paddle.baseWidth * 1.4;
    if (state.wideTimer <= 0) {
      state.wideTimer = 0;
      state.paddle.width = state.paddle.baseWidth;
    }
  }

  // Paddle Movement (Keys)
  if (state.keys['ArrowLeft'] || state.keys['KeyA']) {
    state.paddle.x -= state.paddle.speed;
    state.paddle.targetX = null;
  }
  if (state.keys['ArrowRight'] || state.keys['KeyD']) {
    state.paddle.x += state.paddle.speed;
    state.paddle.targetX = null;
  }

  // Paddle Mouse / Touch Target Smoothing
  if (state.paddle.targetX !== null) {
    const diff = state.paddle.targetX - (state.paddle.x + state.paddle.width / 2);
    if (Math.abs(diff) > 2) {
      state.paddle.x += diff * 0.35;
    }
  }

  // Constrain paddle inside canvas
  if (state.paddle.x < 4) state.paddle.x = 4;
  if (state.paddle.x + state.paddle.width > CANVAS_WIDTH - 4) {
    state.paddle.x = CANVAS_WIDTH - 4 - state.paddle.width;
  }

  // Auto fire laser if space or touch held
  if (state.keys['Space'] && state.laserTimer > 0) {
    fireBreakoutLasers(state);
  }

  // If ball is glued to paddle (pre-launch)
  if (!state.inPlay && state.balls.length > 0) {
    const mainBall = state.balls[0];
    mainBall.x = state.paddle.x + state.paddle.width / 2;
    mainBall.y = state.paddle.y - mainBall.radius - 1;

    if (state.keys['Space']) {
      launchBall(state);
    }
  }

  // Update Lasers
  for (let i = state.lasers.length - 1; i >= 0; i--) {
    const l = state.lasers[i];
    l.y += l.vy;

    // Check laser collision with bricks
    let laserHit = false;
    for (const b of state.bricks) {
      if (!b.active) continue;
      if (
        l.x >= b.x &&
        l.x <= b.x + b.width &&
        l.y >= b.y &&
        l.y <= b.y + b.height
      ) {
        laserHit = true;
        l.active = false;
        if (b.type !== 'unbreakable') {
          b.tier -= 1;
          if (b.tier <= 0) {
            b.active = false;
            state.score += b.points;
            callbacks.onScore(state.score);
            spawnShatterParticles(state, b);
            sound.playBrickBreak();
            if (b.type === 'explosive') explodeBrick(state, b);
            spawnPowerup(state, b.x + b.width / 2, b.y + b.height / 2);
          } else {
            b.hitFlash = 5;
            sound.playBrickHit(b.tier);
          }
        }
        break;
      }
    }

    if (l.y < -10 || laserHit) {
      state.lasers.splice(i, 1);
    }
  }

  // Update Balls
  for (let bi = state.balls.length - 1; bi >= 0; bi--) {
    const ball = state.balls[bi];
    if (!state.inPlay) break;

    // Record ball trail
    ball.trail.push({ x: ball.x, y: ball.y, alpha: 0.7 });
    if (ball.trail.length > 7) ball.trail.shift();
    ball.trail.forEach((t) => (t.alpha *= 0.8));

    ball.x += ball.vx;
    ball.y += ball.vy;

    // Wall Collisions
    if (ball.x - ball.radius <= 0) {
      ball.x = ball.radius;
      ball.vx = Math.abs(ball.vx);
      sound.playPaddleBounce();
    } else if (ball.x + ball.radius >= CANVAS_WIDTH) {
      ball.x = CANVAS_WIDTH - ball.radius;
      ball.vx = -Math.abs(ball.vx);
      sound.playPaddleBounce();
    }

    if (ball.y - ball.radius <= 0) {
      ball.y = ball.radius;
      ball.vy = Math.abs(ball.vy);
      sound.playPaddleBounce();
    }

    // Safety Floor (Shield)
    if (state.shieldFloor && ball.y + ball.radius >= CANVAS_HEIGHT - 8) {
      ball.y = CANVAS_HEIGHT - 8 - ball.radius;
      ball.vy = -Math.abs(ball.vy);
      state.shieldFloor = false; // shield used up
      sound.playHit();
      state.popups.push({
        text: 'SHIELD DEFENSE!',
        x: CANVAS_WIDTH / 2,
        y: CANVAS_HEIGHT - 30,
        color: '#a855f7',
        alpha: 1,
        vy: -1.2,
      });
    }

    // Bottom out of bounds check
    if (ball.y - ball.radius > CANVAS_HEIGHT) {
      state.balls.splice(bi, 1);
      continue;
    }

    // Paddle Collision
    if (
      ball.vy > 0 &&
      ball.y + ball.radius >= state.paddle.y &&
      ball.y - ball.radius <= state.paddle.y + state.paddle.height &&
      ball.x + ball.radius >= state.paddle.x &&
      ball.x - ball.radius <= state.paddle.x + state.paddle.width
    ) {
      // Impact offset from paddle center (-1 to 1)
      const paddleCenter = state.paddle.x + state.paddle.width / 2;
      const relDist = (ball.x - paddleCenter) / (state.paddle.width / 2);
      const clampedRel = Math.max(-0.95, Math.min(0.95, relDist));

      // Rebound angle max 65 degrees
      const maxBounceAngle = (5 * Math.PI) / 12;
      const bounceAngle = clampedRel * maxBounceAngle;

      // Increase speed slightly with each paddle hit (up to cap)
      ball.speed = Math.min(ball.speed + 0.08, 11.5);
      ball.vx = ball.speed * Math.sin(bounceAngle);
      ball.vy = -ball.speed * Math.cos(bounceAngle);
      ball.y = state.paddle.y - ball.radius - 1;

      sound.playPaddleBounce();
      state.combo = 0; // reset brick combo

      // Paddle hit spark particles
      for (let p = 0; p < 6; p++) {
        state.particles.push({
          x: ball.x,
          y: state.paddle.y,
          vx: (Math.random() - 0.5) * 4,
          vy: -Math.random() * 3,
          color: '#38bdf8',
          size: 2,
          alpha: 1,
          decay: 0.05,
        });
      }
    }

    // Brick Collisions
    for (const b of state.bricks) {
      if (!b.active) continue;

      // Closest point on brick to ball center
      const closestX = Math.max(b.x, Math.min(ball.x, b.x + b.width));
      const closestY = Math.max(b.y, Math.min(ball.y, b.y + b.height));
      const distX = ball.x - closestX;
      const distY = ball.y - closestY;
      const distSq = distX * distX + distY * distY;

      if (distSq < ball.radius * ball.radius) {
        // Collision happened!
        if (!ball.isFireball) {
          // Normal ball bounces off
          const prevX = ball.x - ball.vx;
          const prevY = ball.y - ball.vy;

          if (prevX + ball.radius <= b.x || prevX - ball.radius >= b.x + b.width) {
            ball.vx = -ball.vx;
          } else {
            ball.vy = -ball.vy;
          }
        }

        // Damage brick
        if (b.type === 'unbreakable') {
          sound.playPaddleBounce();
          state.shake = 3;
        } else {
          b.tier -= 1;
          state.combo += 1;
          const comboBonus = Math.min(state.combo, 5);
          const pointsEarned = b.points * (1 + comboBonus * 0.2);

          if (b.tier <= 0) {
            b.active = false;
            state.score += Math.round(pointsEarned);
            callbacks.onScore(state.score);
            spawnShatterParticles(state, b);
            sound.playBrickBreak();

            // Floating score popup
            state.popups.push({
              text: `+${Math.round(pointsEarned)}`,
              x: b.x + b.width / 2,
              y: b.y,
              color: b.color,
              alpha: 1,
              vy: -1,
            });

            if (b.type === 'explosive') {
              explodeBrick(state, b);
            }

            spawnPowerup(state, b.x + b.width / 2, b.y + b.height / 2);
          } else {
            b.hitFlash = 6;
            sound.playBrickHit(b.tier);
          }
        }

        // Only handle one brick collision per frame for stable trajectories
        if (!ball.isFireball) break;
      }
    }
  }

  // Handle all balls lost in active play
  if (state.inPlay && state.balls.length === 0) {
    state.lives -= 1;
    callbacks.onLives(state.lives);
    sound.playBallLost();

    if (state.lives <= 0) {
      state.active = false;
      sound.playGameOver();
      callbacks.onGameOver(state.score);
    } else {
      resetBallOnPaddle(state);
    }
  }

  // Update Power-ups
  for (let pi = state.powerups.length - 1; pi >= 0; pi--) {
    const p = state.powerups[pi];
    p.y += p.vy;

    // Check collection by paddle
    if (
      p.y + p.radius >= state.paddle.y &&
      p.y - p.radius <= state.paddle.y + state.paddle.height &&
      p.x + p.radius >= state.paddle.x &&
      p.x - p.radius <= state.paddle.x + state.paddle.width
    ) {
      sound.playPowerup();
      state.popups.push({
        text: p.text.toUpperCase(),
        x: p.x,
        y: state.paddle.y - 20,
        color: p.color,
        alpha: 1,
        vy: -1.5,
      });

      // Apply power-up effect
      if (p.type === 'multiball') {
        const curBalls = [...state.balls];
        curBalls.forEach((b) => {
          state.balls.push(
            {
              x: b.x,
              y: b.y,
              vx: b.vx * Math.cos(0.4) - b.vy * Math.sin(0.4),
              vy: b.vx * Math.sin(0.4) + b.vy * Math.cos(0.4),
              speed: b.speed,
              radius: b.radius,
              active: true,
              trail: [],
              isFireball: b.isFireball,
            },
            {
              x: b.x,
              y: b.y,
              vx: b.vx * Math.cos(-0.4) - b.vy * Math.sin(-0.4),
              vy: b.vx * Math.sin(-0.4) + b.vy * Math.cos(-0.4),
              speed: b.speed,
              radius: b.radius,
              active: true,
              trail: [],
              isFireball: b.isFireball,
            }
          );
        });
      } else if (p.type === 'laser') {
        state.laserTimer = 12; // 12 seconds of laser
      } else if (p.type === 'wide') {
        state.wideTimer = 14; // 14 seconds wide paddle
      } else if (p.type === 'fireball') {
        state.fireballTimer = 8; // 8 seconds fireball
        state.balls.forEach((b) => (b.isFireball = true));
      } else if (p.type === 'shield') {
        state.shieldFloor = true;
      } else if (p.type === 'life') {
        state.lives = Math.min(state.lives + 1, 5);
        callbacks.onLives(state.lives);
      }

      state.powerups.splice(pi, 1);
      continue;
    }

    if (p.y > CANVAS_HEIGHT + 20) {
      state.powerups.splice(pi, 1);
    }
  }

  // Update Particles
  for (let idx = state.particles.length - 1; idx >= 0; idx--) {
    const pt = state.particles[idx];
    pt.x += pt.vx;
    pt.y += pt.vy;
    pt.alpha -= pt.decay;
    if (pt.alpha <= 0) {
      state.particles.splice(idx, 1);
    }
  }

  // Update Popups
  for (let idx = state.popups.length - 1; idx >= 0; idx--) {
    const pop = state.popups[idx];
    pop.y += pop.vy;
    pop.alpha -= 0.02;
    if (pop.alpha <= 0) {
      state.popups.splice(idx, 1);
    }
  }

  // Decay brick hit flash
  state.bricks.forEach((b) => {
    if (b.hitFlash > 0) b.hitFlash -= 1;
  });

  // Check Level Cleared (all breakable bricks destroyed)
  const remainingBreakable = state.bricks.filter(
    (b) => b.active && b.type !== 'unbreakable'
  );
  if (remainingBreakable.length === 0 && state.bricks.length > 0) {
    sound.playLevelWin();
    state.level += 1;
    callbacks.onLevel(state.level);
    state.popups.push({
      text: `SECTOR ${state.level} UNLOCKED!`,
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT / 2,
      color: '#38bdf8',
      alpha: 1.5,
      vy: -0.8,
    });
    state.bricks = buildLevel(state.level);
    resetBallOnPaddle(state);
  }
}

// 60 FPS Canvas Rendering
export function renderBreakoutEngine(ctx, state) {
  ctx.save();

  // Screen shake offset
  if (state.shake > 0) {
    const dx = (Math.random() - 0.5) * state.shake;
    const dy = (Math.random() - 0.5) * state.shake;
    ctx.translate(dx, dy);
  }

  // Background
  ctx.fillStyle = '#030712'; // Slate 950 deep space
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Starfield
  state.stars.forEach((s) => {
    ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`;
    ctx.fillRect(s.x, s.y, s.size, s.size);
  });

  // Cyber Grid Subtle Background lines
  ctx.strokeStyle = 'rgba(30, 41, 59, 0.4)';
  ctx.lineWidth = 1;
  for (let x = 0; x < CANVAS_WIDTH; x += 50) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, CANVAS_HEIGHT);
    ctx.stroke();
  }
  for (let y = 0; y < CANVAS_HEIGHT; y += 50) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(CANVAS_WIDTH, y);
    ctx.stroke();
  }

  // Safety Shield Floor
  if (state.shieldFloor) {
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 4;
    ctx.shadowColor = '#c084fc';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.moveTo(0, CANVAS_HEIGHT - 6);
    ctx.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT - 6);
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  // Render Bricks
  state.bricks.forEach((b) => {
    if (!b.active) return;

    if (b.hitFlash > 0) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(b.x, b.y, b.width, b.height);
      return;
    }

    if (b.type === 'unbreakable') {
      // Chrome metallic steel brick
      const grad = ctx.createLinearGradient(b.x, b.y, b.x, b.y + b.height);
      grad.addColorStop(0, '#94a3b8');
      grad.addColorStop(0.5, '#475569');
      grad.addColorStop(1, '#1e293b');
      ctx.fillStyle = grad;
      ctx.fillRect(b.x, b.y, b.width, b.height);
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(b.x + 1, b.y + 1, b.width - 2, b.height - 2);

      // Steel rivets
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(b.x + 4, b.y + 4, 2, 2);
      ctx.fillRect(b.x + b.width - 6, b.y + 4, 2, 2);
      ctx.fillRect(b.x + 4, b.y + b.height - 6, 2, 2);
      ctx.fillRect(b.x + b.width - 6, b.y + b.height - 6, 2, 2);
      return;
    }

    if (b.type === 'explosive') {
      // Pulsing bomb brick
      const pulse = (Math.sin(Date.now() / 150) + 1) / 2;
      ctx.fillStyle = pulse > 0.5 ? '#f97316' : '#ea580c';
      ctx.fillRect(b.x, b.y, b.width, b.height);

      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(b.x + 1, b.y + 1, b.width - 2, b.height - 2);

      // Bomb icon text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('💣', b.x + b.width / 2, b.y + b.height / 2);
      return;
    }

    // Normal Bricks (with glowing neon borders and inner bevel)
    ctx.shadowColor = b.glow;
    ctx.shadowBlur = 8;
    ctx.fillStyle = b.color;
    ctx.fillRect(b.x, b.y, b.width, b.height);
    ctx.shadowBlur = 0;

    // Bevel highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.fillRect(b.x, b.y, b.width, 3);
    ctx.fillRect(b.x, b.y, 3, b.height);

    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.fillRect(b.x, b.y + b.height - 3, b.width, 3);
    ctx.fillRect(b.x + b.width - 3, b.y, 3, b.height);

    // If multi-tier, draw cracks / armor plates
    if (b.maxTier > 1) {
      ctx.fillStyle = '#ffffff';
      ctx.font = '9px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('✦'.repeat(b.tier), b.x + b.width / 2, b.y + b.height / 2);
    }
  });

  // Render Lasers
  state.lasers.forEach((l) => {
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#f87171';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(l.x, l.y);
    ctx.lineTo(l.x, l.y - 12);
    ctx.stroke();
    ctx.shadowBlur = 0;
  });

  // Render Power-ups
  state.powerups.forEach((p) => {
    ctx.save();
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 12;

    // Glowing pill capsule
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = p.color;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = p.color;
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(p.label, p.x, p.y);
    ctx.restore();
  });

  // Render Paddle
  const pad = state.paddle;
  ctx.save();
  // Paddle body gradient
  const padGrad = ctx.createLinearGradient(pad.x, pad.y, pad.x, pad.y + pad.height);
  padGrad.addColorStop(0, '#38bdf8');
  padGrad.addColorStop(0.5, '#0284c7');
  padGrad.addColorStop(1, '#0369a1');

  ctx.shadowColor = state.laserTimer > 0 ? '#ef4444' : '#0284c7';
  ctx.shadowBlur = 14;

  ctx.fillStyle = padGrad;
  ctx.beginPath();
  ctx.roundRect(pad.x, pad.y, pad.width, pad.height, 6);
  ctx.fill();

  ctx.strokeStyle = state.laserTimer > 0 ? '#fca5a5' : '#e0f2fe';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Paddle Center Core Indicator
  ctx.fillStyle = state.laserTimer > 0 ? '#ef4444' : '#38bdf8';
  ctx.fillRect(pad.x + pad.width / 2 - 8, pad.y + 3, 16, pad.height - 6);

  // Twin Laser Cannons on Paddle Shoulders (if laser active)
  if (state.laserTimer > 0) {
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(pad.x + 5, pad.y - 6, 6, 8);
    ctx.fillRect(pad.x + pad.width - 11, pad.y - 6, 6, 8);
  }
  ctx.restore();

  // Render Balls
  state.balls.forEach((ball) => {
    // Ball comet trail
    ball.trail.forEach((t) => {
      ctx.fillStyle = ball.isFireball
        ? `rgba(249, 115, 22, ${t.alpha * 0.7})`
        : `rgba(56, 189, 248, ${t.alpha * 0.7})`;
      ctx.beginPath();
      ctx.arc(t.x, t.y, ball.radius * 0.75, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.save();
    ctx.shadowColor = ball.isFireball ? '#f97316' : '#38bdf8';
    ctx.shadowBlur = ball.isFireball ? 18 : 12;

    const ballGrad = ctx.createRadialGradient(
      ball.x - 2,
      ball.y - 2,
      1,
      ball.x,
      ball.y,
      ball.radius
    );

    if (ball.isFireball) {
      ballGrad.addColorStop(0, '#ffffff');
      ballGrad.addColorStop(0.4, '#fbbf24');
      ballGrad.addColorStop(1, '#ea580c');
    } else {
      ballGrad.addColorStop(0, '#ffffff');
      ballGrad.addColorStop(0.5, '#7dd3fc');
      ballGrad.addColorStop(1, '#0284c7');
    }

    ctx.fillStyle = ballGrad;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });

  // Render Particles
  state.particles.forEach((pt) => {
    ctx.fillStyle = pt.color;
    ctx.globalAlpha = Math.max(0, pt.alpha);
    ctx.fillRect(pt.x, pt.y, pt.size, pt.size);
  });
  ctx.globalAlpha = 1.0;

  // Render Popups (Floating text)
  state.popups.forEach((pop) => {
    ctx.save();
    ctx.font = 'bold 13px monospace';
    ctx.fillStyle = pop.color;
    ctx.globalAlpha = Math.max(0, pop.alpha);
    ctx.textAlign = 'center';
    ctx.shadowColor = pop.color;
    ctx.shadowBlur = 8;
    ctx.fillText(pop.text, pop.x, pop.y);
    ctx.restore();
  });

  // If waiting to launch, show "PRESS SPACE OR TAP TO LAUNCH"
  if (state.active && !state.inPlay) {
    ctx.save();
    ctx.font = 'bold 12px monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.textAlign = 'center';
    const blink = Math.floor(Date.now() / 400) % 2 === 0;
    if (blink) {
      ctx.fillText(
        'TAP OR PRESS SPACE TO LAUNCH BALL',
        CANVAS_WIDTH / 2,
        state.paddle.y - 35
      );
    }
    ctx.restore();
  }

  ctx.restore();
}
