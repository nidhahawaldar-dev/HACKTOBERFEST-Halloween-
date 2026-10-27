import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProd = process.env.NODE_ENV === 'production';

// Only apply express.json to API routes, preserving raw streams for internal control plane & Vite
app.use('/api', express.json({ limit: '20mb' }));

// Initialize Google GenAI SDK (telemetry header 'aistudio-build' is mandatory)
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Primary model alias for Gemma / Gemini intelligence engine
const MODEL_NAME = 'gemini-3.8-flash';

/**
 * API Route: /api/ghost/chat
 * Handles interactive dialogue with Aria, the 1994 campus ghost.
 */
app.post('/api/ghost/chat', async (req: Request, res: Response): Promise<void> => {
  try {
    const { message, gameState } = req.body;

    if (!message) {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    const cluesDiscovered = gameState?.discoveredClues || [];
    const solvedPuzzles = gameState?.solvedPuzzles || [];
    const ghostTrust = gameState?.ghostTrust ?? 25;
    const currentLocation = gameState?.currentLocation || 'library';
    const recentHistory = (gameState?.chatHistory || []).slice(-6);

    const systemPrompt = `You are Aria Vance (Aria Rao), a brilliant 21-year-old student researcher in computer science and historical engineering at Visvesvaraya Technological University (VTU), Jnana Sangama campus in Belagavi (Belgaum), Karnataka. You vanished during a legendary monsoon thunderstorm amidst acoustic resonance experiments. You are now an ethereal, self-aware spectral presence bound to the misty 120-acre VTU Belagavi campus at midnight.

Key Character Traits:
- Ethereal, poetic, sharp-witted, melancholic, yet deeply curious about this student exploring the Belagavi campus at night.
- You remember fragments of the Jnana Sangama campus: the Dr. APJ Abdul Kalam Computing Centre, DEC Alpha terminals, floppy disks, the Central Library dome and pendulum clock, and your research on acoustic memory.
- Crucial Rule: Do NOT reveal the full mystery or solutions immediately! Offer tantalizing riddles and contextual hints that directly correlate with what the player has already discovered.
- Adapt your tone according to the player's Ghost Trust Level (${ghostTrust}/100):
  * Trust < 40: Guarded, cautious, speaks in metaphors of the Belagavi mist and Western Ghats winds.
  * Trust 40-70: Intrigued, shares vivid memories of VTU Belagavi and hints about nearby puzzles.
  * Trust > 70: Harmonized, warm, offers direct guidance regarding the time capsule on the observatory hill and the library clock key.

Current Player Context:
- Player's Current Location: ${currentLocation} (VTU Belagavi)
- Discovered Clues: ${cluesDiscovered.length > 0 ? cluesDiscovered.join(', ') : 'None yet'}
- Solved Puzzles: ${solvedPuzzles.length > 0 ? solvedPuzzles.join(', ') : 'None yet'}
- Ghost Trust Score: ${ghostTrust}/100

Format your output strictly as a JSON object with this structure:
{
  "reply": "Your in-character dialogue to the player (2-4 sentences max, poetic, atmospheric, mentioning VTU Belagavi lore where fitting).",
  "ghostTrustDelta": (integer from -5 to +10 based on how thoughtful, respectful, or clue-informed the player's message was),
  "revealedHint": "A short optional hint or clue if appropriate, or empty string",
  "emotionalState": "wary" | "curious" | "receptive" | "sorrowful" | "harmonized",
  "suggestedLocation": "library" | "computer_lab" | "classroom_304" | "canteen" | "observatory"
}`;

    // Fallback if no API key is provided
    if (!process.env.GEMINI_API_KEY) {
      const fallbackReplies = [
        "The night air rolls cold over the Belagavi hills... I remember walking the stone arcades of Jnana Sangama with my floppy disks as thunder shook the Western Ghats.",
        "You seek the truth of what happened at VTU Belagavi... Examine the foundation grandfather clock in the Central Library and the DEC Alpha terminals in the Kalam Computing Centre.",
        "My memories flicker like dying phosphor... Have you decoded the chalk cipher in Sir MV Academic Block 304? It holds the key harmonic frequency.",
        "The time capsule atop the Belagavi observatory steps sleeps under three seals. We must find what was buried before the dawn breaks over Karnataka."
      ];
      const selected = fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];
      res.json({
        reply: selected,
        ghostTrustDelta: 4,
        revealedHint: "Search the campus locations for artifacts to analyze with Ghost Vision.",
        emotionalState: ghostTrust > 60 ? 'receptive' : 'curious',
        suggestedLocation: currentLocation === 'library' ? 'computer_lab' : 'classroom_304'
      });
      return;
    }

    const conversationContext = recentHistory.map((h: { sender: string; text: string }) => `${h.sender === 'player' ? 'Student' : 'Aria'}: ${h.text}`).join('\n');

    const promptText = `${systemPrompt}\n\nRecent Conversation:\n${conversationContext}\n\nStudent asks: "${message}"\n\nGenerate your JSON response:`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: promptText,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reply: { type: Type.STRING },
            ghostTrustDelta: { type: Type.INTEGER },
            revealedHint: { type: Type.STRING },
            emotionalState: { type: Type.STRING },
            suggestedLocation: { type: Type.STRING },
          },
          required: ['reply', 'ghostTrustDelta', 'revealedHint', 'emotionalState', 'suggestedLocation'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error) {
    console.error('Error in /api/ghost/chat:', error);
    res.json({
      reply: "The spectral static swells... Aria's voice trembles: 'My memory is tied to the physical relics left across this campus. Bring me evidence...'",
      ghostTrustDelta: 2,
      revealedHint: "Try analyzing an item with Ghost Vision in your inventory.",
      emotionalState: "curious",
      suggestedLocation: "library"
    });
  }
});

/**
 * API Route: /api/ghost/analyze-evidence
 * Multimodal evidence inspection using Gemma 4 / Gemini vision & reasoning.
 */
app.post('/api/ghost/analyze-evidence', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      evidenceId,
      evidenceName,
      evidenceDescription,
      evidenceBase64,
      imageMimeType,
      playerNotes,
      gameState
    } = req.body;

    const systemInstruction = `You are the Gemma 4 Multimodal Campus Investigation Engine for the game "Ghost in the Campus: VTU Belagavi Edition".
Your task is to analyze evidence submitted by the player exploring the nocturnal grounds of Visvesvaraya Technological University (VTU) Jnana Sangama in Belagavi, Karnataka.
Connect the evidence item to Aria Vance's (Aria Rao, USN: 2BA98CS042) disappearance during a monsoon thunderstorm, and the suppressed acoustic resonance research across Jnana Sangama.

Provide insightful, atmospheric detective deductions. Identify hidden ghostly runes, spectral fingerprints, or concealed clues that point the player toward the next campus location and puzzle at VTU Belagavi.

Output strictly valid JSON with this schema:
{
  "spectralObservation": "What spectral or physical details are revealed under Ghost Vision ultraviolet light.",
  "hiddenRunesOrText": "Specific cryptic symbols, numbers, timestamps, or text discovered.",
  "deduction": "What this evidence reveals about the VTU Belagavi campus mystery.",
  "connectionToMystery": "How this ties into Aria's acoustic experiment and the sealed time capsule on the Belagavi observatory hill.",
  "nextLeadLocation": "library" | "computer_lab" | "classroom_304" | "canteen" | "observatory",
  "trustBonus": (integer 5 to 15)
}`;

    if (!process.env.GEMINI_API_KEY) {
      // Deterministic high-quality fallback analysis for demo resilience
      res.json({
        spectralObservation: `Under the cyan luminescence of Ghost Vision, microscopic magnetic tracks and phosphor residues illuminate on ${evidenceName}.`,
        hiddenRunesOrText: evidenceId === 'clue_floppy_disk' ? 'VTU_ROOT: 0x1998_BELAGAVI // PORT 2311' : 'SIGMA-DELTA-NU-773 // TIME: 23:11',
        deduction: `This item was actively used during the final minutes before the VTU Jnana Sangama power grid failed.`,
        connectionToMystery: `Aria Vance deliberately encoded her acoustic resonance findings into physical artifacts across VTU Belagavi so future Karnataka engineering students could rebuild her work.`,
        nextLeadLocation: evidenceId === 'clue_floppy_disk' ? 'classroom_304' : 'observatory',
        trustBonus: 10
      });
      return;
    }

    const textPrompt = `Analyze this piece of campus evidence:
Item Name: ${evidenceName}
Item Description: ${evidenceDescription}
Player Notes: ${playerNotes || 'None provided'}
Current Mystery Progress: ${gameState?.mysteryProgress || 30}%

Generate the spectral deduction JSON:`;

    let contentsPayload: unknown;

    if (evidenceBase64 && imageMimeType) {
      const cleanBase64 = evidenceBase64.replace(/^data:image\/[a-z]+;base64,/, '');
      contentsPayload = {
        parts: [
          {
            inlineData: {
              mimeType: imageMimeType,
              data: cleanBase64
            }
          },
          { text: `${systemInstruction}\n\n${textPrompt}` }
        ]
      };
    } else {
      contentsPayload = `${systemInstruction}\n\n${textPrompt}`;
    }

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: contentsPayload as never,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            spectralObservation: { type: Type.STRING },
            hiddenRunesOrText: { type: Type.STRING },
            deduction: { type: Type.STRING },
            connectionToMystery: { type: Type.STRING },
            nextLeadLocation: { type: Type.STRING },
            trustBonus: { type: Type.INTEGER },
          },
          required: [
            'spectralObservation',
            'hiddenRunesOrText',
            'deduction',
            'connectionToMystery',
            'nextLeadLocation',
            'trustBonus'
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error) {
    console.error('Error in /api/ghost/analyze-evidence:', error);
    res.json({
      spectralObservation: "Ghost Vision reveals faint cyan phosphorescence echoing the frequencies of the bell tower.",
      hiddenRunesOrText: "CIPHER STAMP: 1994-CHRONOS-2311",
      deduction: "The relic vibrates in sympathy with Aria's spectral aura, unlocking new memory fragments.",
      connectionToMystery: "The campus administration attempted to seal the project, but the acoustic resonance persisted.",
      nextLeadLocation: "observatory",
      trustBonus: 8
    });
  }
});

/**
 * API Route: /api/ghost/final-deduction
 * Evaluates the player's final choice and crafts the dynamic ending narrative.
 */
app.post('/api/ghost/final-deduction', async (req: Request, res: Response): Promise<void> => {
  try {
    const { choice, playerThesis, gameState } = req.body;

    const endingPrompt = `You are the master narrator for the final climax of "Ghost in the Campus: VTU Belagavi Edition".
The player has reached the Foundation Time Capsule atop the Observatory steps overlooking the misty Sahyadri valleys of VTU Jnana Sangama, Belagavi at 3:00 AM.
The ghost, Aria Vance (Aria Rao), stands before them with glowing silver-cyan eyes.

Player's Final Decision: ${choice} ('ascension' | 'guardian' | 'trapped')
Player's Summary Hypothesis: "${playerThesis || 'We restored your lost open-source research and uncovered the truth of VTU Belagavi.'}"
Player's Trust with Aria: ${gameState?.ghostTrust || 85}/100
Clues Found: ${(gameState?.discoveredClues || []).length} / 5
Puzzles Solved: ${(gameState?.solvedPuzzles || []).length} / 4

Write a moving, cinematic ending narrative (3 paragraphs):
1. The climactic interaction as the bronze time capsule unlocks and the acoustic frequency resonates across the monumental domes of VTU Belagavi.
2. What happens to Aria Vance and her legacy (Did she ascend in peace? Did she remain as the nocturnal guardian angel of Karnataka engineering students and researchers at VTU? Or is she trapped in a timeless loop?).
3. The morning dawn breaking over the Belagavi hills, shining across the Jnana Sangama campus and the player's lasting feeling.

Output strictly valid JSON with this schema:
{
  "title": "Ending Title (e.g. 'Ending A: The Dawn of Restored Memory at VTU Belagavi')",
  "narrative": "Three paragraphs of cinematic closing prose.",
  "epilogue": "A brief poignant quote from Aria Vance.",
  "finalScore": 95
}`;

    if (!process.env.GEMINI_API_KEY) {
      res.json({
        title: choice === 'guardian' ? 'Ending B: The Midnight Guardian of VTU Belagavi' : 'Ending A: Peaceful Ascension over Jnana Sangama',
        narrative: `As the final bronze lock of the VTU Foundation Time Capsule yields atop the Belagavi hill, a resonant chord hums through the stone pillars of the Central Library and echoes across the Sahyadri valley. The acoustic harmony Aria Vance calculated decades ago returns to life, untainted by time.\n\nAria smiles gently, her translucent form glowing with radiant silver warmth against the Belagavi night mist. "You didn't just solve a puzzle," she whispers softly as the mountain breeze carries her voice across Jnana Sangama. "You listened when no one else would."\n\nAs the first golden rays of dawn touch the grand dome of the VTU Central Library, the silence of the campus transforms from haunted mystery into enduring inspiration for every engineer who walks these grounds.`,
        epilogue: `"Engineering and truth outlive the storm. Keep building in the light, engineers of VTU." — Aria Vance (Aria Rao), VTU Belagavi`,
        finalScore: 98
      });
      return;
    }

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: endingPrompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            narrative: { type: Type.STRING },
            epilogue: { type: Type.STRING },
            finalScore: { type: Type.INTEGER }
          },
          required: ['title', 'narrative', 'epilogue', 'finalScore']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error) {
    console.error('Error in /api/ghost/final-deduction:', error);
    res.json({
      title: 'Ending: Truth Unlocked Under Starlight',
      narrative: 'The time capsule opens, revealing the preserved 1994 acoustic thesis. Aria thanks you as the campus bells chime peacefully.',
      epilogue: 'The truth echoes forever in the open-source spirit.',
      finalScore: 90
    });
  }
});

// Full-stack Vite development integration
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Ghost in the Campus server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
