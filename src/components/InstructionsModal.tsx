import React from 'react';
import { BookOpen, Compass, Eye, Sparkles, KeyRound, Trophy, X } from 'lucide-react';

interface InstructionsModalProps {
  onClose: () => void;
}

export const InstructionsModal: React.FC<InstructionsModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-700 p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-950 text-cyan-300 border border-cyan-500/30">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono-code text-cyan-400 uppercase tracking-widest">
              Detective Handbook
            </span>
            <h3 className="text-xl font-bold font-display text-slate-100">
              How to Play "Ghost in the Campus"
            </h3>
          </div>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
          {/* Step 1 */}
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <Compass className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-100 block font-semibold text-xs sm:text-sm">
                1. Explore the 5 Campus Locations
              </strong>
              <p className="text-xs text-slate-400 mt-0.5">
                Visit the Clocktower Library, Science Lab, Classroom 304, Midnight Canteen, and Observatory. Click glowing hotspots to examine objects and collect relics.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <Eye className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-100 block font-semibold text-xs sm:text-sm">
                2. Activate Ghost Vision Multimodal Lab
              </strong>
              <p className="text-xs text-slate-400 mt-0.5">
                Inspect physical artifacts under ultraviolet and acoustic spectra. Let Gemma 4 analyze the items to reveal hidden runes, timestamps, and actionable leads to other locations.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <Sparkles className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-100 block font-semibold text-xs sm:text-sm">
                3. Commune with Aria Vance (AI Ghost)
              </strong>
              <p className="text-xs text-slate-400 mt-0.5">
                Type questions freely or use inquiry chips. Aria remembers all discovered relics. Her trust increases as you present evidence and speak respectfully.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <KeyRound className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-100 block font-semibold text-xs sm:text-sm">
                4. Solve Campus Puzzles & Uncover the 3 Endings
              </strong>
              <p className="text-xs text-slate-400 mt-0.5">
                Crack the DEC Alpha terminal code, align the grandfather clock, decode the slate cipher, and unlock the Centennial Time Capsule to decide Aria's ultimate fate.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-2 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            Got It, Let's Investigate!
          </button>
        </div>
      </div>
    </div>
  );
};
