import React, { useState, useEffect } from 'react';
import AdSenseAd from './AdSenseAd';
import { trackEvent } from '../utils/analytics';

export default function Polls({ match, apiHost = 'http://localhost:5000' }) {
  const [polls, setPolls] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  const fetchPolls = async () => {
    try {
      const res = await fetch(`${apiHost}/api/polls`);
      if (res.ok) {
        const data = await res.json();
        setPolls(data);
      }
    } catch (err) {
      console.error("Error fetching polls:", err);
    }
  };

  useEffect(() => {
    fetchPolls();
    
    // Set up polling or listen to global events.
    const interval = setInterval(fetchPolls, 10000);
    return () => clearInterval(interval);
  }, []);

  const activePoll = polls.find(p => p.matchId === match.id);

  // Handle Voting
  const handleVote = async (optionIndex) => {
    if (!name || !email) {
      setMessage({ text: 'Please enter both your name and email ID to vote.', type: 'error' });
      return;
    }

    setLoading(true);
    setMessage({ text: '', type: '' });
    try {
      const res = await fetch(`${apiHost}/api/polls/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pollId: activePoll.id,
          email,
          name,
          optionIndex
        })
      });

      const data = await res.json();
      if (res.ok) {
        setMessage({ text: 'Your vote has been cast successfully!', type: 'success' });
        trackEvent('cast_vote', 'engagement', activePoll.question, optionIndex);
        fetchPolls();
      } else {
        setMessage({ text: data.error || 'Failed to submit vote.', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'Network error. Could not connect to server.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Handle Creating Poll
  const handleCreatePollAndVote = async (predictedOptionIndex) => {
    if (!name || !email) {
      setMessage({ text: 'Please enter both your name and email ID to create a poll.', type: 'error' });
      return;
    }

    // Default Options based on sport
    const options = match.sport === 'cricket'
      ? [`${match.homeTeam.name} Win`, `${match.awayTeam.name} Win`]
      : [`${match.homeTeam.name} Win`, `${match.awayTeam.name} Win`, 'Draw'];

    const question = `Who will win this match: ${match.homeTeam.name} vs ${match.awayTeam.name}?`;

    setLoading(true);
    setMessage({ text: '', type: '' });
    try {
      // 1. Create Poll
      const createRes = await fetch(`${apiHost}/api/polls/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matchId: match.id,
          question,
          options
        })
      });

      const newPoll = await createRes.json();
      if (!createRes.ok) {
        setMessage({ text: newPoll.error || 'Failed to create poll.', type: 'error' });
        setLoading(false);
        return;
      }

      // 2. Vote in newly created poll
      const voteRes = await fetch(`${apiHost}/api/polls/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pollId: newPoll.id,
          email,
          name,
          optionIndex: predictedOptionIndex
        })
      });

      const voteData = await voteRes.json();
      if (voteRes.ok) {
        setMessage({ text: 'Poll created & your prediction submitted!', type: 'success' });
        trackEvent('create_poll', 'engagement', question);
        fetchPolls();
      } else {
        setMessage({ text: voteData.error || 'Poll created, but vote failed.', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'Network error. Could not build poll.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Calculate vote percentages
  const getPercentage = (votes, index) => {
    const total = votes.reduce((a, b) => a + b, 0);
    if (total === 0) return 0;
    return Math.round((votes[index] / total) * 100);
  };

  const getVoteCount = (votes, index) => {
    return votes[index] || 0;
  };

  // Poll analytics values
  const totalPollsCount = polls.length;
  const totalVotesAcrossAll = polls.reduce((sum, p) => sum + p.votes.reduce((a,b) => a+b, 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Email & Name Input Panel */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <h4 style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>Identify to Vote / Create Prediction Poll</h4>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name (e.g. John Doe)"
            className="glass-input"
            style={{ flex: 1, minWidth: '180px' }}
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email ID (e.g. name@email.com)"
            className="glass-input"
            style={{ flex: 1, minWidth: '180px' }}
          />
        </div>
        {message.text && (
          <div 
            style={{ 
              padding: '10px 14px', 
              borderRadius: '8px', 
              fontSize: '0.85rem',
              fontWeight: 500,
              backgroundColor: message.type === 'success' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
              color: message.type === 'success' ? '#065f46' : '#991b1b',
              border: `1px solid ${message.type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
            }}
          >
            {message.text}
          </div>
        )}
      </div>

      {/* Main Poll Voting / Creation Interface */}
      {activePoll ? (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ marginBottom: '18px', color: 'var(--text-primary)' }}>{activePoll.question}</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {activePoll.options.map((option, idx) => {
              const pct = getPercentage(activePoll.votes, idx);
              const cnt = getVoteCount(activePoll.votes, idx);
              const accentColor = match.sport === 'cricket' ? 'var(--color-cricket)' : 'var(--color-football)';
              
              return (
                <div 
                  key={idx} 
                  onClick={() => !loading && handleVote(idx)}
                  className="glass-panel"
                  style={{
                    padding: '14px 18px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    background: 'rgba(255, 255, 255, 0.25)',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                    transition: 'border 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = accentColor}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.05)'}
                >
                  {/* Dynamic percentage fill background */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      bottom: 0,
                      width: `${pct}%`,
                      backgroundColor: match.sport === 'cricket' ? 'var(--color-cricket-light)' : 'var(--color-football-light)',
                      zIndex: 1,
                      transition: 'width 0.8s cubic-bezier(0.1, 0.8, 0.1, 1)'
                    }}
                  />
                  
                  <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{option}</span>
                    <div style={{ display: 'flex', gap: '12px', fontSize: '0.9rem', fontWeight: 700 }}>
                      <span style={{ color: 'var(--text-secondary)' }}>{pct}%</span>
                      <span style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.8rem' }}>({cnt} votes)</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div style={{ marginTop: '16px', fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'right' }}>
            Total votes cast in this match: {activePoll.votes.reduce((a,b) => a+b, 0)}
          </div>
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
          <h3 style={{ marginBottom: '8px' }}>No Active Poll for this Match</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>
            Be the first to create the match prediction poll and cast your vote!
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Choose your Prediction:</h4>
            
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                onClick={() => handleCreatePollAndVote(0)}
                disabled={loading}
                className="glass-btn"
                style={{ flex: 1, minWidth: '120px' }}
              >
                👍 {match.homeTeam.name} Win
              </button>
              
              <button
                onClick={() => handleCreatePollAndVote(1)}
                disabled={loading}
                className="glass-btn"
                style={{ flex: 1, minWidth: '120px' }}
              >
                👍 {match.awayTeam.name} Win
              </button>

              {match.sport !== 'cricket' && (
                <button
                  onClick={() => handleCreatePollAndVote(2)}
                  disabled={loading}
                  className="glass-btn"
                  style={{ flex: 1, minWidth: '120px' }}
                >
                  🤝 Draw
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Poll Analytics Dashboard */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <h3 style={{ marginBottom: '14px', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '8px', color: 'var(--text-primary)' }}>
          📊 Poll Analytics & Global Trends
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
          <div className="glass-panel" style={{ padding: '12px', textAlign: 'center', background: 'rgba(255,255,255,0.2)' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Total Active Polls</span>
            <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-football)' }}>{totalPollsCount}</span>
          </div>
          <div className="glass-panel" style={{ padding: '12px', textAlign: 'center', background: 'rgba(255,255,255,0.2)' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Total Votes Cast</span>
            <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-cricket)' }}>{totalVotesAcrossAll}</span>
          </div>
        </div>

        {/* Global Voting Distribution across Matches */}
        <div>
          <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Active Poll Submissions</h4>
          {polls.length === 0 ? (
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', padding: '10px' }}>No global polls constructed yet.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {polls.map((p) => {
                const pollTotalVotes = p.votes.reduce((a,b) => a+b, 0);
                const pctOfTotal = totalVotesAcrossAll > 0 ? Math.round((pollTotalVotes / totalVotesAcrossAll) * 100) : 0;
                
                return (
                  <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem' }}>
                    <span style={{ width: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 500 }}>
                      {p.question.replace('Who will win this match: ', '').replace('?', '')}
                    </span>
                    <div style={{ flex: 1, height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${pctOfTotal}%`, height: '100%', background: 'linear-gradient(90deg, var(--color-football) 0%, var(--color-cricket) 100%)' }} />
                    </div>
                    <span style={{ width: '60px', textAlign: 'right', fontWeight: 600, color: 'var(--text-muted)' }}>
                      {pollTotalVotes} v ({pctOfTotal}%)
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      
      {/* Google AdSense Revenue Generator Unit */}
      <AdSenseAd 
        slot="3847291048" // Dedicated Poll Panel Ad Unit Slot
        height="120px"
      />
      
    </div>
  );
}
