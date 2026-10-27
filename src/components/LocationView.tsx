import React, { useState } from 'react';
import { LocationId, Hotspot, ClueItem, PuzzleType } from '../types/game';
import { CAMPUS_LOCATIONS } from '../data/gameContent';
import { Eye, Search, Sparkles, MapPin, KeyRound, AlertCircle, Check, ArrowRight } from 'lucide-react';
import { soundEffects } from '../services/audioService';

interface LocationViewProps {
  locationId: LocationId;
  ghostVisionActive: boolean;
  discoveredClues: string[];
  solvedPuzzles: PuzzleType[];
  onToggleGhostVision: () => void;
  onDiscoverClue: (clueId: string) => void;
  onTriggerPuzzle: (puzzleId: PuzzleType) => void;
  onOpenGhostDialogue: () => void;
  onOpenMap: () => void;
}

export const LocationView: React.FC<LocationViewProps> = ({
  locationId,
  ghostVisionActive,
  discoveredClues,
  solvedPuzzles,
  onToggleGhostVision,
  onDiscoverClue,
  onTriggerPuzzle,
  onOpenGhostDialogue,
  onOpenMap,
}) => {
  const location = CAMPUS_LOCATIONS[locationId];
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const handleHotspotClick = (spot: Hotspot) => {
    soundEffects.playClick();
    setSelectedHotspot(spot);

    // If spot has a clue not yet discovered
    if (spot.unlockedClueId && !discoveredClues.includes(spot.unlockedClueId)) {
      onDiscoverClue(spot.unlockedClueId);
      soundEffects.playClueFound();
      setNotification(`New Evidence Discovered: Added to your Evidence Journal!`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Location Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-code text-cyan-400 uppercase tracking-widest">
            <MapPin className="w-3.5 h-3.5" />
            <span>{location.subtitle}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-100 mt-0.5">
            {location.name}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {/* Ghost Vision Toggle */}
          <button
            onClick={() => {
              soundEffects.playGhostVision();
              onToggleGhostVision();
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              ghostVisionActive
                ? 'bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 shadow-lg shadow-cyan-500/25 ring-2 ring-cyan-400'
                : 'bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>{ghostVisionActive ? 'Ghost Vision: ACTIVE' : 'Enable Ghost Vision'}</span>
          </button>

          <button
            onClick={onOpenGhostDialogue}
            className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Ask Aria</span>
          </button>

          <button
            onClick={onOpenMap}
            className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs transition-colors cursor-pointer"
          >
            Change Location
          </button>
        </div>
      </div>

      {/* Main Location Scene with Hotspots */}
      <div
        className={`relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl aspect-[16/9] max-h-[620px] w-full transition-all duration-300 ${
          ghostVisionActive ? 'ghost-vision-active spectral-glow ring-2 ring-cyan-500/50' : ''
        }`}
      >
        <img
          src={location.image}
          alt={location.name}
          className="w-full h-full object-cover select-none"
          referrerPolicy="no-referrer"
        />

        {/* Ambient Dark Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/30 pointer-events-none" />

        {/* Ghost Vision Spectral Overlay Layer */}
        {ghostVisionActive && (
          <div className="absolute inset-0 bg-cyan-950/20 mix-blend-color-dodge pointer-events-none flex items-center justify-center">
            <div className="text-cyan-300/40 font-mono-code text-xs tracking-widest uppercase select-none animate-pulse">
              SPECTRAL UV SENSORS ENGAGED · ACOUSTIC RUNES REVEALED
            </div>
          </div>
        )}

        {/* Interactive Hotspots */}
        {location.hotspots.map((spot) => {
          const isPuzzle = Boolean(spot.associatedPuzzleId);
          const isPuzzleSolved = spot.associatedPuzzleId && solvedPuzzles.includes(spot.associatedPuzzleId as PuzzleType);
          const hasClueDiscovered = spot.unlockedClueId && discoveredClues.includes(spot.unlockedClueId);

          return (
            <div
              key={spot.id}
              style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
            >
              <button
                onClick={() => handleHotspotClick(spot)}
                className={`group relative p-2.5 rounded-full cursor-pointer transition-all duration-300 focus-visible:outline-none ${
                  ghostVisionActive
                    ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-400/50 ring-2 ring-white scale-110'
                    : isPuzzle
                    ? isPuzzleSolved
                      ? 'bg-teal-900/90 text-teal-300 border border-teal-500/60'
                      : 'bg-amber-900/90 hover:bg-amber-800 text-amber-200 border border-amber-500/70 animate-bounce'
                    : hasClueDiscovered
                    ? 'bg-slate-900/80 text-cyan-400 border border-cyan-500/40'
                    : 'bg-slate-950/90 hover:bg-cyan-950 text-slate-200 border border-slate-600 hover:border-cyan-400 hover:scale-110'
                }`}
                title={spot.name}
              >
                {isPuzzle ? (
                  isPuzzleSolved ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <KeyRound className="w-4 h-4" />
                  )
                ) : (
                  <Search className="w-4 h-4" />
                )}

                {/* Hotspot Floating Label */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs px-2.5 py-1.5 rounded-md bg-slate-950/90 border border-slate-700 text-xs text-slate-200 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                  <span className="font-semibold">{spot.name}</span>
                  {isPuzzle && !isPuzzleSolved && (
                    <span className="ml-1.5 text-amber-400 font-mono-code">[Puzzle]</span>
                  )}
                  {hasClueDiscovered && (
                    <span className="ml-1.5 text-teal-400 font-mono-code">[Examined]</span>
                  )}
                </div>
              </button>
            </div>
          );
        })}

        {/* Ambient atmospheric caption overlay at bottom of canvas */}
        <div className="absolute bottom-0 inset-x-0 p-4 sm:p-6 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent">
          <p className="text-xs sm:text-sm text-slate-300 font-light max-w-3xl leading-relaxed">
            {location.description}
          </p>
          <div className="mt-2 text-xs text-slate-400 font-mono-code flex items-center gap-2">
            <span className="text-cyan-400">Ambience:</span>
            <span>{location.ambience}</span>
          </div>
        </div>
      </div>

      {/* Discovery Notification Toast */}
      {notification && (
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-teal-950/90 to-slate-900 border border-teal-500/50 flex items-center justify-between text-xs text-teal-200">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-400 shrink-0" />
            <span>{notification}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-slate-400 hover:text-white ml-3 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Hotspot Inspection Modal / Drawer */}
      {selectedHotspot && (
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-700 shadow-xl space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xs font-mono-code text-cyan-400 uppercase tracking-wider">
                Examining Hotspot
              </div>
              <h3 className="text-lg font-bold text-slate-100 mt-0.5 font-display">
                {selectedHotspot.name}
              </h3>
            </div>
            <button
              onClick={() => setSelectedHotspot(null)}
              className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800"
            >
              Close
            </button>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed">
            {selectedHotspot.inspectMessage}
          </p>

          {/* If there's an associated puzzle */}
          {selectedHotspot.associatedPuzzleId && (
            <div className="pt-2 flex items-center justify-between border-t border-slate-800">
              <div className="text-xs text-amber-300 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                <span>An unsolved mechanism or lock prevents further progress here.</span>
              </div>
              <button
                onClick={() => {
                  soundEffects.playClick();
                  onTriggerPuzzle(selectedHotspot.associatedPuzzleId as PuzzleType);
                }}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-lg text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Attempt Puzzle Mechanism</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
