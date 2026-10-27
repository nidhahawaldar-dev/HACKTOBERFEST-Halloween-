# 👻 Ghost in the Campus: An AI-Powered Mystery Adventure

> **Built for Hacktoberfest 2026 (6-Hour AI Challenge)**  
> Competing for: *Best Use of Gemma*, *Best Open-Source AI Project*, *Most Innovative Solution*, *Most Creative Build*, and *Best Demo*.

---

## 🌟 Concept Overview

**Ghost in the Campus** is an interactive, 2D campus mystery adventure set at midnight in an abandoned college campus. 

On **October 24, 1994**, honors computer science and archaeology researcher **Aria Vance** vanished during the Great Autumn Storm while investigating acoustic resonance in the bell tower. Thirty-two years later, her spectral presence has awakened.

As a student exploring the nocturnal university grounds, you must navigate 5 atmospheric locations, collect physical and magnetic relics, inspect evidence through **Gemma 4 Multimodal "Ghost Vision"**, commune with Aria across the spectral ether, solve campus ciphers, and decide the ultimate fate of her suppressed open-source research.

---

## ⚡ The Gemma 4 AI Architecture (Not a Decorative Chatbot!)

In this game, the AI model is fundamentally woven into the core investigative loop:

```
[Player Explores Campus]
         ↓
[Discovers Physical Relic] (Floppy Disk, Student ID, Torn Diary, Clock Key)
         ↓
[Ghost Vision Lab] (Multimodal Wavelength Filter: UV / Acoustic / Magnetic)
         ↓
[Gemma 4 Multimodal Analysis] (/api/ghost/analyze-evidence)
         ↓
[Decodes Spectral Runes & Generates Actionable Location Leads]
         ↓
[Commune with Aria] (/api/ghost/chat with Dynamic Memory & Trust Score)
         ↓
[Aria Adjusts Trust & Reveals Progressive Story Secrets]
         ↓
[Solves 4 Campus Puzzles]
         ↓
[Centennial Time Capsule Climax: 3 Divergent Story Endings]
```

### 1. Multimodal Evidence Analysis (`/api/ghost/analyze-evidence`)
Under Ghost Vision mode, players inspect relics or upload custom evidence photos. Gemma 4 processes image tensors and artifact metadata to deduce hidden timestamps, magnetic track codes, and tactical next-step coordinates.

### 2. Context-Aware Dynamic Memory (`/api/ghost/chat`)
Aria retains session state:
- All discovered relics
- Visited locations
- Solved puzzles
- Real-time Trust Level (Wary → Curious → Receptive → Harmonized)
She responds with poetic, atmospheric prose and refuses to reveal the final secrets until sufficient trust and evidence have been assembled.

### 3. Dynamic Story Climax (`/api/ghost/final-deduction`)
At 3:00 AM atop the Observatory steps, players submit their final hypothesis and choose between 3 divergent endings:
- **Ending A: Peaceful Ascension** (The research is released worldwide; Aria finds peace)
- **Ending B: The Midnight Guardian** (An open-source pact; Aria remains as guardian angel of future coders)
- **Ending C: The Midnight Loop** (Selfish exploitation keeps the campus frozen in time)

---

## 🗺️ Campus Locations

1. **Old Clocktower Library**: Gothic arches, century-old card catalog, and a grandfather clock frozen at the phantom hour.
2. **Science & Computer Lab**: 1990s subterranean DEC Alpha terminals, phosphor CRT monitors, and magnetic floppy disk caddies.
3. **Academic Hall 304**: Preserved lecture hall featuring a slate chalkboard inscribed with Greek harmonic ciphers.
4. **Midnight Canteen**: Abandoned student cafeteria holding lost student IDs and yellowed 1994 newspaper clippings.
5. **Foggy Observatory & Steps**: The highest point on campus, sheltering the three-sealed Centennial Time Capsule.

---

## 🧩 Interactive Campus Puzzles

- **Grandfather Clock Riddle**: Align the hands to the phantom hour (`23:11`) to pop open the hidden pendulum compartment.
- **DEC Alpha Mainframe Login**: Bypass the root terminal authentication using the year of the storm (`1994`).
- **Slate Chalkboard Cipher**: Extract the 3-digit frequency constant (`773`) from `SIGMA-DELTA-NU-773`.
- **Centennial Time Capsule**: Enter master project codename (`CHRONOS`) to unlock the preserved research thesis.

---

## 🚀 Quickstart & Setup

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/hacktoberfest/ghost-in-the-campus.git
cd ghost-in-the-campus

# Install dependencies
npm install

# Start the full-stack dev server (Express backend + Vite React frontend)
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## 🛠️ Open-Source Contribution Guide (Hacktoberfest)

We welcome beginner contributors! Here is how you can expand the game in under 10 minutes:

### 1. Adding a New Campus Location
Open `src/data/gameContent.ts` and add an entry to `CAMPUS_LOCATIONS`:
```typescript
botanical_greenhouse: {
  id: 'botanical_greenhouse',
  name: 'Victorian Greenhouse',
  subtitle: 'Bio-Acoustic Flora Ward',
  image: '/src/assets/images/...',
  ambience: 'Rustling ferns, condensation dripping from glass panes.',
  description: 'Exotic flora nourished by low-frequency acoustic vibrations.',
  hotspots: [
    {
      id: 'spot_specimen_jar',
      name: 'Resonant Specimen Jar',
      description: 'A glass bell jar vibrating in pitch with the clocktower.',
      x: 45,
      y: 60,
      unlockedClueId: 'clue_flower_seed',
      inspectMessage: 'You recover a seed packet marked: Acoustic Germination 1994.'
    }
  ]
}
```

### 2. Adding a New Clue / Relic
In `src/data/gameContent.ts`, append to `INITIAL_CLUES`:
```typescript
{
  id: 'clue_cassette',
  name: 'Micro-Cassette Recording #4',
  category: 'artifact',
  locationFound: 'botanical_greenhouse',
  summary: 'Audio recording of the October 1994 faculty meeting.',
  description: 'Faint magnetic tape with Aria\'s voice discussing harmonic frequencies.',
  spectralSecret: 'Spectral UV reveals: "The time capsule frequency is 432 Hz."',
  analyzedByGemma: false
}
```

### 3. Adding a New Puzzle
In `src/data/gameContent.ts`, append to `INITIAL_PUZZLES`:
```typescript
{
  id: 'greenhouse_lock',
  title: 'Bio-Acoustic Frequency Dial',
  locationId: 'botanical_greenhouse',
  prompt: 'Tune the greenhouse resonator to the frequency found on the cassette:',
  hint: 'The secret frequency is 432. Enter 432.',
  solutionKey: '432',
  solved: false,
  solvedMessage: 'The glass dome chimes in resonance, unlocking the garden gate!'
}
```

---

## ⏱️ 3-Minute Judge Demo Tour

For hackathon judges evaluating the submission:
1. **Landing Page**: Click **"Judge 3-Minute Quick Demo"** to start with preloaded relics and heightened ghost trust.
2. **Top Bar**: Use the **Hacktoberfest Demo Bar** to instantly unlock clues, boost trust to 90%, or jump directly to the climax ceremony.
3. **Ghost Vision Lab**: Select an item from the left panel and click **"Decode with Gemma 4 Vision"** to view real-time multimodal deductions.
4. **Dialogue**: Open **"Commune with Aria"** and ask anything about 1994 to see context-aware responses.
5. **Observatory Climax**: Click **"Time Capsule Ceremony"** in the footer to test the 3 divergent narrative endings and view your final score.

---

## 📜 License
Released under Apache-2.0. Built with pride for Hacktoberfest 2026.
