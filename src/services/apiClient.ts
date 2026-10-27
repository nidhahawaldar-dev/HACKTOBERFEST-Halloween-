import { GameState, ClueItem } from '../types/game';

export interface ChatResponse {
  reply: string;
  ghostTrustDelta: number;
  revealedHint: string;
  emotionalState: 'wary' | 'curious' | 'receptive' | 'sorrowful' | 'harmonized';
  suggestedLocation: string;
}

export interface EvidenceAnalysisResponse {
  spectralObservation: string;
  hiddenRunesOrText: string;
  deduction: string;
  connectionToMystery: string;
  nextLeadLocation: string;
  trustBonus: number;
}

export interface FinalEndingResponse {
  title: string;
  narrative: string;
  epilogue: string;
  finalScore: number;
}

export async function sendGhostMessage(message: string, gameState: GameState): Promise<ChatResponse> {
  const response = await fetch('/api/ghost/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, gameState }),
  });
  if (!response.ok) {
    throw new Error(`Failed to send message: ${response.statusText}`);
  }
  return response.json();
}

export async function analyzeEvidenceWithGemma(
  clue: ClueItem,
  customImageBase64?: string,
  imageMimeType?: string,
  playerNotes?: string,
  gameState?: GameState
): Promise<EvidenceAnalysisResponse> {
  const response = await fetch('/api/ghost/analyze-evidence', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      evidenceId: clue.id,
      evidenceName: clue.name,
      evidenceDescription: clue.description,
      evidenceBase64: customImageBase64,
      imageMimeType: imageMimeType,
      playerNotes: playerNotes,
      gameState: gameState,
    }),
  });
  if (!response.ok) {
    throw new Error(`Failed to analyze evidence: ${response.statusText}`);
  }
  return response.json();
}

export async function triggerFinalDeduction(
  choice: 'ascension' | 'guardian' | 'trapped',
  playerThesis: string,
  gameState: GameState
): Promise<FinalEndingResponse> {
  const response = await fetch('/api/ghost/final-deduction', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ choice, playerThesis, gameState }),
  });
  if (!response.ok) {
    throw new Error(`Failed to resolve ending: ${response.statusText}`);
  }
  return response.json();
}
