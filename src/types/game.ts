export type LocationId = 'library' | 'computer_lab' | 'classroom_304' | 'canteen' | 'observatory';

export interface Hotspot {
  id: string;
  name: string;
  description: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  icon?: string;
  requiredClueId?: string;
  unlockedClueId?: string;
  associatedPuzzleId?: string;
  inspectMessage: string;
}

export interface CampusLocation {
  id: LocationId;
  name: string;
  subtitle: string;
  image: string;
  ambience: string;
  description: string;
  hotspots: Hotspot[];
}

export interface ClueItem {
  id: string;
  name: string;
  category: 'document' | 'artifact' | 'tech' | 'cipher';
  locationFound: LocationId;
  summary: string;
  description: string;
  spectralSecret: string;
  imageVisual?: string;
  analyzedByGemma: boolean;
  gemmaAnalysis?: {
    spectralObservation: string;
    hiddenRunesOrText: string;
    deduction: string;
    connectionToMystery: string;
    nextLeadLocation: LocationId | string;
    trustBonus?: number;
  };
}

export type PuzzleType = 'clock_riddle' | 'terminal_code' | 'chalk_cipher' | 'time_capsule';

export interface Puzzle {
  id: PuzzleType;
  title: string;
  locationId: LocationId;
  prompt: string;
  hint: string;
  solved: boolean;
  solutionKey: string;
  rewardClueId?: string;
  solvedMessage: string;
}

export interface ChatMessage {
  id: string;
  sender: 'player' | 'ghost' | 'system';
  text: string;
  timestamp: string;
  hint?: string;
  trustChange?: number;
  emotionalState?: 'wary' | 'curious' | 'receptive' | 'sorrowful' | 'harmonized';
}

export interface GameState {
  currentLocation: LocationId;
  visitedLocations: LocationId[];
  discoveredClues: string[]; // Clue IDs
  solvedPuzzles: PuzzleType[];
  ghostTrust: number; // 0 - 100
  mysteryProgress: number; // 0 - 100
  ghostVisionActive: boolean;
  chatHistory: ChatMessage[];
  importantDecisions: string[];
  gamePhase: 'intro' | 'exploring' | 'confrontation' | 'ending';
  endingAchieved?: 'ascension' | 'guardian' | 'trapped';
  inventoryOpen: boolean;
  selectedClueForVision?: ClueItem | null;
}
