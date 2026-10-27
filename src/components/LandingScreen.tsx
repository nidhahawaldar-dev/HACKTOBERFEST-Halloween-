import React from 'react';
import { Compass, Sparkles, BookOpen, Clock, ShieldCheck, ArrowRight, Eye, Terminal } from 'lucide-react';
import { soundEffects } from '../services/audioService';

interface LandingScreenProps {
  onStartGame: () => void;
  onStartDemoSpeedrun: () => void;
  onOpenInstructions: () => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({
  onStartGame,
  onStartDemoSpeedrun,
  onOpenInstructions,
}) => {
  return (
    <div className="relative min-h-[calc(100vh-65px)] flex items-center justify-center overflow-hidden px-4 py-12">
      {/* Background with dark overlay & subtle vignette */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/campus_map_night_1793091058092.jpg"
          alt="Haunted University Campus at Midnight"
          className="w-full h-full object-cover opacity-25 filter blur-[1px] scale-105 transform duration-1000 ease-out"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/90 to-slate-950/70" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
        {/* Hackathon banner & release tag */}
        <div className="inline-flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-cyan-500/30 text-xs text-cyan-300 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-medium">VTU Belagavi · Jnana Sangama Campus</span>
          <span className="text-slate-500">·</span>
          <span>Gemma 4 AI Mystery Edition</span>
        </div>

        {/* Hero Title & Synopsis */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-display tracking-tight text-slate-100 max-w-3xl mx-auto leading-tight">
            Ghost in the <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-sky-200">Campus</span>
          </h1>
          <p className="text-sm font-mono-code text-cyan-400/90 tracking-widest uppercase">
            Visvesvaraya Technological University (VTU) · Belagavi, Karnataka
          </p>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
            Amidst the misty Sahyadri hills of Belagavi, honors research scholar <strong className="text-cyan-300 font-semibold">Aria Vance (Aria Rao, USN: 2BA98CS042)</strong> vanished during a torrential monsoon storm.
            Tonight, her spectral presence has awakened across the 120-acre Jnana Sangama campus. Search the grounds, decode relics with <strong className="text-teal-300 font-semibold">Gemma 4 Vision</strong>, and uncover the truth.
          </p>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left max-w-3xl mx-auto pt-2">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-cyan-400 text-sm font-semibold mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Gemma 4 AI Ghost</span>
            </div>
            <p className="text-xs text-slate-400 leading-normal">
              Commune with Aria. She remembers your discovered clues, adjusts her trust, and speaks in dynamic, context-aware prose.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-teal-400 text-sm font-semibold mb-1">
              <Eye className="w-4 h-4" />
              <span>Ghost Vision Multimodal</span>
            </div>
            <p className="text-xs text-slate-400 leading-normal">
              Inspect physical evidence under spectral ultraviolet light to decode invisible runes and reveal next location coordinates.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-sky-400 text-sm font-semibold mb-1">
              <Terminal className="w-4 h-4" />
              <span>4 Campus Puzzles & 3 Endings</span>
            </div>
            <p className="text-xs text-slate-400 leading-normal">
              Unlock the grandfather clock, DEC Alpha terminal, slate cipher, and the 1994 time capsule to decide Aria's eternal fate.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => {
              soundEffects.startAmbience();
              soundEffects.playClick();
              onStartGame();
            }}
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-bold rounded-xl shadow-lg shadow-cyan-500/20 hover:shadow-cyan-400/30 transition-all flex items-center justify-center gap-2 cursor-pointer text-base"
          >
            <Compass className="w-5 h-5" />
            <span>Begin Campus Exploration</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              soundEffects.startAmbience();
              soundEffects.playClick();
              onStartDemoSpeedrun();
            }}
            className="w-full sm:w-auto px-6 py-3.5 bg-slate-800/90 hover:bg-slate-700 text-cyan-300 border border-cyan-500/40 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer text-sm font-medium"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Judge 3-Minute Quick Demo</span>
          </button>

          <button
            onClick={onOpenInstructions}
            className="w-full sm:w-auto px-5 py-3.5 bg-slate-900/60 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer text-sm"
          >
            <BookOpen className="w-4 h-4 text-slate-400" />
            <span>Instructions</span>
          </button>
        </div>

        {/* Quiet Meta Line */}
        <div className="pt-4 text-xs text-slate-500 flex items-center justify-center gap-4">
          <span>5 Campus Locations</span>
          <span>·</span>
          <span>Open Source Architecture</span>
          <span>·</span>
          <span>Zero External Asset Dependencies</span>
        </div>
      </div>
    </div>
  );
};
