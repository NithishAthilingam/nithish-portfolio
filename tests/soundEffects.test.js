import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { sound } from '../src/components/Arcade/soundEffects.js';

function createMockAudioContext() {
  const oscillators = [];
  const gains = [];

  return {
    state: 'running',
    currentTime: 0,
    destination: {},
    oscillators,
    gains,
    resumed: false,
    resume() {
      this.resumed = true;
      this.state = 'running';
    },
    createOscillator() {
      const osc = {
        type: 'sine',
        frequency: {
          values: [],
          setValueAtTime(val, time) {
            this.values.push({ type: 'set', val, time });
          },
          exponentialRampToValueAtTime(val, time) {
            this.values.push({ type: 'ramp', val, time });
          },
        },
        connectedTo: null,
        startedAt: null,
        stoppedAt: null,
        connect(target) {
          this.connectedTo = target;
        },
        start(time) {
          this.startedAt = time;
        },
        stop(time) {
          this.stoppedAt = time;
        },
      };
      oscillators.push(osc);
      return osc;
    },
    createGain() {
      const g = {
        gain: {
          values: [],
          setValueAtTime(val, time) {
            this.values.push({ type: 'set', val, time });
          },
          exponentialRampToValueAtTime(val, time) {
            this.values.push({ type: 'ramp', val, time });
          },
        },
        connectedTo: null,
        connect(target) {
          this.connectedTo = target;
        },
      };
      gains.push(g);
      return g;
    },
  };
}

describe('Procedural Web Audio SoundSystem', () => {
  beforeEach(() => {
    sound.ctx = null;
    sound.muted = false;
  });

  it('toggles mute state accurately', () => {
    assert.strictEqual(sound.muted, false);
    const firstToggle = sound.toggleMute();
    assert.strictEqual(firstToggle, true);
    assert.strictEqual(sound.muted, true);

    const secondToggle = sound.toggleMute();
    assert.strictEqual(secondToggle, false);
    assert.strictEqual(sound.muted, false);
  });

  it('safely no-ops when AudioContext is uninitialized', () => {
    assert.doesNotThrow(() => {
      sound.playShoot();
      sound.playExplosion(true);
      sound.playPowerup();
      sound.playHit();
      sound.playGameOver();
      sound.playPaddleBounce();
      sound.playBrickHit(2);
      sound.playBrickBreak();
      sound.playBallLost();
      sound.playLevelWin();
    });
  });

  it('synthesizes laser, explosion, and breakout oscillators when active', () => {
    const mockCtx = createMockAudioContext();
    sound.ctx = mockCtx;

    sound.playShoot();
    assert.strictEqual(mockCtx.oscillators.length, 1);
    assert.strictEqual(mockCtx.oscillators[0].type, 'sawtooth');
    assert.strictEqual(mockCtx.oscillators[0].frequency.values[0].val, 880);

    sound.playPaddleBounce();
    assert.strictEqual(mockCtx.oscillators.length, 2);
    assert.strictEqual(mockCtx.oscillators[1].type, 'sine');

    sound.playBrickHit(3);
    assert.strictEqual(mockCtx.oscillators.length, 3);
    assert.strictEqual(mockCtx.oscillators[2].type, 'triangle');
    assert.strictEqual(mockCtx.oscillators[2].frequency.values[0].val, 500 + 3 * 120);

    // 4-note arpeggio on level win
    sound.playLevelWin();
    assert.strictEqual(mockCtx.oscillators.length, 7);
  });

  it('suppresses oscillator synthesis when muted', () => {
    const mockCtx = createMockAudioContext();
    sound.ctx = mockCtx;
    sound.toggleMute();

    sound.playShoot();
    sound.playExplosion();
    sound.playPaddleBounce();

    assert.strictEqual(mockCtx.oscillators.length, 0);
  });
});
