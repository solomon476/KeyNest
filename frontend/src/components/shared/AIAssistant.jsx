import React, { useState } from 'react';
import { Bot, X, Send, Sparkles } from 'lucide-react';

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hello! I am your KeyNest AI Assistant. I can help categorize maintenance requests, draft rent reminders, or analyze your rental income. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const newMessages = [...messages, { role: 'user', text: input }];
    setMessages(newMessages);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      let aiResponse = "I'm currently in demo mode, but in the future, I'll be able to perform advanced actions directly on your properties and tenants!";
      
      const lowerInput = input.toLowerCase();
      if (lowerInput.includes('reminder') || lowerInput.includes('late')) {
        aiResponse = "Here is a draft you can send to John Doe (Apt 4B): 'Dear John, this is a friendly reminder that your rent of KES 25,000 for this month is currently overdue. Please arrange payment at your earliest convenience. Thank you!'";
      } else if (lowerInput.includes('maintenance') || lowerInput.includes('leak')) {
        aiResponse = "I've analyzed the recent maintenance request. I've categorized it as 'Plumbing - High Priority' and assigned it to your Caretaker, Michael. The estimated repair cost is KES 2,500 based on historical data.";
      }

      setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
    }, 1000);
  };

  return (
    <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 100 }}>
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          style={{ 
            width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#2563EB', 
            color: 'white', border: 'none', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <Sparkles size={28} />
        </button>
      ) : (
        <div style={{ 
          width: '350px', height: '500px', backgroundColor: '#fff', borderRadius: '16px', 
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid #E2E8F0'
        }}>
          {/* Header */}
          <div style={{ backgroundColor: '#2563EB', color: '#fff', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
              <Bot size={20} /> KeyNest AI
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
              <X size={20} />
            </button>
          </div>

          {/* Chat Area */}
          <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', backgroundColor: '#F8FAFC' }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{ 
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                backgroundColor: msg.role === 'user' ? '#2563EB' : '#fff',
                color: msg.role === 'user' ? '#fff' : '#1E293B',
                padding: '0.75rem', borderRadius: '12px', maxWidth: '85%',
                boxShadow: msg.role === 'ai' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                border: msg.role === 'ai' ? '1px solid #E2E8F0' : 'none',
                fontSize: '0.9rem', lineHeight: '1.5'
              }}>
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} style={{ display: 'flex', borderTop: '1px solid #E2E8F0', padding: '0.75rem', backgroundColor: '#fff' }}>
            <input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask the AI assistant..." 
              style={{ flex: 1, border: 'none', outline: 'none', padding: '0.5rem', fontSize: '0.9rem' }}
            />
            <button type="submit" style={{ background: '#2563EB', color: '#fff', border: 'none', borderRadius: '8px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
