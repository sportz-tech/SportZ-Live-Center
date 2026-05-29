import React, { useState, useEffect, useRef } from 'react';

export default function CommentaryVoice({ match }) {
  const [isMuted, setIsMuted] = useState(true);
  const [voices, setVoices] = useState([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState('');
  const [speechRate, setSpeechRate] = useState(1.0);
  const [speechVolume, setSpeechVolume] = useState(0.8);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const lastSpokenIdRef = useRef(null);

  // Load browser voices
  useEffect(() => {
    const loadVoices = () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const availableVoices = window.speechSynthesis.getVoices();
        // Filter out useful English/native voices
        const engVoices = availableVoices.filter(v => v.lang.startsWith('en') || v.lang.startsWith('es'));
        setVoices(engVoices.length > 0 ? engVoices : availableVoices);
        
        // Select a default voice
        if (engVoices.length > 0 && !selectedVoiceName) {
          // Look for an English UK or US voice
          const defaultVoice = engVoices.find(v => v.lang.includes('GB') || v.lang.includes('US')) || engVoices[0];
          setSelectedVoiceName(defaultVoice.name);
        }
      }
    };

    loadVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Handle incoming commentary lines and speak them
  useEffect(() => {
    if (match.commentary && match.commentary.length > 0) {
      const latestComment = match.commentary[0]; // first index is latest
      
      // If we haven't spoken this comment yet, and voice synthesis is NOT muted
      if (latestComment.id !== lastSpokenIdRef.current) {
        lastSpokenIdRef.current = latestComment.id;
        
        if (!isMuted && typeof window !== 'undefined' && 'speechSynthesis' in window) {
          // Cancel any ongoing speaking to voice the newest immediately
          window.speechSynthesis.cancel();

          // Prepare clean text (remove over/minute stamps for clean narration)
          let speakText = latestComment.text;
          
          const utterance = new SpeechSynthesisUtterance(speakText);
          
          // Set user config
          const activeVoice = voices.find(v => v.name === selectedVoiceName);
          if (activeVoice) {
            utterance.voice = activeVoice;
          }
          utterance.rate = speechRate;
          utterance.volume = speechVolume;

          utterance.onstart = () => setIsSpeaking(true);
          utterance.onend = () => setIsSpeaking(false);
          utterance.onerror = () => setIsSpeaking(false);

          window.speechSynthesis.speak(utterance);
        }
      }
    }
  }, [match.commentary, isMuted, selectedVoiceName, speechRate, speechVolume, voices]);

  // Handle manual trigger play for testing
  const playManualComment = (commentText) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(commentText);
      const activeVoice = voices.find(v => v.name === selectedVoiceName);
      if (activeVoice) utterance.voice = activeVoice;
      utterance.rate = speechRate;
      utterance.volume = speechVolume;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleMuteToggle = () => {
    if (!isMuted) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
    }
    setIsMuted(!isMuted);
  };

  const isCricket = match.sport === 'cricket';
  const sportColor = isCricket ? 'var(--color-cricket)' : 'var(--color-football)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Voice Controls Panel */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>🎙️ Live AI Voice Commentary</h3>
          
          {/* Animated Waveform Visualizer */}
          <div className="bar-visualizer">
            <div className={`vis-bar ${isSpeaking ? 'playing' : ''}`} style={{ backgroundColor: sportColor }} />
            <div className={`vis-bar ${isSpeaking ? 'playing' : ''}`} style={{ backgroundColor: sportColor }} />
            <div className={`vis-bar ${isSpeaking ? 'playing' : ''}`} style={{ backgroundColor: sportColor }} />
            <div className={`vis-bar ${isSpeaking ? 'playing' : ''}`} style={{ backgroundColor: sportColor }} />
            <div className={`vis-bar ${isSpeaking ? 'playing' : ''}`} style={{ backgroundColor: sportColor }} />
            <div className={`vis-bar ${isSpeaking ? 'playing' : ''}`} style={{ backgroundColor: sportColor }} />
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
          
          {/* Mute/Unmute Action */}
          <button
            onClick={handleMuteToggle}
            className="glass-btn"
            style={{
              padding: '12px 24px',
              backgroundColor: isMuted ? 'rgba(239, 68, 68, 0.1)' : sportColor,
              color: isMuted ? 'var(--color-live)' : 'white',
              border: isMuted ? '1px solid rgba(239, 68, 68, 0.2)' : 'none',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '0.95rem'
            }}
          >
            {isMuted ? '🔇 Voice Commentary: Muted' : '🔊 Voice Commentary: ON'}
          </button>

          {/* Accents Selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minWidth: '180px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Commentator Accent</span>
            <select
              value={selectedVoiceName}
              onChange={(e) => setSelectedVoiceName(e.target.value)}
              className="glass-input"
              style={{ width: '100%', padding: '8px 12px' }}
            >
              {voices.map((voice) => (
                <option key={voice.name} value={voice.name}>
                  {voice.name} ({voice.lang})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Volume & Speed sliders */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Narrator Speed ({speechRate}x)
            </span>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={speechRate}
              onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
              style={{ accentColor: sportColor }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Volume ({Math.round(speechVolume * 100)}%)
            </span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={speechVolume}
              onChange={(e) => setSpeechVolume(parseFloat(e.target.value))}
              style={{ accentColor: sportColor }}
            />
          </div>
        </div>
      </div>

      {/* Commentary text logs */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h3 style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '8px' }}>Commentary Log</h3>

        {match.commentary && match.commentary.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '400px', overflowY: 'auto', paddingRight: '8px' }}>
            {match.commentary.map((log) => (
              <div 
                key={log.id} 
                className="glass-panel"
                style={{ 
                  padding: '12px 16px', 
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: '1px solid rgba(0,0,0,0.03)',
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'flex-start'
                }}
              >
                <span 
                  style={{ 
                    fontSize: '0.8rem', 
                    fontWeight: 700, 
                    color: sportColor, 
                    backgroundColor: isCricket ? 'rgba(16, 185, 129, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {isCricket ? `Ov ${log.over}` : log.minute}
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                    {log.text}
                  </p>
                  
                  {/* Speak button for individual commentary item */}
                  <button 
                    onClick={() => playManualComment(log.text)}
                    style={{ 
                      alignSelf: 'flex-end', 
                      background: 'none', 
                      border: 'none', 
                      color: 'var(--text-muted)', 
                      cursor: 'pointer', 
                      fontSize: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = sportColor}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                  >
                    🔊 Listen Again
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No commentary lines registered yet for this match.
          </div>
        )}
      </div>

    </div>
  );
}
