/**
 * Speech synthesis utility for voice readout of agricultural advisories
 */

let currentUtterance = null;

export const playAdvisorySpeech = ({ text, language = 'en', onStart, onEnd, onError }) => {
  if (!('speechSynthesis' in window)) {
    if (onError) onError(new Error('Speech synthesis not supported on this browser.'));
    return;
  }

  // Stop previous speech
  stopAdvisorySpeech();

  const langMap = {
    'en': 'en-IN',
    'kn': 'kn-IN',
    'hi': 'hi-IN',
    'mr': 'mr-IN',
    'pa': 'pa-IN',
    'te': 'te-IN',
    'ta': 'ta-IN',
    'gu': 'gu-IN'
  };

  const cleanText = text
    .replace(/[#*`_~]/g, '')
    .replace(/🌾|🛠|💰|🏛|⚠️|→/g, ' ')
    .replace(/\n\s*\n/g, '. ')
    .slice(0, 1200); // Friendly listening length

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = langMap[language] || 'en-IN';
  utterance.rate = 0.92; // Slightly measured pace for clarity
  utterance.pitch = 1.0;

  // Attempt to select a regional voice if available
  const voices = window.speechSynthesis.getVoices();
  const matchedVoice = voices.find(v => v.lang.startsWith(langMap[language] || 'en'));
  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }

  utterance.onstart = () => {
    if (onStart) onStart();
  };

  utterance.onend = () => {
    currentUtterance = null;
    if (onEnd) onEnd();
  };

  utterance.onerror = (e) => {
    currentUtterance = null;
    if (onError) onError(e);
  };

  currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);
};

export const stopAdvisorySpeech = () => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    currentUtterance = null;
  }
};

export const isSpeaking = () => {
  return 'speechSynthesis' in window && window.speechSynthesis.speaking;
};
