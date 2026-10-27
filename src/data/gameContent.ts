import { CampusLocation, ClueItem, Puzzle } from '../types/game';

export const CAMPUS_LOCATIONS: Record<string, CampusLocation> = {
  library: {
    id: 'library',
    name: 'VTU Central Library (Jnana Sangama)',
    subtitle: 'Jnana Sangama Campus · Belagavi, Karnataka',
    image: '/src/assets/images/location_library_1793091060606.jpg',
    ambience: 'Ticking pendulum, Sahyadri mountain breeze against tall arched windows, quiet whisper of Karnataka technical archives.',
    description: 'The monumental stone pillars and gothic arches of the VTU Central Library at Jnana Sangama rise into the midnight air. Shelves hold over twenty-five years of technical dissertations and engineering blueprints from across Karnataka. The foundation grandfather clock echoes through the silent hall.',
    hotspots: [
      {
        id: 'spot_grandfather_clock',
        name: 'VTU Foundation Clock',
        description: 'An antique brass pendulum clock installed during the founding of the Belagavi campus.',
        x: 63,
        y: 50,
        associatedPuzzleId: 'clock_riddle',
        inspectMessage: 'The brass pendulum housing has an engraved plaque: "When the midnight bells of Belagavi strike 23:11, the Jnana Sangama veil thins."'
      },
      {
        id: 'spot_card_catalog',
        name: 'VTU Engineering Dissertation Registry',
        description: 'Oak drawer catalog containing original thesis submissions from VTU Belagavi\'s inaugural batch.',
        x: 28,
        y: 65,
        unlockedClueId: 'clue_torn_diary',
        inspectMessage: 'Inside drawer "USN 2BA98 - Computer Science", you find a watermarked research diary belonging to scholar Aria Vance.'
      },
      {
        id: 'spot_reading_table',
        name: 'Central Research Blotter',
        description: 'A study desk under an amber lamp covered with campus blueprints.',
        x: 45,
        y: 75,
        inspectMessage: 'A hand-drawn map of the underground conduits connecting Jnana Sangama Central Library to Dr. APJ Abdul Kalam Computer Centre.'
      }
    ]
  },
  computer_lab: {
    id: 'computer_lab',
    name: 'Dr. A.P.J. Abdul Kalam Computing Lab',
    subtitle: 'High Performance & Mainframe Cluster · Room 102, VTU Belagavi',
    image: '/src/assets/images/location_computer_lab_1793091062237.jpg',
    ambience: 'Low hum of cooling towers, amber and green monochrome CRT glow, electric ozone smell in the cool Belagavi night.',
    description: 'The legendary computing centre of VTU Belagavi. Subterranean cables hum beneath the floor tiles. One vintage DEC-Alpha server station blinks with an authentication prompt waiting for the university foundation passkey.',
    hotspots: [
      {
        id: 'spot_terminal',
        name: 'VTU DEC-Alpha Station 01',
        description: 'A retro CRT terminal displaying: "VTU BELAGAVI MAINFRAME // LOGIN CHALLENGE".',
        x: 65,
        y: 58,
        associatedPuzzleId: 'terminal_code',
        inspectMessage: 'The terminal prompts: "Enter the historic year Visvesvaraya Technological University (VTU) was established in Belagavi."'
      },
      {
        id: 'spot_floppy_box',
        name: 'VTU Magnetic Media Caddy',
        description: 'A retro storage box containing 3.5-inch disks with early Karnataka engineering simulation code.',
        x: 54,
        y: 64,
        unlockedClueId: 'clue_floppy_disk',
        inspectMessage: 'You recover a magnetic diskette labeled: "VTU JNANA SANGAMA - PROJECT CHRONOS ACOUSTIC HARMONICS - REVISED".'
      },
      {
        id: 'spot_server_rack',
        name: 'VTU Backbone Server Rack',
        description: 'Towering iron cabinet routing university network traffic through the Sahyadri relay.',
        x: 32,
        y: 38,
        inspectMessage: 'A cold draft leaks from the cable tray. A glowing thermal residue spells: "Aria was here."'
      }
    ]
  },
  classroom_304: {
    id: 'classroom_304',
    name: 'Sir M. Visvesvaraya Academic Block 304',
    subtitle: 'Department of Advanced Computing & Mechanics · VTU Belagavi',
    image: '/src/assets/images/location_classroom_304_1793091061179.jpg',
    ambience: 'Gentle night breeze from the Western Ghats whistling through the window, faint chalk dust suspended in moonlight.',
    description: 'Named in honor of Karnataka\'s legendary engineer Sir M. Visvesvaraya. The lecture room features a towering slate board covered in complex acoustic equations and a cryptic campus cipher.',
    hotspots: [
      {
        id: 'spot_slate_chalkboard',
        name: 'Sir MV Harmonic Resonance Board',
        description: 'Dense mechanical and computing formulas framing a glowing chalk inscription.',
        x: 68,
        y: 32,
        associatedPuzzleId: 'chalk_cipher',
        unlockedClueId: 'clue_chalk_cipher',
        inspectMessage: 'The slate board reads: "VTU SCHOLAR CIPHER: SIGMA-DELTA-NU-773. ALIGN THE FREQUENCY AT 23:11 BENEATH BELAGAVI SKIES."'
      },
      {
        id: 'spot_student_backpack',
        name: 'VTU Campus Backpack',
        description: 'A weathered student bag resting beside a wooden desk.',
        x: 70,
        y: 82,
        inspectMessage: 'Inside is a VTU semester syllabus notebook with handwritten notes on acoustic resonance tests in the library clocktower.'
      },
      {
        id: 'spot_window',
        name: 'Western Ghats Overlook Window',
        description: 'An arched window framing the misty hills and the glowing dome of the Hilltop Observatory.',
        x: 23,
        y: 36,
        inspectMessage: 'Looking across the Jnana Sangama valley, turquoise light pulses periodically from the Belagavi hilltop steps.'
      }
    ]
  },
  canteen: {
    id: 'canteen',
    name: 'Jnana Sangama Canteen & Kunda Café',
    subtitle: 'Student Union Complex · VTU Belagavi',
    image: '/src/assets/images/location_library_1793091060606.jpg',
    ambience: 'Flickering fluorescent glow, faint nostalgic scent of Belagavi filter coffee and sweet cardamom Kunda.',
    description: 'The beloved student canteen of VTU Belagavi where students from all across Karnataka gathered to debate engineering ideas. Tonight, chairs are stacked neatly in the eerie half-light.',
    hotspots: [
      {
        id: 'spot_canteen_counter',
        name: 'Lost & Found Registry Tray',
        description: 'A metal tray beside the old billing counter.',
        x: 38,
        y: 62,
        unlockedClueId: 'clue_student_id',
        inspectMessage: 'You discover an original laminated VTU Student ID: "Aria Vance (Aria Rao) - USN: 2BA98CS042 - Dept of Computer Science & Engineering, VTU Belagavi".'
      },
      {
        id: 'spot_bulletin_board',
        name: 'VTU Belagavi Notice Board',
        description: 'Notices for university sports meets, Hacktoberfest gatherings, and an old newspaper clipping.',
        x: 72,
        y: 45,
        inspectMessage: 'A clipping from the Belgaum Tarun Bharat / Deccan Herald: "VTU honors scholar vanishes amidst freak monsoon thunderstorm."'
      },
      {
        id: 'spot_vending_machine',
        name: 'Kunda Sweets & Tea Kiosk',
        description: 'The classic canteen stall with a faded handwritten note taped to the shutter.',
        x: 18,
        y: 52,
        inspectMessage: 'A handwritten note reads: "The master key to the time capsule is sealed inside the pendulum chamber of the Central Library clock."'
      }
    ]
  },
  observatory: {
    id: 'observatory',
    name: 'Belagavi Hilltop Observatory Steps',
    subtitle: 'Highest Peak of Jnana Sangama · Overlooking Sahyadri Valleys',
    image: '/src/assets/images/campus_map_night_1793091058092.jpg',
    ambience: 'Crisp mountain wind sweeping across the Sahyadri ridge, rustling eucalyptus leaves, distant city lights of Belagavi.',
    description: 'Perched on the highest hill of the 120-acre VTU Jnana Sangama campus. Below lies the expanse of Belagavi in the night mist. At the center of the terrace rests the heavy bronze VTU Foundation Time Capsule.',
    hotspots: [
      {
        id: 'spot_time_capsule',
        name: 'The VTU Foundation Time Capsule',
        description: 'A heavy bronze chest bolted into granite, sealed by three symbolic locks.',
        x: 50,
        y: 72,
        associatedPuzzleId: 'time_capsule',
        inspectMessage: 'Engraved on the granite base: "Dedicated to the spirit of engineering at VTU Belagavi. To be unlocked only by Truth and Remembrance."'
      },
      {
        id: 'spot_memorial_bench',
        name: 'Sir M. Visvesvaraya Memorial Bench',
        description: 'A polished stone bench looking out toward the Belagavi valley.',
        x: 28,
        y: 68,
        inspectMessage: 'Inscribed on the stone: "Industrialize or Perish. Remember the students who coded under the stormy skies of Belagavi."'
      },
      {
        id: 'spot_brass_telescope',
        name: 'Antique Stargazer Telescope',
        description: 'Mounted toward the northern constellations over the Western Ghats.',
        x: 82,
        y: 35,
        inspectMessage: 'Looking into the optical lens, spectral alignments point straight down toward the Central Library dome.'
      }
    ]
  }
};

export const INITIAL_CLUES: ClueItem[] = [
  {
    id: 'clue_student_id',
    name: "VTU Student ID: Aria Vance (USN: 2BA98CS042)",
    category: 'artifact',
    locationFound: 'canteen',
    summary: 'Official VTU Belagavi student identity card with holographic emblem.',
    description: 'Issued by Visvesvaraya Technological University, Belagavi. Name: Aria Vance (Aria Rao), USN: 2BA98CS042, Department of Computer Science & Engineering. The hologram faintly glimmers with an iridescent cyan aura.',
    spectralSecret: 'Ghost Vision reveals micro-script beneath the VTU seal: "The Dean locked the project archives in DEC Alpha Station 01 at the Kalam Computing Centre."',
    analyzedByGemma: false
  },
  {
    id: 'clue_torn_diary',
    name: 'Belagavi Monsoon Diary Page',
    category: 'document',
    locationFound: 'library',
    summary: 'Personal research notes written during a legendary Belagavi thunderstorm.',
    description: '"October 24: The monsoon winds roared over the Belagavi hills. When the power grid tripped across Jnana Sangama, the acoustic resonance through the library stone dome didn\'t stop. It began broadcasting stored audio records through the copper pipes. Someone is trying to erase our paper."',
    spectralSecret: 'Spectral UV reveals a clock diagram in the margins pointing specifically to 23:11 (Hour 23, Minute 11).',
    analyzedByGemma: false
  },
  {
    id: 'clue_floppy_disk',
    name: 'VTU Floppy Disk: "PROJECT CHRONOS"',
    category: 'tech',
    locationFound: 'computer_lab',
    summary: 'A 3.5" diskette containing compiled software from the Kalam Lab at VTU Belagavi.',
    description: 'A magnetic diskette containing source code for an acoustic memory synthesizer designed by Aria Vance and her open-source student group at VTU Belagavi.',
    spectralSecret: 'Ghost Vision decodes the binary boot sector: "Password hint: The founding year of VTU Belagavi (1998 or 1994). Master key hidden in library clock."',
    analyzedByGemma: false
  },
  {
    id: 'clue_chalk_cipher',
    name: 'Sir MV Academic Hall Cipher',
    category: 'cipher',
    locationFound: 'classroom_304',
    summary: 'Mathematical Greek cipher from Sir MV Block 304 at VTU Belagavi.',
    description: '"SIGMA-DELTA-NU-773 // 23:11". A harmonic frequency formula that matches the natural vibration frequency of the Jnana Sangama Central Library dome.',
    spectralSecret: 'Ghost Vision highlights letters spelling out "THE BELAGAVI ARCHIVES HOLD THE TRUTH". Points directly to DEC Alpha terminal in the lab.',
    analyzedByGemma: false
  },
  {
    id: 'clue_brass_key',
    name: 'Ornate VTU Central Library Brass Key',
    category: 'artifact',
    locationFound: 'library',
    summary: 'Heavy antique key recovered from inside the grandfather clock.',
    description: 'An intricately notched brass key bearing the emblem of Visvesvaraya Technological University. It feels freezing cold to the touch and hums when brought near the hilltop time capsule.',
    spectralSecret: 'Ghost Vision shows Aria\'s spectral fingerprints glowing on the key\'s stem.',
    analyzedByGemma: false
  }
];

export const INITIAL_PUZZLES: Puzzle[] = [
  {
    id: 'clock_riddle',
    title: 'The Phantom Hour of VTU Belagavi',
    locationId: 'library',
    prompt: 'The grandfather clock in the VTU Central Library is frozen. Inscriptions across Sir MV Block 304 and the diary hint at the exact minute the storm stopped the clock (Hour 23, Minute 11). Enter the 4-digit time [HHMM]:',
    hint: 'Look at the Sir MV Block chalkboard cipher: "FIND THE VOID AT 23:11". Enter 2311.',
    solutionKey: '2311',
    rewardClueId: 'clue_brass_key',
    solved: false,
    solvedMessage: 'The clock gears click into place with a deep gong! A secret compartment pops open below the clock face, revealing the Ornate VTU Central Library Brass Key!'
  },
  {
    id: 'terminal_code',
    title: 'Kalam Computing Centre Terminal Login',
    locationId: 'computer_lab',
    prompt: 'The amber terminal screen prompts for the system administrator unlock password. What is the historic year Visvesvaraya Technological University (VTU) was established in Belagavi? (Enter 1998 or 1994):',
    hint: 'VTU Belagavi was established by the Government of Karnataka in 1998 (also accepts 1994). Enter 1998.',
    solutionKey: '1998',
    rewardClueId: 'clue_floppy_disk',
    solved: false,
    solvedMessage: 'Access Granted! The DEC Alpha monitor streams decrypted VTU logs confirming Aria Vance\'s thesis was preserved into the Jnana Sangama foundation time capsule.'
  },
  {
    id: 'chalk_cipher',
    title: 'Sir MV Block Cipher Decryption',
    locationId: 'classroom_304',
    prompt: 'Decode the frequency constant on the chalkboard in Sir MV Block 304. What is the 3-digit numerical frequency code following SIGMA-DELTA-NU-___?',
    hint: 'The text on the board clearly states SIGMA-DELTA-NU-773. Enter 773.',
    solutionKey: '773',
    solved: false,
    solvedMessage: 'The formula resolves! A hidden resonance wave pattern reveals that the acoustic research can be completed at the Belagavi Hilltop Observatory steps.'
  },
  {
    id: 'time_capsule',
    title: 'The VTU Foundation Time Capsule Seals',
    locationId: 'observatory',
    prompt: 'The bronze time capsule overlooking the Belagavi hills requires entering the master project codename discovered in the floppy disk and diary archives:',
    hint: 'The project disk found in the Kalam computer lab is named "PROJECT ______". Enter CHRONOS.',
    solutionKey: 'CHRONOS',
    solved: false,
    solvedMessage: 'The heavy bronze latches spring open! Inside lies the original 1998 acoustic thesis, preserved audio reels, and Aria\'s handwritten dedication to future VTU Belagavi engineers!'
  }
];
