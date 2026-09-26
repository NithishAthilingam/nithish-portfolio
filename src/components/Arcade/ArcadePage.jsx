import React from 'react';
import { ArrowLeft, Gamepad2, Cpu, Sparkles, Volume2 } from 'lucide-react';
import JetShooter from './JetShooter';

export default function ArcadePage({ onNavigate }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-600/30 selection:text-white flex flex-col">
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button
            onClick={() => onNavigate('/')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 text-blue-400 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Portfolio</span>
          </button>

          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Arcade Online
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-10 flex flex-col items-center">
        {/* Title */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>Aerospace Minigame Showcase</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Skyhawk Interceptor
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            A retro supersonic flight defense combat simulation inspired by Captain Skyhawk. Built with 100% native HTML5 Canvas and procedural Web Audio.
          </p>
        </div>

        {/* The Game */}
        <div className="w-full flex justify-center mb-12">
          <JetShooter />
        </div>

        {/* Technical Architecture Notes */}
        <div className="w-full max-w-3xl pt-8 border-t border-slate-800/80">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6 text-center">
            Engine & Systems Architecture
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                <Cpu className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-white">60 FPS Game Loop</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Decoupled mutable render loop using <code className="text-blue-300">requestAnimationFrame</code> preventing React state thrashing during high-volume particle rendering.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-white">Particle & Vector Math</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Custom physics arrays managing velocity vectors, dynamic drag, bank angle rotation, and multi-stage explosion life cycles.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Volume2 className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-white">Synthesized Audio</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Zero audio asset downloads. All laser shots, thrusters, and explosive rumble frequencies are procedurally generated via Web Audio API oscillators.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-slate-800/60 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} Nithish Athilingam • Skyhawk Interceptor Arcade Module</p>
      </footer>
    </div>
  );
}
