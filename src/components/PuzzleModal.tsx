import React, { useState } from 'react';
import { Puzzle, PuzzleType } from '../types/game';
import { INITIAL_PUZZLES } from '../data/gameContent';
import { KeyRound, Lock, CheckCircle2, HelpCircle, Terminal, Clock, Sparkles, X } from 'lucide-react';
import { soundEffects } from '../services/audioService';

interface PuzzleModalProps {
  puzzleId: PuzzleType;
  solved: boolean;
  onSolve: (puzzleId: PuzzleType, rewardClueId?: string) => void;
  onClose: () => void;
}

export const PuzzleModal: React.FC<PuzzleModalProps> = ({
  puzzleId,
  solved,
  onSolve,
  onClose,
}) => {
  const puzzle = INITIAL_PUZZLES.find((p) => p.id === puzzleId) || INITIAL_PUZZLES[0];
  const [inputVal, setInputVal] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const cleanInput = inputVal.trim().toUpperCase();
    const cleanSolution = puzzle.solutionKey.toUpperCase();

    if (cleanInput === cleanSolution || (puzzle.id === 'clock_riddle' && cleanInput === '23:11')) {
      soundEffects.playPuzzleSolved();
      onSolve(puzzle.id, puzzle.rewardClueId);
      setErrorMessage(null);
    } else {
      soundEffects.playClick();
      setErrorMessage('Mechanism clicks negatively. The code is incorrect. Consult your clues or ask Aria.');
    }
  };

  const handleInstantDemoSolve = () => {
    soundEffects.playPuzzleSolved();
    onSolve(puzzle.id, puzzle.rewardClueId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Puzzle Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-amber-950/80 border border-amber-500/40 text-amber-300">
            {puzzle.id === 'terminal_code' ? (
              <Terminal className="w-6 h-6" />
            ) : puzzle.id === 'clock_riddle' ? (
              <Clock className="w-6 h-6" />
            ) : (
              <KeyRound className="w-6 h-6" />
            )}
          </div>

          <div>
            <span className="text-[10px] font-mono-code text-cyan-400 uppercase tracking-widest">
              Campus Lock Mechanism
            </span>
            <h3 className="text-xl font-bold font-display text-slate-100">
              {puzzle.title}
            </h3>
          </div>
        </div>

        {/* Solved state view */}
        {solved ? (
          <div className="p-5 rounded-xl bg-teal-950/40 border border-teal-500/50 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-teal-400 mx-auto" />
            <h4 className="text-base font-bold text-teal-200">Mechanism Disarmed</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {puzzle.solvedMessage}
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
            >
              Continue Exploring
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {puzzle.prompt}
            </p>

            {/* Terminal styling for computer lab puzzle */}
            {puzzle.id === 'terminal_code' ? (
              <div className="p-4 rounded-xl bg-black border border-amber-600/50 font-mono-code text-amber-400 text-xs space-y-2">
                <div>DEC-ALPHA OS v2.1 // 1994 CAMPUS MAINFRAME</div>
                <div>ROOT AUTHENTICATION CHALLENGE:</div>
                <div className="flex items-center gap-2 pt-1">
                  <span>ENTER PASSKEY &gt;</span>
                  <input
                    type="text"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    placeholder="YYYY"
                    autoFocus
                    className="flex-1 bg-transparent border-b border-amber-500 focus:outline-none text-amber-300 font-bold tracking-widest text-sm uppercase"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="text-xs font-mono-code text-slate-400 block">
                  Input Solution Key:
                </label>
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="Enter answer (e.g. numbers or letters)..."
                  autoFocus
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 uppercase font-mono-code"
                />
              </div>
            )}

            {errorMessage && (
              <p className="text-xs text-rose-400 font-mono-code">
                {errorMessage}
              </p>
            )}

            {/* Hint reveal */}
            {showHint ? (
              <div className="p-3 rounded-lg bg-slate-950 border border-cyan-500/30 text-xs text-cyan-300 space-y-1">
                <span className="font-bold font-mono-code block text-[10px] uppercase">
                  Investigation Hint:
                </span>
                <p>{puzzle.hint}</p>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowHint(true)}
                className="text-xs text-slate-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Show Clue Hint</span>
              </button>
            )}

            {/* Buttons */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={handleInstantDemoSolve}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 underline font-mono-code cursor-pointer"
              >
                [Judge Fast-Solve]
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Unlock Mechanism</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
