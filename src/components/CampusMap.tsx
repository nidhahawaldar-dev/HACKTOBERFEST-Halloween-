import React from 'react';
import { LocationId } from '../types/game';
import { CAMPUS_LOCATIONS } from '../data/gameContent';
import { MapPin, Navigation, Eye, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';
import { soundEffects } from '../services/audioService';

interface CampusMapProps {
  currentLocationId: LocationId;
  visitedLocations: LocationId[];
  discoveredClues: string[];
  onSelectLocation: (id: LocationId) => void;
  onOpenGhostDialogue: () => void;
}

export const CampusMap: React.FC<CampusMapProps> = ({
  currentLocationId,
  visitedLocations,
  discoveredClues,
  onSelectLocation,
  onOpenGhostDialogue,
}) => {
  // Coordinates matching the generated isometric campus map image
  const pinCoordinates: Record<LocationId, { x: number; y: number }> = {
    library: { x: 42, y: 28 },
    computer_lab: { x: 18, y: 55 },
    classroom_304: { x: 38, y: 78 },
    canteen: { x: 78, y: 64 },
    observatory: { x: 86, y: 22 },
  };

  const handleTravel = (id: LocationId) => {
    soundEffects.playStep();
    onSelectLocation(id);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-2xl font-bold font-display text-slate-100 flex items-center gap-2">
            <Navigation className="w-5 h-5 text-cyan-400" />
            <span>Interactive Campus Map</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Select a location pin or card to navigate the campus grounds at midnight.
          </p>
        </div>

        <button
          onClick={onOpenGhostDialogue}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 text-xs transition-colors cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Aria is watching nearby</span>
        </button>
      </div>

      {/* Map Canvas Card */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl aspect-[16/9] max-h-[600px] w-full group">
        <img
          src="/src/assets/images/campus_map_night_1793091058092.jpg"
          alt="Campus Aerial Map at Midnight"
          className="w-full h-full object-cover select-none pointer-events-none"
          referrerPolicy="no-referrer"
        />

        {/* Ambient midnight vignette */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-slate-950/20 to-slate-950/80 pointer-events-none" />

        {/* Hotspot Pins */}
        {(Object.keys(pinCoordinates) as LocationId[]).map((locId) => {
          const loc = CAMPUS_LOCATIONS[locId];
          const coords = pinCoordinates[locId];
          const isCurrent = currentLocationId === locId;
          const isVisited = visitedLocations.includes(locId);

          return (
            <div
              key={locId}
              style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
            >
              <button
                onClick={() => handleTravel(locId)}
                className={`relative group/pin p-2 rounded-full cursor-pointer transition-transform duration-200 focus-visible:outline-none ${
                  isCurrent
                    ? 'scale-125 ring-4 ring-cyan-400/50 bg-cyan-500 text-slate-950'
                    : isVisited
                    ? 'bg-slate-900/90 hover:bg-cyan-900/90 text-cyan-300 border border-cyan-500/40 hover:scale-110'
                    : 'bg-slate-950/80 hover:bg-slate-800 text-slate-300 border border-slate-700 hover:scale-110'
                }`}
              >
                {/* Pulsing ring for current position */}
                {isCurrent && (
                  <span className="absolute -inset-2 rounded-full bg-cyan-400/30 animate-ping pointer-events-none" />
                )}

                <MapPin className="w-5 h-5" />

                {/* Pin Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs p-2.5 rounded-lg bg-slate-950/95 border border-slate-700 shadow-xl opacity-0 group-hover/pin:opacity-100 transition-opacity pointer-events-none z-30">
                  <div className="text-xs font-bold text-slate-100">{loc.name}</div>
                  <div className="text-[11px] text-cyan-400 font-mono-code">{loc.subtitle}</div>
                  <div className="mt-1 text-[10px] text-slate-400 line-clamp-1">{loc.ambience}</div>
                  <div className="mt-1.5 pt-1 border-t border-slate-800 text-[10px] text-teal-300 flex items-center justify-between">
                    <span>{isCurrent ? 'Current Position' : 'Click to Travel'}</span>
                    {isVisited && <span className="text-slate-400">Visited</span>}
                  </div>
                </div>
              </button>
            </div>
          );
        })}
      </div>

      {/* Location Fast Travel Directory Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
        {(Object.keys(CAMPUS_LOCATIONS) as LocationId[]).map((locId) => {
          const loc = CAMPUS_LOCATIONS[locId];
          const isCurrent = currentLocationId === locId;
          const isVisited = visitedLocations.includes(locId);

          return (
            <div
              key={locId}
              onClick={() => handleTravel(locId)}
              className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all duration-200 ${
                isCurrent
                  ? 'bg-slate-900 border-cyan-500/60 shadow-lg shadow-cyan-950/50 ring-1 ring-cyan-500/30'
                  : 'bg-slate-950/60 hover:bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-mono-code text-cyan-400 uppercase tracking-wider">
                  {locId.replace('_', ' ')}
                </span>
                {isCurrent ? (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-medium">
                    Here
                  </span>
                ) : isVisited ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                ) : null}
              </div>

              <div className="text-sm font-semibold text-slate-100 truncate">{loc.name}</div>
              <div className="text-xs text-slate-400 line-clamp-1 mt-0.5">{loc.subtitle}</div>

              <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 group-hover:text-cyan-300">
                <span>{loc.hotspots.length} Hotspots</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
