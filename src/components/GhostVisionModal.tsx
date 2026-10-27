import React, { useState } from 'react';
import { ClueItem, GameState } from '../types/game';
import { analyzeEvidenceWithGemma, EvidenceAnalysisResponse } from '../services/apiClient';
import { Eye, Sparkles, Upload, Loader2, ArrowRight, CheckCircle2, AlertCircle, Compass } from 'lucide-react';
import { soundEffects } from '../services/audioService';

interface GhostVisionModalProps {
  clues: ClueItem[];
  selectedClue: ClueItem | null;
  gameState: GameState;
  onSelectClue: (clue: ClueItem) => void;
  onApplyAnalysis: (clueId: string, analysis: EvidenceAnalysisResponse) => void;
  onTravelToLocation: (locationId: string) => void;
}

export const GhostVisionModal: React.FC<GhostVisionModalProps> = ({
  clues,
  selectedClue,
  gameState,
  onSelectClue,
  onApplyAnalysis,
  onTravelToLocation,
}) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<NonNullable<ClueItem['gemmaAnalysis']> | null>(
    selectedClue?.gemmaAnalysis || null
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [customImageBase64, setCustomImageBase64] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string | null>(null);
  const [visionMode, setVisionMode] = useState<'ultraviolet' | 'acoustic' | 'magnetic'>('ultraviolet');

  // Handle custom image upload for multimodal analysis
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (PNG, JPG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setCustomImageBase64(reader.result as string);
      setImageMimeType(file.type);
      setErrorMsg(null);
      soundEffects.playClick();
    };
    reader.readAsDataURL(file);
  };

  const handleRunAnalysis = async () => {
    if (!selectedClue) return;
    try {
      setAnalyzing(true);
      setErrorMsg(null);
      soundEffects.playGhostVision();

      const result = await analyzeEvidenceWithGemma(
        selectedClue,
        customImageBase64 || undefined,
        imageMimeType || undefined,
        `Analyzing under ${visionMode} spectral wavelength filter.`,
        gameState
      );

      setAnalysisResult(result);
      onApplyAnalysis(selectedClue.id, result);
      soundEffects.playPuzzleSolved();
    } catch (err) {
      console.error(err);
      setErrorMsg('Spectral connection interrupted. Retrying with local cached memory.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Title */}
      <div className="pb-2 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-code text-teal-400 uppercase tracking-widest">
            <Eye className="w-4 h-4" />
            <span>Multimodal Investigation Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-100 mt-0.5">
            Ghost Vision Spectral Lab
          </h2>
        </div>

        {/* Spectral wavelength filter toggle */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs">
          <button
            onClick={() => setVisionMode('ultraviolet')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              visionMode === 'ultraviolet'
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            UV Phosphor
          </button>
          <button
            onClick={() => setVisionMode('acoustic')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              visionMode === 'acoustic'
                ? 'bg-teal-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Acoustic Harmonics
          </button>
          <button
            onClick={() => setVisionMode('magnetic')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              visionMode === 'magnetic'
                ? 'bg-sky-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Magnetic 1994
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Select Discovered Clues */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider font-mono-code">
            Select Evidence Relic ({clues.length} available)
          </h3>

          <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
            {clues.map((clue) => {
              const isSelected = selectedClue?.id === clue.id;
              const hasAnalysis = Boolean(clue.gemmaAnalysis);

              return (
                <div
                  key={clue.id}
                  onClick={() => {
                    soundEffects.playClick();
                    onSelectClue(clue);
                    setAnalysisResult(clue.gemmaAnalysis || null);
                  }}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-900 border-teal-400 ring-1 ring-teal-400/50 shadow-lg shadow-teal-950/40'
                      : 'bg-slate-950/80 hover:bg-slate-900/60 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-mono-code text-cyan-400 uppercase text-[10px]">
                      {clue.category}
                    </span>
                    {hasAnalysis && (
                      <span className="text-[10px] text-teal-300 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Decoded</span>
                      </span>
                    )}
                  </div>
                  <div className="text-sm font-semibold text-slate-100">{clue.name}</div>
                  <div className="text-xs text-slate-400 mt-1 line-clamp-2">{clue.summary}</div>
                </div>
              );
            })}
          </div>

          {/* Optional: Upload custom evidence photo */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2.5">
            <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5 text-cyan-400" />
              <span>Submit Custom Evidence Image</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Upload any image or handwritten clue sketch to pass directly into Gemma 4's multimodal vision tensor.
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="text-xs text-slate-400 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-cyan-300 hover:file:bg-slate-700 cursor-pointer"
            />
            {customImageBase64 && (
              <div className="mt-2 relative rounded-lg overflow-hidden border border-cyan-500/30 max-h-28">
                <img src={customImageBase64} alt="Custom Evidence" className="w-full h-full object-cover" />
                <button
                  onClick={() => {
                    setCustomImageBase64(null);
                    setImageMimeType(null);
                  }}
                  className="absolute top-1 right-1 px-1.5 py-0.5 rounded bg-slate-950/80 text-[10px] text-slate-300 hover:text-white"
                >
                  Clear
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Center & Right Column: Spectral Lens & Gemma 4 Analysis Result */}
        <div className="lg:col-span-2 space-y-5">
          {selectedClue ? (
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6">
              {/* Evidence header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div>
                  <span className="text-xs font-mono-code text-cyan-400 uppercase tracking-widest">
                    Active Inspection Relic
                  </span>
                  <h3 className="text-xl font-bold font-display text-slate-100 mt-0.5">
                    {selectedClue.name}
                  </h3>
                </div>

                <button
                  disabled={analyzing}
                  onClick={handleRunAnalysis}
                  className="px-5 py-2.5 bg-gradient-to-r from-teal-400 via-cyan-400 to-sky-400 hover:from-teal-300 hover:to-cyan-300 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {analyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Gemma 4 Multimodal Reasoning...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>{analysisResult ? 'Re-Analyze with Gemma 4' : 'Decode with Gemma 4 Vision'}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Physical Relic Description & Spectral Secret */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="text-xs font-mono-code text-slate-400 mb-1">
                    Physical Relic Examination
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {selectedClue.description}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30">
                  <div className="text-xs font-mono-code text-cyan-400 mb-1">
                    Ghost Vision Ultraviolet Reading
                  </div>
                  <p className="text-xs text-cyan-200 leading-relaxed font-mono-code">
                    {selectedClue.spectralSecret}
                  </p>
                </div>
              </div>

              {/* Gemma 4 AI Analysis Result Section */}
              {analysisResult ? (
                <div className="p-5 rounded-xl bg-gradient-to-b from-slate-950 to-slate-900 border border-teal-500/40 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <div className="flex items-center gap-2 text-xs font-bold text-teal-300 uppercase tracking-wider font-mono-code">
                      <Sparkles className="w-4 h-4 text-teal-400" />
                      <span>Gemma 4 Multimodal Intelligence Deduction</span>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-500/30">
                      Trust +{analysisResult.trustBonus}%
                    </span>
                  </div>

                  <div className="space-y-3 text-xs leading-relaxed">
                    <div>
                      <strong className="text-slate-400 font-mono-code uppercase block text-[11px]">
                        Spectral Observation:
                      </strong>
                      <span className="text-slate-200">{analysisResult.spectralObservation}</span>
                    </div>

                    <div>
                      <strong className="text-cyan-400 font-mono-code uppercase block text-[11px]">
                        Decoded Runes & Symbols:
                      </strong>
                      <span className="text-cyan-200 font-mono-code font-bold">
                        {analysisResult.hiddenRunesOrText}
                      </span>
                    </div>

                    <div>
                      <strong className="text-teal-400 font-mono-code uppercase block text-[11px]">
                        Detective Deduction:
                      </strong>
                      <span className="text-slate-200">{analysisResult.deduction}</span>
                    </div>

                    <div>
                      <strong className="text-sky-400 font-mono-code uppercase block text-[11px]">
                        Connection to Aria & 1994 Conspiracy:
                      </strong>
                      <span className="text-slate-300">{analysisResult.connectionToMystery}</span>
                    </div>
                  </div>

                  {/* Actionable Next Location Lead */}
                  <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="text-xs text-teal-300 flex items-center gap-1.5">
                      <Compass className="w-4 h-4 text-teal-400" />
                      <span>
                        Points toward:{' '}
                        <strong className="text-white capitalize">
                          {analysisResult.nextLeadLocation.replace('_', ' ')}
                        </strong>
                      </span>
                    </div>

                    <button
                      onClick={() => onTravelToLocation(analysisResult.nextLeadLocation)}
                      className="px-4 py-2 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
                    >
                      <span>Investigate Lead Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-8 rounded-xl bg-slate-950/40 border border-slate-800 text-center space-y-2">
                  <Sparkles className="w-8 h-8 text-cyan-400/50 mx-auto" />
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Click "Decode with Gemma 4 Vision" above to process this evidence through our AI reasoning engine.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 rounded-2xl bg-slate-900/40 border border-slate-800 text-center space-y-3">
              <Eye className="w-10 h-10 text-slate-600 mx-auto" />
              <h4 className="text-base font-semibold text-slate-300">No Evidence Relic Selected</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Choose an item from the left panel or discover more relics across the campus locations.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
