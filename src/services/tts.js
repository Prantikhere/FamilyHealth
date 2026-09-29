export const ttsService = {
  isSupported: () => typeof window !== 'undefined' && 'speechSynthesis' in window,

  speak: (text, language = 'en') => {
    if (!ttsService.isSupported()) {
      console.warn('Text-to-speech is not supported in this environment.');
      return false;
    }

    try {
      window.speechSynthesis.cancel(); // Stop any active speech

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95; // Slightly slower, clear cadence for medical comprehension
      utterance.pitch = 1.0;

      // Map language codes
      const langMap = {
        en: 'en-US',
        ha: 'ha-NG', // Hausa (Nigeria)
        yo: 'yo-NG', // Yoruba (Nigeria)
        ig: 'ig-NG', // Igbo (Nigeria)
        sw: 'sw-KE', // Swahili (Kenya)
      };

      utterance.lang = langMap[language] || 'en-US';

      // Pick best matching voice if available
      const voices = window.speechSynthesis.getVoices();
      const regionalVoice = voices.find(v => v.lang.startsWith(utterance.lang) || v.lang.includes('NG') || v.lang.includes('GB'));
      if (regionalVoice) {
        utterance.voice = regionalVoice;
      }

      window.speechSynthesis.speak(utterance);
      return true;
    } catch (e) {
      console.error('Speech synthesis error:', e);
      return false;
    }
  },

  stop: () => {
    if (ttsService.isSupported()) {
      window.speechSynthesis.cancel();
    }
  }
};
