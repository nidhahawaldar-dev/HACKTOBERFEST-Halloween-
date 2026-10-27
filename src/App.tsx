/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { LocationId, PuzzleType, ClueItem, GameState, ChatMessage } from './types/game';
import { INITIAL_CLUES, INITIAL_PUZZLES } from './data/gameContent';
import { NavigationHeader } from './components/NavigationHeader';
import { LandingScreen } from './components/LandingScreen';
import { CampusMap } from './components/CampusMap';
import { LocationView } from './components/LocationView';
import { GhostVisionModal } from './components/GhostVisionModal';
import { GhostDialogue } from './components/GhostDialogue';
import { InventoryDrawer } from './components/InventoryDrawer';
import { PuzzleModal } from './components/PuzzleModal';
import { FinalConfrontationModal } from './components/FinalConfrontationModal';
import { InstructionsModal } from './components/InstructionsModal';
import { JudgeDemoBar } from './components/JudgeDemoBar';
import { sendGhostMessage, EvidenceAnalysisResponse } from './services/apiClient';
import { soundEffects } from './services/audioService';

export default function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentTab, setCurrentTab] = useState<'explore' | 'map' | 'ghost' | 'vision' | 'inventory'>('explore');
  const [currentLocation, setCurrentLocation] = useState<LocationId>('library');
  const [visitedLocations, setVisitedLocations] = useState<LocationId[]>(['library']);
  const [discoveredClues, setDiscoveredClues] = useState<string[]>([]);
  const [cluesList, setCluesList] = useState<ClueItem[]>(INITIAL_CLUES);
  const [solvedPuzzles, setSolvedPuzzles] = useState<PuzzleType[]>([]);
  const [ghostTrust, setGhostTrust] = useState<number>(30);
  const [ghostVisionActive, setGhostVisionActive] = useState<boolean>(false);
  const [activePuzzleModal, setActivePuzzleModal] = useState<PuzzleType | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showClimaxModal, setShowClimaxModal] = useState(false);
  const [selectedClueForVision, setSelectedClueForVision] = useState<ClueItem | null>(null);

  // Initial atmospheric chat message from Aria Vance
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: 'init_aria_msg',
      sender: 'ghost',
      text: "Who walks the midnight corridors of VTU Jnana Sangama? It has been so long since anyone listened to the frequencies echoing over the Belagavi hills... I am Aria Vance (Aria Rao, USN: 2BA98CS042). If you seek the truth of what was hidden across our campus, search the halls and bring me what remains.",
      timestamp: '12:00 AM',
      emotionalState: 'curious',
    },
  ]);

  // Compute overall mystery progress
  const mysteryProgress = Math.min(
    100,
    Math.round(
      (discoveredClues.length / INITIAL_CLUES.length) * 40 +
      (solvedPuzzles.length / INITIAL_PUZZLES.length) * 40 +
      (ghostTrust / 100) * 20
    )
  );

  // GameState snapshot for API payloads
  const gameState: GameState = {
    currentLocation,
    visitedLocations,
    discoveredClues,
    solvedPuzzles,
    ghostTrust,
    mysteryProgress,
    ghostVisionActive,
    chatHistory,
    importantDecisions: [],
    gamePhase: showClimaxModal ? 'confrontation' : gameStarted ? 'exploring' : 'intro',
    inventoryOpen: currentTab === 'inventory',
    selectedClueForVision,
  };

  const handleSelectLocation = (id: LocationId | string) => {
    const validId: LocationId = (id in { library: 1, computer_lab: 1, classroom_304: 1, canteen: 1, observatory: 1 } ? id : 'library') as LocationId;
    setCurrentLocation(validId);
    if (!visitedLocations.includes(validId)) {
      setVisitedLocations((prev) => [...prev, validId]);
    }
    setCurrentTab('explore');
  };

  const handleDiscoverClue = (clueId: string) => {
    if (!discoveredClues.includes(clueId)) {
      setDiscoveredClues((prev) => [...prev, clueId]);
      setGhostTrust((prev) => Math.min(100, prev + 8));

      // Append system message to chat log
      setChatHistory((prev) => [
        ...prev,
        {
          id: `disc_${Date.now()}`,
          sender: 'system',
          text: `Evidence Relic Recovered: ${clueId.replace('clue_', '').replace('_', ' ').toUpperCase()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  };

  const handleSolvePuzzle = (puzzleId: PuzzleType, rewardClueId?: string) => {
    if (!solvedPuzzles.includes(puzzleId)) {
      setSolvedPuzzles((prev) => [...prev, puzzleId]);
      setGhostTrust((prev) => Math.min(100, prev + 15));

      if (rewardClueId) {
        handleDiscoverClue(rewardClueId);
      }

      setChatHistory((prev) => [
        ...prev,
        {
          id: `solve_${Date.now()}`,
          sender: 'system',
          text: `Campus Mechanism Solved: ${puzzleId.replace('_', ' ').toUpperCase()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  };

  const handleSendMessage = async (msg: string) => {
    const userMessage: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'player',
      text: msg,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatHistory((prev) => [...prev, userMessage]);

    try {
      const response = await sendGhostMessage(msg, {
        ...gameState,
        chatHistory: [...chatHistory, userMessage],
      });

      const delta = response.ghostTrustDelta || 2;
      setGhostTrust((prev) => Math.max(0, Math.min(100, prev + delta)));

      const ghostReply: ChatMessage = {
        id: `gst_${Date.now()}`,
        sender: 'ghost',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        hint: response.revealedHint || undefined,
        trustChange: delta,
        emotionalState: response.emotionalState,
      };

      setChatHistory((prev) => [...prev, ghostReply]);
    } catch (err) {
      console.error(err);
      setChatHistory((prev) => [
        ...prev,
        {
          id: `gst_err_${Date.now()}`,
          sender: 'ghost',
          text: "The autumn wind howls against the windowpane... Aria whispers: 'Listen closely to the bell tower at 23:11...'",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  };

  const handleApplyAnalysis = (clueId: string, analysis: EvidenceAnalysisResponse) => {
    setCluesList((prev) =>
      prev.map((c) => (c.id === clueId ? { ...c, gemmaAnalysis: analysis, analyzedByGemma: true } : c))
    );
    setGhostTrust((prev) => Math.min(100, prev + (analysis.trustBonus || 10)));
  };

  // Speedrun shortcuts for Hackathon judges & testers
  const handleUnlockDemoClues = () => {
    const clueIds = ['clue_student_id', 'clue_torn_diary', 'clue_floppy_disk'];
    setDiscoveredClues((prev) => Array.from(new Set([...prev, ...clueIds])));
    setGhostTrust(85);
    setSolvedPuzzles(['terminal_code', 'chalk_cipher']);
  };

  const handleStartDemoSpeedrun = () => {
    setGameStarted(true);
    handleUnlockDemoClues();
    setCurrentTab('ghost');
  };

  const handleRestartGame = () => {
    setDiscoveredClues([]);
    setSolvedPuzzles([]);
    setGhostTrust(30);
    setVisitedLocations(['library']);
    setCurrentLocation('library');
    setCurrentTab('explore');
    setShowClimaxModal(false);
    setCluesList(INITIAL_CLUES);
    setChatHistory([
      {
        id: 'restart_msg',
        sender: 'ghost',
        text: "The clock tower tolls midnight once again... The past resets, waiting for your discoveries.",
        timestamp: '12:00 AM',
        emotionalState: 'curious',
      },
    ]);
  };

  // Get list of discovered ClueItem objects
  const collectedClues = cluesList.filter((c) => discoveredClues.includes(c.id));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Demo Bar for Judges */}
      <JudgeDemoBar
        onUnlockAllClues={handleUnlockDemoClues}
        onBoostTrust={() => setGhostTrust(90)}
        onTriggerClimax={() => setShowClimaxModal(true)}
      />

      {/* Main Navigation Bar */}
      <NavigationHeader
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        trustScore={ghostTrust}
        cluesCount={discoveredClues.length}
        totalClues={INITIAL_CLUES.length}
        onOpenJudgeTour={() => setShowInstructions(true)}
        onOpenInstructions={() => setShowInstructions(true)}
      />

      {/* Main Application Content */}
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
        {!gameStarted ? (
          <LandingScreen
            onStartGame={() => setGameStarted(true)}
            onStartDemoSpeedrun={handleStartDemoSpeedrun}
            onOpenInstructions={() => setShowInstructions(true)}
          />
        ) : (
          <div className="space-y-6">
            {currentTab === 'explore' && (
              <LocationView
                locationId={currentLocation}
                ghostVisionActive={ghostVisionActive}
                discoveredClues={discoveredClues}
                solvedPuzzles={solvedPuzzles}
                onToggleGhostVision={() => setGhostVisionActive(!ghostVisionActive)}
                onDiscoverClue={handleDiscoverClue}
                onTriggerPuzzle={(id) => setActivePuzzleModal(id)}
                onOpenGhostDialogue={() => setCurrentTab('ghost')}
                onOpenMap={() => setCurrentTab('map')}
              />
            )}

            {currentTab === 'map' && (
              <CampusMap
                currentLocationId={currentLocation}
                visitedLocations={visitedLocations}
                discoveredClues={discoveredClues}
                onSelectLocation={handleSelectLocation}
                onOpenGhostDialogue={() => setCurrentTab('ghost')}
              />
            )}

            {currentTab === 'ghost' && (
              <GhostDialogue
                gameState={gameState}
                onSendMessage={handleSendMessage}
                onUpdateTrust={(d) => setGhostTrust((prev) => Math.max(0, Math.min(100, prev + d)))}
                onReceiveHint={() => {}}
                onTravelToLocation={handleSelectLocation}
              />
            )}

            {currentTab === 'vision' && (
              <GhostVisionModal
                clues={collectedClues}
                selectedClue={selectedClueForVision || collectedClues[0] || null}
                gameState={gameState}
                onSelectClue={(c) => setSelectedClueForVision(c)}
                onApplyAnalysis={handleApplyAnalysis}
                onTravelToLocation={handleSelectLocation}
              />
            )}

            {currentTab === 'inventory' && (
              <InventoryDrawer
                clues={collectedClues}
                gameState={gameState}
                onOpenGhostVisionWithClue={(c) => {
                  setSelectedClueForVision(c);
                  setCurrentTab('vision');
                }}
                onNavigateToLocation={handleSelectLocation}
              />
            )}
          </div>
        )}
      </main>

      {/* Footer with Hacktoberfest open-source credits */}
      <footer className="border-t border-slate-900 bg-slate-950/80 px-4 py-6 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">Ghost in the Campus</span>
            <span>·</span>
            <span>Hacktoberfest 6-Hour AI Challenge</span>
            <span>·</span>
            <span className="text-cyan-400 font-mono-code">Gemma 4 Multimodal</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setShowInstructions(true)}
              className="hover:text-cyan-300 cursor-pointer"
            >
              Detective Handbook
            </button>
            <button
              onClick={() => setShowClimaxModal(true)}
              className="hover:text-cyan-300 cursor-pointer text-amber-400"
            >
              Time Capsule Ceremony
            </button>
          </div>
        </div>
      </footer>

      {/* Interactive Puzzle Modal */}
      {activePuzzleModal && (
        <PuzzleModal
          puzzleId={activePuzzleModal}
          solved={solvedPuzzles.includes(activePuzzleModal)}
          onSolve={handleSolvePuzzle}
          onClose={() => setActivePuzzleModal(null)}
        />
      )}

      {/* Final Mystery Climax Modal */}
      {showClimaxModal && (
        <FinalConfrontationModal
          gameState={gameState}
          onRestartGame={handleRestartGame}
          onClose={() => setShowClimaxModal(false)}
        />
      )}

      {/* Instructions & Demo Modal */}
      {showInstructions && (
        <InstructionsModal onClose={() => setShowInstructions(false)} />
      )}
    </div>
  );
}
