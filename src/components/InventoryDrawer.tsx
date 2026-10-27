import React from 'react';
import { ClueItem, GameState, LocationId } from '../types/game';
import { BookOpen, Eye, CheckCircle2, MapPin, Sparkles, Award, ArrowUpRight } from 'lucide-react';
import { soundEffects } from '../services/audioService';

interface InventoryDrawerProps {
  clues: ClueItem[];
  gameState: GameState;
  onOpenGhostVisionWithClue: (clue: ClueItem) => void;
  onNavigateToLocation: (locId: LocationId) => void;
}

export const InventoryDrawer: React.FC<InventoryDrawerProps> = ({
  clues,
  gameState,
  onOpenGhostVisionWithClue,
  onNavigateToLocation,
}) => {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Title & Progress Header */}
      <div className="pb-2 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-code text-cyan-400 uppercase tracking-widest">
            <BookOpen className="w-4 h-4" />
            <span>Detective Dossier</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-100 mt-0.5">
            Evidence Journal & Memory System
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs px-3 py-1.5 rounded-lg bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 font-mono-code">
            Progress: {gameState.mysteryProgress}%
          </span>
        </div>
      </div>

      {/* Progress Cards Matrix */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[11px] font-mono-code text-slate-400 uppercase">Clues Discovered</span>
          <div className="text-2xl font-bold text-slate-100 mt-1 font-mono-code">
            {gameState.discoveredClues.length} <span className="text-xs text-slate-500">/ 5</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[11px] font-mono-code text-slate-400 uppercase">Puzzles Solved</span>
          <div className="text-2xl font-bold text-teal-300 mt-1 font-mono-code">
            {gameState.solvedPuzzles.length} <span className="text-xs text-slate-500">/ 4</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[11px] font-mono-code text-slate-400 uppercase">Ghost Trust</span>
          <div className="text-2xl font-bold text-cyan-400 mt-1 font-mono-code">
            {gameState.ghostTrust}%
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[11px] font-mono-code text-slate-400 uppercase">Locations Visited</span>
          <div className="text-2xl font-bold text-sky-300 mt-1 font-mono-code">
            {gameState.visitedLocations.length} <span className="text-xs text-slate-500">/ 5</span>
          </div>
        </div>
      </div>

      {/* Discovered Clues Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider font-mono-code">
            Physical & Holographic Relics ({clues.length})
          </h3>
          <span className="text-xs text-slate-400">
            Click any item to inspect under Ghost Vision
          </span>
        </div>

        {clues.length === 0 ? (
          <div className="p-12 rounded-2xl bg-slate-900/40 border border-slate-800 text-center space-y-2">
            <BookOpen className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-sm text-slate-400">Your evidence journal is currently empty.</p>
            <p className="text-xs text-slate-500">
              Explore the Clocktower Library, Computer Lab, or Canteen to recover 1994 artifacts.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {clues.map((clue) => {
              const isAnalyzed = Boolean(clue.gemmaAnalysis);

              return (
                <div
                  key={clue.id}
                  className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[10px] font-mono-code uppercase px-2 py-0.5 rounded bg-slate-950 text-cyan-400 border border-slate-800">
                        {clue.category}
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono-code">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        <span>{clue.locationFound.replace('_', ' ')}</span>
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-100 font-display">
                      {clue.name}
                    </h4>

                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                      {clue.description}
                    </p>

                    {isAnalyzed ? (
                      <div className="p-2 rounded bg-teal-950/40 border border-teal-500/30 text-[11px] text-teal-300 space-y-1">
                        <div className="flex items-center gap-1 font-semibold text-[10px] uppercase font-mono-code">
                          <CheckCircle2 className="w-3 h-3 text-teal-400" />
                          <span>Gemma 4 Decoded</span>
                        </div>
                        <div className="line-clamp-2 italic text-slate-300">
                          {clue.gemmaAnalysis?.deduction}
                        </div>
                      </div>
                    ) : (
                      <div className="text-[11px] text-slate-500 italic">
                        Not yet scanned with Ghost Vision.
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      soundEffects.playClick();
                      onOpenGhostVisionWithClue(clue);
                    }}
                    className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-750 text-cyan-300 hover:text-white border border-slate-700 hover:border-cyan-500/50 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Inspect in Ghost Vision</span>
                    <ArrowUpRight className="w-3 h-3 ml-auto text-slate-400" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
