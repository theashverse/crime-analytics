import { useState } from 'react';
import axios from 'axios';
import config from "../config";

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Hi! Ask me anything about India crime data. Example: "Which state had most murders in 2005?"'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // const res = await axios.post('http://localhost:5000/api/chat', {
      //   question: input
      // });
      const res = await axios.post(
  `${config.API_BASE_URL}/api/chat`,
  {
    question: input
  }
);
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: res.data.answer,
        meta: res.data.dataUsed
      }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: 'Sorry, something went wrong. Please try again.'
      }]);
    }
    setLoading(false);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #7F77DD, #533AB7)',
          border: 'none',
          cursor: 'pointer',
          fontSize: '24px',
          color: '#FFFFFF',
          boxShadow: '0 4px 20px rgba(127,119,221,0.5)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {open ? '✕' : '🤖'}
      </button>

      {/* Chat panel */}
      {open && (
        <div style={{
          position: 'fixed',
          bottom: '90px',
          right: '24px',
          width: '360px',
          height: '480px',
          background: '#0F3460',
          border: '1px solid #533AB7',
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1000,
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
        }}>

          {/* Header */}
          <div style={{
            padding: '16px',
            borderBottom: '1px solid #1E2A45',
            background: '#16213E',
            borderRadius: '16px 16px 0 0'
          }}>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#FFFFFF' }}>
              🤖 Crime AI Assistant
            </div>
            <div style={{ fontSize: '11px', color: '#8888AA', marginTop: '2px' }}>
              Powered by Groq + Llama 3
            </div>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
              }}>
                <div style={{
                  maxWidth: '80%',
                  padding: '10px 14px',
                  borderRadius: msg.role === 'user'
                    ? '16px 16px 4px 16px'
                    : '16px 16px 16px 4px',
                  background: msg.role === 'user' ? '#533AB7' : '#16213E',
                  border: '1px solid',
                  borderColor: msg.role === 'user' ? '#7F77DD' : '#1E2A45',
                  fontSize: '12px',
                  color: '#FFFFFF',
                  lineHeight: '1.5'
                }}>
                  {msg.text}
                  {msg.meta && (
                    <div style={{
                      marginTop: '6px',
                      fontSize: '10px',
                      color: '#8888AA',
                      borderTop: '1px solid #1E2A45',
                      paddingTop: '4px'
                    }}>
                      📊 {msg.meta.recordsFound} records · {msg.meta.state} · {msg.meta.year}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{
                  padding: '10px 14px',
                  background: '#16213E',
                  borderRadius: '16px 16px 16px 4px',
                  fontSize: '12px',
                  color: '#8888AA'
                }}>
                  Thinking...
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div style={{
            padding: '12px',
            borderTop: '1px solid #1E2A45',
            display: 'flex',
            gap: '8px'
          }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask about crime data..."
              style={{
                flex: 1,
                background: '#16213E',
                border: '1px solid #533AB7',
                borderRadius: '8px',
                padding: '8px 12px',
                color: '#FFFFFF',
                fontSize: '12px',
                outline: 'none'
              }}
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              style={{
                background: '#533AB7',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 14px',
                color: '#FFFFFF',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}