import React from 'react';
import { Volume2, VolumeX, Sparkles, BookOpen, Compass, Eye } from 'lucide-react';
import { soundEffects } from '../services/audioService';

interface NavigationHeaderProps {
  currentTab: 'explore' | 'map' | 'ghost' | 'vision' | 'inventory';
  setCurrentTab: (tab: 'explore' | 'map' | 'ghost' | 'vision' | 'inventory') => void;
  trustScore: number;
  cluesCount: number;
  totalClues: number;
  onOpenJudgeTour: () => void;
  onOpenInstructions: () => void;
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  currentTab,
  setCurrentTab,
  trustScore,
  cluesCount,
  totalClues,
  onOpenJudgeTour,
  onOpenInstructions,
}) => {
  const [muted, setMuted] = React.useState(soundEffects.getMuted());

  const handleToggleSound = () => {
    const isMuted = soundEffects.toggleMute();
    setMuted(isMuted);
    if (!isMuted) {
      soundEffects.startAmbience();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 px-4 md:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => {
            soundEffects.playClick();
            setCurrentTab('explore');
          }}
          className="text-left group flex items-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-sm"
        >
          <span className="text-xl md:text-2xl font-bold font-display tracking-wider text-slate-100 group-hover:text-cyan-300 transition-colors whitespace-nowrap shrink-0">
            Ghost in the Campus
          </span>
          <span className="hidden sm:inline-block text-xs font-mono-code text-cyan-400/90 uppercase tracking-widest pl-2 border-l border-slate-700">
            VTU Belagavi · Gemma 4
          </span>
        </button>

        {/* Zone 2: 4-5 single-line navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => {
              soundEffects.playClick();
              setCurrentTab('explore');
            }}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer hover:text-white ${
              currentTab === 'explore' ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400' : 'text-slate-400'
            }`}
          >
            Location View
          </button>
          <button
            onClick={() => {
              soundEffects.playClick();
              setCurrentTab('map');
            }}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer hover:text-white ${
              currentTab === 'map' ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400' : 'text-slate-400'
            }`}
          >
            Campus Map
          </button>
          <button
            onClick={() => {
              soundEffects.playClick();
              setCurrentTab('ghost');
            }}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer hover:text-white ${
              currentTab === 'ghost' ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400' : 'text-slate-400'
            }`}
          >
            Commune with Aria
          </button>
          <button
            onClick={() => {
              soundEffects.playClick();
              setCurrentTab('vision');
            }}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer hover:text-white ${
              currentTab === 'vision' ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400' : 'text-slate-400'
            }`}
          >
            Ghost Vision Lab
          </button>
          <button
            onClick={() => {
              soundEffects.playClick();
              setCurrentTab('inventory');
            }}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer hover:text-white ${
              currentTab === 'inventory' ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400' : 'text-slate-400'
            }`}
          >
            Evidence Journal ({cluesCount}/{totalClues})
          </button>
        </nav>

        {/* Zone 3: Primary action & quick controls */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenInstructions}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-900 border border-slate-700/80 rounded-lg hover:border-slate-600 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            title="Read Detective Handbook"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Guide</span>
          </button>

          <button
            onClick={handleToggleSound}
            className="p-2 text-slate-300 hover:text-cyan-300 bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700 transition-colors cursor-pointer"
            title={muted ? 'Unmute Ambient Atmospheric Audio' : 'Mute Ambient Audio'}
          >
            {muted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>

          <button
            onClick={onOpenJudgeTour}
            className="px-3.5 py-1.5 text-xs font-medium text-cyan-950 bg-gradient-to-r from-cyan-400 to-teal-300 hover:from-cyan-300 hover:to-teal-200 rounded-lg shadow-sm transition-all whitespace-nowrap shrink-0 cursor-pointer font-semibold flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Judge Demo</span>
          </button>
        </div>
      </div>

      {/* Mobile navigation tab strip */}
      <div className="flex lg:hidden items-center justify-around pt-2.5 mt-2 border-t border-slate-800/60 text-xs">
        <button
          onClick={() => setCurrentTab('explore')}
          className={`flex items-center gap-1 py-1 ${currentTab === 'explore' ? 'text-cyan-400 font-bold' : 'text-slate-400'}`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Explore</span>
        </button>
        <button
          onClick={() => setCurrentTab('map')}
          className={`flex items-center gap-1 py-1 ${currentTab === 'map' ? 'text-cyan-400 font-bold' : 'text-slate-400'}`}
        >
          <span>Map</span>
        </button>
        <button
          onClick={() => setCurrentTab('ghost')}
          className={`flex items-center gap-1 py-1 ${currentTab === 'ghost' ? 'text-cyan-400 font-bold' : 'text-slate-400'}`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Ghost ({trustScore}%)</span>
        </button>
        <button
          onClick={() => setCurrentTab('vision')}
          className={`flex items-center gap-1 py-1 ${currentTab === 'vision' ? 'text-cyan-400 font-bold' : 'text-slate-400'}`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Vision</span>
        </button>
        <button
          onClick={() => setCurrentTab('inventory')}
          className={`flex items-center gap-1 py-1 ${currentTab === 'inventory' ? 'text-cyan-400 font-bold' : 'text-slate-400'}`}
        >
          <span>Clues ({cluesCount})</span>
        </button>
      </div>
    </header>
  );
};
