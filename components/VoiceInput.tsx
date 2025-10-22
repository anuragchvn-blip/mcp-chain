'use client';

import { useState, useEffect, useRef } from 'react';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  onCommand?: (command: string) => void;
}

export function VoiceInput({ onTranscript, onCommand }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check if browser supports Web Speech API
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        setIsSupported(true);
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let finalTranscript = '';
          let interimTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript + ' ';
            } else {
              interimTranscript += transcript;
            }
          }

          const currentTranscript = finalTranscript || interimTranscript;
          setTranscript(currentTranscript);

          if (finalTranscript) {
            onTranscript(finalTranscript.trim());
            processVoiceCommand(finalTranscript.trim());
          }
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onTranscript]);

  const processVoiceCommand = (text: string) => {
    const lowerText = text.toLowerCase();
    
    // Detect common blockchain commands
    if (lowerText.includes('balance') || lowerText.includes('check')) {
      if (onCommand) {
        onCommand('check_balance');
      }
    } else if (lowerText.includes('send') || lowerText.includes('transfer')) {
      if (onCommand) {
        onCommand('send_transaction');
      }
    } else if (lowerText.includes('summary') || lowerText.includes('overview')) {
      if (onCommand) {
        onCommand('multi_chain_summary');
      }
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  if (!isSupported) {
    return null; // Hide if not supported
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={toggleListening}
        className={`p-3 rounded-xl transition-all duration-200 ${
          isListening
            ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg animate-pulse'
            : 'bg-gray-100 hover:bg-gray-200 text-gray-700 shadow-sm'
        }`}
        title={isListening ? 'Stop listening' : 'Start voice input'}
      >
        {isListening ? (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 002 0V8a1 1 0 00-1-1zm4 0a1 1 0 00-1 1v4a1 1 0 002 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
          </svg>
        )}
      </button>
      
      {transcript && (
        <div className="flex-1 px-4 py-2 bg-blue-50 border border-blue-200 rounded-xl">
          <p className="text-sm text-blue-900 font-medium">
            {isListening ? '🎤 ' : '✓ '}{transcript}
          </p>
        </div>
      )}
    </div>
  );
}
