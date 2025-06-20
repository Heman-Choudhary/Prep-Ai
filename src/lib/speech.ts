export class SpeechService {
  private synthesis: SpeechSynthesis;
  private recognition: SpeechRecognition | null = null;
  private isListening: boolean = false;
  private voices: SpeechSynthesisVoice[] = [];
  private selectedVoice: SpeechSynthesisVoice | null = null;

  constructor() {
    this.synthesis = window.speechSynthesis;
    this.initializeVoices();
    this.initializeSpeechRecognition();
  }

  private initializeVoices() {
    const loadVoices = () => {
      this.voices = this.synthesis.getVoices();
      this.selectedVoice = this.selectOptimalVoice();
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
      this.recognition.maxAlternatives = 1;
    } else {
      console.warn('Speech recognition not supported in this browser');
    }
  }

  private selectOptimalVoice(): SpeechSynthesisVoice | null {
    if (this.voices.length === 0) return null;

    // Priority list for high-quality, native English voices
    const preferredVoices = [
      // Google voices (highest quality, most natural)
      { name: 'Google US English', priority: 10 },
      { name: 'Google UK English Female', priority: 9 },
      { name: 'Google UK English Male', priority: 8 },
      
      // Microsoft voices (high quality, natural)
      { name: 'Microsoft Zira Desktop', priority: 7 },
      { name: 'Microsoft David Desktop', priority: 6 },
      { name: 'Microsoft Hazel Desktop', priority: 7 },
      { name: 'Microsoft Mark Desktop', priority: 6 },
      
      // Apple voices (very natural)
      { name: 'Samantha', priority: 9 },
      { name: 'Alex', priority: 8 },
      { name: 'Victoria', priority: 7 },
      { name: 'Karen', priority: 6 },
      { name: 'Moira', priority: 5 },
      
      // Other high-quality voices
      { name: 'Fiona', priority: 6 },
      { name: 'Daniel', priority: 5 },
      { name: 'Tessa', priority: 5 },
      { name: 'Veena', priority: 4 },
      { name: 'Rishi', priority: 4 }
    ];

    // Find the best available voice
    let bestVoice: SpeechSynthesisVoice | null = null;
    let highestPriority = 0;

    for (const voice of this.voices) {
      // Skip non-English voices
      if (!voice.lang.toLowerCase().startsWith('en')) continue;

      // Check for exact name matches
      const preferredVoice = preferredVoices.find(pv => 
        voice.name.toLowerCase().includes(pv.name.toLowerCase())
      );

      if (preferredVoice && preferredVoice.priority > highestPriority) {
        bestVoice = voice;
        highestPriority = preferredVoice.priority;
        continue;
      }

      // Fallback: Look for quality indicators in voice names
      const qualityIndicators = [
        { pattern: /google/i, priority: 8 },
        { pattern: /microsoft.*premium/i, priority: 7 },
        { pattern: /microsoft/i, priority: 6 },
        { pattern: /apple/i, priority: 6 },
        { pattern: /enhanced/i, priority: 5 },
        { pattern: /natural/i, priority: 5 },
        { pattern: /neural/i, priority: 7 }
      ];

      for (const indicator of qualityIndicators) {
        if (indicator.pattern.test(voice.name) && indicator.priority > highestPriority) {
          bestVoice = voice;
          highestPriority = indicator.priority;
          break;
        }
      }
    }

    // If no high-quality voice found, prefer female English voices (generally more pleasant)
    if (!bestVoice) {
      bestVoice = this.voices.find(voice => 
        voice.lang.toLowerCase().startsWith('en') && 
        (voice.name.toLowerCase().includes('female') || 
         voice.name.toLowerCase().includes('woman'))
      ) || this.voices.find(voice => voice.lang.toLowerCase().startsWith('en'));
    }

    return bestVoice;
  }

  public initializeOptimalVoice() {
    // Force voice loading and selection
    this.synthesis.getVoices();
    setTimeout(() => {
      this.voices = this.synthesis.getVoices();
      this.selectedVoice = this.selectOptimalVoice();
      console.log('Selected optimal voice:', this.selectedVoice?.name, this.selectedVoice?.lang);
    }, 100);
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
      
      // Use the selected optimal voice
      if (this.selectedVoice) {
        utterance.voice = this.selectedVoice;
      }

      // Optimize settings for natural, human-like speech
      utterance.rate = options.rate || 0.9; // Slightly slower for clarity and naturalness
      utterance.pitch = options.pitch || 1.0; // Natural pitch
      utterance.volume = options.volume || 0.85; // Clear but not overwhelming

      // Add natural pauses for better speech flow
      const processedText = text
        .replace(/\./g, '. ') // Add pause after periods
        .replace(/,/g, ', ') // Add pause after commas
        .replace(/\?/g, '? ') // Add pause after questions
        .replace(/!/g, '! ') // Add pause after exclamations
        .replace(/:/g, ': ') // Add pause after colons
        .replace(/;/g, '; '); // Add pause after semicolons

      utterance.text = processedText;

      utterance.onend = () => {
        console.log('Speech completed successfully');
        resolve();
      };
      
      utterance.onerror = (error) => {
        console.error('Speech synthesis error:', error);
        reject(error);
      };

      utterance.onstart = () => {
        console.log('Speech started with voice:', utterance.voice?.name);
      };

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
      let timeoutId: NodeJS.Timeout;

      this.recognition.onstart = () => {
        this.isListening = true;
        console.log('Speech recognition started');
        
        // Set a timeout to automatically stop listening after 30 seconds
        timeoutId = setTimeout(() => {
          this.stopListening();
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
        resolve(finalTranscript.trim() || interimTranscript.trim());
      };

      this.recognition.onerror = (event) => {
        this.isListening = false;
        clearTimeout(timeoutId);
        console.error('Speech recognition error:', event.error);
        reject(new Error(`Speech recognition error: ${event.error}`));
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

  // Method to get available voices for debugging
  getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.voices;
  }

  // Method to get the currently selected voice
  getSelectedVoice(): SpeechSynthesisVoice | null {
    return this.selectedVoice;
  }

  // Method to test voice selection and quality
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
    
    // Test speech with a short phrase
    if (this.selectedVoice) {
      this.speak('Hello, this is a voice quality test.').catch(console.error);
    }
  }
}