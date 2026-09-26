import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Play, RotateCcw, Volume2, VolumeX, Shield, Trophy, Flame, Zap } from 'lucide-react';
import { sound } from './soundEffects';
import {
  createInitialGameState,
  initStarfield,
  resetGame,
  updateEngine,
  renderEngine,
  firePlayerBullets,
} from './engine';

export default function JetShooter() {
  const canvasRef = useRef(null);

  // React state for HUD
  const [gameState, setGameState] = useState('START'); // 'START' | 'PLAYING' | 'GAMEOVER'
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    try {
      return parseInt(localStorage.getItem('skyhawk_high_score') || '0', 10);
    } catch {
      return 0;
    }
  });
  const [health, setHealth] = useState(100);
  const [weaponLevel, setWeaponLevel] = useState(1);
  const [sector, setSector] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [bossActive, setBossActive] = useState(false);
  const [bossHealthPercent, setBossHealthPercent] = useState(100);

  // Mutable Game Reference (zero React re-render overhead inside 60 FPS tick)
  const gameRef = useRef(createInitialGameState());

  const handleToggleMute = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const handleGameOver = useCallback((finalScore) => {
    setGameState('GAMEOVER');
    setHighScore((prev) => {
      const best = Math.max(prev, finalScore);
      try {
        localStorage.setItem('skyhawk_high_score', best.toString());
      } catch {}
      return best;
    });
  }, []);

  const handleBossState = useCallback((active, healthPercent) => {
    setBossActive(active);
    setBossHealthPercent(healthPercent);
  }, []);

  // Start / Restart Game
  const startGame = () => {
    sound.init();
    resetGame(gameRef.current);
    setScore(0);
    setHealth(100);
    setWeaponLevel(1);
    setSector(1);
    setBossActive(false);
    setGameState('PLAYING');
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    gameRef.current.stars = initStarfield();

    const handleKeyDown = (e) => {
      gameRef.current.keys[e.code] = true;
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        e.preventDefault();
      }
      if (e.code === 'Space' && gameRef.current.active) {
        sound.init();
      }
    };

    const handleKeyUp = (e) => {
      gameRef.current.keys[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    let animId;
    const callbacks = {
      onScore: setScore,
      onHealth: setHealth,
      onSector: setSector,
      onWeapon: setWeaponLevel,
      onBossState: handleBossState,
      onGameOver: handleGameOver,
    };

    const loop = () => {
      updateEngine(gameRef.current, callbacks);
      renderEngine(ctx, gameRef.current);
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleBossState, handleGameOver]);

  const handleTouchMove = (e) => {
    if (!gameRef.current.active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const scaleX = 480 / rect.width;
    const scaleY = 640 / rect.height;

    gameRef.current.player.x = (touch.clientX - rect.left) * scaleX;
    gameRef.current.player.y = (touch.clientY - rect.top) * scaleY - 30;
  };

  return (
    <div className="flex flex-col items-center select-none">
      {/* Top Arcade HUD Stats */}
      <div className="w-full max-w-[480px] bg-slate-900/90 border border-slate-800 rounded-t-2xl p-3 flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-mono">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-white">{score}</span>
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            HI: <span className="text-slate-300">{highScore}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-blue-400" />
            <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-200 ${
                  health > 50 ? 'bg-emerald-500' : health > 25 ? 'bg-amber-500' : 'bg-red-500'
                }`}
                style={{ width: `${health}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-1 text-[11px] font-mono text-purple-400">
            <Zap className="w-3.5 h-3.5" />
            <span>LV{weaponLevel}</span>
          </div>

          <button
            onClick={handleToggleMute}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-blue-400" />}
          </button>
        </div>
      </div>

      {/* Boss Health Bar (if active) */}
      {bossActive && (
        <div className="w-full max-w-[480px] bg-red-950/60 border-x border-red-500/40 p-1.5 flex items-center gap-2">
          <span className="text-[10px] font-mono text-red-400 uppercase tracking-wider font-bold">
            BOSS CARRIER
          </span>
          <div className="flex-1 h-2 bg-red-950 rounded-full overflow-hidden border border-red-500/40">
            <div
              className="h-full bg-gradient-to-r from-red-600 to-amber-500 transition-all"
              style={{ width: `${bossHealthPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Main Canvas Container */}
      <div className="relative w-full max-w-[480px] aspect-[3/4] bg-slate-950 border border-slate-800 shadow-2xl shadow-blue-500/10 overflow-hidden">
        <canvas
          ref={canvasRef}
          width={480}
          height={640}
          onTouchMove={handleTouchMove}
          onTouchStart={() => {
            if (gameState === 'PLAYING') firePlayerBullets(gameRef.current);
          }}
          className="w-full h-full block cursor-crosshair touch-none"
        />

        {/* Start Overlay */}
        {gameState === 'START' && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-4 shadow-lg shadow-blue-500/20">
              <Flame className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-black text-white tracking-wider uppercase mb-1">
              SKYHAWK INTERCEPTOR
            </h2>
            <p className="text-xs text-blue-400 font-mono uppercase tracking-widest mb-6">
              Sector Defense Simulation
            </p>

            <button
              onClick={startGame}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/40 transition-all hover:scale-105 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              LAUNCH JET
            </button>

            <div className="mt-8 pt-6 border-t border-slate-800/80 text-xs text-slate-400 space-y-1 font-mono">
              <p>Move: <span className="text-slate-200">WASD / Arrow Keys</span></p>
              <p>Fire: <span className="text-slate-200">Spacebar</span></p>
              <p className="text-slate-500 text-[11px] pt-1">Mobile: Drag anywhere to steer</p>
            </div>
          </div>
        )}

        {/* Game Over Overlay */}
        {gameState === 'GAMEOVER' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
            <h3 className="text-2xl font-black text-red-500 tracking-wider uppercase mb-2">
              MISSION TERMINATED
            </h3>
            <p className="text-xs text-slate-400 font-mono mb-4">
              Your jet was destroyed in Sector {sector}
            </p>

            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 w-48 mb-6">
              <div className="text-xs text-slate-400 uppercase">Final Score</div>
              <div className="text-2xl font-black text-white font-mono mt-0.5">{score}</div>
              <div className="text-[11px] text-amber-400 mt-2">
                High Score: {highScore}
              </div>
            </div>

            <button
              onClick={startGame}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/40 transition-all hover:scale-105 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              DEPLOY AGAIN
            </button>
          </div>
        )}
      </div>

      {/* Bottom Controls Legend */}
      <div className="w-full max-w-[480px] bg-slate-900/80 border border-slate-800 rounded-b-2xl p-3 flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <span>WASD / Arrows to Move</span>
        <span>Space to Fire</span>
      </div>
    </div>
  );
}
