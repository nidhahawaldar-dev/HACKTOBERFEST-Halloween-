import React, { useState } from 'react';
import { GameState } from '../types/game';
import { triggerFinalDeduction, FinalEndingResponse } from '../services/apiClient';
import { Sparkles, Trophy, RotateCcw, Loader2, ArrowRight, Sun, Moon, AlertTriangle } from 'lucide-react';
import { soundEffects } from '../services/audioService';

interface FinalConfrontationModalProps {
  gameState: GameState;
  onRestartGame: () => void;
  onClose: () => void;
}

export const FinalConfrontationModal: React.FC<FinalConfrontationModalProps> = ({
  gameState,
  onRestartGame,
  onClose,
}) => {
  const [selectedEnding, setSelectedEnding] = useState<'ascension' | 'guardian' | 'trapped'>('ascension');
  const [playerThesis, setPlayerThesis] = useState(
    'Aria Vance uncovered the harmonic resonance of the campus bell tower in 1994. Her research was preserved in the time capsule to inspire future open-source builders.'
  );
  const [loading, setLoading] = useState(false);
  const [endingResult, setEndingResult] = useState<FinalEndingResponse | null>(null);

  const handleResolveEnding = async () => {
    try {
      setLoading(true);
      soundEffects.playGhostVision();

      const result = await triggerFinalDeduction(selectedEnding, playerThesis, gameState);
      setEndingResult(result);
      soundEffects.playPuzzleSolved();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 sm:p-8 space-y-6 my-8">
        {!endingResult ? (
          <>
            {/* Climax Introduction Header */}
            <div className="text-center space-y-2">
              <span className="text-xs font-mono-code text-cyan-400 uppercase tracking-widest">
                The Midnight Climax · 3:00 AM
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold font-display text-slate-100">
                The Centennial Time Capsule
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto font-light leading-relaxed">
                You stand before the opened bronze chest atop the Observatory hill. Aria Vance's translucent form illuminates the mist around you.
                Choose the fate of her legacy.
              </p>
            </div>

            {/* Ending Choice Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div
                onClick={() => {
                  soundEffects.playClick();
                  setSelectedEnding('ascension');
                }}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedEnding === 'ascension'
                    ? 'bg-slate-950 border-cyan-400 ring-2 ring-cyan-400/30'
                    : 'bg-slate-950/60 hover:bg-slate-950 border-slate-800'
                }`}
              >
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold font-mono-code mb-1">
                  <Sun className="w-4 h-4" />
                  <span>Ascension</span>
                </div>
                <h4 className="text-sm font-bold text-slate-100">Peaceful Release</h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-normal">
                  Publish Aria's research globally; release her spirit from thirty-two years of campus purgatory.
                </p>
              </div>

              <div
                onClick={() => {
                  soundEffects.playClick();
                  setSelectedEnding('guardian');
                }}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedEnding === 'guardian'
                    ? 'bg-slate-950 border-teal-400 ring-2 ring-teal-400/30'
                    : 'bg-slate-950/60 hover:bg-slate-950 border-slate-800'
                }`}
              >
                <div className="flex items-center gap-2 text-teal-400 text-xs font-bold font-mono-code mb-1">
                  <Moon className="w-4 h-4" />
                  <span>The Guardian</span>
                </div>
                <h4 className="text-sm font-bold text-slate-100">Campus Protector</h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-normal">
                  Forge a pact with Aria. She remains as the nocturnal guardian angel of young hackers and students.
                </p>
              </div>

              <div
                onClick={() => {
                  soundEffects.playClick();
                  setSelectedEnding('trapped');
                }}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedEnding === 'trapped'
                    ? 'bg-slate-950 border-amber-400 ring-2 ring-amber-400/30'
                    : 'bg-slate-950/60 hover:bg-slate-950 border-slate-800'
                }`}
              >
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold font-mono-code mb-1">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Midnight Loop</span>
                </div>
                <h4 className="text-sm font-bold text-slate-100">The Secret Kept</h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-normal">
                  Conceal the resonance machine to exploit it alone. The campus fog deepens indefinitely.
                </p>
              </div>
            </div>

            {/* Custom Student Thesis Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono-code text-slate-300 block">
                Your Final Detective Hypothesis:
              </label>
              <textarea
                rows={3}
                value={playerThesis}
                onChange={(e) => setPlayerThesis(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-4 pt-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white bg-slate-800 rounded-lg cursor-pointer"
              >
                Return to Campus
              </button>

              <button
                disabled={loading}
                onClick={handleResolveEnding}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-300 to-sky-300 hover:from-cyan-300 hover:to-teal-200 text-slate-950 font-bold text-sm shadow-xl transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Gemma 4 Writing Epilogue...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Conclude Campus Mystery</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </>
        ) : (
          /* Ending Result Screen */
          <div className="space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-500 to-teal-400 text-slate-950 flex items-center justify-center mx-auto shadow-xl">
              <Trophy className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-mono-code text-teal-400 uppercase tracking-widest">
                Investigation Complete · Final Score: {endingResult.finalScore}/100
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-100">
                {endingResult.title}
              </h2>
            </div>

            {/* Cinematic 3-paragraph narrative */}
            <div className="p-6 rounded-2xl bg-slate-950/90 border border-slate-800 text-left space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed max-h-[380px] overflow-y-auto">
              {endingResult.narrative.split('\n\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            {/* Epilogue quote */}
            <div className="p-4 rounded-xl bg-teal-950/30 border border-teal-500/30 text-teal-200 font-mono-code text-xs italic">
              {endingResult.epilogue}
            </div>

            {/* Restart Button */}
            <div className="pt-2 flex items-center justify-center gap-4">
              <button
                onClick={() => {
                  soundEffects.playClick();
                  onRestartGame();
                }}
                className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Play Again (Restart Investigation)</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
