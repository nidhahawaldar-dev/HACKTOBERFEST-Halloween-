import React, { useState } from 'react';
import { Sparkles, Zap, FastForward, Info, Cpu, Check, X } from 'lucide-react';
import { soundEffects } from '../services/audioService';

interface JudgeDemoBarProps {
  onUnlockAllClues: () => void;
  onBoostTrust: () => void;
  onTriggerClimax: () => void;
}

export const JudgeDemoBar: React.FC<JudgeDemoBarProps> = ({
  onUnlockAllClues,
  onBoostTrust,
  onTriggerClimax,
}) => {
  const [showArchModal, setShowArchModal] = useState(false);
  const [showNotice, setShowNotice] = useState(false);

  return (
    <>
      <div className="bg-slate-900/90 border-b border-cyan-500/20 px-4 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-cyan-300 font-mono-code">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="font-bold">Hacktoberfest Demo Bar:</span>
            <span className="text-slate-400 hidden sm:inline">
              Evaluate Gemma 4 investigation loop in 3 minutes
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundEffects.playClueFound();
                onUnlockAllClues();
                setShowNotice(true);
                setTimeout(() => setShowNotice(false), 3000);
              }}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 text-[11px] font-mono-code flex items-center gap-1 cursor-pointer"
            >
              <Zap className="w-3 h-3 text-teal-400" />
              <span>Unlock 3 Clues</span>
            </button>

            <button
              onClick={() => {
                soundEffects.playClick();
                onBoostTrust();
              }}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-[11px] font-mono-code flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>Trust: 90%</span>
            </button>

            <button
              onClick={() => {
                soundEffects.playPuzzleSolved();
                onTriggerClimax();
              }}
              className="px-2.5 py-1 rounded bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold text-[11px] font-mono-code flex items-center gap-1 cursor-pointer"
            >
              <FastForward className="w-3 h-3" />
              <span>Jump to Climax</span>
            </button>

            <button
              onClick={() => setShowArchModal(true)}
              className="px-2.5 py-1 rounded bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/30 text-[11px] font-mono-code flex items-center gap-1 cursor-pointer"
            >
              <Cpu className="w-3 h-3 text-cyan-400" />
              <span>Gemma 4 Flow</span>
            </button>
          </div>
        </div>
      </div>

      {showNotice && (
        <div className="fixed top-14 right-4 z-50 p-3 rounded-xl bg-teal-950 border border-teal-500 text-teal-200 text-xs shadow-xl animate-fade-in">
          3 1994 Evidence Clues Added to your Evidence Journal!
        </div>
      )}

      {/* Gemma 4 Architecture Modal */}
      {showArchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-700 p-6 space-y-5 max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setShowArchModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-cyan-400" />
              <h3 className="text-lg font-bold font-display text-slate-100">
                Gemma 4 AI Investigation Architecture
              </h3>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed font-light">
              <p>
                In <strong>Ghost in the Campus</strong>, Gemma 4 is NOT a simple chatbot widget. It forms the foundational feedback loop of gameplay:
              </p>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 font-mono-code text-[11px]">
                <div className="text-cyan-400 font-bold">THE CORE INVESTIGATION PIPELINE:</div>
                <div className="text-slate-300">
                  1. Player Explores Campus & Finds Relic (Disk, Journal, Cipher)
                  <br />
                  ↓
                  <br />
                  2. Relic Submitted to <strong className="text-teal-300">Gemma 4 Multimodal Vision</strong> (Wavelength Analysis)
                  <br />
                  ↓
                  <br />
                  3. Gemma Decodes Runes & Produces Next Location Lead + Trust Bonus
                  <br />
                  ↓
                  <br />
                  4. Player Talks with Ghost (Aria retains full dynamic session memory)
                  <br />
                  ↓
                  <br />
                  5. Ghost's Trust Level changes tone from cryptic to harmonized
                  <br />
                  ↓
                  <br />
                  6. Solves 4 Puzzles and Unlocks 1 of 3 Divergent Endings at Observatory
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="font-bold text-teal-300 mb-1 font-mono-code">Server-Side Security</div>
                  <p className="text-[11px] text-slate-400">
                    Built with Node/Express and @google/genai SDK on server side.
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="font-bold text-cyan-300 mb-1 font-mono-code">Open Source Ready</div>
                  <p className="text-[11px] text-slate-400">
                    Structured modular folders so contributors can easily add locations, clues, puzzles, or new endings.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setShowArchModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs text-white rounded-lg cursor-pointer"
              >
                Close Diagram
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
