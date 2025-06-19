export class SpeechService {
  private synthesis: SpeechSynthesis;
  private recognition: SpeechRecognition | null = null;
  private isListening: boolean = false;
  private voices: SpeechSynthesisVoice[] = [];

  constructor() {
    this.synthesis = window.speechSynthesis;
    this.initializeVoices();
    this.initializeSpeechRecognition();
  }

  private initializeVoices() {
    const loadVoices = () => {
      this.voices = this.synthesis.getVoices();
    };

    loadVoices();
    if (this.synthesis.onvoiceschanged !== undefined) {
      this.synthesis.onvoiceschanged = loadVoices;
    }
  }

  private initializeSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';
    } else {
      console.warn('Speech recognition not supported in this browser');
    }
  }

  private selectBestVoice(): SpeechSynthesisVoice | null {
    if (this.voices.length === 0) return null;

    // Priority order for more human-sounding voices
    const preferredVoices = [
      // Google voices (usually highest quality)
      'Google US English',
      'Google UK English Female',
      'Google UK English Male',
      
      // Microsoft voices (good quality)
      'Microsoft Zira Desktop',
      'Microsoft David Desktop',
      'Microsoft Hazel Desktop',
      
      // Apple voices (natural sounding)
      'Samantha',
      'Alex',
      'Victoria',
      'Karen',
      'Moira',
      
      // Other high-quality voices
      'Fiona',
      'Daniel',
      'Tessa'
    ];

    // First, try to find preferred voices by exact name match
    for (const preferredName of preferredVoices) {
      const voice = this.voices.find(v => v.name === preferredName);
      if (voice) return voice;
    }

    // Then try to find voices that contain preferred names
    for (const preferredName of preferredVoices) {
      const voice = this.voices.find(v => v.name.toLowerCase().includes(preferredName.toLowerCase()));
      if (voice) return voice;
    }

    // Look for any English female voice (generally more pleasant for interviews)
    const femaleEnglishVoice = this.voices.find(voice => 
      voice.lang.startsWith('en') && 
      (voice.name.toLowerCase().includes('female') || 
       voice.name.toLowerCase().includes('woman') ||
       voice.name.toLowerCase().includes('zira') ||
       voice.name.toLowerCase().includes('hazel') ||
       voice.name.toLowerCase().includes('samantha') ||
       voice.name.toLowerCase().includes('karen') ||
       voice.name.toLowerCase().includes('fiona'))
    );
    
    if (femaleEnglishVoice) return femaleEnglishVoice;

    // Look for any high-quality English voice
    const qualityEnglishVoice = this.voices.find(voice => 
      voice.lang.startsWith('en') && 
      (voice.name.toLowerCase().includes('google') ||
       voice.name.toLowerCase().includes('microsoft') ||
       voice.name.toLowerCase().includes('apple'))
    );
    
    if (qualityEnglishVoice) return qualityEnglishVoice;

    // Fallback to any English voice
    const englishVoice = this.voices.find(voice => voice.lang.startsWith('en'));
    if (englishVoice) return englishVoice;

    // Last resort - use the first available voice
    return this.voices[0] || null;
  }

  speak(text: string, options: { rate?: number; pitch?: number; volume?: number } = {}): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!text) {
        resolve();
        return;
      }

      // Cancel any ongoing speech
      this.synthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Select the best available voice
      const selectedVoice = this.selectBestVoice();
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      // Optimize settings for more natural speech
      utterance.rate = options.rate || 0.85; // Slightly slower for clarity
      utterance.pitch = options.pitch || 1.0; // Natural pitch
      utterance.volume = options.volume || 0.9; // Clear but not overwhelming

      utterance.onend = () => resolve();
      utterance.onerror = (error) => reject(error);

      this.synthesis.speak(utterance);
    });
  }

  startListening(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.recognition) {
        reject(new Error('Speech recognition not supported'));
        return;
      }

      if (this.isListening) {
        reject(new Error('Already listening'));
        return;
      }

      let finalTranscript = '';
      let interimTranscript = '';

      this.recognition.onstart = () => {
        this.isListening = true;
      };

      this.recognition.onresult = (event) => {
        interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
      };

      this.recognition.onend = () => {
        this.isListening = false;
        resolve(finalTranscript.trim() || interimTranscript.trim());
      };

      this.recognition.onerror = (event) => {
        this.isListening = false;
        reject(new Error(`Speech recognition error: ${event.error}`));
      };

      this.recognition.start();
    });
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }

  stopSpeaking() {
    this.synthesis.cancel();
  }

  isCurrentlyListening(): boolean {
    return this.isListening;
  }

  isSpeechSupported(): boolean {
    return !!this.recognition && 'speechSynthesis' in window;
  }

  // Method to get available voices for debugging
  getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.voices;
  }

  // Method to test voice selection
  testVoice(): void {
    const selectedVoice = this.selectBestVoice();
    console.log('Selected voice:', selectedVoice?.name, selectedVoice?.lang);
    console.log('Available voices:', this.voices.map(v => ({ name: v.name, lang: v.lang })));
  }
}