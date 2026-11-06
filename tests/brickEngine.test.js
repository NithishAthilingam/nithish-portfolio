import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  createInitialBreakoutState,
  initStarfield,
  buildLevel,
  resetBreakoutGame,
  launchBall,
  explodeBrick,
  updateBreakoutEngine,
} from '../src/components/Arcade/brickEngine.js';

function createNoopCallbacks() {
  return {
    scores: [],
    lives: [],
    levels: [],
    gameOverScores: [],
    onScore(s) {
      this.scores.push(s);
    },
    onLives(l) {
      this.lives.push(l);
    },
    onLevel(lvl) {
      this.levels.push(lvl);
    },
    onGameOver(finalScore) {
      this.gameOverScores.push(finalScore);
    },
  };
}

describe('Cyber Breakout Physics & Simulation Engine', () => {
  it('initializes game state and starfield within 480x640 cabinet dimensions', () => {
    assert.strictEqual(CANVAS_WIDTH, 480);
    assert.strictEqual(CANVAS_HEIGHT, 640);

    const state = createInitialBreakoutState();
    assert.strictEqual(state.active, false);
    assert.strictEqual(state.lives, 3);
    assert.strictEqual(state.level, 1);

    const stars = initStarfield();
    assert.strictEqual(stars.length, 45);
    for (const s of stars) {
      assert.ok(s.x >= 0 && s.x <= CANVAS_WIDTH);
      assert.ok(s.y >= 0 && s.y <= CANVAS_HEIGHT);
    }
  });

  it('builds valid brick grids across levels 1, 2, and 3', () => {
    const lvl1 = buildLevel(1);
    assert.strictEqual(lvl1.length, 6 * 8); // 6 rows x 8 cols
    for (const b of lvl1) {
      assert.ok(b.x >= 0 && b.x + b.width <= CANVAS_WIDTH + 0.01);
      assert.strictEqual(b.active, true);
    }

    const lvl2 = buildLevel(2);
    const explosiveCount = lvl2.filter((b) => b.type === 'explosive').length;
    assert.ok(explosiveCount > 0, 'Level 2 should include explosive cluster bricks');

    const lvl3 = buildLevel(3);
    const unbreakableCount = lvl3.filter((b) => b.type === 'unbreakable').length;
    const tier3Count = lvl3.filter((b) => b.tier === 3).length;
    assert.ok(unbreakableCount > 0, 'Level 3 should include unbreakable steel bricks');
    assert.ok(tier3Count > 0, 'Level 3 should include tier-3 reinforced bricks');
  });

  it('resets game and launches ball with upward velocity vector', () => {
    const state = createInitialBreakoutState();
    resetBreakoutGame(state, 1);

    assert.strictEqual(state.active, true);
    assert.strictEqual(state.inPlay, false);
    assert.strictEqual(state.balls.length, 1);
    assert.strictEqual(state.balls[0].vy, 0);

    launchBall(state);
    assert.strictEqual(state.inPlay, true);
    assert.ok(state.balls[0].vy < 0, 'Launched ball must travel upward (vy < 0)');
  });

  it('constrains paddle movement within left and right arena boundaries', () => {
    const state = createInitialBreakoutState();
    const cb = createNoopCallbacks();
    resetBreakoutGame(state, 1);

    // Move far left
    state.keys['ArrowLeft'] = true;
    for (let i = 0; i < 60; i++) {
      updateBreakoutEngine(state, cb);
    }
    assert.strictEqual(state.paddle.x, 4);

    // Move far right
    state.keys['ArrowLeft'] = false;
    state.keys['ArrowRight'] = true;
    for (let i = 0; i < 100; i++) {
      updateBreakoutEngine(state, cb);
    }
    assert.strictEqual(state.paddle.x + state.paddle.width, CANVAS_WIDTH - 4);
  });

  it('calculates angular rebound deflection when ball hits paddle', () => {
    const state = createInitialBreakoutState();
    const cb = createNoopCallbacks();
    resetBreakoutGame(state, 1);
    state.inPlay = true;

    // Position ball hitting right side of paddle moving downward
    const paddleRightHitX = state.paddle.x + state.paddle.width * 0.85;
    state.balls[0].x = paddleRightHitX;
    state.balls[0].y = state.paddle.y - 2;
    state.balls[0].vx = 0;
    state.balls[0].vy = 5;

    updateBreakoutEngine(state, cb);

    assert.ok(state.balls[0].vy < 0, 'Ball should bounce upward off paddle');
    assert.ok(state.balls[0].vx > 0, 'Striking right side of paddle should deflect right (vx > 0)');
  });

  it('triggers 3x3 cluster damage when an explosive brick detonates', () => {
    const state = createInitialBreakoutState();
    resetBreakoutGame(state, 2);

    const centerBrick = state.bricks.find((b) => b.row === 1 && b.col === 2);
    const neighborBrick = state.bricks.find((b) => b.row === 1 && b.col === 1);
    assert.ok(centerBrick);
    assert.ok(neighborBrick);

    const initialTier = neighborBrick.tier;
    explodeBrick(state, centerBrick);

    assert.strictEqual(neighborBrick.tier, initialTier - 1);
    assert.ok(state.shake > 0, 'Screen shake should trigger on explosion');
  });

  it('applies multiball power-up and safety shield floor defense', () => {
    const state = createInitialBreakoutState();
    const cb = createNoopCallbacks();
    resetBreakoutGame(state, 1);
    launchBall(state);

    // Collect multiball powerup at paddle position
    state.powerups.push({
      x: state.paddle.x + 20,
      y: state.paddle.y,
      vy: 2,
      radius: 12,
      type: 'multiball',
      label: '3x',
      color: '#38bdf8',
      text: 'Multi-Ball',
    });

    updateBreakoutEngine(state, cb);
    assert.strictEqual(state.balls.length, 3, 'Multiball should split 1 ball into 3');

    // Test safety shield floor saving a ball at bottom
    state.balls = [
      {
        x: 240,
        y: CANVAS_HEIGHT - 10,
        vx: 0,
        vy: 6,
        speed: 6,
        radius: 6,
        active: true,
        trail: [],
        isFireball: false,
      },
    ];
    state.shieldFloor = true;

    updateBreakoutEngine(state, cb);
    assert.ok(state.balls[0].vy < 0, 'Safety floor should bounce ball back up');
    assert.strictEqual(state.shieldFloor, false, 'Safety floor is consumed after saving ball');
  });

  it('decrements lives and triggers game over when all balls are lost', () => {
    const state = createInitialBreakoutState();
    const cb = createNoopCallbacks();
    resetBreakoutGame(state, 1);
    state.lives = 1;
    state.inPlay = true;

    // Place ball past bottom boundary
    state.balls[0].y = CANVAS_HEIGHT + 20;
    state.balls[0].vy = 5;

    updateBreakoutEngine(state, cb);

    assert.strictEqual(state.lives, 0);
    assert.strictEqual(state.active, false);
    assert.strictEqual(cb.gameOverScores.length, 1);
  });
});
