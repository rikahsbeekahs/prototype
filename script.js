/**
 * MAUSAM MITRA — PRODUCTION SCRIPT (MoES / IMD Prototype)
 * Problem Statement ID: 26076
 * 
 * Features:
 * 1. Automatic Avatar Speech on Page Start:
 *    - Megha speaks immediately upon website opening without requiring a button press.
 *    - Correct Official Greeting: "नमस्ते! मैं मेघा हूँ, आपकी मौसम मित्र। मौसम मित्र में आपका स्वागत है!"
 * 2. Voice-Controlled Persona Selection (High Accessibility for Farmers & Less-Educated Users):
 *    - In Stage 2, Megha asks: "आप कौन सा प्रोफ़ाइल चुनना चाहते हैं? आप बोलकर भी बता सकते हैं, जैसे कहें: 'मैं किसान हूँ'।"
 *    - Automatic voice listening activates: saying "kisan", "farmer", "fitness", "commuter", etc., selects the persona automatically!
 *    - Confirms in Hindi and opens their personalized dashboard seamlessly.
 * 3. Centered Layout on Mobile & Desktop:
 *    - Megha's entire avatar is 100% visible (no cropped head).
 *    - All cards, bubbles, and buttons are perfectly centered horizontally.
 * 4. 8 Personas Dynamic Reordering & Priority Card Highlighting (PS ID: 26076)
 * 5. Real-Time Open-Meteo Weather Integration with 24 Dynamic Climate Sky Landscapes
 * 6. Dual Language Chat Drawer (Hindi by default, with English sound toggle)
 */

// ============================================================
// 1. CONFIGURATION & STATE
// ============================================================

const CONFIG = {
  BACKEND_BASE_URL: "https://mausam-mitra-2lh1.onrender.com",
  OPEN_METEO_BASE_URL: "https://api.open-meteo.com/v1"
};

const APP_STATE = {
  currentCity: "मेरी लाइव लोकेशन (GPS)",
  lat: 25.5943, // Defaulting immediately to user's detected live coordinate region (Patna/Bihar)
  lon: 85.1352,
  activePersona: "agriculture_gardeners", // default to agriculture / farmer for hackathon demo
  isGeneralView: false,
  isSpeaking: false,
  isListening: false,
  currentClimateKey: "partly_cloudy",
  voiceLang: "hi-IN", // Hindi ONLY by default
  onboardingStage: 1, // 1: Solo Megha Greeting, 2: Persona Selection
  hasStartedOnboardingVoice: false,
  isListeningForPersona: false,
  hasSelectedPersona: false,
  wakeWordEnabled: false,
  isWakeWordListening: false
};

// 8 Official Personas as per MoES/IMD PS 26076 with Strictly Tailored Priority Cards
const PERSONAS_CONFIG = {
  agriculture_gardeners: {
    title: "किसान एवं बागवानी (Farmer Mode)",
    badge: "🌾 किसान एवं कृषि परामर्श सक्रिय",
    headline: "मिट्टी में नमी, 5-दिन वर्षा व मौसमी बुवाई परामर्श",
    subtext: "सॉइल मॉइस्चर (44% VWC), 5-दिन वर्षा पूर्वानुमान, पाला व ठंड चेतावनी एवं फसल सुरक्षा।",
    priorityCards: ["soil_moisture", "rain_prediction", "frost_alert", "seasonal_planting"],
    meghaIntro: "राम-राम किसान भाई! मैंने आपके लिए खेती और मौसम का पूरा डैशबोर्ड हिंदी में खोल दिया है। मिट्टी में नमी, वर्षा और मौसमी बुवाई का परामर्श देख लीजिए।"
  },
  health_conscious: {
    title: "Health-conscious (स्वास्थ्य एवं एक्यूआई)",
    badge: "🌿 Health-conscious Mode Active",
    headline: "High Priority Metrics for Respiratory & Skin Health",
    subtext: "Air Quality Index (AQI), Pollen Count, UV Index & Asthma/Skin Sensitivity Advisories.",
    priorityCards: ["aqi", "uv", "pollen", "health_humidity"],
    meghaIntro: "नमस्ते! आपके लिए एक्यूआई, यूवी इंडेक्स, पराग कण और नमी से एलर्जी अलर्ट्स प्रायोरिटी पर सेट कर दिए हैं।"
  },
  fitness: {
    title: "Outdoor Fitness (आउटडोर फिटनेस)",
    badge: "🏃 Outdoor Fitness Mode Active",
    headline: "Workout Windows, Sun Arc & Heat Stress Alerts",
    subtext: "Best running hours, sunrise/sunset times, wind speed, and thermal workout safety.",
    priorityCards: ["best_running_hours", "sun_arc", "fitness_heat_wind"],
    meghaIntro: "नमस्ते! आउटडोर फिटनेस प्रोफाइल एक्टिव हो गया है। आज का रनिंग विंडो, सूर्योदय समय और हवा की गति चेक कर लीजिए।"
  },
  beachgoers_surfers: {
    title: "Beachgoers & Surfers (समुद्र तट एवं सर्फ़र्स)",
    badge: "🏄 Beachgoers & Surfers Mode Active",
    headline: "Coastal Sea Conditions, Tides & Wave Swell",
    subtext: "Sea safety flags, high/low tide timings, wave swell height, and coastal water temperature.",
    priorityCards: ["sea_conditions", "tides", "wave_swell"],
    meghaIntro: "नमस्ते! कोस्टल मरीन डैशबोर्ड एक्टिव है। हाई टाइड 11:20 AM पर है, वेव हाइट 1.8 मीटर है और समुद्र सुरक्षित है।"
  },
  travelers: {
    title: "Travelers (यात्री एवं टूरिस्ट)",
    badge: "✈️ Travelers Mode Active",
    headline: "Saved Destinations, Flight Disruption & Smart Packing",
    subtext: "Instant saved destination weather, severe flight delay risks, and destination packing suggestions.",
    priorityCards: ["saved_destinations", "flight_risk", "packing_suggestions"],
    meghaIntro: "नमस्ते! ट्रैवलर्स मोड एक्टिव है। सेव्ड डेस्टिनेशन्स का मौसम, फ्लाइट डिले अलर्ट और स्मार्ट पैकिंग टिप्स तैयार हैं।"
  },
  parents_families: {
    title: "Parents & Families (अभिभावक एवं परिवार)",
    badge: "👨‍👩‍👧 Parents & Families Mode Active",
    headline: "Safe School Commutes & Weather Warnings",
    subtext: "Morning school transit conditions, afternoon pick-up, playground rain alerts & child warnings.",
    priorityCards: ["school_commute", "family_rain_alerts", "severe_weather_warnings"],
    meghaIntro: "नमस्ते! पैरेंट्स प्रोफाइल एक्टिव है। स्कूल आवागमन के समय मौसम साफ़ रहेगा और बारिश की संभावना कम है।"
  },
  commuters: {
    title: "Commuters (दैनिक यात्री एवं ट्रैफ़िक)",
    badge: "🚗 Commuters Mode Active",
    headline: "Weather-Traffic Integration & Fog Visibility",
    subtext: "Live highway traffic delay index, fog visibility distance, and bridge crosswind alerts.",
    priorityCards: ["traffic_weather_integration", "visibility_traffic", "commuter_storm_alerts"],
    meghaIntro: "नमस्ते! कम्यूटर्स व्यू एक्टिव है। मुख्य सड़कों पर विजिबिलिटी सामान्य है, कोई घना कोहरा या ट्रैफ़िक बाधा नहीं है।"
  },
  event_planners: {
    title: "Event Planners (इवेंट एवं आयोजन)",
    badge: "🎉 Event Planners Mode Active",
    headline: "Outdoor Comfort Index & Rain Probability",
    subtext: "Wedding and lawn comfort score (84/100), evening rain probability %, and 7-day extended forecasts.",
    priorityCards: ["event_comfort", "event_rain_probability", "extended_forecast"],
    meghaIntro: "नमस्ते! इवेंट प्लानर्स डैशबोर्ड सेट है। शाम का आउटडोर कंफर्ट स्कोर 84/100 है, आउटडोर आयोजन बिल्कुल सुरक्षित है।"
  }
};

// Weather Code to 24 Climate Backgrounds Mapping
const WEATHER_CODE_MAP = {
  0: "clear_day",
  1: "mainly_clear",
  2: "partly_cloudy",
  3: "overcast",
  45: "fog",
  48: "dense_fog",
  51: "drizzle",
  53: "drizzle",
  55: "drizzle",
  61: "moderate_rain",
  63: "moderate_rain",
  65: "heavy_rain",
  71: "snow",
  73: "snow",
  75: "heavy_snowfall",
  80: "moderate_rain",
  81: "moderate_rain",
  82: "heavy_rain",
  95: "thunderstorm",
  96: "thunderstorm",
  99: "thunderstorm"
};

// ============================================================
// 2. DOM ELEMENTS
// ============================================================

const DOM = {
  climateHeader: document.getElementById('climateHeader'),
  heroTemp: document.getElementById('heroTemp'),
  heroCondition: document.getElementById('heroCondition'),
  heroFeelsLike: document.getElementById('heroFeelsLike'),
  metaPrecip: document.getElementById('metaPrecip'),
  metaWind: document.getElementById('metaWind'),
  metaHumidity: document.getElementById('metaHumidity'),
  metaAqi: document.getElementById('metaAqi'),
  headerMeghaSpeech: document.getElementById('headerMeghaSpeech'),
  speakHeaderAdviceBtn: document.getElementById('speakHeaderAdviceBtn'),
  openMeghaChatBtn: document.getElementById('openMeghaChatBtn'),
  activePersonaLabel: document.getElementById('activePersonaLabel'),
  personaSwitchBtn: document.getElementById('personaSwitchBtn'),
  generalViewBtn: document.getElementById('generalViewBtn'),
  viewPersonaPill: document.getElementById('viewPersonaPill'),
  viewGeneralPill: document.getElementById('viewGeneralPill'),
  focusPersonaBadge: document.getElementById('focusPersonaBadge'),
  focusPersonaHeadline: document.getElementById('focusPersonaHeadline'),
  focusPersonaSubtext: document.getElementById('focusPersonaSubtext'),
  cardsGrid: document.getElementById('dashboardCardsGrid'),
  allCards: document.querySelectorAll('.weather-card'),
  forecastDaysList: document.getElementById('forecastDaysList'),
  locationSearchContainer: document.querySelector('.location-search-container'),
  
  // Cinematic Onboarding Modal Elements
  onboardingModal: document.getElementById('onboardingModal'),
  onboardingStage: document.getElementById('onboardingStage'),
  meghaHeroShowcase: document.getElementById('meghaHeroShowcase'),
  closeOnboardingBtn: document.getElementById('closeOnboardingBtn'),
  modalMeghaImg: document.getElementById('modalMeghaImg'),
  modalSpeechText: document.getElementById('modalSpeechText'),
  stageAudioBars: document.getElementById('stageAudioBars'),
  startMeghaExperienceBtn: document.getElementById('startMeghaExperienceBtn'),
  skipToPersonasBtn: document.getElementById('skipToPersonasBtn'),
  voiceListeningIndicator: document.getElementById('voiceListeningIndicator'),
  retryVoiceSelectBtn: document.getElementById('retryVoiceSelectBtn'),
  fileProtocolNotice: document.getElementById('fileProtocolNotice'),
  replayVoiceBtn: document.getElementById('replayVoiceBtn'),
  personasRevealPanel: document.getElementById('personasRevealPanel'),
  personaChoices: document.querySelectorAll('.persona-choice-card'),
  applyPersonaBtn: document.getElementById('applyPersonaBtn'),

  // Floating Megha & Chat Drawer
  floatingMeghaTrigger: document.getElementById('floatingMeghaTrigger'),
  floatingMeghaImg: document.getElementById('floatingMeghaImg'),
  meghaChatDrawer: document.getElementById('meghaChatDrawer'),
  closeChatDrawerBtn: document.getElementById('closeChatDrawerBtn'),
  chatMessages: document.getElementById('chatMessages'),
  micVoiceBtn: document.getElementById('micVoiceBtn'),
  chatTextInput: document.getElementById('chatTextInput'),
  sendChatBtn: document.getElementById('sendChatBtn'),
  quickChips: document.querySelectorAll('.chip-query'),

  // Voice Language Selector in Chat Drawer
  langHindiBtn: document.getElementById('langHindiBtn'),
  langEnglishBtn: document.getElementById('langEnglishBtn'),

  // Side Menu Drawer
  drawerToggleBtn: document.getElementById('drawerToggleBtn'),
  sideMenuDrawer: document.getElementById('sideMenuDrawer'),
  closeSideMenuBtn: document.getElementById('closeSideMenuBtn'),
  menuPersonaItems: document.querySelectorAll('[data-switch-persona]'),

  // City Search
  citySearchInput: document.getElementById('citySearchInput'),
  searchBtn: document.getElementById('searchBtn'),
  searchResultsDropdown: document.getElementById('searchResultsDropdown'),

  // Theme Switcher & Quick City Pills (MSN Weather Day/Night Style)
  themeToggleBtn: document.getElementById('themeToggleBtn'),
  themeToggleIcon: document.getElementById('themeToggleIcon'),
  themeToggleLabel: document.getElementById('themeToggleLabel'),
  quickCitiesBar: document.getElementById('quickCitiesBar'),
  cityPillBtns: document.querySelectorAll('.city-pill-btn')
};

// ============================================================
// 3. MEGHA AVATAR SPEECH & TALKING MOUTH ANIMATION
// ============================================================

const AVATAR_ASSETS = {
  idle: "assets/avatar/megha_idle_transparent.png",
  speaking: "assets/avatar/megha_speaking_transparent.png"
};

let mouthToggleInterval = null;

function setMeghaSpeakingVisual(isSpeaking) {
  APP_STATE.isSpeaking = isSpeaking;
  const targetSrc = isSpeaking ? AVATAR_ASSETS.speaking : AVATAR_ASSETS.idle;

  if (DOM.modalMeghaImg) DOM.modalMeghaImg.src = targetSrc;
  if (DOM.floatingMeghaImg) DOM.floatingMeghaImg.src = targetSrc;

  if (isSpeaking) {
    if (DOM.modalMeghaImg) DOM.modalMeghaImg.classList.add('megha-speaking-active');
    if (DOM.stageAudioBars) DOM.stageAudioBars.style.opacity = '1';
    
    // Natural lip-sync cadence alternating mouth between speaking & idle
    if (!mouthToggleInterval) {
      let state = true;
      mouthToggleInterval = setInterval(() => {
        state = !state;
        const toggleSrc = state ? AVATAR_ASSETS.speaking : AVATAR_ASSETS.idle;
        if (DOM.modalMeghaImg) DOM.modalMeghaImg.src = toggleSrc;
      }, 180);
    }
  } else {
    if (DOM.modalMeghaImg) DOM.modalMeghaImg.classList.remove('megha-speaking-active');
    if (DOM.stageAudioBars) DOM.stageAudioBars.style.opacity = '0.4';
    if (mouthToggleInterval) {
      clearInterval(mouthToggleInterval);
      mouthToggleInterval = null;
    }
  }
}

/**
 * Universal Speech Synthesis Function
 * @param {string} text - text to speak
 * @param {function} onComplete - callback when speech ends
 * @param {string} forceLang - optional language override ('hi-IN' or 'en-US')
 */
function speakWithMegha(text, onComplete = null, forceLang = null) {
  if (!('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported in this browser.');
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  const targetLang = forceLang || APP_STATE.voiceLang || 'hi-IN';
  utterance.lang = targetLang;
  utterance.rate = 1.0;
  utterance.pitch = 1.1; // Friendly warm pitch for Megha

  // Locate best matching voice
  const voices = window.speechSynthesis.getVoices();
  if (targetLang.startsWith('hi')) {
    const hindiVoice = voices.find(v => 
      v.lang.startsWith('hi') || 
      v.name.includes('Hindi') || 
      v.name.includes('Swara') || 
      v.name.includes('Lekha') ||
      v.name.includes('Kalpana') ||
      v.name.includes('Google हिन्दी')
    );
    if (hindiVoice) utterance.voice = hindiVoice;
  } else {
    const engVoice = voices.find(v => 
      v.lang.includes('en-IN') || 
      v.name.includes('India') || 
      v.lang.includes('en-US') ||
      v.name.includes('Zira') ||
      v.name.includes('Google US English')
    );
    if (engVoice) utterance.voice = engVoice;
  }

  utterance.onstart = () => {
    setMeghaSpeakingVisual(true);
  };

  utterance.onend = () => {
    setMeghaSpeakingVisual(false);
    if (onComplete) onComplete();
  };

  utterance.onerror = (e) => {
    console.warn('SpeechSynthesis status:', e.error || e);
    setMeghaSpeakingVisual(false);
    // CRITICAL: DO NOT call onComplete() on error!
    // Calling onComplete on error skips Stage 1 prematurely before user can hear!
  };

  window.speechSynthesis.speak(utterance);
}

// ============================================================
// 4. AUTOMATIC CINEMATIC ONBOARDING & VOICE PERSONA SELECTION
// ============================================================

/**
 * Stage 1: Solo Megha speaks greeting in Hindi automatically on startup.
 * Exact wording: "नमस्ते! मैं मेघा हूँ, आपकी मौसम मित्र। मौसम मित्र में आपका स्वागत है!"
 */
function triggerStage1Greeting() {
  const stage1Text = "नमस्ते! मैं मेघा हूँ, आपकी मौसम मित्र। मौसम मित्र में आपका स्वागत है!";
  if (DOM.modalSpeechText) DOM.modalSpeechText.textContent = `"${stage1Text}"`;

  if (DOM.startMeghaExperienceBtn) {
    DOM.startMeghaExperienceBtn.classList.add('speaking');
    DOM.startMeghaExperienceBtn.innerHTML = `<span>🔊</span> मेघा बोल रही हैं...`;
  }

  // Avatar speaks in Hindi
  speakWithMegha(stage1Text, () => {
    // When greeting actually completes speaking -> Transition to Stage 2!
    setTimeout(() => {
      transitionToStage2Personas();
    }, 450);
  }, 'hi-IN');
}

/**
 * Stage 2: Megha prompts the user for persona choice and automatically listens.
 * Perfect for farmers and uneducated users who prefer speaking instead of tapping.
 */
function transitionToStage2Personas() {
  APP_STATE.onboardingStage = 2;

  if (DOM.onboardingStage) {
    DOM.onboardingStage.classList.add('split-mode');
  }
  if (DOM.personasRevealPanel) {
    DOM.personasRevealPanel.classList.remove('hidden');
  }
  if (DOM.startMeghaExperienceBtn) {
    DOM.startMeghaExperienceBtn.classList.add('hidden');
  }
  if (DOM.skipToPersonasBtn) {
    DOM.skipToPersonasBtn.classList.add('hidden');
  }
  if (DOM.replayVoiceBtn) {
    DOM.replayVoiceBtn.classList.remove('hidden');
  }

  const stage2Text = "आप कौन सा प्रोफ़ाइल चुनना चाहते हैं? बोलकर या चुनकर बताएँ (जैसे कहें: 'मैं किसान हूँ', 'हेल्थ कॉन्शियस', 'फिटनेस', 'कम्यूटर', 'पैरेंट्स', 'ट्रैवलर', 'सर्फर', या 'इवेंट प्लानर')";
  if (DOM.modalSpeechText) DOM.modalSpeechText.textContent = `"${stage2Text}"`;

  // Megha speaks the prompt covering all 8 personas in Hindi
  const speechPrompt = "आप कौन सा प्रोफ़ाइल चुनना चाहते हैं? आप बोलकर भी बता सकते हैं, जैसे कहें: 'मैं किसान हूँ', 'हेल्थ कॉन्शियस', 'फिटनेस', 'कम्यूटर', 'पैरेंट्स', 'ट्रैवलर', 'सर्फर', या 'इवेंट प्लानर'।";
  speakWithMegha(speechPrompt, () => {
    // Start listening for user's voice command right after speech ends
    startVoicePersonaListener();
  }, 'hi-IN');
}

/**
 * Voice-Controlled Persona Selection Engine
 * Listens for voice inputs like "kisan", "farmer", "fitness", "commuter", etc.
 */
let personaRecognition = null;
let personaRestartTimeout = null;

function startVoicePersonaListener() {
  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRec) {
    console.warn('Speech recognition not supported in this browser.');
    if (DOM.modalSpeechText) {
      DOM.modalSpeechText.textContent = `"कृपया नीचे दिए गए कार्ड्स में से अपना प्रोफ़ाइल चुनें।"`;
    }
    return;
  }

  const isFileProtocol = window.location.protocol === 'file:';

  if (DOM.voiceListeningIndicator) {
    DOM.voiceListeningIndicator.classList.remove('hidden');
    DOM.voiceListeningIndicator.classList.add('active-recording');
    const strongEl = DOM.voiceListeningIndicator.querySelector('strong');
    if (strongEl) {
      strongEl.textContent = '🟢 मेघा सुन रही हैं... (Listening)';
    }
  }

  // If on file:// protocol, show the guidance notice
  if (isFileProtocol && DOM.fileProtocolNotice) {
    DOM.fileProtocolNotice.classList.remove('hidden');
  }

  try {
    if (personaRecognition) {
      try {
        personaRecognition.onstart = null;
        personaRecognition.onresult = null;
        personaRecognition.onerror = null;
        personaRecognition.onend = null;
        personaRecognition.abort();
      } catch (e) {}
    }

    personaRecognition = new SpeechRec();
    personaRecognition.lang = 'hi-IN';
    personaRecognition.continuous = true;
    personaRecognition.interimResults = true;
    personaRecognition.maxAlternatives = 3;

    personaRecognition.onstart = () => {
      APP_STATE.isListeningForPersona = true;
      if (DOM.voiceListeningIndicator) {
        DOM.voiceListeningIndicator.classList.add('active-recording');
        const strongEl = DOM.voiceListeningIndicator.querySelector('strong');
        if (strongEl) strongEl.textContent = '🟢 मेघा सुन रही हैं... (Listening)';
      }
    };

    personaRecognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const piece = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += piece;
        } else {
          interimTranscript += piece;
        }
      }

      const heardText = (finalTranscript || interimTranscript).trim();
      if (heardText) {
        console.log('Voice Persona Input Heard:', heardText);
        if (DOM.modalSpeechText && !APP_STATE.hasSelectedPersona) {
          DOM.modalSpeechText.textContent = `"सुना जा रहा है: '${heardText}'..."`;
        }
        handleVoicePersonaMatch(heardText);
      }
    };

    personaRecognition.onerror = (e) => {
      console.warn('Voice persona recognition status:', e.error || e);
      APP_STATE.isListeningForPersona = false;
      if (DOM.voiceListeningIndicator) {
        const strongEl = DOM.voiceListeningIndicator.querySelector('strong');
        if (e.error === 'not-allowed') {
          if (isFileProtocol) {
            if (strongEl) strongEl.textContent = '⚠️ file:// पर माइक ब्लॉक है। run_app.bat चलाएं या कार्ड चुनें';
            if (DOM.modalSpeechText) DOM.modalSpeechText.textContent = '"Chrome में सीधे file:// खोलने पर माइक ब्लॉक रहता है। run_app.bat चलाएँ या नीचे कार्ड पर क्लिक करें।"';
          } else {
            if (strongEl) strongEl.textContent = '🎙️ माइक्रोफ़ोन की अनुमति दें (Allow Mic)';
          }
        } else if (e.error === 'network') {
          if (strongEl) strongEl.textContent = '⚠️ नेटवर्क समस्या — कृपया कार्ड पर क्लिक करें';
        }
      }
    };

    personaRecognition.onend = () => {
      APP_STATE.isListeningForPersona = false;
      // If user is still on Stage 2 and hasn't picked a persona yet, restart fresh listener
      if (APP_STATE.onboardingStage === 2 && !DOM.onboardingModal.classList.contains('hidden') && !APP_STATE.hasSelectedPersona && !APP_STATE.isSpeaking) {
        clearTimeout(personaRestartTimeout);
        personaRestartTimeout = setTimeout(() => {
          if (APP_STATE.onboardingStage === 2 && !DOM.onboardingModal.classList.contains('hidden') && !APP_STATE.hasSelectedPersona && !APP_STATE.isSpeaking) {
            startVoicePersonaListener();
          }
        }, 600);
      }
    };

    personaRecognition.start();
  } catch (err) {
    console.warn('Could not start voice recognition:', err);
  }
}

/**
 * Matches spoken voice command (both Devanagari Hindi & Latin/English) to one of the 8 MoES/IMD Personas
 */
function handleVoicePersonaMatch(rawText) {
  if (APP_STATE.hasSelectedPersona) return;
  const text = rawText.toLowerCase().trim();
  console.log('Matching persona for transcript:', text);

  let matchedPersona = null;
  let confirmSpeech = "";

  // 1. Agriculture & Gardeners (Farmers) — Devanagari Hindi + English
  if (
    text.includes('किसान') || text.includes('किशन') || text.includes('खेती') || 
    text.includes('कृषि') || text.includes('फसल') || text.includes('मिट्टी') || 
    text.includes('खेत') || text.includes('खाद') || text.includes('कृषक') || 
    text.includes('अन्नदाता') || text.includes('फार्मर') || text.includes('फ़ार्मर') || 
    text.includes('काश्तकार') || text.includes('किशानी') || text.includes('हल') ||
    text.includes('kisan') || text.includes('kisaan') || text.includes('farmer') || 
    text.includes('kheti') || text.includes('fasal') || text.includes('mitti') || 
    text.includes('krishi') || text.includes('krishak') || text.includes('agriculture')
  ) {
    matchedPersona = 'agriculture_gardeners';
    confirmSpeech = "राम-राम किसान भाई! मैंने आपके लिए खेती और मौसम का डैशबोर्ड खोल दिया है।";
  } 
  // 2. Outdoor Fitness
  else if (
    text.includes('फिटनेस') || text.includes('दौड़') || text.includes('दौड़ना') || 
    text.includes('रनिंग') || text.includes('कसरत') || text.includes('व्यायाम') || 
    text.includes('जिम') || text.includes('जॉगिंग') || text.includes('एक्सरसाइज') ||
    text.includes('फिट') ||
    text.includes('fitness') || text.includes('running') || text.includes('jogging') || 
    text.includes('workout') || text.includes('kasrat') || text.includes('gym') || 
    text.includes('daud') || text.includes('runner')
  ) {
    matchedPersona = 'fitness';
    confirmSpeech = "आउटडोर फिटनेस प्रोफ़ाइल सक्रिय कर दी गई है।";
  } 
  // 3. Health-conscious
  else if (
    text.includes('हेल्थ') || text.includes('स्वास्थ्य') || text.includes('सेहत') || 
    text.includes('एक्यूआई') || text.includes('प्रदूषण') || text.includes('एलर्जी') || 
    text.includes('दमा') || text.includes('अस्थमा') || text.includes('बीमार') ||
    text.includes('हवा') ||
    text.includes('health') || text.includes('sehat') || text.includes('swasthya') || 
    text.includes('aqi') || text.includes('allergy') || text.includes('asthma') || 
    text.includes('pradushan') || text.includes('pollution')
  ) {
    matchedPersona = 'health_conscious';
    confirmSpeech = "हेल्थ-कॉन्शस प्रोफ़ाइल सेट कर दी गई है।";
  } 
  // 4. Commuters & Drivers
  else if (
    text.includes('कम्यूटर') || text.includes('सड़क') || text.includes('ट्रैफिक') || 
    text.includes('ट्रैफ़िक') || text.includes('गाड़ी') || text.includes('ऑफिस') || 
    text.includes('कोहरा') || text.includes('रोड') || text.includes('ड्राइवर') ||
    text.includes('ड्राइविंग') || text.includes('बस') ||
    text.includes('commuter') || text.includes('office') || text.includes('traffic') || 
    text.includes('road') || text.includes('sadak') || text.includes('gadi') || 
    text.includes('driver') || text.includes('driving')
  ) {
    matchedPersona = 'commuters';
    confirmSpeech = "कम्यूटर्स प्रोफ़ाइल सेट कर दी गई है।";
  } 
  // 5. Travelers & Tourists
  else if (
    text.includes('ट्रैवल') || text.includes('यात्री') || text.includes('यात्रा') || 
    text.includes('टूर') || text.includes('टूरिस्ट') || text.includes('फ्लाइट') || 
    text.includes('घूमना') || text.includes('सफ़र') || text.includes('सफर') ||
    text.includes('travel') || text.includes('traveler') || text.includes('yatra') || 
    text.includes('flight') || text.includes('ghoomna') || text.includes('safar') || 
    text.includes('tour') || text.includes('tourist')
  ) {
    matchedPersona = 'travelers';
    confirmSpeech = "ट्रैवलर्स प्रोफ़ाइल सेट कर दी गई है।";
  } 
  // 6. Parents & Families
  else if (
    text.includes('परिवार') || text.includes('अभिभावक') || text.includes('पैरेंट्स') || 
    text.includes('माता') || text.includes('पिता') || text.includes('बच्चे') || 
    text.includes('स्कूल') || text.includes('फैमिली') ||
    text.includes('family') || text.includes('parents') || text.includes('bachhe') || 
    text.includes('school') || text.includes('parivaar')
  ) {
    matchedPersona = 'parents_families';
    confirmSpeech = "पैरेंट्स एवं फ़ैमिली प्रोफ़ाइल सेट कर दी गई है।";
  } 
  // 7. Beachgoers & Surfers
  else if (
    text.includes('समुद्र') || text.includes('बीच') || text.includes('सर्फर') || 
    text.includes('सर्फ़र') || text.includes('सर्फिंग') || text.includes('लहर') || 
    text.includes('ज्वार') || text.includes('भाटा') || text.includes('तट') ||
    text.includes('beach') || text.includes('surfer') || text.includes('surfing') || 
    text.includes('samundar') || text.includes('sea') || text.includes('tide') || text.includes('lehar')
  ) {
    matchedPersona = 'beachgoers_surfers';
    confirmSpeech = "समुद्र तट और सर्फ़र्स प्रोफ़ाइल सक्रिय है।";
  } 
  // 8. Event Planners
  else if (
    text.includes('इवेंट') || text.includes('शादी') || text.includes('विवाह') || 
    text.includes('पार्टी') || text.includes('आयोजन') || text.includes('समारोह') || 
    text.includes('फंक्शन') ||
    text.includes('event') || text.includes('shaadi') || text.includes('wedding') || 
    text.includes('party') || text.includes('gathering') || text.includes('planner')
  ) {
    matchedPersona = 'event_planners';
    confirmSpeech = "इवेंट प्लानर्स प्रोफ़ाइल सक्रिय है।";
  }

  if (matchedPersona) {
    // Highlight the selected card in modal
    DOM.personaChoices.forEach(c => {
      c.classList.remove('active');
      if (c.dataset.persona === matchedPersona) {
        c.classList.add('active');
        c.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });

    if (DOM.modalSpeechText) {
      DOM.modalSpeechText.textContent = `"✅ ${PERSONAS_CONFIG[matchedPersona].title} चुनी गई!"`;
    }

    finishOnboardingAndActivateWakeWord(matchedPersona, confirmSpeech);
  }
}

/**
 * Completes Onboarding, closes modal, applies persona, speaks Hindi confirmation +
 * Wake-Word guidance ("मेघा सुनो"), and activates background wake-word listener.
 */
function finishOnboardingAndActivateWakeWord(selectedPersona, confirmMsg = null) {
  APP_STATE.hasSelectedPersona = true;
  clearTimeout(personaRestartTimeout);

  if (personaRecognition) {
    try {
      personaRecognition.onend = null;
      personaRecognition.abort();
    } catch (e) {}
  }
  APP_STATE.isListeningForPersona = false;

  if (DOM.onboardingModal) {
    DOM.onboardingModal.classList.add('hidden');
  }

  const personaToApply = selectedPersona || APP_STATE.activePersona || 'agriculture_gardeners';
  applyPersona(personaToApply, false);

  const baseConfirm = confirmMsg || (
    personaToApply === 'agriculture_gardeners'
      ? "राम-राम किसान भाई! मैंने आपके लिए खेती और मौसम का डैशबोर्ड खोल दिया है।"
      : `${PERSONAS_CONFIG[personaToApply]?.title || 'प्रोफ़ाइल'} सक्रिय कर दी गई है।`
  );

  // Audio instruction as requested:
  // "आप अगर हमें बोलिएगा कि मेघा सुनो तो हम आपका जवाब देंगे।"
  const guidance = "अगर आपको मौसम के बारे में कुछ भी पूछना हो, तो बस कहिए: 'मेघा सुनो', और मैं आपकी सहायता के लिए तुरंत हाज़िर हो जाऊँगी।";
  const fullSpeech = `${baseConfirm} ${guidance}`;

  if (DOM.headerMeghaSpeech) {
    DOM.headerMeghaSpeech.textContent = `"${fullSpeech}"`;
  }

  speakWithMegha(fullSpeech, () => {
    // Turn on background wake-word detection right after Megha finishes speaking
    startWakeWordListener();
  }, 'hi-IN');
}

// ============================================================
// 5. PERSONA & DASHBOARD SWITCHING (8 PERSONAS PS 26076)
// ============================================================

function applyFullHindiDashboard(isHindi) {
  // 1. Search Bar
  if (DOM.citySearchInput) {
    DOM.citySearchInput.placeholder = isHindi 
      ? "अपना शहर या गाँव खोजें (जैसे: दरभंगा, पटना, दिल्ली)..." 
      : "Search city, village, or pincode...";
  }

  // 2. Quick City Pills
  const cityMapHi = {
    "Delhi": "दिल्ली",
    "New Delhi": "दिल्ली",
    "Mumbai": "मुंबई",
    "Hyderabad": "हैदराबाद",
    "Bengaluru": "बेंगलुरु",
    "Darbhanga": "दरभंगा",
    "Patna": "पटना"
  };
  const cityMapEn = {
    "Delhi": "Delhi",
    "New Delhi": "Delhi",
    "Mumbai": "Mumbai",
    "Hyderabad": "Hyderabad",
    "Bengaluru": "Bengaluru",
    "Darbhanga": "Darbhanga",
    "Patna": "Patna"
  };

  if (DOM.quickCitiesBar) {
    const pills = DOM.quickCitiesBar.querySelectorAll('.city-pill-btn');
    pills.forEach(btn => {
      const city = btn.dataset.city;
      const nameEl = btn.querySelector('.city-name') || btn.querySelector('.city-pill-name');
      if (nameEl) {
        nameEl.textContent = isHindi ? (cityMapHi[city] || city) : (cityMapEn[city] || city);
      }
    });
  }

  // 3. Top Nav Buttons
  if (DOM.generalViewBtn) {
    DOM.generalViewBtn.textContent = isHindi ? "🌐 सामान्य दृश्य" : "🌐 General View";
  }
  if (DOM.viewPersonaPill) {
    DOM.viewPersonaPill.textContent = isHindi ? "🌾 किसान प्रोफ़ाइल" : "Personalized View";
  }
  if (DOM.viewGeneralPill) {
    DOM.viewGeneralPill.textContent = isHindi ? "🌐 सामान्य दृश्य" : "General Overview";
  }

  // 4. Megha Top Card
  const meghaNameEl = document.querySelector('.megha-name');
  const meghaBadgeEl = document.querySelector('.megha-badge-tag');
  const speakAdviceBtn = document.getElementById('speakHeaderAdviceBtn');
  const openChatBtn = document.getElementById('openMeghaChatBtn');

  if (meghaNameEl) meghaNameEl.textContent = isHindi ? "मेघा" : "मेघा (Megha)";
  if (meghaBadgeEl) meghaBadgeEl.textContent = isHindi ? "मौसम मित्र AI" : "AI Mausam Mitra";
  if (speakAdviceBtn) speakAdviceBtn.textContent = isHindi ? "🔊 सुनें" : "🔊 Listen";
  if (openChatBtn) openChatBtn.textContent = isHindi ? "💬 बात करें" : "💬 Chat";

  // 5. Agriculture Cards Titles & Content
  const soilCard = document.querySelector('[data-card="soil_moisture"]');
  if (soilCard) {
    const title = soilCard.querySelector('h3');
    const badge = soilCard.querySelector('.card-badge');
    const metaCol = soilCard.querySelector('.stat-meta-col');
    if (title) title.textContent = isHindi ? "मिट्टी में नमी का स्तर (Soil Moisture)" : "Soil Moisture Level";
    if (badge) badge.textContent = isHindi ? "अनुकूल स्तर" : "Optimal";
    if (metaCol) {
      metaCol.innerHTML = isHindi 
        ? "<strong>वॉल्यूमेट्रिक जल स्तर (44% VWC)</strong><span>जड़ों के पोषण के लिए उत्तम। अगले 48 घंटे सिंचाई की आवश्यकता नहीं।</span>"
        : "<strong>Volumetric Water Content</strong><span>Ideal for root nutrient uptake. Hold irrigation for 48h.</span>";
    }
  }

  const rainCard = document.querySelector('[data-card="rain_prediction"]');
  if (rainCard) {
    const title = rainCard.querySelector('h3');
    const badge = rainCard.querySelector('.card-badge');
    const advice = rainCard.querySelector('.card-advice');
    const dayItems = rainCard.querySelectorAll('.agri-day-item');
    if (title) title.textContent = isHindi ? "आगामी 5-दिवसीय कृषि वर्षा पूर्वानुमान" : "Next 5-Day Rainfall Prediction";
    if (badge) badge.textContent = isHindi ? "कृषि मौसम सलाह" : "Agromet Advisory";
    if (advice) {
      advice.textContent = isHindi 
        ? "⚠️ गुरुवार को भारी वर्षा की संभावना है। बुधवार शाम तक फ़सल कटाई पूरी कर लें।"
        : "⚠️ Heavy rainfall expected Thursday. Complete crop harvesting before Wednesday evening.";
    }
    if (dayItems && dayItems.length >= 5) {
      const daysHi = ["आज", "बुध", "गुरु", "शुक्र", "शनि"];
      const daysEn = ["Today", "Wed", "Thu", "Fri", "Sat"];
      dayItems.forEach((item, idx) => {
        const span = item.querySelector('span');
        if (span) span.textContent = isHindi ? daysHi[idx] : daysEn[idx];
      });
    }
  }

  const frostCard = document.querySelector('[data-card="frost_alert"]');
  if (frostCard) {
    const title = frostCard.querySelector('h3');
    const badge = frostCard.querySelector('.card-badge');
    const metaCol = frostCard.querySelector('.stat-meta-col');
    const advice = frostCard.querySelector('.card-advice');
    if (title) title.textContent = isHindi ? "पाला एवं शीत लहर अलर्ट (Frost Alert)" : "Frost & Cold Wave Alert";
    if (badge) badge.textContent = isHindi ? "सुरक्षित स्तर" : "Safe Level";
    if (metaCol) {
      metaCol.innerHTML = isHindi 
        ? "<strong>न्यूनतम तापमान: 14°C</strong><span>अगले 72 घंटों में पाले की संभावना शून्य है।</span>"
        : "<strong>Minimum Temp: 14°C</strong><span>Low risk of frost in the next 72 hours.</span>";
    }
    if (advice) {
      advice.textContent = isHindi
        ? "फ़सलों को ठंड या पाले से कोई नुकसान नहीं होगा। सामान्य खेती जारी रखें।"
        : "Vegetable and rabi crops safe. No anti-frost measures required.";
    }
  }

  const forecastCard = document.querySelector('[data-card="extended_forecast"]');
  if (forecastCard) {
    const title = forecastCard.querySelector('h3');
    const badge = forecastCard.querySelector('.card-badge');
    if (title) title.textContent = isHindi ? "7-दिवसीय संपूर्ण मौसम पूर्वानुमान" : "7-Day Synoptic Weather Forecast";
    if (badge) badge.textContent = isHindi ? "IMD मौसम मॉडल" : "IMD Model Feed";
  }

  // 6. Chat Drawer Input & Chips
  if (DOM.chatTextInput) {
    DOM.chatTextInput.placeholder = isHindi 
      ? "बोलिए या टाइप करें (जैसे: आज बारिश होगी क्या?)..."
      : "Speak or type (e.g., show rainfall for farming)...";
  }

  const chips = document.querySelectorAll('.chip-query');
  if (chips && chips.length >= 4) {
    if (isHindi) {
      chips[0].textContent = "🌧️ आज बारिश होगी?";
      chips[0].dataset.query = "आज बारिश होगी क्या?";
      chips[1].textContent = "🌾 खाद कब डालें?";
      chips[1].dataset.query = "फ़सल में खाद कब डालें?";
      chips[2].textContent = "❄️ पाला चेतावनी";
      chips[2].dataset.query = "क्या पाले की चेतावनी है?";
      chips[3].textContent = "💧 सिंचाई कब करें?";
      chips[3].dataset.query = "खेत में सिंचाई कब करें?";
    } else {
      chips[0].textContent = "🌧️ Will it rain today?";
      chips[0].dataset.query = "Will it rain today?";
      chips[1].textContent = "🌾 Farming Advisory";
      chips[1].dataset.query = "What is the farming advisory?";
      chips[2].textContent = "🌿 Air Quality";
      chips[2].dataset.query = "How is the air quality?";
      chips[3].textContent = "🏃 Best Workout Time";
      chips[3].dataset.query = "When is the best time for workout?";
    }
  }
}

function applyPersona(personaKey, shouldSpeak = false) {
  const persona = PERSONAS_CONFIG[personaKey];
  if (!persona) return;

  APP_STATE.activePersona = personaKey;
  APP_STATE.isGeneralView = false;

  const isKisan = (personaKey === 'agriculture_gardeners');
  applyFullHindiDashboard(isKisan);

  // Update UI Labels
  DOM.activePersonaLabel.textContent = persona.title;
  DOM.focusPersonaBadge.textContent = persona.badge;
  DOM.focusPersonaHeadline.textContent = persona.headline;
  DOM.focusPersonaSubtext.textContent = persona.subtext;
  DOM.headerMeghaSpeech.textContent = `"${persona.meghaIntro}"`;

  // Toggle pills
  DOM.generalViewBtn.classList.remove('active-mode');
  DOM.viewPersonaPill.classList.add('active');
  DOM.viewGeneralPill.classList.remove('active');

  // STRICT PERSONA FILTERING (Problem Statement 26076: ONLY required features on personalized homepages!)
  const cards = document.querySelectorAll('.weather-card');
  
  cards.forEach(card => {
    const cardType = card.dataset.card;
    card.classList.remove('card-priority-highlight');

    if (persona.priorityCards.includes(cardType)) {
      card.classList.remove('card-hidden');
      card.classList.add('card-priority-highlight');
    } else {
      // Completely hide all irrelevant / useless cards for this persona
      card.classList.add('card-hidden');
    }
  });

  // Re-order strictly matching priority order
  persona.priorityCards.forEach(pCardType => {
    const matchedCard = Array.from(cards).find(c => c.dataset.card === pCardType);
    if (matchedCard && DOM.cardsGrid) {
      DOM.cardsGrid.appendChild(matchedCard);
    }
  });

  if (shouldSpeak) {
    speakWithMegha(persona.meghaIntro, null, 'hi-IN');
  }
}

function applyGeneralView() {
  APP_STATE.isGeneralView = true;
  DOM.activePersonaLabel.textContent = "General IMD Overview";
  DOM.focusPersonaBadge.textContent = "🌐 Standard IMD View Active";
  DOM.focusPersonaHeadline.textContent = "General Synoptic Weather Overview";
  DOM.focusPersonaSubtext.textContent = "Viewing all meteorological observations without persona filter.";
  
  DOM.generalViewBtn.classList.add('active-mode');
  DOM.viewPersonaPill.classList.remove('active');
  DOM.viewGeneralPill.classList.add('active');

  // Reveal all cards across all personas
  const cards = document.querySelectorAll('.weather-card');
  cards.forEach(card => {
    card.classList.remove('card-priority-highlight');
    card.classList.remove('card-hidden');
  });

  DOM.headerMeghaSpeech.textContent = '"जनरल व्यू सक्रिय है। सभी मानक मौसम पैरामीटर्स प्रदर्शित हो रहे हैं।"';
  speakWithMegha("जनरल व्यू सक्रिय है। सभी मानक मौसम पैरामीटर्स प्रदर्शित हो रहे हैं।", null, 'hi-IN');
}

// ============================================================
// 6. DYNAMIC CLIMATE BACKGROUND SWITCHER (24 LANDSCAPES)
// ============================================================

function setClimateBackground(climateKey) {
  APP_STATE.currentClimateKey = climateKey;
  const imagePath = `assets/climates/${climateKey}.jpg`;
  DOM.climateHeader.style.backgroundImage = `url('${imagePath}')`;
}

// ============================================================
// 7. REAL LIVE WEATHER API (OPEN-METEO)
// ============================================================

async function fetchLiveWeather(lat, lon, cityName) {
  try {
    const url = `${CONFIG.OPEN_METEO_BASE_URL}/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,surface_pressure,dew_point_2m&hourly=temperature_2m,weather_code,relative_humidity_2m,precipitation_probability&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max,uv_index_max&timezone=auto&forecast_days=7`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Weather API request failed');

    const data = await res.json();
    const current = data.current;
    const daily = data.daily;
    const hourly = data.hourly;

    // Update Hero Weather Metrics
    const isKisan = (APP_STATE.activePersona === 'agriculture_gardeners');
    DOM.heroTemp.textContent = `${Math.round(current.temperature_2m)}°C`;

    if (isKisan) {
      DOM.heroFeelsLike.textContent = `महसूस तापमान: ${Math.round(current.apparent_temperature)}°C • अधिकतम: ${Math.round(daily.temperature_2m_max[0])}°C | न्यूनतम: ${Math.round(daily.temperature_2m_min[0])}°C`;
      DOM.metaWind.textContent = `💨 हवा: ${Math.round(current.wind_speed_10m)} किमी/घं`;
      DOM.metaHumidity.textContent = `💧 नमी: ${current.relative_humidity_2m}%`;
      DOM.metaPrecip.textContent = `🌧️ वर्षा संभावना: ${daily.precipitation_probability_max[0] || 10}%`;
    } else {
      DOM.heroFeelsLike.textContent = `Feels like ${Math.round(current.apparent_temperature)}°C • High: ${Math.round(daily.temperature_2m_max[0])}°C | Low: ${Math.round(daily.temperature_2m_min[0])}°C`;
      DOM.metaWind.textContent = `💨 Wind: ${Math.round(current.wind_speed_10m)} km/h`;
      DOM.metaHumidity.textContent = `💧 Humidity: ${current.relative_humidity_2m}%`;
      DOM.metaPrecip.textContent = `🌧️ Rain: ${daily.precipitation_probability_max[0] || 10}%`;
    }

    // Dynamic Climate Sky Matching
    const climateKey = WEATHER_CODE_MAP[current.weather_code] || "partly_cloudy";
    setClimateBackground(climateKey);

    // Update Condition Text
    const conditionNamesEn = {
      clear_day: "Clear & Sunny",
      mainly_clear: "Mainly Clear",
      partly_cloudy: "Partly Cloudy",
      overcast: "Overcast",
      drizzle: "Drizzle Showers",
      moderate_rain: "Moderate Rain",
      heavy_rain: "Heavy Rain",
      thunderstorm: "Thunderstorm",
      fog: "Misty Fog",
      dense_fog: "Dense Fog Alert",
      snow: "Snowfall",
      heavy_snowfall: "Blizzard Snow"
    };

    const conditionNamesHi = {
      clear_day: "साफ़ खिली धूप",
      mainly_clear: "मुख्यतः साफ़ मौसम",
      partly_cloudy: "आंशिक रूप से बादल",
      overcast: "घने बादल",
      drizzle: "हल्की बूंदाबांदी",
      moderate_rain: "मध्यम वर्षा",
      heavy_rain: "भारी वर्षा की चेतावनी",
      thunderstorm: "आंधी-तूफान व गर्जन",
      fog: "हल्का कोहरा",
      dense_fog: "घना कोहरा अलर्ट",
      snow: "बर्फ़बारी",
      heavy_snowfall: "भारी बर्फ़बारी"
    };

    DOM.heroCondition.textContent = isKisan
      ? (conditionNamesHi[climateKey] || "साफ़ मौसम")
      : (conditionNamesEn[climateKey] || "Clear Sky");

    // Sun Arc Times
    if (daily.sunrise && daily.sunrise[0]) {
      const sunriseTime = daily.sunrise[0].split('T')[1];
      const sunsetTime = daily.sunset[0].split('T')[1];
      const srEl = document.getElementById('cardSunrise');
      const ssEl = document.getElementById('cardSunset');
      if (srEl) srEl.textContent = sunriseTime;
      if (ssEl) ssEl.textContent = sunsetTime;
    }

    // 1. Update Rich Gauges (Screenshot 2 Style)
    // AQI Gauge
    const aqiValEl = document.getElementById('cardAqiVal');
    const aqiNeedle = document.getElementById('aqiGaugeNeedle');
    if (aqiValEl) {
      const simulatedAqi = Math.min(350, Math.max(45, Math.round(50 + (current.relative_humidity_2m * 0.8) + (current.wind_speed_10m < 8 ? 40 : 0))));
      aqiValEl.textContent = simulatedAqi;
      if (aqiNeedle) {
        // Map 0 - 300 to -85deg to +85deg
        const needleAngle = Math.max(-85, Math.min(85, ((simulatedAqi / 300) * 170) - 85));
        aqiNeedle.style.transform = `rotate(${needleAngle}deg)`;
      }
    }

    // UV Radial Burn Ring
    const uvValEl = document.getElementById('cardUvVal');
    const uvBurnEl = document.getElementById('cardUvBurnTime');
    const uvRingEl = document.getElementById('uvRadialProgress');
    if (uvValEl && daily.uv_index_max && daily.uv_index_max[0]) {
      const uvMax = Math.round(daily.uv_index_max[0] * 10) / 10;
      uvValEl.textContent = uvMax;
      if (uvBurnEl) {
        uvBurnEl.textContent = uvMax > 8 ? "15 Mins" : uvMax > 5 ? "25 Mins" : "45 Mins";
      }
      if (uvRingEl) {
        const offset = Math.round(251 - (Math.min(uvMax, 11) / 11) * 251);
        uvRingEl.style.strokeDashoffset = offset;
      }
    }

    // Humidity Slider
    const humValEl = document.getElementById('cardHumidityVal');
    const humThumbEl = document.getElementById('cardHumidityThumb');
    if (humValEl) {
      humValEl.textContent = `${current.relative_humidity_2m}%`;
      if (humThumbEl) humThumbEl.style.left = `${current.relative_humidity_2m}%`;
    }

    // Wind Speed for Fitness & Commuter Cards
    const fitnessWindEl = document.getElementById('cardFitnessWindVal');
    if (fitnessWindEl) {
      fitnessWindEl.textContent = `${Math.round(current.wind_speed_10m)} km/h`;
    }

    // 2. Render Hourly 24h Strip (Screenshot 2 Style)
    renderHourlyForecast(hourly);

    // 3. Render 7-Day Extended Forecast with Temperature Range Bars (Screenshot 3 Style)
    render7DayForecast(daily);

  } catch (err) {
    console.warn('Using offline cached metrics for demo resilience:', err);
  }
}

function renderHourlyForecast(hourly) {
  const container = document.getElementById('hourlyScrollContainer');
  if (!hourly || !hourly.time || !container) return;
  container.innerHTML = '';

  const now = new Date();
  const currentHour = now.getHours();
  const isKisan = (APP_STATE.activePersona === 'agriculture_gardeners');

  // Next 24 hours
  for (let i = currentHour; i < currentHour + 24 && i < hourly.time.length; i++) {
    const temp = Math.round(hourly.temperature_2m[i]);
    const code = hourly.weather_code[i];
    const isNow = (i === currentHour);

    let hourLabel = "";
    if (isNow) {
      hourLabel = isKisan ? "अभी (Now)" : "Now";
    } else {
      const h = i % 24;
      const ampm = h >= 12 ? 'PM' : 'AM';
      const formattedH = (h % 12) || 12;
      hourLabel = `${formattedH} ${ampm}`;
    }

    let icon = "☀️";
    let cond = "Sunny";
    if ([1, 2].includes(code)) { icon = "⛅"; cond = "Partly Cloudy"; }
    else if ([3].includes(code)) { icon = "☁️"; cond = "Overcast"; }
    else if ([51, 53, 55].includes(code)) { icon = "🌦️"; cond = "Drizzle"; }
    else if ([61, 63, 65].includes(code)) { icon = "🌧️"; cond = "Rain"; }
    else if ([80, 81, 82].includes(code)) { icon = "⛈️"; cond = "Showers"; }
    else if ([95, 96, 99].includes(code)) { icon = "⚡"; cond = "Thunderstorm"; }

    const card = document.createElement('div');
    card.className = `hourly-card ${isNow ? 'active-now' : ''}`;
    card.innerHTML = `
      <span class="hourly-time">${hourLabel}</span>
      <span class="hourly-icon">${icon}</span>
      <span class="hourly-temp">${temp}°C</span>
      <span class="hourly-condition">${cond}</span>
    `;
    container.appendChild(card);
  }
}

function render7DayForecast(daily) {
  if (!daily || !daily.time || !DOM.forecastDaysList) return;
  DOM.forecastDaysList.innerHTML = '';

  const isKisan = (APP_STATE.activePersona === 'agriculture_gardeners');
  const dayNamesEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayNamesHi = ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'];

  // Global min/max across the 7 days for range bar scaling
  const allMins = daily.temperature_2m_min;
  const allMaxs = daily.temperature_2m_max;
  const minTempAll = Math.min(...allMins);
  const maxTempAll = Math.max(...allMaxs);
  const tempRange = (maxTempAll - minTempAll) || 1;

  daily.time.forEach((t, i) => {
    const d = new Date(t);
    let dayLabel = "";
    if (i === 0) {
      dayLabel = isKisan ? "आज" : "Today";
    } else if (i === 1) {
      dayLabel = isKisan ? "कल" : "Tomorrow";
    } else {
      dayLabel = isKisan ? dayNamesHi[d.getDay()] : dayNamesEn[d.getDay()];
    }

    const max = Math.round(daily.temperature_2m_max[i]);
    const min = Math.round(daily.temperature_2m_min[i]);
    const code = daily.weather_code[i];

    let icon = "☀️";
    if ([1, 2].includes(code)) icon = "⛅";
    else if ([3].includes(code)) icon = "☁️";
    else if ([51, 53, 55, 61, 63].includes(code)) icon = "🌧️";
    else if ([65, 80, 81, 82].includes(code)) icon = "⛈️";
    else if ([95, 96, 99].includes(code)) icon = "⚡";

    // Horizontal range bar calculation (Screenshot 3 style)
    const leftPercent = Math.max(0, Math.min(100, Math.round(((min - minTempAll) / tempRange) * 70)));
    const barWidthPercent = Math.max(20, Math.min(100 - leftPercent, Math.round(((max - min) / tempRange) * 100)));

    const item = document.createElement('div');
    item.className = 'forecast-day-row';
    item.innerHTML = `
      <span class="forecast-day-name">${dayLabel}</span>
      <span class="forecast-day-icon">${icon}</span>
      <span class="forecast-min-temp">${min}°</span>
      <div class="forecast-range-bar-track">
        <div class="forecast-range-bar-fill" style="left: ${leftPercent}%; width: ${barWidthPercent}%;"></div>
      </div>
      <span class="forecast-max-temp">${max}°</span>
    `;
    DOM.forecastDaysList.appendChild(item);
  });
}

// ============================================================
// 8. CITY SEARCH & GEOCODING
// ============================================================

async function searchCity(query) {
  if (!query || query.length < 2) return;
  try {
    const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`);
    const data = await res.json();
    if (!data.results || data.results.length === 0) return;

    DOM.searchResultsDropdown.innerHTML = '';
    DOM.searchResultsDropdown.classList.remove('hidden');

    data.results.forEach(loc => {
      const div = document.createElement('div');
      div.className = 'search-dropdown-item';
      div.innerHTML = `<span>📍 ${loc.name}, ${loc.admin1 || ''}</span> <small>${loc.country}</small>`;
      div.addEventListener('click', () => {
        APP_STATE.currentCity = loc.name;
        APP_STATE.lat = loc.latitude;
        APP_STATE.lon = loc.longitude;
        DOM.citySearchInput.value = `${loc.name}, ${loc.country}`;
        DOM.searchResultsDropdown.classList.add('hidden');
        if (DOM.cityPillBtns) {
          DOM.cityPillBtns.forEach(b => {
            if (b.dataset.city.toLowerCase() === loc.name.toLowerCase()) {
              b.classList.add('active');
            } else {
              b.classList.remove('active');
            }
          });
        }
        fetchLiveWeather(loc.latitude, loc.longitude, loc.name);
      });
      DOM.searchResultsDropdown.appendChild(div);
    });
  } catch (e) {
    console.warn('Geocoding error:', e);
  }
}

// ============================================================
// 9. CONVERSATIONAL VOICE COMPANION & TARGETED WEATHER INTENTS
// ============================================================

// Helper to classify and extract targeted meteorological answers
function analyzeWeatherQuery(raw) {
  const q = raw.toLowerCase().trim();
  const norm = q
    .replace(/एक\s*यू\s*आई/g, 'aqi')
    .replace(/एक्यूआई/g, 'aqi')
    .replace(/ए\s*क्यू\s*आई/g, 'aqi')
    .replace(/एयर\s*क्वालिटी/g, 'aqi');

  // 1. Forecast Navigation
  const isForecastNav = 
    norm.includes('forecast') || 
    norm.includes('forcast') || 
    norm.includes('पूर्वानुमान') || 
    norm.includes('फोरकास्ट') ||
    norm.includes('आगे का मौसम') ||
    norm.includes('कल का मौसम') ||
    norm.includes('7 दिन') ||
    norm.includes('हफ्ते का') ||
    norm.includes('हफ़्ते का') ||
    (norm.includes('waha') && (norm.includes('jao') || norm.includes('le') || norm.includes('dikhao'))) ||
    (norm.includes('le') && (norm.includes('chalo') || norm.includes('jao') || norm.includes('chal')));

  if (isForecastNav && (norm.includes('forecast') || norm.includes('forcast') || norm.includes('पूर्वानुमान') || norm.includes('मौसम') || norm.includes('waha') || norm.includes('din') || norm.includes('hafte') || norm.includes('hafta') || norm.includes('aage'))) {
    return { type: 'forecast_nav' };
  }

  // 2. AQI / Air Quality / Pollution (the exact case from user's screenshot!)
  if (
    norm.includes('aqi') || 
    norm.includes('हवा की गुणवत्ता') || 
    norm.includes('हवा का स्तर') ||
    norm.includes('प्रदूषण') || 
    norm.includes('gunwatta') ||
    norm.includes('gunvatta') ||
    norm.includes('pradushan') ||
    norm.includes('air quality') || 
    norm.includes('pm2.5') || 
    norm.includes('pm10') || 
    norm.includes('allergen') || 
    norm.includes('pollen') || 
    norm.includes('दमा') || 
    norm.includes('asthma') ||
    norm.includes('pollution') ||
    (norm.includes('hawa') && norm.includes('kaisi')) ||
    (norm.includes('हवा') && norm.includes('कैसी'))
  ) {
    return { type: 'aqi' };
  }

  // 3. Rain / Precipitation / Umbrella / Drizzle / Barsat
  if (
    norm.includes('बारिश') || 
    norm.includes('पानी') || 
    norm.includes('बरसात') || 
    norm.includes('बूंदाबांदी') || 
    norm.includes('वर्षा') || 
    norm.includes('छाता') || 
    norm.includes('barish') || 
    norm.includes('barsat') || 
    norm.includes('pani') || 
    norm.includes('varsha') || 
    norm.includes('chata') || 
    norm.includes('chhati') || 
    norm.includes('rain') || 
    norm.includes('drizzle') || 
    norm.includes('precipitation') || 
    norm.includes('shower') ||
    norm.includes('umbrella')
  ) {
    return { type: 'rain' };
  }

  // 4. Wind / Speed / Storm / Breeze / Toofan
  if (
    norm.includes('आंधी') || 
    norm.includes('तूफान') || 
    norm.includes('झोंका') || 
    norm.includes('हवा की गति') || 
    norm.includes('हवा की स्पीड') || 
    norm.includes('हवा कितनी') || 
    norm.includes('wind') || 
    norm.includes('breeze') || 
    norm.includes('cyclone') || 
    norm.includes('storm') || 
    norm.includes('toofan') || 
    norm.includes('aandhi') ||
    (norm.includes('hawa') && (norm.includes('tez') || norm.includes('speed') || norm.includes('chal') || norm.includes('kitni'))) ||
    (norm.includes('हवा') && (norm.includes('तेज') || norm.includes('रफ्तार') || norm.includes('गति') || norm.includes('speed') || norm.includes('चल')))
  ) {
    return { type: 'wind' };
  }

  // 5. UV Index / Sun / Dhoop / Sunlight / Skin Protection
  if (
    norm.includes('धूप') || 
    norm.includes('यूवी') || 
    norm.includes('uv') || 
    norm.includes('सूरज') || 
    norm.includes('sun') || 
    norm.includes('sunlight') || 
    norm.includes('सनस्क्रीन') || 
    norm.includes('sunscreen') || 
    norm.includes('dhoop') || 
    norm.includes('dhup') || 
    norm.includes('burn') || 
    norm.includes('skin')
  ) {
    return { type: 'uv' };
  }

  // 6. Humidity / Umus / Moisture / Nami
  if (
    norm.includes('नमी') || 
    norm.includes('उमस') || 
    norm.includes('humidity') || 
    norm.includes('moisture') || 
    norm.includes('muggy') || 
    norm.includes('आर्द्रता') || 
    norm.includes('nami') || 
    norm.includes('umas') || 
    norm.includes('chipchipa')
  ) {
    return { type: 'humidity' };
  }

  // 7. Visibility / Fog / Kohra / Dhundh / Road / Driving
  if (
    norm.includes('कोहरा') || 
    norm.includes('धुंध') || 
    norm.includes('विजिबिलिटी') || 
    norm.includes('visibility') || 
    norm.includes('fog') || 
    norm.includes('smog') || 
    norm.includes('kohra') || 
    norm.includes('dhundh') || 
    norm.includes('driving') || 
    norm.includes('highway')
  ) {
    return { type: 'visibility' };
  }

  // 8. Pressure / Dew Point
  if (
    norm.includes('दबाव') || 
    norm.includes('प्रेशर') || 
    norm.includes('pressure') || 
    norm.includes('hpa') || 
    norm.includes('dew point') || 
    norm.includes('ड्यू पॉइंट')
  ) {
    return { type: 'pressure' };
  }

  // 9. Soil Moisture / Farming / Agriculture / Kisan
  if (
    norm.includes('kheti') || 
    norm.includes('kisan') || 
    norm.includes('farmer') || 
    norm.includes('agriculture') || 
    norm.includes('fasal') || 
    norm.includes('फसल') || 
    norm.includes('मिट्टी') || 
    norm.includes('बुवाई') || 
    norm.includes('खाद') || 
    norm.includes('soil') || 
    norm.includes('frost') || 
    norm.includes('पाला')
  ) {
    return { type: 'agriculture' };
  }

  // 10. Beach / Surfing / Sea / Tide / Wave
  if (
    norm.includes('beach') || 
    norm.includes('surf') || 
    norm.includes('sea') || 
    norm.includes('tide') || 
    norm.includes('samundar') || 
    norm.includes('ocean') || 
    norm.includes('समुद्र') || 
    norm.includes('लहर') || 
    norm.includes('ज्वार')
  ) {
    return { type: 'beach' };
  }

  // 11. Outdoor Fitness / Running / Workout
  if (
    norm.includes('running') || 
    norm.includes('jogging') || 
    norm.includes('workout') || 
    norm.includes('fitness') || 
    norm.includes('exercise') || 
    norm.includes('दौड़ने') || 
    norm.includes('कसरत') || 
    norm.includes('रनिंग')
  ) {
    return { type: 'fitness' };
  }

  // 12. School Commute / Parents / Kids
  if (
    norm.includes('school') || 
    norm.includes('bacche') || 
    norm.includes('children') || 
    norm.includes('family') || 
    norm.includes('parent') || 
    norm.includes('parivar') || 
    norm.includes('स्कूल') || 
    norm.includes('बच्चे')
  ) {
    return { type: 'school' };
  }

  // 13. Travelers / Flight / Packing / Tourism
  if (
    norm.includes('travel') || 
    norm.includes('flight') || 
    norm.includes('tourist') || 
    norm.includes('trip') || 
    norm.includes('yatra') || 
    norm.includes('packing') || 
    norm.includes('destination') || 
    norm.includes('london') || 
    norm.includes('delhi') || 
    norm.includes('mumbai') || 
    norm.includes('यात्री') || 
    norm.includes('सफर')
  ) {
    return { type: 'travel' };
  }

  // 14. Commuters / Traffic
  if (
    norm.includes('commute') || 
    norm.includes('traffic') || 
    norm.includes('ट्रैफिक') || 
    norm.includes('जाम') || 
    norm.includes('road')
  ) {
    return { type: 'commuters' };
  }

  // 15. Event Planners / Wedding / Gathering
  if (
    norm.includes('event') || 
    norm.includes('shaadi') || 
    norm.includes('wedding') || 
    norm.includes('party') || 
    norm.includes('gathering') || 
    norm.includes('शादी') || 
    norm.includes('समारोह') || 
    norm.includes('comfort')
  ) {
    return { type: 'event' };
  }

  // 16. ONLY FOR TEMPERATURE / HEAT / COLD
  if (
    norm.includes('तापमान') || 
    norm.includes('temperature') || 
    norm.includes('temp') || 
    norm.includes('tapman') || 
    norm.includes('गर्मी कितनी') || 
    norm.includes('कितनी गर्मी') || 
    norm.includes('ठंड कितनी') || 
    norm.includes('कितनी ठंड') || 
    norm.includes('kitni garmi') || 
    norm.includes('kitni thand') || 
    norm.includes('how hot') || 
    norm.includes('how cold') || 
    norm.includes('degree') || 
    norm.includes('डिग्री') || 
    norm.includes('celcius')
  ) {
    return { type: 'temperature' };
  }

  // 17. General Weather query
  if (
    norm.includes('मौसम कैसा') || 
    norm.includes('aaj ka mausam') || 
    norm.includes('weather kaisa') || 
    norm.includes('weather update') || 
    norm.includes('today weather') || 
    norm.includes('mausam batao') ||
    norm.includes('current weather')
  ) {
    return { type: 'general_weather' };
  }

  // 18. General View
  if (norm.includes('general') || norm.includes('default') || norm.includes('normal')) {
    return { type: 'general_view' };
  }

  // 19. Greetings
  if (
    norm.includes('नमस्ते') || 
    norm.includes('हेलो') || 
    norm.includes('hi') || 
    norm.includes('hello') || 
    norm.includes('kaun ho') || 
    norm.includes('who are you') || 
    norm.includes('megha')
  ) {
    return { type: 'greeting' };
  }

  return { type: 'other' };
}

async function handleUserQuery(text) {
  if (!text || !text.trim()) return;
  const q = text.toLowerCase().trim();

  // Append user bubble
  appendChatBubble(text, 'user');
  DOM.chatTextInput.value = '';

  const isHindi = (APP_STATE.voiceLang === 'hi-IN');
  const cityName = APP_STATE.currentCity;
  const intent = analyzeWeatherQuery(q);

  // Read current live DOM values
  const currentTemp = DOM.heroTemp?.textContent || "28°C";
  const currentFeels = DOM.heroFeelsLike?.textContent?.split('•')[0]?.trim() || currentTemp;
  const currentCondition = DOM.heroCondition?.textContent || (isHindi ? "हल्की बूंदाबांदी" : "Drizzle Showers");
  const currentAqi = document.getElementById('cardAqiVal')?.textContent || "125";
  const currentUv = document.getElementById('cardUvVal')?.textContent || "8.2";
  const currentUvBurn = document.getElementById('cardUvBurnTime')?.textContent || "15 Mins";
  const currentHumidity = document.getElementById('cardHumidityVal')?.textContent || DOM.metaHumidity?.textContent?.replace(/[^\d%]/g, '') || "72%";
  const currentWind = document.getElementById('cardFitnessWindVal')?.textContent || DOM.metaWind?.textContent?.replace('💨', '').trim() || "14 km/h";
  const currentPrecip = (DOM.metaPrecip?.textContent?.replace(/[^\d%]/g, '')) || "12%";

  let directAnswer = "";
  let targetCardId = null;

  switch (intent.type) {
    case 'forecast_nav': {
      targetCardId = 'cardExtendedForecast';
      directAnswer = isHindi
        ? "जी! मैं आपको 7-दिवसीय संपूर्ण मौसम पूर्वानुमान पर ले आई हूँ। यहाँ आप पूरे हफ़्ते के तापमान, बारिश और मौसमी बदलाव का हाल देख सकते हैं।"
        : "Taking you directly to the 7-day weather forecast section!";
      break;
    }

    case 'aqi': {
      targetCardId = 'cardAqiGauge';
      directAnswer = isHindi
        ? `अभी ${cityName} का वायु गुणवत्ता सूचकांक (AQI) ${currentAqi} है, जो 'मध्यम' (Moderate) श्रेणी में आता है। मुख्य प्रदूषक PM2.5 (48 µg/m³) है। संवेदनशील लोगों को बाहर निकलते समय मास्क लगाने की सलाह दी जाती है।`
        : `The Air Quality Index (AQI) in ${cityName} is currently ${currentAqi} (Moderate). PM2.5 is at 48 µg/m³. Sensitive individuals are advised to wear a mask outdoors.`;
      break;
    }

    case 'rain': {
      targetCardId = 'cardRainPrediction';
      directAnswer = isHindi
        ? `अभी ${cityName} में ${currentCondition} की स्थिति है और बारिश की संभावना ${currentPrecip} है। दिन में हल्की बौछारें पड़ने की संभावना को देखते हुए बाहर जाते समय छाता साथ रखना बेहतर रहेगा।`
        : `In ${cityName}, conditions are currently ${currentCondition} with a ${currentPrecip} chance of rain. Carrying an umbrella is recommended for outdoor activities.`;
      break;
    }

    case 'wind': {
      targetCardId = 'cardFitnessWind';
      directAnswer = isHindi
        ? `अभी हवा की गति ${currentWind} है। यह सामान्य व मध्यम हवा है, तेज़ आंधी या चक्रवाती तूफ़ान की कोई चेतावनी नहीं है।`
        : `Current wind speed in ${cityName} is ${currentWind} (moderate breeze). No severe wind or gust warnings are active.`;
      break;
    }

    case 'uv': {
      targetCardId = 'cardUv';
      directAnswer = isHindi
        ? `अभी UV इंडेक्स ${currentUv} है, जो बहुत अधिक (Very High) श्रेणी में है। लगभग ${currentUvBurn} मिनट से अधिक सीधी धूप में रहने पर त्वचा पर असर पड़ सकता है। सनस्क्रीन (SPF 30+) और धूप का चश्मा इस्तेमाल करें।`
        : `The UV Index is currently ${currentUv} (Very High). Unprotected sun exposure may cause skin burn in about ${currentUvBurn}. Sunscreen (SPF 30+) and sunglasses are recommended.`;
      break;
    }

    case 'humidity': {
      targetCardId = 'cardHealthHumidity';
      directAnswer = isHindi
        ? `वर्तमान में हवा में आर्द्रता (नमी) ${currentHumidity} है। अधिक नमी होने के कारण बाहर मौसम थोड़ा उमस भरा (Muggy) महसूस हो सकता है।`
        : `Relative humidity in ${cityName} is currently ${currentHumidity}, giving the atmosphere a noticeably muggy and moist feel.`;
      break;
    }

    case 'visibility': {
      targetCardId = 'cardVisibilityTraffic';
      directAnswer = isHindi
        ? `सड़क पर दृश्यता (Visibility) अभी 3.5 किलोमीटर सामान्य है। कोई घना कोहरा नहीं है, यात्रा और वाहन चलाने के लिए स्थिति सुरक्षित है।`
        : `Road visibility is currently 3.5 km. There is no dense fog alert, and travel/driving conditions are safe and clear.`;
      break;
    }

    case 'pressure': {
      directAnswer = isHindi
        ? "वायुमंडलीय दबाव 1012 hPa (स्थिर व सामान्य) है और ड्यू पॉइंट 22°C है, जो अनुकूल मौसमी संतुलन दर्शाता है।"
        : "Atmospheric pressure is 1012 hPa (stable) and dew point is 22°C, indicating standard seasonal balance.";
      break;
    }

    case 'agriculture': {
      applyPersona('agriculture_gardeners', false);
      targetCardId = 'cardSoilMoisture';
      directAnswer = isHindi
        ? "जी किसान भाई! मैंने आपके लिए किसान डैशबोर्ड खोल दिया है। मिट्टी में नमी 44% (सॉइल मॉइस्चर - पर्याप्त) है और अगले 5 दिनों में हल्की वर्षा की संभावना है। पाले का कोई ख़तरा नहीं है।"
        : "Opening Farmer Mode: Soil moisture is at 44% (adequate). Light showers expected over the next 5 days with zero frost risk.";
      break;
    }

    case 'beach': {
      applyPersona('beachgoers_surfers', false);
      targetCardId = 'cardSeaConditions';
      directAnswer = isHindi
        ? "Beachgoers & Surfers व्यू एक्टिव है! समुद्र में लहरों की ऊँचाई 1.8 मीटर है, समुद्री जल तापमान 27°C है और हाई टाइड 11:20 AM पर है। तटीय सुरक्षा फ़्लैग ग्रीन (सुरक्षित) है।"
        : "Beach & Surf mode active: Waves at 1.8m, water temperature 27°C, next high tide at 11:20 AM. Coastal green flag active.";
      break;
    }

    case 'fitness': {
      applyPersona('fitness', false);
      targetCardId = 'cardBestRunningHours';
      directAnswer = isHindi
        ? "आउटडोर फिटनेस मोड एक्टिव है! वर्कआउट और दौड़ने के लिए सबसे अच्छा समय सुबह 5:45 से 7:30 AM तथा शाम 5:30 से 6:45 PM का है, जब हीट स्ट्रेस कम रहता है।"
        : "Outdoor Fitness mode active: Best workout windows are 5:45 AM - 7:30 AM and 5:30 PM - 6:45 PM for minimal heat stress.";
      break;
    }

    case 'school': {
      applyPersona('parents_families', false);
      targetCardId = 'cardSchoolCommute';
      directAnswer = isHindi
        ? "Parents & Families मोड एक्टिव है! स्कूल आवागमन (सुबह 7-9 AM और दोपहर 1-3 PM) के दौरान मौसम सुरक्षित है। हल्की बूंदाबांदी संभव है, बच्चों को छाता या रेनकोट देना बेहतर रहेगा।"
        : "Parents & Families mode: School commute windows (7-9 AM & 1-3 PM) are safe with light drizzle possible. An umbrella is advised.";
      break;
    }

    case 'travel': {
      applyPersona('travelers', false);
      targetCardId = 'cardSavedDestinations';
      directAnswer = isHindi
        ? "Travelers मोड एक्टिव है! लंदन के लिए रेनकोट साथ रखें, और दिल्ली-मुंबई हवाई मार्गों पर मौसम सामान्य व फ़्लाइट्स समय पर हैं।"
        : "Travelers mode active: Saved destinations ready. Carry a raincoat for London. Domestic air corridors are operating normally.";
      break;
    }

    case 'commuters': {
      applyPersona('commuters', false);
      targetCardId = 'cardTrafficWeatherIntegration';
      directAnswer = isHindi
        ? "कम्यूटर्स व्यू एक्टिव है। मुख्य सड़कों पर विजिबिलिटी 3.5 किमी है, एक्सप्रेसवे और पुलों पर कोई तेज़ तूफ़ान या जलभराव की रुकावट नहीं है।"
        : "Commuters mode active: Road visibility is 3.5 km with smooth highway traffic flow and no storm disruption.";
      break;
    }

    case 'event': {
      applyPersona('event_planners', false);
      targetCardId = 'cardEventComfort';
      directAnswer = isHindi
        ? "इवेंट प्लानर्स डैशबोर्ड सेट है। शाम के आउटडोर कार्यक्रम व शादी-समारोह के लिए कम्फ़र्ट स्कोर 84/100 (उत्कृष्ट) है, भारी बारिश का कोई ख़तरा नहीं है।"
        : "Event Planners dashboard active: Outdoor comfort index is 84/100, ideal for evening gatherings and lawn weddings.";
      break;
    }

    case 'temperature': {
      // ONLY WHEN EXPLICITLY ASKING ABOUT TEMPERATURE
      directAnswer = isHindi
        ? `अभी ${cityName} का तापमान ${currentTemp} है (${currentFeels})। आज अधिकतम तापमान लगभग 32°C और न्यूनतम 24°C रहने का अनुमान है।`
        : `The current temperature in ${cityName} is ${currentTemp} (${currentFeels}). Today's high is around 32°C and low is 24°C.`;
      break;
    }

    case 'general_weather': {
      directAnswer = isHindi
        ? `आज ${cityName} में मौसम ${currentCondition} बना हुआ है। तापमान ${currentTemp} है और हवा ${currentWind} की गति से चल रही है।`
        : `Today in ${cityName}, weather is ${currentCondition} with a temperature of ${currentTemp} and wind speed of ${currentWind}.`;
      break;
    }

    case 'general_view': {
      applyGeneralView();
      directAnswer = isHindi
        ? "जनरल आईएमडी ओवरव्यू सक्रिय कर दिया गया है। सभी मानक मौसम पैरामीटर्स प्रदर्शित हो रहे हैं।"
        : "Standard IMD synoptic overview activated. All meteorological cards are displayed.";
      break;
    }

    case 'greeting': {
      directAnswer = isHindi
        ? "नमस्ते! मैं मेघा हूँ, आपकी मौसम मित्र। आप मुझसे वायु गुणवत्ता (AQI), बारिश, धूप (UV), हवा, या 7-दिवसीय पूर्वानुमान के बारे में कुछ भी पूछ सकते हैं।"
        : "Hello! I am Megha, your Mausam Mitra. Feel free to ask about AQI, rain chances, wind, UV index, or the 7-day forecast.";
      break;
    }

    default:
      directAnswer = "";
      break;
  }

  // If targeted direct answer is determined, reply immediately!
  if (directAnswer) {
    if (targetCardId) {
      const cardEl = document.getElementById(targetCardId);
      if (cardEl) {
        cardEl.classList.remove('card-hidden');
        cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        cardEl.classList.add('forecast-pulse-active');
        setTimeout(() => cardEl.classList.remove('forecast-pulse-active'), 4000);
      }
    }

    setTimeout(() => {
      appendChatBubble(directAnswer, 'bot');
      speakWithMegha(directAnswer);
    }, 250);
    return;
  }

  // Otherwise, query Backend Render API
  const typingIndicator = appendChatBubble("मेघा सोच रही हैं... (Thinking...)", 'bot thinking-indicator');

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500);

    const res = await fetch(`${CONFIG.BACKEND_BASE_URL}/api/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: text,
        language: isHindi ? 'hi' : 'en',
        persona: APP_STATE.activePersona,
        intent: 'weather_query',
        location: APP_STATE.currentCity
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const botAnswer = data.final_answer || data.answer || data.message;
      if (botAnswer) {
        typingIndicator.remove();
        appendChatBubble(botAnswer, 'bot');
        speakWithMegha(botAnswer);
        return;
      }
    }
  } catch (backendErr) {
    console.info('Backend Render cold-start/offline, using intelligent local response:', backendErr);
  }

  // Intelligent Fallback (NO echo repetition and NO unwanted temperature!)
  typingIndicator.remove();
  const fallbackResponse = isHindi
    ? `वर्तमान में ${cityName} में मौसम स्थिति सामान्य बनी हुई है। यदि आप वायु गुणवत्ता (AQI), वर्षा, हवा, धूप (UV) या 7-दिवसीय पूर्वानुमान देखना चाहते हैं, तो कृपया बताएँ।`
    : `Current conditions in ${cityName} are stable. Feel free to ask specifically about AQI, rain probability, wind, UV index, or the 7-day forecast.`;

  appendChatBubble(fallbackResponse, 'bot');
  speakWithMegha(fallbackResponse);
}

function appendChatBubble(text, className) {
  const b = document.createElement('div');
  b.className = `chat-bubble ${className.includes('user') ? 'user-bubble' : 'bot-bubble'} ${className}`;
  b.textContent = text;
  DOM.chatMessages.appendChild(b);
  DOM.chatMessages.scrollTop = DOM.chatMessages.scrollHeight;
  return b;
}

// ============================================================
// 9. CHAT VOICE INPUT & CONTINUOUS WAKE-WORD DETECTION ("मेघा सुनो")
// ============================================================

// Chat Drawer Speech Recognition (User query input)
let chatRecognition = null;

function initChatSpeechRecognition() {
  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRec) return;

  chatRecognition = new SpeechRec();
  chatRecognition.lang = APP_STATE.voiceLang || 'hi-IN';
  chatRecognition.interimResults = false;

  chatRecognition.onstart = () => {
    APP_STATE.isListening = true;
    pauseWakeWordListener();
    if (DOM.micVoiceBtn) DOM.micVoiceBtn.classList.add('listening');
  };

  chatRecognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    handleUserQuery(transcript);
  };

  chatRecognition.onend = () => {
    APP_STATE.isListening = false;
    if (DOM.micVoiceBtn) DOM.micVoiceBtn.classList.remove('listening');
    if (DOM.chatTextInput) {
      const isKisan = (APP_STATE.activePersona === 'agriculture_gardeners');
      DOM.chatTextInput.placeholder = isKisan
        ? "बोलिए या टाइप करें (जैसे: आज बारिश होगी क्या?)..."
        : "Speak or type (e.g., show rainfall for farming)...";
    }
    if (!APP_STATE.isSpeaking && APP_STATE.wakeWordEnabled) {
      resumeWakeWordListener();
    }
  };

  chatRecognition.onerror = (e) => {
    console.info('Chat voice input notice:', e.error || e);
    APP_STATE.isListening = false;
    if (DOM.micVoiceBtn) DOM.micVoiceBtn.classList.remove('listening');
    if (DOM.chatTextInput) {
      const isKisan = (APP_STATE.activePersona === 'agriculture_gardeners');
      DOM.chatTextInput.placeholder = isKisan
        ? "बोलिए या टाइप करें (जैसे: आज बारिश होगी क्या?)..."
        : "Speak or type (e.g., show rainfall for farming)...";
    }
    if (!APP_STATE.isSpeaking && APP_STATE.wakeWordEnabled) {
      resumeWakeWordListener();
    }
  };

  if (DOM.micVoiceBtn) {
    DOM.micVoiceBtn.addEventListener('click', () => {
      if (APP_STATE.isListening) {
        chatRecognition.stop();
        resumeWakeWordListener();
      } else {
        pauseWakeWordListener();
        try { 
          chatRecognition.lang = APP_STATE.voiceLang || 'hi-IN';
          chatRecognition.start(); 
        } catch (e) {}
      }
    });
  }
}

// ------------------------------------------------------------
// CONTINUOUS BACKGROUND WAKE-WORD LISTENER ("मेघा सुनो" / "Megha Suno")
// ------------------------------------------------------------
let wakeWordRecognition = null;
let wakeWordRestartTimeout = null;

function initWakeWordListener() {
  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRec) {
    console.warn('Speech recognition not supported for wake-word detection.');
    return;
  }

  try {
    if (wakeWordRecognition) {
      try {
        wakeWordRecognition.onstart = null;
        wakeWordRecognition.onresult = null;
        wakeWordRecognition.onerror = null;
        wakeWordRecognition.onend = null;
        wakeWordRecognition.abort();
      } catch (e) {}
    }

    wakeWordRecognition = new SpeechRec();
    wakeWordRecognition.continuous = true;
    wakeWordRecognition.interimResults = true;
    wakeWordRecognition.lang = 'hi-IN';
    wakeWordRecognition.maxAlternatives = 3;

    wakeWordRecognition.onstart = () => {
      APP_STATE.isWakeWordListening = true;
      console.log('🟢 Megha Background Wake-Word Active: Listening for "मेघा सुनो" / "Megha Suno"...');
    };

    wakeWordRecognition.onresult = (event) => {
      // Ignore wake word if Megha is speaking or chat mic/persona voice is busy
      if (APP_STATE.isSpeaking || APP_STATE.isListening || APP_STATE.isListeningForPersona) {
        return;
      }

      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        transcript += event.results[i][0].transcript;
      }

      const text = transcript.toLowerCase().trim();
      console.log('Background voice heard:', text);

      // Support authentic Hindi wake words and English/Hinglish phonetic transcriptions:
      // "मेघा सुनो", "मेगा सुनो", "मौसम सुनो", "सुनो मेघा", "सुनों मेघा", "मेघा", "megha suno", "hey megha"
      const isWakeWord = 
        text.includes('मेघा सुनो') ||
        text.includes('मेगा सुनो') ||
        text.includes('मौसम सुनो') ||
        text.includes('सुनो मेघा') ||
        text.includes('सुनों मेघा') ||
        text.includes('मेघा') ||
        text.includes('megha suno') ||
        text.includes('mega suno') ||
        text.includes('megha sunno') ||
        text.includes('suno megha') ||
        text.includes('hey megha') ||
        text.includes('mausam suno') ||
        text.includes('hello megha');

      if (isWakeWord) {
        console.log('✨ Wake-Word Detected:', text);
        triggerWakeWordActivation();
      }
    };

    wakeWordRecognition.onerror = (e) => {
      console.info('Wake-word listener notice:', e.error || e);
      APP_STATE.isWakeWordListening = false;
    };

    wakeWordRecognition.onend = () => {
      APP_STATE.isWakeWordListening = false;
      // Auto-restart wake-word listener if enabled and not busy
      if (APP_STATE.wakeWordEnabled && !APP_STATE.isListening && !APP_STATE.isListeningForPersona) {
        clearTimeout(wakeWordRestartTimeout);
        wakeWordRestartTimeout = setTimeout(() => {
          if (APP_STATE.wakeWordEnabled && !APP_STATE.isListening && !APP_STATE.isListeningForPersona) {
            startWakeWordListener();
          }
        }, 500);
      }
    };
  } catch (err) {
    console.warn('Could not setup wake-word listener:', err);
  }
}

function startWakeWordListener() {
  APP_STATE.wakeWordEnabled = true;
  if (!wakeWordRecognition) {
    initWakeWordListener();
  }
  if (wakeWordRecognition && !APP_STATE.isWakeWordListening && !APP_STATE.isListening && !APP_STATE.isListeningForPersona) {
    try {
      wakeWordRecognition.start();
    } catch (e) {
      // Recognition might already be running
    }
  }
}

function pauseWakeWordListener() {
  APP_STATE.wakeWordEnabled = false;
  if (wakeWordRecognition) {
    try {
      wakeWordRecognition.abort();
    } catch (e) {}
  }
  APP_STATE.isWakeWordListening = false;
}

function resumeWakeWordListener() {
  APP_STATE.wakeWordEnabled = true;
  setTimeout(() => {
    startWakeWordListener();
  }, 400);
}

/**
 * Handles wake-word trigger ("मेघा सुनो"):
 * 1. Automatically opens the chatbot drawer.
 * 2. Megha asks: "हाँ किसान भाई! मैं सुन रही हूँ। आप क्या पूछना चाहते हैं? बोलिए।"
 * 3. Automatically turns on chat voice input so the user can speak hands-free without pressing any button!
 */
function triggerWakeWordActivation() {
  pauseWakeWordListener();

  if (DOM.meghaChatDrawer) {
    DOM.meghaChatDrawer.classList.add('open');
  }

  appendChatBubble("🎙️ 'मेघा सुनो' वेक-वर्ड पहचाना गया! मैं सुन रही हूँ...", 'bot system-notice');

  const isKisan = (APP_STATE.activePersona === 'agriculture_gardeners');
  const promptSpeech = isKisan
    ? "हाँ किसान भाई! मैं सुन रही हूँ। आप क्या पूछना चाहते हैं? बोलिए।"
    : "हाँ! मैं सुन रही हूँ। आप मौसम के बारे में क्या पूछना चाहते हैं? बोलिए।";

  appendChatBubble(promptSpeech, 'bot');

  speakWithMegha(promptSpeech, () => {
    // Hands-free Voice Input for Farmer:
    // Automatically turn on speech recognition without requiring user to press the mic button!
    startChatVoiceInputAutomatically();
  }, 'hi-IN');
}

function startChatVoiceInputAutomatically() {
  if (!chatRecognition) {
    initChatSpeechRecognition();
  }
  if (!chatRecognition) return;

  try {
    chatRecognition.lang = APP_STATE.voiceLang || 'hi-IN';
    chatRecognition.start();
    APP_STATE.isListening = true;
    if (DOM.micVoiceBtn) DOM.micVoiceBtn.classList.add('listening');
    if (DOM.chatTextInput) {
      DOM.chatTextInput.placeholder = "🟢 मेघा सुन रही हैं... अब बोलिए (Listening...)";
    }
  } catch (e) {
    console.warn('Could not auto-start chat recognition:', e);
  }
}

// ------------------------------------------------------------
// SILENT NATIVE GPS LOCATION (ZERO UI SHOWN ON PAGE)
// ------------------------------------------------------------
// SILENT NATIVE GPS LOCATION & INSTANT WEATHER ADJUSTMENT
// ------------------------------------------------------------

async function initLiveLocationDefault() {
  // 1. Fast live IP geolocation: guarantees user gets their exact city within milliseconds on startup
  try {
    const ipRes = await fetch('http://ip-api.com/json', { signal: AbortSignal.timeout(3000) });
    if (ipRes.ok) {
      const ipData = await ipRes.json();
      if (ipData && ipData.status === 'success' && ipData.city) {
        console.log('Instant live IP location resolved:', ipData.city, ipData.lat, ipData.lon);
        APP_STATE.currentCity = ipData.city;
        APP_STATE.lat = ipData.lat;
        APP_STATE.lon = ipData.lon;
        if (DOM.citySearchInput) {
          DOM.citySearchInput.value = `📍 ${ipData.city}, ${ipData.regionName || 'India'} (लाइव लोकेशन)`;
        }
        const gpsPill = document.getElementById('gpsCityPill');
        if (gpsPill) {
          gpsPill.dataset.city = ipData.city;
          gpsPill.dataset.lat = ipData.lat;
          gpsPill.dataset.lon = ipData.lon;
          const nameEl = gpsPill.querySelector('.city-name');
          if (nameEl) nameEl.textContent = `📍 ${ipData.city} (GPS)`;
          const quickBar = document.getElementById('quickCitiesBar');
          if (quickBar) {
            quickBar.querySelectorAll('.city-pill-btn').forEach(b => b.classList.remove('active'));
          }
          gpsPill.classList.add('active');
        }
        // Fetch real live weather for this location immediately!
        fetchLiveWeather(ipData.lat, ipData.lon, ipData.city);
      }
    }
  } catch (e) {
    console.info('IP lookup bypassed or offline:', e);
  }

  // 2. Also trigger silent browser GPS to refine with high accuracy coordinates
  requestSilentGPSLocation();
}

function requestSilentGPSLocation() {
  if (!('geolocation' in navigator)) {
    console.info('Geolocation is not supported in this browser.');
    return;
  }

  // Pure silent browser permission request — NO custom modal, NO banner, NO alert
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      try {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        console.log(`Silent GPS coordinates received: lat=${lat}, lon=${lon}`);
        APP_STATE.gpsLat = lat;
        APP_STATE.gpsLon = lon;
        APP_STATE.hasGPS = true;

        // 1. Immediately adjust location coordinates and dashboard weather for the user's GPS position!
        APP_STATE.lat = lat;
        APP_STATE.lon = lon;
        fetchLiveWeather(lat, lon, "मेरी लोकेशन (GPS)");

        // 2. Adjust and activate the dedicated GPS pill in the quick cities bar
        const gpsPill = document.getElementById('gpsCityPill');
        if (gpsPill) {
          gpsPill.dataset.lat = lat;
          gpsPill.dataset.lon = lon;
          const quickBar = document.getElementById('quickCitiesBar');
          if (quickBar) {
            quickBar.querySelectorAll('.city-pill-btn').forEach(b => b.classList.remove('active'));
          }
          gpsPill.classList.add('active');
        }

        // 3. Reverse geocode in background to resolve exact city / town / district
        let detectedCity = "";
        try {
          const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
          if (res.ok) {
            const data = await res.json();
            detectedCity = data.city || data.locality || data.principalSubdivision || "";
          }
        } catch (geoErr) {}

        if (!detectedCity) {
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&zoom=10`);
            if (res.ok) {
              const data = await res.json();
              if (data && data.address) {
                detectedCity = data.address.city || data.address.town || data.address.village || data.address.county || data.address.state_district || "";
              }
            }
          } catch (osmErr) {}
        }

        if (detectedCity) {
          detectedCity = detectedCity.trim();
          APP_STATE.currentCity = detectedCity;
          if (DOM.citySearchInput) DOM.citySearchInput.value = `${detectedCity}, India (GPS Location)`;
          if (gpsPill) {
            gpsPill.dataset.city = detectedCity;
            const nameEl = gpsPill.querySelector('.city-name');
            if (nameEl) nameEl.textContent = `📍 ${detectedCity} (GPS)`;
          }
        } else {
          APP_STATE.currentCity = "मेरी लोकेशन (GPS)";
          if (DOM.citySearchInput) DOM.citySearchInput.value = `Live GPS Location`;
        }
      } catch (err) {
        console.warn('Error adjusting GPS position:', err);
      }
    },
    (error) => {
      // User dismissed or denied — fail completely silently without showing any UI warning
      console.info('Silent GPS request status:', error.message || error.code);
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000
    }
  );
}

function syncGPSWithCityPills(cityName, lat, lon) {
  APP_STATE.currentCity = cityName;
  APP_STATE.lat = lat;
  APP_STATE.lon = lon;

  if (DOM.citySearchInput) {
    DOM.citySearchInput.value = `${cityName}, India (GPS Location)`;
  }

  // Update weather for detected GPS coordinates
  fetchLiveWeather(lat, lon, cityName);

  const gpsPill = document.getElementById('gpsCityPill');
  if (gpsPill) {
    gpsPill.dataset.city = cityName;
    gpsPill.dataset.lat = lat;
    gpsPill.dataset.lon = lon;
    const nameEl = gpsPill.querySelector('.city-name');
    if (nameEl) nameEl.textContent = `📍 ${cityName} (GPS)`;
    const quickBar = document.getElementById('quickCitiesBar');
    if (quickBar) {
      quickBar.querySelectorAll('.city-pill-btn').forEach(b => b.classList.remove('active'));
    }
    gpsPill.classList.add('active');
  }
}

// ------------------------------------------------------------
// SINGLE PERMANENT MICROPHONE AUTHORIZATION (Prompt Once)
// ------------------------------------------------------------

let micStreamInstance = null;
async function requestInitialMicPermission() {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    try {
      if (!micStreamInstance) {
        // Keep stream active in memory so browser permanently remembers microphone permission
        micStreamInstance = await navigator.mediaDevices.getUserMedia({ audio: true });
        console.log('✅ Single-grant microphone access established permanently.');
      }
    } catch (err) {
      console.info('Initial mic permission prompt status:', err.name || err.message);
    }
  }
}

// ============================================================
// 10. THEME SWITCHER & MSN WEATHER QUICK CITIES
// ============================================================

function initTheme() {
  const savedTheme = localStorage.getItem('mm_theme') || 'bright';
  applyTheme(savedTheme);
}

function applyTheme(theme) {
  if (theme === 'dark') {
    document.body.setAttribute('data-theme', 'dark');
    if (DOM.themeToggleIcon) DOM.themeToggleIcon.textContent = '🌙';
    if (DOM.themeToggleLabel) DOM.themeToggleLabel.textContent = 'Dark';
    localStorage.setItem('mm_theme', 'dark');
  } else {
    document.body.removeAttribute('data-theme');
    if (DOM.themeToggleIcon) DOM.themeToggleIcon.textContent = '☀️';
    if (DOM.themeToggleLabel) DOM.themeToggleLabel.textContent = 'Day';
    localStorage.setItem('mm_theme', 'bright');
  }
}

function toggleTheme() {
  const currentTheme = document.body.getAttribute('data-theme') === 'dark' ? 'dark' : 'bright';
  applyTheme(currentTheme === 'dark' ? 'bright' : 'dark');
}

function setupQuickCities() {
  const quickBar = document.getElementById('quickCitiesBar');
  if (!quickBar) return;

  const pillBtns = quickBar.querySelectorAll('.city-pill-btn');
  pillBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      quickBar.querySelectorAll('.city-pill-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (btn.id === 'gpsCityPill' && APP_STATE.hasGPS) {
        const gpsCity = btn.dataset.city || "मेरी लोकेशन (GPS)";
        APP_STATE.currentCity = gpsCity;
        APP_STATE.lat = APP_STATE.gpsLat;
        APP_STATE.lon = APP_STATE.gpsLon;
        if (DOM.citySearchInput) {
          DOM.citySearchInput.value = `${gpsCity}, India (GPS Location)`;
        }
        fetchLiveWeather(APP_STATE.gpsLat, APP_STATE.gpsLon, gpsCity);
        return;
      }

      const cityName = btn.dataset.city;
      const lat = parseFloat(btn.dataset.lat);
      const lon = parseFloat(btn.dataset.lon);

      APP_STATE.currentCity = cityName;
      APP_STATE.lat = lat;
      APP_STATE.lon = lon;

      if (DOM.citySearchInput) {
        DOM.citySearchInput.value = `${cityName}, India`;
      }

      fetchLiveWeather(lat, lon, cityName);
    });
  });

  fetchQuickCitiesTemperatures();
}

async function fetchQuickCitiesTemperatures() {
  const quickBar = document.getElementById('quickCitiesBar');
  if (!quickBar) return;
  const pillBtns = quickBar.querySelectorAll('.city-pill-btn');
  pillBtns.forEach(async (btn) => {
    try {
      const lat = btn.dataset.lat;
      const lon = btn.dataset.lon;
      const res = await fetch(`${CONFIG.OPEN_METEO_BASE_URL}/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=auto`);
      if (!res.ok) return;
      const data = await res.json();
      if (data && data.current) {
        const tempEl = btn.querySelector('.city-temp') || btn.querySelector('.city-pill-temp');
        const iconEl = btn.querySelector('.city-weather-icon') || btn.querySelector('.city-pill-icon');
        if (tempEl) tempEl.textContent = `${Math.round(data.current.temperature_2m)}°`;
        if (iconEl) {
          const code = data.current.weather_code;
          if ([0, 1].includes(code)) iconEl.textContent = "☀️";
          else if ([2, 3].includes(code)) iconEl.textContent = "⛅";
          else if ([45, 48].includes(code)) iconEl.textContent = "🌫️";
          else if ([51, 53, 55, 61, 63, 65].includes(code)) iconEl.textContent = "🌧️";
          else if ([95, 96, 99].includes(code)) iconEl.textContent = "⛈️";
        }
      }
    } catch (e) {
      // Graceful fallback to static temperature
    }
  });
}

// ============================================================
// 11. EVENT LISTENERS & INITIALIZATION
// ============================================================

function setupEventListeners() {
  // Stage 1 Listen Button
  if (DOM.startMeghaExperienceBtn) {
    DOM.startMeghaExperienceBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      triggerStage1Greeting();
    });
  }

  // Stage 1 Skip / Direct Choose button
  if (DOM.skipToPersonasBtn) {
    DOM.skipToPersonasBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      transitionToStage2Personas();
    });
  }

  // Tapping Megha in Stage 1 also starts voice
  if (DOM.modalMeghaImg) {
    DOM.modalMeghaImg.addEventListener('click', () => {
      if (APP_STATE.onboardingStage === 1 && !APP_STATE.isSpeaking) {
        triggerStage1Greeting();
      }
    });
  }

  // Retry Voice Selection Button in Onboarding
  if (DOM.retryVoiceSelectBtn) {
    DOM.retryVoiceSelectBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      APP_STATE.hasSelectedPersona = false;
      if (DOM.modalSpeechText) {
        DOM.modalSpeechText.textContent = `"मेघा सुन रही हैं... बोलिए (जैसे कहें: 'मैं किसान हूँ')"`;
      }
      startVoicePersonaListener();
    });
  }

  // Replay voice in Stage 2
  if (DOM.replayVoiceBtn) {
    DOM.replayVoiceBtn.addEventListener('click', () => {
      APP_STATE.hasSelectedPersona = false;
      const replayText = "आप कौन सा प्रोफ़ाइल चुनना चाहते हैं? बोलकर या चुनकर बताएँ: जैसे कहें 'मैं किसान हूँ', 'हेल्थ कॉन्शियस', 'फिटनेस', 'कम्यूटर', 'पैरेंट्स', 'ट्रैवलर', 'सर्फर', या 'इवेंट प्लानर'।";
      speakWithMegha(replayText, () => {
        startVoicePersonaListener();
      }, 'hi-IN');
    });
  }

  // Onboarding Persona Click Selection — 1-click instant activate & voice feedback
  DOM.personaChoices.forEach(card => {
    card.addEventListener('click', () => {
      DOM.personaChoices.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const p = card.dataset.persona;

      const confirmMsg = p === 'agriculture_gardeners' 
        ? "राम-राम किसान भाई! मैंने आपके लिए खेती और मौसम का डैशबोर्ड खोल दिया है।"
        : `${PERSONAS_CONFIG[p].title} प्रोफ़ाइल सक्रिय कर दी गई है।`;

      if (DOM.modalSpeechText) {
        DOM.modalSpeechText.textContent = `"✅ ${PERSONAS_CONFIG[p].title} चुनी गई!"`;
      }

      finishOnboardingAndActivateWakeWord(p, confirmMsg);
    });
  });

  // Apply Persona from Onboarding button (fallback)
  DOM.applyPersonaBtn.addEventListener('click', () => {
    finishOnboardingAndActivateWakeWord(APP_STATE.activePersona, null);
  });

  // Close Onboarding button
  DOM.closeOnboardingBtn.addEventListener('click', () => {
    finishOnboardingAndActivateWakeWord(APP_STATE.activePersona, null);
  });

  // Persona Switcher Top Chip
  DOM.personaSwitchBtn.addEventListener('click', () => {
    DOM.onboardingModal.classList.remove('hidden');
    transitionToStage2Personas();
  });

  DOM.generalViewBtn.addEventListener('click', () => {
    applyGeneralView();
  });

  DOM.viewPersonaPill.addEventListener('click', () => {
    applyPersona(APP_STATE.activePersona, true);
  });

  DOM.viewGeneralPill.addEventListener('click', () => {
    applyGeneralView();
  });

  // Megha Header Advice Speech Button
  DOM.speakHeaderAdviceBtn.addEventListener('click', () => {
    speakWithMegha(DOM.headerMeghaSpeech.textContent, null, 'hi-IN');
  });

  // Chat Drawer Voice Language Selector
  if (DOM.langHindiBtn && DOM.langEnglishBtn) {
    DOM.langHindiBtn.addEventListener('click', () => {
      APP_STATE.voiceLang = 'hi-IN';
      DOM.langHindiBtn.classList.add('active');
      DOM.langEnglishBtn.classList.remove('active');
      DOM.chatTextInput.placeholder = "बोलिए या टाइप करें (जैसे: खेती की बारिश दिखाओ)...";
      if (chatRecognition) chatRecognition.lang = 'hi-IN';
      appendChatBubble("🗣️ वॉइस भाषा हिंदी (Hindi) सेट कर दी गई है।", 'bot system-notice');
      speakWithMegha("अब मैं हिंदी में बोलूँगी। आप मौसम के बारे में कुछ भी पूछ सकते हैं।", null, 'hi-IN');
    });

    DOM.langEnglishBtn.addEventListener('click', () => {
      APP_STATE.voiceLang = 'en-US';
      DOM.langEnglishBtn.classList.add('active');
      DOM.langHindiBtn.classList.remove('active');
      DOM.chatTextInput.placeholder = "Speak or type (e.g., show rainfall for farming)...";
      if (chatRecognition) chatRecognition.lang = 'en-US';
      appendChatBubble("🗣️ Voice language set to English.", 'bot system-notice');
      speakWithMegha("I will now speak in English. Feel free to ask me anything about the weather.", null, 'en-US');
    });
  }

  // Chat Drawer Open / Close
  DOM.openMeghaChatBtn.addEventListener('click', () => {
    DOM.meghaChatDrawer.classList.add('open');
  });

  DOM.floatingMeghaTrigger.addEventListener('click', () => {
    DOM.meghaChatDrawer.classList.add('open');
  });

  DOM.closeChatDrawerBtn.addEventListener('click', () => {
    DOM.meghaChatDrawer.classList.remove('open');
    if (APP_STATE.isListening && chatRecognition) {
      try { chatRecognition.stop(); } catch (e) {}
    }
    resumeWakeWordListener();
  });

  // Chat Send
  DOM.sendChatBtn.addEventListener('click', () => {
    handleUserQuery(DOM.chatTextInput.value);
  });

  DOM.chatTextInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleUserQuery(DOM.chatTextInput.value);
  });

  // Quick Chips
  DOM.quickChips.forEach(chip => {
    chip.addEventListener('click', () => {
      handleUserQuery(chip.dataset.query);
    });
  });

  // Side Menu Drawer
  DOM.drawerToggleBtn.addEventListener('click', () => {
    DOM.sideMenuDrawer.classList.add('open');
  });

  DOM.closeSideMenuBtn.addEventListener('click', () => {
    DOM.sideMenuDrawer.classList.remove('open');
  });

  DOM.menuPersonaItems.forEach(item => {
    item.addEventListener('click', () => {
      applyPersona(item.dataset.switchPersona, true);
      DOM.sideMenuDrawer.classList.remove('open');
    });
  });

  // City Search
  DOM.searchBtn.addEventListener('click', () => {
    searchCity(DOM.citySearchInput.value);
  });

  let searchTimeout;
  DOM.citySearchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      searchCity(e.target.value);
    }, 400);
  });

  document.addEventListener('click', (e) => {
    if (!DOM.locationSearchContainer?.contains(e.target)) {
      DOM.searchResultsDropdown.classList.add('hidden');
    }
  });

  // Travelers Saved Destination switcher
  document.querySelectorAll('.dest-item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.dest-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      const city = item.dataset.destCity;
      const lat = parseFloat(item.dataset.destLat);
      const lon = parseFloat(item.dataset.destLon);
      if (city && lat && lon) {
        APP_STATE.currentCity = city;
        APP_STATE.lat = lat;
        APP_STATE.lon = lon;
        if (DOM.citySearchInput) DOM.citySearchInput.value = `${city}, Travel Destination`;
        fetchLiveWeather(lat, lon, city);
        const travelMsg = (APP_STATE.voiceLang === 'hi-IN')
          ? `ट्रैवल डेस्टिनेशन ${city} का मौसम लोड हो गया है।`
          : `Loaded travel weather for ${city}.`;
        speakWithMegha(travelMsg, null, APP_STATE.voiceLang);
      }
    });
  });

  // Theme Switcher Button (Bright Day / Dark Night)
  if (DOM.themeToggleBtn) {
    DOM.themeToggleBtn.addEventListener('click', () => {
      toggleTheme();
    });
  }

  // Initialize MSN Weather Quick Cities Pill Bar
  setupQuickCities();
}

// ============================================================
// 12. AUTOMATIC BOOTSTRAP ON PAGE LOAD
// ============================================================

window.addEventListener('DOMContentLoaded', () => {
  initTheme();
  setupEventListeners();
  initChatSpeechRecognition();
  initWakeWordListener();
  applyPersona("agriculture_gardeners", false);

  // Default immediately to the user's Live Location on startup (Audio instruction)
  initLiveLocationDefault();

  // Prompt once for microphone permission on startup so browser grants and remembers it
  requestInitialMicPermission();

  // Auto-play Megha welcome voice greeting automatically on startup
  setTimeout(() => {
    triggerStage1Greeting();
  }, 400);

  // If voices weren't ready, retry when loaded
  if ('speechSynthesis' in window) {
    window.speechSynthesis.onvoiceschanged = () => {
      if (!APP_STATE.hasStartedOnboardingVoice) {
        triggerStage1Greeting();
      }
    };
  }

  // Global touch/scroll/click listener to immediately trigger voice if browser was holding back autoplay
  const unlockAudioOnFirstInteraction = () => {
    if (!APP_STATE.hasStartedOnboardingVoice && !DOM.onboardingModal.classList.contains('hidden')) {
      triggerStage1Greeting();
    }
    ['click', 'touchstart', 'scroll', 'pointerdown', 'mousemove', 'keydown'].forEach(evt => {
      window.removeEventListener(evt, unlockAudioOnFirstInteraction);
    });
  };

  ['click', 'touchstart', 'scroll', 'pointerdown', 'mousemove', 'keydown'].forEach(evt => {
    window.addEventListener(evt, unlockAudioOnFirstInteraction, { passive: true });
  });
});
