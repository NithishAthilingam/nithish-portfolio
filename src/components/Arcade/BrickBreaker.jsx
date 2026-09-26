import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Play, RotateCcw, Volume2, VolumeX, Heart, Zap, Flame, Shield, Trophy } from 'lucide-react';
import { sound } from './soundEffects';
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  createInitialBreakoutState,
  initStarfield,
  resetBreakoutGame,
  launchBall,
  fireBreakoutLasers,
  updateBreakoutEngine,
  renderBreakoutEngine,
} from './brickEngine';

export default function BrickBreaker() {
  const canvasRef = useRef(null);

  // React state for HUD
  const [gameState, setGameState] = useState('START'); // 'START' | 'PLAYING' | 'GAMEOVER'
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    try {
      return parseInt(localStorage.getItem('breakout_high_score') || '0', 10);
    } catch {
      return 0;
    }
  });
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [activeLaser, setActiveLaser] = useState(false);
  const [activeFireball, setActiveFireball] = useState(false);
  const [activeWide, setActiveWide] = useState(false);
  const [activeShield, setActiveShield] = useState(false);

  // Mutable Game Reference (zero React re-render overhead inside 60 FPS tick)
  const gameRef = useRef(createInitialBreakoutState());

  const handleToggleMute = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const handleGameOver = useCallback((finalScore) => {
    setGameState('GAMEOVER');
    setHighScore((prev) => {
      const best = Math.max(prev, finalScore);
      try {
        localStorage.setItem('breakout_high_score', best.toString());
      } catch {}
      return best;
    });
  }, []);

  const startGame = () => {
    sound.init();
    resetBreakoutGame(gameRef.current, 1);
    setScore(0);
    setLives(3);
    setLevel(1);
    setActiveLaser(false);
    setActiveFireball(false);
    setActiveWide(false);
    setActiveShield(false);
    setGameState('PLAYING');
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    gameRef.current.stars = initStarfield();

    const handleKeyDown = (e) => {
      gameRef.current.keys[e.code] = true;
      if (['Space', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        e.preventDefault();
      }
      if (e.code === 'Space' && gameRef.current.active) {
        sound.init();
        if (!gameRef.current.inPlay) {
          launchBall(gameRef.current);
        } else if (gameRef.current.laserTimer > 0) {
          fireBreakoutLasers(gameRef.current);
        }
      }
    };

    const handleKeyUp = (e) => {
      gameRef.current.keys[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    let animId;
    let lastHudSync = 0;

    const callbacks = {
      onScore: setScore,
      onLives: setLives,
      onLevel: setLevel,
      onGameOver: handleGameOver,
    };

    const loop = () => {
      updateBreakoutEngine(gameRef.current, callbacks);
      renderBreakoutEngine(ctx, gameRef.current);

      // Throttle HUD power-up checks to ~10Hz
      const now = Date.now();
      if (now - lastHudSync > 100) {
        lastHudSync = now;
        const g = gameRef.current;
        setActiveLaser(g.laserTimer > 0);
        setActiveFireball(g.fireballTimer > 0);
        setActiveWide(g.wideTimer > 0);
        setActiveShield(g.shieldFloor);
      }

      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleGameOver]);

  // Mouse & Touch Tracking
  const handlePointerMove = (e) => {
    if (!gameRef.current.active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const scaleX = CANVAS_WIDTH / rect.width;
    const canvasX = (clientX - rect.left) * scaleX;
    gameRef.current.paddle.targetX = canvasX;
  };

  const handlePointerDown = (e) => {
    if (!gameRef.current.active) return;
    sound.init();
    if (!gameRef.current.inPlay) {
      launchBall(gameRef.current);
    } else if (gameRef.current.laserTimer > 0) {
      fireBreakoutLasers(gameRef.current);
    }
  };

  return (
    <div className="flex flex-col items-center select-none w-full max-w-xl mx-auto">
      {/* Top Cyber HUD Bar */}
      <div className="w-full bg-slate-900/90 border border-slate-800 rounded-t-2xl p-3 sm:p-4 backdrop-blur-md flex items-center justify-between shadow-lg">
        {/* Lives & Level */}
        <div className="flex items-center gap-3 sm:gap-5">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-slate-400">
              LIVES
            </span>
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, idx) => (
                <Heart
                  key={idx}
                  className={`w-3.5 h-3.5 transition-colors ${
                    idx < lives
                      ? 'text-rose-500 fill-rose-500'
                      : 'text-slate-700/60'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="h-4 w-px bg-slate-800" />

          <div>
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-slate-400">
              SECTOR
            </span>
            <div className="text-xs sm:text-sm font-black text-cyan-400 font-mono">
              0{level}
            </div>
          </div>
        </div>

        {/* Score & High Score */}
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="text-right">
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-slate-400">
              SCORE
            </span>
            <div className="text-sm sm:text-base font-black text-white font-mono tracking-tight">
              {score.toLocaleString()}
            </div>
          </div>

          <div className="text-right hidden xs:block">
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-amber-400/80 flex items-center gap-1 justify-end">
              <Trophy className="w-3 h-3 text-amber-400" /> HI
            </span>
            <div className="text-sm sm:text-base font-black text-amber-400 font-mono tracking-tight">
              {highScore.toLocaleString()}
            </div>
          </div>

          {/* Sound Mute Toggle */}
          <button
            onClick={handleToggleMute}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Active Power-up Badges Strip */}
      <div className="w-full bg-slate-950/80 border-x border-slate-800 px-3 py-1.5 flex items-center justify-center gap-2 overflow-x-auto min-h-[30px]">
        {activeLaser && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse">
            <Zap className="w-3 h-3" /> LASER CANNON
          </span>
        )}
        {activeFireball && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse">
            <Flame className="w-3 h-3" /> FIREBALL PIERCE
          </span>
        )}
        {activeWide && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            ⬌ WIDE PADDLE
          </span>
        )}
        {activeShield && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">
            <Shield className="w-3 h-3" /> SAFETY FLOOR ACTIVE
          </span>
        )}
        {!activeLaser && !activeFireball && !activeWide && !activeShield && (
          <span className="text-[10px] font-mono text-slate-500">
            SMASH BRICKS TO REVEAL POWER-UPS
          </span>
        )}
      </div>

      {/* Canvas Game Arena Container */}
      <div className="relative w-full aspect-[500/650] max-w-[500px] border-x border-b border-slate-800 bg-slate-950 rounded-b-2xl overflow-hidden shadow-2xl">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          onMouseMove={handlePointerMove}
          onMouseDown={handlePointerDown}
          onTouchMove={handlePointerMove}
          onTouchStart={handlePointerDown}
          className="w-full h-full block cursor-none"
        />

        {/* Start Overlay */}
        {gameState === 'START' && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-20">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4 shadow-lg shadow-cyan-500/10 animate-bounce">
              <span className="text-2xl font-black">🧱</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
              CYBER BREAKOUT
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-sm mb-6 leading-relaxed">
              Demolish quantum defense grids with precision vector deflection. Collect multi-balls, plasma lasers, fireballs, and defensive safety barriers!
            </p>

            <button
              onClick={startGame}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/20 active:scale-95 transition-all"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>INITIALIZE MISSION</span>
            </button>

            <div className="mt-6 pt-5 border-t border-slate-800/80 text-[11px] font-mono text-slate-400 space-y-1">
              <p>MOUSE / TOUCH: Move Paddle</p>
              <p>KEYBOARD: [A / D] or [← / →] to Move • [SPACE] to Launch & Fire</p>
            </div>
          </div>
        )}

        {/* Game Over Overlay */}
        {gameState === 'GAMEOVER' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-20">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-4">
              <RotateCcw className="w-7 h-7" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-rose-400 tracking-tight mb-1">
              SYSTEM BREACH
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              All quantum balls depleted in Sector {level}
            </p>

            <div className="grid grid-cols-2 gap-4 w-full max-w-xs mb-6">
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3">
                <span className="text-[10px] font-mono text-slate-400 uppercase">FINAL SCORE</span>
                <p className="text-lg font-black text-white font-mono">{score.toLocaleString()}</p>
              </div>
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3">
                <span className="text-[10px] font-mono text-amber-400 uppercase">BEST RECORD</span>
                <p className="text-lg font-black text-amber-400 font-mono">{highScore.toLocaleString()}</p>
              </div>
            </div>

            <button
              onClick={startGame}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 active:scale-95 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>REDEPLOY PADDLE</span>
            </button>
          </div>
        )}
      </div>

      {/* On-Screen Mobile Action Touch Bar */}
      <div className="w-full max-w-[500px] mt-4 flex items-center justify-between gap-3 px-2 sm:hidden">
        <button
          onTouchStart={() => {
            gameRef.current.keys['ArrowLeft'] = true;
          }}
          onTouchEnd={() => {
            gameRef.current.keys['ArrowLeft'] = false;
          }}
          className="flex-1 py-3 bg-slate-900 border border-slate-800 rounded-xl active:bg-slate-800 text-slate-300 font-mono text-sm font-bold flex items-center justify-center"
        >
          ◄ LEFT
        </button>

        <button
          onTouchStart={() => {
            sound.init();
            if (!gameRef.current.inPlay) {
              launchBall(gameRef.current);
            } else if (gameRef.current.laserTimer > 0) {
              fireBreakoutLasers(gameRef.current);
            }
          }}
          className={`px-6 py-3 border rounded-xl font-mono text-xs font-black transition-all ${
            activeLaser
              ? 'bg-rose-500/20 border-rose-500 text-rose-400 animate-pulse'
              : 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300 active:bg-cyan-500/40'
          }`}
        >
          {activeLaser ? 'FIRE ⚡' : 'LAUNCH'}
        </button>

        <button
          onTouchStart={() => {
            gameRef.current.keys['ArrowRight'] = true;
          }}
          onTouchEnd={() => {
            gameRef.current.keys['ArrowRight'] = false;
          }}
          className="flex-1 py-3 bg-slate-900 border border-slate-800 rounded-xl active:bg-slate-800 text-slate-300 font-mono text-sm font-bold flex items-center justify-center"
        >
          RIGHT ►
        </button>
      </div>
    </div>
  );
}
