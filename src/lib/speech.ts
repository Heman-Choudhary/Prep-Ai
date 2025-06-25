export class SpeechService {
  private synthesis: SpeechSynthesis;
  private recognition: SpeechRecognition | null = null;
  private isListening: boolean = false;
  private voices: SpeechSynthesisVoice[] = [];
  private selectedVoice: SpeechSynthesisVoice | null = null;
  private isInitialized: boolean = false;

  constructor() {
    this.synthesis = window.speechSynthesis;
    this.initializeVoices();
    this.initializeSpeechRecognition();
  }

  private initializeVoices() {
    const loadVoices = () => {
      this.voices = this.synthesis.getVoices();
      this.selectedVoice = this.selectOptimalVoice();
      this.isInitialized = true;
      console.log('Voices loaded:', this.voices.length);
    };

    // Load voices immediately if available
    loadVoices();
    
    // Also listen for the voices changed event
    if (this.synthesis.onvoiceschanged !== undefined) {
      this.synthesis.onvoiceschanged = loadVoices;
    }

    // Fallback: try loading voices after a delay
    setTimeout(loadVoices, 100);
    setTimeout(loadVoices, 500);
    setTimeout(loadVoices, 1000);
  }

  private initializeSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';
      this.recognition.maxAlternatives = 1;
    } else {
      console.warn('Speech recognition not supported in this browser');
    }
  }

  private selectOptimalVoice(): SpeechSynthesisVoice | null {
    if (this.voices.length === 0) return null;

    // Enhanced priority list for the most natural, human-like English voices
    const voicePriorities = [
      // Google voices (highest quality, most natural)
      { patterns: ['google us english', 'google uk english female'], priority: 100 },
      { patterns: ['google uk english male'], priority: 95 },
      { patterns: ['google'], priority: 90 },
      
      // Microsoft premium voices (very natural)
      { patterns: ['microsoft zira', 'microsoft hazel'], priority: 85 },
      { patterns: ['microsoft david', 'microsoft mark'], priority: 80 },
      { patterns: ['microsoft.*premium', 'microsoft.*neural'], priority: 88 },
      { patterns: ['microsoft'], priority: 75 },
      
      // Apple voices (excellent quality)
      { patterns: ['samantha'], priority: 92 },
      { patterns: ['alex'], priority: 88 },
      { patterns: ['victoria', 'karen'], priority: 85 },
      { patterns: ['moira', 'fiona'], priority: 80 },
      
      // Native system voices (often highest quality)
      { patterns: ['native', 'system', 'default'], priority: 95 },
      
      // Other high-quality voices
      { patterns: ['enhanced', 'natural', 'neural'], priority: 70 },
      { patterns: ['premium', 'quality'], priority: 65 },
      
      // Fallback preferences for natural-sounding voices
      { patterns: ['female', 'woman'], priority: 60 },
      { patterns: ['male', 'man'], priority: 55 }
    ];

    let bestVoice: SpeechSynthesisVoice | null = null;
    let highestPriority = 0;

    for (const voice of this.voices) {
      // Only consider English voices
      if (!voice.lang.toLowerCase().startsWith('en')) continue;

      const voiceName = voice.name.toLowerCase();
      
      // Prefer local/native voices as they're usually higher quality
      let priorityBonus = voice.localService ? 10 : 0;
      
      // Find the highest priority match
      for (const { patterns, priority } of voicePriorities) {
        const matches = patterns.some(pattern => {
          if (pattern.includes('*')) {
            // Handle regex patterns
            const regex = new RegExp(pattern.replace(/\*/g, '.*'), 'i');
            return regex.test(voiceName);
          } else {
            // Handle exact string matches
            return voiceName.includes(pattern.toLowerCase());
          }
        });

        if (matches && (priority + priorityBonus) > highestPriority) {
          bestVoice = voice;
          highestPriority = priority + priorityBonus;
          break; // Take the first (highest priority) match
        }
      }
    }

    // Final fallback: any English voice, preferring local ones
    if (!bestVoice) {
      const englishVoices = this.voices.filter(voice => voice.lang.toLowerCase().startsWith('en'));
      bestVoice = englishVoices.find(voice => voice.localService) || englishVoices[0] || null;
    }

    console.log('Selected voice:', bestVoice?.name, bestVoice?.lang, 'Local:', bestVoice?.localService);
    return bestVoice;
  }

  public initializeOptimalVoice() {
    // Force voice loading and selection
    this.synthesis.getVoices();
    
    // Try multiple times to ensure voices are loaded
    const attempts = [100, 500, 1000, 2000];
    attempts.forEach(delay => {
      setTimeout(() => {
        this.voices = this.synthesis.getVoices();
        if (this.voices.length > 0) {
          this.selectedVoice = this.selectOptimalVoice();
          this.isInitialized = true;
        }
      }, delay);
    });
  }

  speak(text: string, options: { rate?: number; pitch?: number; volume?: number } = {}): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!text) {
        resolve();
        return;
      }

      // Cancel any ongoing speech
      this.synthesis.cancel();

      // Wait a moment for cancellation to complete
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance();
        
        // Use the selected optimal voice
        if (this.selectedVoice) {
          utterance.voice = this.selectedVoice;
        }

        // Optimize settings for natural, human-like speech
        utterance.rate = options.rate || 0.9; // Slightly slower for clarity and naturalness
        utterance.pitch = options.pitch || 1.0; // Natural pitch
        utterance.volume = options.volume || 0.9; // Clear volume

        // Process text for more natural speech
        const processedText = this.preprocessTextForSpeech(text);
        utterance.text = processedText;

        let hasEnded = false;

        utterance.onend = () => {
          if (!hasEnded) {
            hasEnded = true;
            console.log('Speech completed successfully');
            resolve();
          }
        };
        
        utterance.onerror = (error) => {
          if (!hasEnded) {
            hasEnded = true;
            console.error('Speech synthesis error:', error);
            reject(error);
          }
        };

        utterance.onstart = () => {
          console.log('Speech started with voice:', utterance.voice?.name || 'default');
        };

        // Add timeout as fallback
        const timeout = setTimeout(() => {
          if (!hasEnded) {
            hasEnded = true;
            this.synthesis.cancel();
            resolve();
          }
        }, Math.max(text.length * 120, 8000)); // Minimum 8 seconds, adjusted for natural pace

        utterance.onend = () => {
          clearTimeout(timeout);
          if (!hasEnded) {
            hasEnded = true;
            resolve();
          }
        };

        this.synthesis.speak(utterance);
      }, 100);
    });
  }

  private preprocessTextForSpeech(text: string): string {
    return text
      // Add natural pauses
      .replace(/\./g, '. ')
      .replace(/,/g, ', ')
      .replace(/\?/g, '? ')
      .replace(/!/g, '! ')
      .replace(/:/g, ': ')
      .replace(/;/g, '; ')
      // Handle common abbreviations
      .replace(/\bDr\./g, 'Doctor')
      .replace(/\bMr\./g, 'Mister')
      .replace(/\bMrs\./g, 'Missus')
      .replace(/\bMs\./g, 'Miss')
      .replace(/\betc\./g, 'etcetera')
      .replace(/\bi\.e\./g, 'that is')
      .replace(/\be\.g\./g, 'for example')
      // Handle technical terms more naturally
      .replace(/\bAPI\b/g, 'A P I')
      .replace(/\bURL\b/g, 'U R L')
      .replace(/\bHTML\b/g, 'H T M L')
      .replace(/\bCSS\b/g, 'C S S')
      .replace(/\bJS\b/g, 'JavaScript')
      .replace(/\bSQL\b/g, 'S Q L')
      .replace(/\bJSON\b/g, 'Jason')
      .replace(/\bXML\b/g, 'X M L')
      // Improve pronunciation of common programming terms
      .replace(/\bReact\b/g, 'React')
      .replace(/\bNode\.js\b/g, 'Node J S')
      .replace(/\bPython\b/g, 'Python')
      .replace(/\bJava\b/g, 'Java')
      // Clean up extra spaces
      .replace(/\s+/g, ' ')
      .trim();
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
      let timeoutId: NodeJS.Timeout;
      let hasResolved = false;

      this.recognition.onstart = () => {
        this.isListening = true;
        console.log('Speech recognition started');
        
        // Set a timeout to automatically stop listening after 30 seconds
        timeoutId = setTimeout(() => {
          if (!hasResolved) {
            this.stopListening();
          }
        }, 30000);
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
        clearTimeout(timeoutId);
        console.log('Speech recognition ended');
        
        if (!hasResolved) {
          hasResolved = true;
          resolve(finalTranscript.trim() || interimTranscript.trim());
        }
      };

      this.recognition.onerror = (event) => {
        this.isListening = false;
        clearTimeout(timeoutId);
        console.error('Speech recognition error:', event.error);
        
        if (!hasResolved) {
          hasResolved = true;
          reject(new Error(`Speech recognition error: ${event.error}`));
        }
      };

      try {
        this.recognition.start();
      } catch (error) {
        this.isListening = false;
        reject(error);
      }
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

  getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.voices;
  }

  getSelectedVoice(): SpeechSynthesisVoice | null {
    return this.selectedVoice;
  }

  testVoice(): void {
    console.log('=== Voice Selection Test ===');
    console.log('Total voices available:', this.voices.length);
    console.log('Selected voice:', this.selectedVoice?.name, this.selectedVoice?.lang);
    console.log('Voice details:', {
      name: this.selectedVoice?.name,
      lang: this.selectedVoice?.lang,
      localService: this.selectedVoice?.localService,
      default: this.selectedVoice?.default
    });
    
    // List top 10 available voices for debugging
    const englishVoices = this.voices
      .filter(v => v.lang.toLowerCase().startsWith('en'))
      .slice(0, 10);
    
    console.log('Top English voices:', englishVoices.map(v => ({
      name: v.name,
      lang: v.lang,
      local: v.localService
    })));
  }
}