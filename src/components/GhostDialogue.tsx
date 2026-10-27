import React, { useState, useRef, useEffect } from 'react';
import { GameState, ChatMessage } from '../types/game';
import { sendGhostMessage, ChatResponse } from '../services/apiClient';
import { Sparkles, Send, Loader2, MessageSquare, Heart, Shield, RefreshCw } from 'lucide-react';
import { soundEffects } from '../services/audioService';

interface GhostDialogueProps {
  gameState: GameState;
  onSendMessage: (msg: string) => Promise<void>;
  onUpdateTrust: (delta: number) => void;
  onReceiveHint: (hint: string) => void;
  onTravelToLocation: (locationId: string) => void;
}

export const GhostDialogue: React.FC<GhostDialogueProps> = ({
  gameState,
  onSendMessage,
  onUpdateTrust,
  onReceiveHint,
  onTravelToLocation,
}) => {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [gameState.chatHistory, loading]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || loading) return;

    setInputText('');
    setLoading(true);
    soundEffects.playClick();

    try {
      await onSendMessage(text);
    } finally {
      setLoading(false);
    }
  };

  const sampleQuestions = [
    'What happened to you on October 24, 1994?',
    'Why is the library clock frozen at 23:11?',
    'What does SIGMA-DELTA-NU-773 mean on the chalkboard?',
    'What is Project Chronos on the floppy disk?',
    'How can we unlock the Centennial Time Capsule?',
  ];

  const getTrustLabel = (trust: number) => {
    if (trust >= 80) return { label: 'Harmonized', color: 'text-emerald-400 bg-emerald-950/80 border-emerald-500/40' };
    if (trust >= 60) return { label: 'Receptive', color: 'text-cyan-400 bg-cyan-950/80 border-cyan-500/40' };
    if (trust >= 40) return { label: 'Curious', color: 'text-teal-400 bg-teal-950/80 border-teal-500/40' };
    return { label: 'Wary', color: 'text-slate-400 bg-slate-900 border-slate-700' };
  };

  const trustStatus = getTrustLabel(gameState.ghostTrust);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="pb-2 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-code text-cyan-400 uppercase tracking-widest">
            <Sparkles className="w-4 h-4" />
            <span>Spectral Communication Terminal</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-100 mt-0.5">
            Commune with Aria Vance
          </h2>
        </div>

        {/* Ghost Trust Indicator */}
        <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-1.5 text-xs">
            <Heart className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-400 font-mono-code">Spectral Trust:</span>
            <span className="text-slate-100 font-bold tabular-nums font-mono-code">
              {gameState.ghostTrust}%
            </span>
          </div>
          <span className={`text-[11px] px-2 py-0.5 rounded-full border font-medium ${trustStatus.color}`}>
            {trustStatus.label}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Ghost Portrait, Memory Synapses, & Lore */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 text-center space-y-4">
            {/* Spectral Portrait */}
            <div className="relative mx-auto w-40 h-40 rounded-full overflow-hidden border-2 border-cyan-400/50 shadow-xl shadow-cyan-900/30 spectral-glow ghost-float">
              <img
                src="/src/assets/images/ghost_aria_portrait_1793091059503.jpg"
                alt="Aria Vance Spectral Form"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-slate-950/40 pointer-events-none" />
            </div>

            <div>
              <h3 className="text-lg font-bold font-display text-slate-100">
                Aria Vance
              </h3>
              <p className="text-xs text-cyan-400 font-mono-code">
                Class of 1994 · Research Fellow
              </p>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-light">
              "Thirty-two years I have watched the students pass by beneath the autumn trees. Ask me what you wish, but remember: the past does not give up its secrets easily."
            </p>
          </div>

          {/* Active Memory Context for Gemma 4 */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2.5">
            <div className="text-xs font-semibold text-slate-300 font-mono-code uppercase tracking-wider flex items-center justify-between">
              <span>Aria's Active Memory</span>
              <span className="text-cyan-400 text-[10px]">{gameState.discoveredClues.length} Relics</span>
            </div>

            <div className="space-y-1.5">
              {gameState.discoveredClues.length === 0 ? (
                <p className="text-xs text-slate-500 italic">
                  Aria has not seen any physical evidence from you yet. Explore campus rooms to recover relics.
                </p>
              ) : (
                gameState.discoveredClues.map((id) => (
                  <div
                    key={id}
                    className="text-xs px-2.5 py-1 rounded-md bg-slate-900 text-cyan-300 border border-slate-800 flex items-center gap-1.5 truncate"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                    <span className="truncate">{id.replace('clue_', '').replace('_', ' ').toUpperCase()}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Center & Right Column: Interactive Chat Log & Input */}
        <div className="lg:col-span-2 flex flex-col h-[580px] rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl overflow-hidden">
          {/* Chat Messages Scrollable Box */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4">
            {gameState.chatHistory.map((msg) => {
              const isGhost = msg.sender === 'ghost';
              const isSystem = msg.sender === 'system';

              if (isSystem) {
                return (
                  <div key={msg.id} className="text-center my-2">
                    <span className="text-[11px] px-3 py-1 rounded-full bg-slate-800/80 text-slate-400 border border-slate-700 font-mono-code">
                      {msg.text}
                    </span>
                  </div>
                );
              }

              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${isGhost ? 'justify-start' : 'justify-end'}`}
                >
                  {isGhost && (
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-cyan-400/50 shrink-0">
                      <img
                        src="/src/assets/images/ghost_aria_portrait_1793091059503.jpg"
                        alt="Aria"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                      isGhost
                        ? 'bg-slate-950/90 text-slate-200 border border-slate-800 shadow-md font-light'
                        : 'bg-cyan-600 text-slate-950 font-medium rounded-tr-none'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] mb-1 font-mono-code opacity-75">
                      <span>{isGhost ? 'Aria Vance' : 'You (Student)'}</span>
                      <span>{msg.timestamp}</span>
                    </div>

                    <p className="whitespace-pre-wrap">{msg.text}</p>

                    {msg.hint && (
                      <div className="mt-2.5 pt-2 border-t border-slate-800/80 text-xs text-teal-300 font-mono-code">
                        <strong>Clue Whisper:</strong> {msg.hint}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-cyan-400 p-2 font-mono-code animate-pulse">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Aria is listening across the spectral ether...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Quick Questions */}
          <div className="px-5 py-2.5 bg-slate-950/80 border-t border-slate-800 flex items-center gap-2 overflow-x-auto text-xs whitespace-nowrap scrollbar-none">
            <span className="text-slate-500 font-mono-code text-[11px] shrink-0">Topics:</span>
            {sampleQuestions.map((q, idx) => (
              <button
                key={idx}
                disabled={loading}
                onClick={() => handleSend(q)}
                className="px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-800 transition-colors cursor-pointer text-xs shrink-0 disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Text Input Box */}
          <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              disabled={loading}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend();
              }}
              placeholder="Ask Aria anything about 1994, the clues, or the campus..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
            />

            <button
              disabled={loading || !inputText.trim()}
              onClick={() => handleSend()}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-bold transition-all disabled:opacity-40 cursor-pointer flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline text-xs">Speak</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
