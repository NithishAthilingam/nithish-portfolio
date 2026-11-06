import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  createInitialGameState,
  initStarfield,
  resetGame,
  updateEngine,
  firePlayerBullets,
} from '../src/components/Arcade/engine.js';

function createCallbacks() {
  const scores = [];
  const healths = [];
  const sectors = [];
  const weapons = [];
  const bossStates = [];
  const gameOverScores = [];

  return {
    scores,
    healths,
    sectors,
    weapons,
    bossStates,
    gameOverScores,
    onScore: (s) => scores.push(s),
    onHealth: (h) => healths.push(h),
    onSector: (sec) => sectors.push(sec),
    onWeapon: (w) => weapons.push(w),
    onBossState: (active, hpPct) => bossStates.push({ active, hpPct }),
    onGameOver: (finalScore) => gameOverScores.push(finalScore),
  };
}

describe('Skyhawk Interceptor Flight & Combat Engine', () => {
  it('initializes game state and 90-star parallax starfield', () => {
    const state = createInitialGameState();
    assert.strictEqual(state.active, false);
    assert.strictEqual(state.health, 100);
    assert.strictEqual(state.sector, 1);

    const stars = initStarfield();
    assert.strictEqual(stars.length, 90);
    for (const s of stars) {
      assert.ok(s.x >= 0 && s.x <= 480);
      assert.ok(s.y >= 0 && s.y <= 640);
    }
  });

  it('scales weapon fire patterns across levels 1, 2, and 3', () => {
    const state = createInitialGameState();
    resetGame(state);

    // Level 1: Dual lasers (2 bullets)
    state.player.weaponLevel = 1;
    firePlayerBullets(state);
    assert.strictEqual(state.bullets.length, 2);

    // Level 2: 3-way spread (3 bullets)
    state.bullets = [];
    state.player.weaponLevel = 2;
    firePlayerBullets(state);
    assert.strictEqual(state.bullets.length, 3);

    // Level 3: Quad plasma cannon (4 bullets)
    state.bullets = [];
    state.player.weaponLevel = 3;
    firePlayerBullets(state);
    assert.strictEqual(state.bullets.length, 4);
  });

  it('handles player movement, banking tilt, and arena clamping', () => {
    const state = createInitialGameState();
    const cb = createCallbacks();
    resetGame(state);

    state.keys['ArrowLeft'] = true;
    for (let i = 0; i < 60; i++) {
      updateEngine(state, cb);
    }
    assert.strictEqual(state.player.x, 24, 'Player X clamped to left bound 24');
    assert.ok(state.player.tilt < 0, 'Banking left induces negative tilt');

    state.keys['ArrowLeft'] = false;
    state.keys['ArrowRight'] = true;
    for (let i = 0; i < 100; i++) {
      updateEngine(state, cb);
    }
    assert.strictEqual(state.player.x, 456, 'Player X clamped to right bound 480 - 24');
    assert.ok(state.player.tilt > 0, 'Banking right induces positive tilt');
  });

  it('destroys enemy on bullet impact and increments score', () => {
    const state = createInitialGameState();
    const cb = createCallbacks();
    resetGame(state);

    // Place a scout enemy and a bullet directly colliding with it
    state.enemies.push({
      type: 'scout',
      x: 200,
      y: 200,
      vx: 0,
      vy: 0,
      width: 26,
      height: 26,
      health: 1,
      points: 100,
    });
    state.bullets.push({
      x: 200,
      y: 205,
      vx: 0,
      vy: -5,
      damage: 1,
    });

    updateEngine(state, cb);

    assert.strictEqual(state.enemies.length, 0, 'Scout enemy should be destroyed');
    assert.strictEqual(state.score, 100, 'Score should increase by 100');
    assert.strictEqual(cb.scores[0], 100);
  });

  it('spawns boss carrier at sector threshold and advances sector on defeat', () => {
    const state = createInitialGameState();
    const cb = createCallbacks();
    resetGame(state);
    state.score = 1200; // Sector 1 boss threshold

    updateEngine(state, cb);
    assert.ok(state.boss !== null, 'Boss carrier should spawn at 1200 score');
    assert.strictEqual(cb.bossStates[0].active, true);

    // Hit boss with high-damage bullet to defeat it
    state.boss.y = 100;
    state.boss.health = 2;
    state.bullets.push({
      x: state.boss.x,
      y: state.boss.y,
      vx: 0,
      vy: 0,
      damage: 5,
    });

    updateEngine(state, cb);
    assert.strictEqual(state.boss, null, 'Boss should be destroyed');
    assert.strictEqual(state.sector, 2, 'Sector should advance to 2');
    assert.strictEqual(state.score, 3200, 'Boss defeat awards 2000 bonus points');
  });

  it('triggers game over when player health drops to 0', () => {
    const state = createInitialGameState();
    const cb = createCallbacks();
    resetGame(state);
    state.health = 10;
    state.player.invulnerable = 0;

    // Collide enemy bullet with player
    state.enemyBullets.push({
      x: state.player.x,
      y: state.player.y,
      vx: 0,
      vy: 0,
      radius: 4,
      color: '#ef4444',
    });

    updateEngine(state, cb);

    assert.strictEqual(state.health, 0);
    assert.strictEqual(state.active, false);
    assert.strictEqual(cb.gameOverScores.length, 1);
  });
});
