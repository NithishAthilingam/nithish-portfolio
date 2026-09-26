import { sound } from './soundEffects';

export function createInitialGameState() {
  return {
    keys: {},
    player: {
      x: 240,
      y: 540,
      width: 36,
      height: 44,
      speed: 6,
      tilt: 0,
      invulnerable: 0,
      weaponLevel: 1,
      fireTimer: 0,
      fireRate: 10,
    },
    bullets: [],
    enemyBullets: [],
    enemies: [],
    particles: [],
    powerups: [],
    stars: [],
    boss: null,
    score: 0,
    health: 100,
    sector: 1,
    frameCount: 0,
    active: false,
  };
}

export function initStarfield() {
  const stars = [];
  for (let i = 0; i < 90; i++) {
    stars.push({
      x: Math.random() * 480,
      y: Math.random() * 640,
      radius: Math.random() < 0.6 ? 1 : Math.random() < 0.9 ? 1.5 : 2.5,
      speed: 0.5 + Math.random() * 2.5,
      alpha: 0.3 + Math.random() * 0.7,
    });
  }
  return stars;
}

export function resetGame(g) {
  g.player.x = 240;
  g.player.y = 540;
  g.player.weaponLevel = 1;
  g.player.invulnerable = 60;
  g.bullets = [];
  g.enemyBullets = [];
  g.enemies = [];
  g.particles = [];
  g.powerups = [];
  g.boss = null;
  g.score = 0;
  g.health = 100;
  g.sector = 1;
  g.frameCount = 0;
  g.active = true;
}

export function updateEngine(g, callbacks) {
  const { onScore, onHealth, onSector, onWeapon, onBossState, onGameOver } = callbacks;
  const keys = g.keys;
  const player = g.player;

  // Starfield
  g.stars.forEach((star) => {
    star.y += star.speed * (g.active ? 1.2 : 0.4);
    if (star.y > 640) {
      star.y = 0;
      star.x = Math.random() * 480;
    }
  });

  if (!g.active) return;
  g.frameCount++;

  // Player Movement
  let dx = 0;
  let dy = 0;
  if (keys['ArrowLeft'] || keys['KeyA']) dx -= 1;
  if (keys['ArrowRight'] || keys['KeyD']) dx += 1;
  if (keys['ArrowUp'] || keys['KeyW']) dy -= 1;
  if (keys['ArrowDown'] || keys['KeyS']) dy += 1;

  if (dx !== 0 && dy !== 0) {
    dx *= 0.7071;
    dy *= 0.7071;
  }

  player.x += dx * player.speed;
  player.y += dy * player.speed;

  if (dx < 0) player.tilt = Math.max(player.tilt - 0.1, -0.4);
  else if (dx > 0) player.tilt = Math.min(player.tilt + 0.1, 0.4);
  else player.tilt *= 0.8;

  player.x = Math.max(24, Math.min(480 - 24, player.x));
  player.y = Math.max(40, Math.min(640 - 30, player.y));

  if (player.invulnerable > 0) player.invulnerable--;

  // Thruster particles
  if (g.frameCount % 2 === 0) {
    g.particles.push({
      x: player.x - 7 + (Math.random() - 0.5) * 4,
      y: player.y + 22,
      vx: (Math.random() - 0.5) * 0.8,
      vy: 3 + Math.random() * 2,
      life: 18,
      maxLife: 18,
      color: '#38bdf8',
      size: 3,
    });
    g.particles.push({
      x: player.x + 7 + (Math.random() - 0.5) * 4,
      y: player.y + 22,
      vx: (Math.random() - 0.5) * 0.8,
      vy: 3 + Math.random() * 2,
      life: 18,
      maxLife: 18,
      color: '#60a5fa',
      size: 3,
    });
  }

  // Firing
  if (player.fireTimer > 0) player.fireTimer--;
  if ((keys['Space'] || keys['KeyJ'] || keys['Enter']) && player.fireTimer === 0) {
    firePlayerBullets(g);
    player.fireTimer = player.fireRate;
  }

  // Boss trigger
  const nextBossScore = g.sector * 1200;
  if (g.score >= nextBossScore && !g.boss) {
    g.boss = {
      x: 240,
      y: -80,
      targetY: 100,
      width: 140,
      height: 60,
      health: 200 + g.sector * 100,
      maxHealth: 200 + g.sector * 100,
      vx: 2,
      fireCooldown: 40,
    };
    onBossState(true, 100);
  }

  // Boss Update
  if (g.boss) {
    const b = g.boss;
    if (b.y < b.targetY) b.y += 1;
    else {
      b.x += b.vx;
      if (b.x < 100 || b.x > 380) b.vx *= -1;

      b.fireCooldown--;
      if (b.fireCooldown <= 0) {
        b.fireCooldown = Math.max(25, 45 - g.sector * 3);
        [-1.5, 0, 1.5].forEach((vx) => {
          g.enemyBullets.push({
            x: b.x,
            y: b.y + 30,
            vx,
            vy: 4.5,
            radius: 4,
            color: '#ef4444',
          });
        });
        sound.playShoot();
      }
    }
  }

  // Spawn Enemies
  const spawnRate = g.boss ? 110 : Math.max(35, 75 - g.sector * 5);
  if (g.frameCount % spawnRate === 0) {
    const typeRand = Math.random();
    if (typeRand < 0.5) {
      g.enemies.push({
        type: 'scout',
        x: 40 + Math.random() * 400,
        y: -20,
        vx: (Math.random() - 0.5) * 3,
        vy: 2.8 + g.sector * 0.2,
        width: 26,
        height: 26,
        health: 1,
        points: 100,
      });
    } else if (typeRand < 0.85) {
      g.enemies.push({
        type: 'interceptor',
        x: 50 + Math.random() * 380,
        y: -30,
        vx: (Math.random() - 0.5) * 1.5,
        vy: 2.0 + g.sector * 0.15,
        width: 32,
        height: 32,
        health: 2,
        points: 200,
        fireCooldown: 40 + Math.floor(Math.random() * 30),
      });
    } else {
      g.enemies.push({
        type: 'heavy',
        x: 60 + Math.random() * 360,
        y: -40,
        vx: (Math.random() - 0.5) * 1,
        vy: 1.4,
        width: 44,
        height: 38,
        health: 5,
        points: 350,
        fireCooldown: 50,
      });
    }
  }

  // Update Player Bullets
  for (let i = g.bullets.length - 1; i >= 0; i--) {
    const b = g.bullets[i];
    b.x += b.vx;
    b.y += b.vy;
    if (b.y < -20 || b.x < -10 || b.x > 490) {
      g.bullets.splice(i, 1);
      continue;
    }

    if (g.boss) {
      const boss = g.boss;
      if (
        b.x > boss.x - boss.width / 2 &&
        b.x < boss.x + boss.width / 2 &&
        b.y > boss.y - boss.height / 2 &&
        b.y < boss.y + boss.height / 2
      ) {
        boss.health -= b.damage || 1;
        createSparks(g, b.x, b.y, '#38bdf8', 4);
        g.bullets.splice(i, 1);
        onBossState(true, Math.max(0, Math.round((boss.health / boss.maxHealth) * 100)));

        if (boss.health <= 0) {
          createExplosion(g, boss.x, boss.y, true);
          sound.playExplosion(true);
          g.score += 2000;
          g.sector++;
          onScore(g.score);
          onSector(g.sector);
          spawnPowerup(g, boss.x, boss.y, 'emp');
          g.boss = null;
          onBossState(false, 0);
        }
        continue;
      }
    }

    for (let j = g.enemies.length - 1; j >= 0; j--) {
      const e = g.enemies[j];
      if (
        b.x > e.x - e.width / 2 &&
        b.x < e.x + e.width / 2 &&
        b.y > e.y - e.height / 2 &&
        b.y < e.y + e.height / 2
      ) {
        e.health -= b.damage || 1;
        createSparks(g, b.x, b.y, '#38bdf8', 3);
        g.bullets.splice(i, 1);

        if (e.health <= 0) {
          createExplosion(g, e.x, e.y, e.type === 'heavy');
          sound.playExplosion(e.type === 'heavy');
          g.score += e.points;
          onScore(g.score);

          if (Math.random() < 0.15) {
            const types = ['weapon', 'shield', 'emp'];
            spawnPowerup(g, e.x, e.y, types[Math.floor(Math.random() * types.length)]);
          }
          g.enemies.splice(j, 1);
        }
        break;
      }
    }
  }

  // Update Enemies
  for (let i = g.enemies.length - 1; i >= 0; i--) {
    const e = g.enemies[i];
    e.x += e.vx;
    e.y += e.vy;

    if (e.type === 'scout' && (e.x < 30 || e.x > 450)) e.vx *= -1;

    if (e.fireCooldown !== undefined) {
      e.fireCooldown--;
      if (e.fireCooldown <= 0 && e.y > 20 && e.y < 500) {
        e.fireCooldown = e.type === 'heavy' ? 60 : 70;
        g.enemyBullets.push({
          x: e.x,
          y: e.y + e.height / 2,
          vx: (player.x - e.x) * 0.015,
          vy: 3.5,
          radius: 3.5,
          color: '#ef4444',
        });
      }
    }

    if (
      player.invulnerable <= 0 &&
      Math.hypot(player.x - e.x, player.y - e.y) < (player.width + e.width) * 0.4
    ) {
      createExplosion(g, e.x, e.y, false);
      g.enemies.splice(i, 1);
      applyPlayerDamage(g, 25, onHealth, onGameOver);
      continue;
    }

    if (e.y > 660) {
      g.enemies.splice(i, 1);
    }
  }

  // Update Enemy Bullets
  for (let i = g.enemyBullets.length - 1; i >= 0; i--) {
    const eb = g.enemyBullets[i];
    eb.x += eb.vx;
    eb.y += eb.vy;

    if (eb.y > 660 || eb.x < -10 || eb.x > 490) {
      g.enemyBullets.splice(i, 1);
      continue;
    }

    if (player.invulnerable <= 0 && Math.hypot(player.x - eb.x, player.y - eb.y) < 18) {
      g.enemyBullets.splice(i, 1);
      applyPlayerDamage(g, 15, onHealth, onGameOver);
    }
  }

  // Update Powerups
  for (let i = g.powerups.length - 1; i >= 0; i--) {
    const p = g.powerups[i];
    p.y += p.vy;

    if (Math.hypot(player.x - p.x, player.y - p.y) < 32) {
      sound.playPowerup();
      applyPowerup(g, p.type, onWeapon, onHealth, onScore);
      createSparks(g, p.x, p.y, '#34d399', 8);
      g.powerups.splice(i, 1);
      continue;
    }

    if (p.y > 660) g.powerups.splice(i, 1);
  }

  // Update Particles
  for (let i = g.particles.length - 1; i >= 0; i--) {
    const pt = g.particles[i];
    pt.x += pt.vx;
    pt.y += pt.vy;
    pt.life--;
    if (pt.life <= 0) g.particles.splice(i, 1);
  }
}

export function firePlayerBullets(g) {
  const p = g.player;
  sound.playShoot();

  if (p.weaponLevel === 1) {
    g.bullets.push({ x: p.x - 7, y: p.y - 18, vx: 0, vy: -12, damage: 1 });
    g.bullets.push({ x: p.x + 7, y: p.y - 18, vx: 0, vy: -12, damage: 1 });
  } else if (p.weaponLevel === 2) {
    g.bullets.push({ x: p.x, y: p.y - 20, vx: 0, vy: -13, damage: 1.5 });
    g.bullets.push({ x: p.x - 12, y: p.y - 14, vx: -1.8, vy: -12, damage: 1 });
    g.bullets.push({ x: p.x + 12, y: p.y - 14, vx: 1.8, vy: -12, damage: 1 });
  } else {
    g.bullets.push({ x: p.x - 6, y: p.y - 22, vx: -0.5, vy: -14, damage: 2 });
    g.bullets.push({ x: p.x + 6, y: p.y - 22, vx: 0.5, vy: -14, damage: 2 });
    g.bullets.push({ x: p.x - 18, y: p.y - 12, vx: -3, vy: -12, damage: 1.5 });
    g.bullets.push({ x: p.x + 18, y: p.y - 12, vx: 3, vy: -12, damage: 1.5 });
  }
}

function applyPlayerDamage(g, amount, onHealth, onGameOver) {
  g.health = Math.max(0, g.health - amount);
  g.player.invulnerable = 45;
  sound.playHit();
  onHealth(g.health);

  if (g.health <= 0) {
    g.active = false;
    sound.playGameOver();
    createExplosion(g, g.player.x, g.player.y, true);
    onGameOver(g.score);
  }
}

function applyPowerup(g, type, onWeapon, onHealth, onScore) {
  if (type === 'weapon') {
    g.player.weaponLevel = Math.min(3, g.player.weaponLevel + 1);
    onWeapon(g.player.weaponLevel);
  } else if (type === 'shield') {
    g.health = Math.min(100, g.health + 35);
    onHealth(g.health);
  } else if (type === 'emp') {
    g.enemies.forEach((e) => {
      createExplosion(g, e.x, e.y, false);
      g.score += e.points;
    });
    g.enemies = [];
    g.enemyBullets = [];
    onScore(g.score);
    sound.playExplosion(true);
  }
}

function spawnPowerup(g, x, y, type) {
  g.powerups.push({ x, y, vy: 1.8, type });
}

function createSparks(g, x, y, color, count) {
  for (let i = 0; i < count; i++) {
    g.particles.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 6,
      vy: (Math.random() - 0.5) * 6,
      life: 14 + Math.random() * 8,
      maxLife: 22,
      color,
      size: 2 + Math.random() * 2,
    });
  }
}

function createExplosion(g, x, y, isLarge) {
  const count = isLarge ? 30 : 16;
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 1 + Math.random() * (isLarge ? 6 : 4);
    g.particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 20 + Math.random() * 15,
      maxLife: 35,
      color: Math.random() < 0.5 ? '#f97316' : '#facc15',
      size: 3 + Math.random() * 3,
    });
  }
}

export function renderEngine(ctx, g) {
  ctx.clearRect(0, 0, 480, 640);

  const bgGrad = ctx.createLinearGradient(0, 0, 0, 640);
  bgGrad.addColorStop(0, '#030712');
  bgGrad.addColorStop(1, '#0b1329');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 480, 640);

  g.stars.forEach((star) => {
    ctx.fillStyle = `rgba(224, 242, 254, ${star.alpha})`;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.strokeStyle = 'rgba(56, 189, 248, 0.04)';
  ctx.lineWidth = 1;
  for (let x = 40; x < 480; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 640);
    ctx.stroke();
  }
  for (let y = 40; y < 640; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(480, y);
    ctx.stroke();
  }

  g.particles.forEach((p) => {
    ctx.fillStyle = p.color;
    ctx.globalAlpha = p.life / p.maxLife;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;

  ctx.fillStyle = '#38bdf8';
  ctx.shadowColor = '#0284c7';
  ctx.shadowBlur = 8;
  g.bullets.forEach((b) => {
    ctx.beginPath();
    ctx.rect(b.x - 2, b.y - 8, 4, 16);
    ctx.fill();
  });
  ctx.shadowBlur = 0;

  ctx.fillStyle = '#ef4444';
  ctx.shadowColor = '#dc2626';
  ctx.shadowBlur = 6;
  g.enemyBullets.forEach((eb) => {
    ctx.beginPath();
    ctx.arc(eb.x, eb.y, eb.radius, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.shadowBlur = 0;

  g.powerups.forEach((p) => {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.strokeStyle = p.type === 'weapon' ? '#38bdf8' : p.type === 'shield' ? '#10b981' : '#f59e0b';
    ctx.lineWidth = 2;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
    ctx.beginPath();
    ctx.arc(0, 0, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = ctx.strokeStyle;
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const label = p.type === 'weapon' ? 'W' : p.type === 'shield' ? 'S' : 'EMP';
    ctx.fillText(label, 0, 1);
    ctx.restore();
  });

  if (g.boss) {
    const b = g.boss;
    ctx.save();
    ctx.translate(b.x, b.y);
    ctx.fillStyle = '#4c1d95';
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 32);
    ctx.lineTo(b.width / 2, 0);
    ctx.lineTo(b.width / 2 - 20, -25);
    ctx.lineTo(0, -15);
    ctx.lineTo(-b.width / 2 + 20, -25);
    ctx.lineTo(-b.width / 2, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(0, 5, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  g.enemies.forEach((e) => {
    ctx.save();
    ctx.translate(e.x, e.y);
    if (e.type === 'scout') {
      ctx.fillStyle = '#dc2626';
      ctx.strokeStyle = '#f87171';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, 14);
      ctx.lineTo(13, -10);
      ctx.lineTo(0, -4);
      ctx.lineTo(-13, -10);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (e.type === 'interceptor') {
      ctx.fillStyle = '#d97706';
      ctx.strokeStyle = '#fde047';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, 16);
      ctx.lineTo(16, -6);
      ctx.lineTo(8, -14);
      ctx.lineTo(-8, -14);
      ctx.lineTo(-16, -6);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else {
      ctx.fillStyle = '#6b21a8';
      ctx.strokeStyle = '#c084fc';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 18);
      ctx.lineTo(22, 6);
      ctx.lineTo(18, -16);
      ctx.lineTo(-18, -16);
      ctx.lineTo(-22, 6);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
    ctx.restore();
  });

  if (g.active) {
    const p = g.player;
    if (p.invulnerable % 6 < 3) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.tilt);

      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.moveTo(0, -22);
      ctx.lineTo(6, -6);
      ctx.lineTo(18, 14);
      ctx.lineTo(12, 16);
      ctx.lineTo(7, 22);
      ctx.lineTo(0, 18);
      ctx.lineTo(-7, 22);
      ctx.lineTo(-12, 16);
      ctx.lineTo(-18, 14);
      ctx.lineTo(-6, -6);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.ellipse(0, -4, 3.5, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      if (p.invulnerable > 0) {
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, 26, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    }
  }
}
