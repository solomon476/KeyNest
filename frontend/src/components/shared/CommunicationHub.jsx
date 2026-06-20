import React, { useState, useEffect } from 'react';
import { getNotifications, markNotificationRead, getConversation, sendMessage, getChatContacts } from '../../services/api';
import { Bell, MessageSquare, X, ArrowLeft } from 'lucide-react';

export default function CommunicationHub({ onClose }) {
  const [activeTab, setActiveTab] = useState('notifications');
  const [notifications, setNotifications] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatPartners, setChatPartners] = useState([]);
  const [chatPartnerId, setChatPartnerId] = useState('');
  const [chatView, setChatView] = useState('list'); // 'list' or 'chat'

  useEffect(() => {
    fetchNotifications();
    fetchChatPartners();
  }, []);

  useEffect(() => {
    let interval;
    if (chatPartnerId && activeTab === 'messages' && chatView === 'chat') {
      fetchMessages();
      interval = setInterval(fetchMessages, 5000);
    } else {
      setMessages([]);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [chatPartnerId, activeTab, chatView]);

  const fetchChatPartners = async () => {
    try {
      const usersRes = await getChatContacts().catch(() => []);
      const users = Array.isArray(usersRes) ? usersRes : (usersRes.data || []);
      
      const partners = users.map(u => ({ 
        id: u.id, 
        name: u.name, 
        role: u.role || 'user',
        unreadCount: parseInt(u.unread_count) || 0,
        lastMessageTime: u.last_message_time
      }));

      setChatPartners(partners);
    } catch (err) {
      console.error('Failed to fetch chat partners', err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data.data || []);
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    }
  };

  const fetchMessages = async () => {
    try {
      const data = await getConversation(chatPartnerId);
      setMessages(data.data || []);
    } catch (err) {
      console.error('Failed to fetch messages', err);
    }
  };

  const handleReadNotification = async (id) => {
    try {
      await markNotificationRead(id);
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !chatPartnerId) return;
    try {
      await sendMessage({ receiverId: parseInt(chatPartnerId), content: newMessage });
      setNewMessage('');
      fetchMessages();
    } catch (err) {
      const detail = err.response?.data?.detail || err.response?.data?.error || err.message || 'Unknown error';
      alert(`Failed to send message: ${detail}`);
    }
  };

  const activePartner = chatPartners.find(p => p.id == chatPartnerId);

  return (
    <div style={{
      position: 'fixed', top: 0, right: 0, bottom: 0, width: '100%', maxWidth: '400px',
      backgroundColor: '#fff', boxShadow: '-4px 0 15px rgba(0,0,0,0.1)',
      zIndex: 1000, display: 'flex', flexDirection: 'column'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', borderBottom: '1px solid #E2E8F0' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, display: 'flex', gap: '0.5rem', margin: 0 }}>
          {activeTab === 'notifications' ? <Bell /> : <MessageSquare />} 
          {activeTab === 'notifications' ? 'Notifications' : 'Messages'}
        </h2>
        <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}><X /></button>
      </div>

      <div style={{ display: 'flex', borderBottom: '1px solid #E2E8F0' }}>
        <button 
          style={{ flex: 1, padding: '1rem', background: 'transparent', border: 'none', borderBottom: activeTab === 'notifications' ? '2px solid var(--color-primary)' : 'none', fontWeight: activeTab === 'notifications' ? 600 : 400, cursor: 'pointer' }}
          onClick={() => { setActiveTab('notifications'); }}
        >
          Notifications
        </button>
        <button 
          style={{ flex: 1, padding: '1rem', background: 'transparent', border: 'none', borderBottom: activeTab === 'messages' ? '2px solid var(--color-primary)' : 'none', fontWeight: activeTab === 'messages' ? 600 : 400, cursor: 'pointer' }}
          onClick={() => { setActiveTab('messages'); }}
        >
          Messages
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', backgroundColor: '#F8FAFC', display: 'flex', flexDirection: 'column' }}>
        {activeTab === 'notifications' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem' }}>
            {notifications.map(n => (
              <div key={n.id} style={{ padding: '1rem', backgroundColor: '#fff', borderRadius: '8px', borderLeft: n.is_read ? '4px solid #E2E8F0' : '4px solid var(--color-primary)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontWeight: 600 }}>{n.title}</h4>
                <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{n.message}</p>
                {!n.is_read && (
                  <button className="btn btn-outline" style={{ marginTop: '0.5rem', padding: '0.25rem 0.5rem', fontSize: '0.75rem' }} onClick={() => handleReadNotification(n.id)}>
                    Mark as Read
                  </button>
                )}
              </div>
            ))}
            {notifications.length === 0 && <p style={{ textAlign: 'center', color: '#94A3B8' }}>No notifications.</p>}
          </div>
        )}

        {activeTab === 'messages' && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {chatView === 'list' ? (
              <div style={{ flex: 1, overflowY: 'auto', backgroundColor: '#fff' }}>
                {chatPartners.map(p => (
                   <div 
                     key={p.id} 
                     onClick={() => { setChatPartnerId(p.id); setChatView('chat'); }} 
                     style={{ padding: '1rem', borderBottom: '1px solid #E2E8F0', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem' }}
                     onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F1F5F9'}
                     onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}
                   >
                      <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--color-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>
                         {p.name.charAt(0).toUpperCase()}
                      </div>
                      <div style={{ flex: 1 }}>
                         <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.125rem' }}>
                           <div style={{ fontWeight: 600, fontSize: '1rem', color: '#1E293B' }}>{p.name}</div>
                           {p.lastMessageTime && <div style={{ fontSize: '0.75rem', color: p.unreadCount > 0 ? '#25D366' : '#94A3B8' }}>{new Date(p.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>}
                         </div>
                         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                           <div style={{ fontSize: '0.85rem', color: '#64748B', textTransform: 'capitalize' }}>{p.role}</div>
                           {p.unreadCount > 0 && <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#25D366', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 'bold' }}>{p.unreadCount}</div>}
                         </div>
                      </div>
                   </div>
                ))}
                {chatPartners.length === 0 && <div style={{ padding: '2rem', textAlign: 'center', color: '#64748B' }}>No active users available to message.</div>}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                {/* Chat Header */}
                <div style={{ padding: '0.75rem 1rem', backgroundColor: '#F0F2F5', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                   <button onClick={() => setChatView('list')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '0.5rem' }}>
                     <ArrowLeft size={20} color="#54656F" />
                   </button>
                   <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--color-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                      {activePartner?.name.charAt(0).toUpperCase()}
                   </div>
                   <div>
                     <div style={{ fontWeight: 600, fontSize: '1rem', color: '#111B21' }}>{activePartner?.name}</div>
                     <div style={{ fontSize: '0.75rem', color: '#667781', textTransform: 'capitalize' }}>{activePartner?.role}</div>
                   </div>
                </div>

                {/* Messages Body */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '1rem', backgroundColor: '#E5DDD5', overflowY: 'auto' }}>
                  {messages.map(m => {
                    const isPartner = m.sender_id === parseInt(chatPartnerId);
                    const timeStr = new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    return (
                      <div key={m.id} style={{ 
                        padding: '0.5rem 0.75rem', 
                        borderRadius: isPartner ? '0 8px 8px 8px' : '8px 0 8px 8px', 
                        maxWidth: '85%',
                        alignSelf: isPartner ? 'flex-start' : 'flex-end',
                        backgroundColor: isPartner ? '#FFFFFF' : '#DCF8C6',
                        color: '#111B21',
                        boxShadow: '0 1px 0.5px rgba(11,20,26,0.13)',
                        display: 'flex',
                        flexDirection: 'column'
                      }}>
                        <span style={{ fontSize: '0.95rem', lineHeight: '1.4' }}>{m.content}</span>
                        <span style={{ fontSize: '0.65rem', color: '#667781', alignSelf: 'flex-end', marginTop: '0.1rem', marginBottom: '-0.2rem' }}>{timeStr}</span>
                      </div>
                    );
                  })}
                  {messages.length === 0 && chatPartnerId && (
                    <div style={{ alignSelf: 'center', backgroundColor: '#FFEECD', color: '#54656F', padding: '0.5rem 1rem', borderRadius: '16px', fontSize: '0.85rem', marginTop: '1rem', boxShadow: '0 1px 0.5px rgba(11,20,26,0.13)' }}>
                      No messages yet. Send a message to start!
                    </div>
                  )}
                </div>

                {/* Input Area */}
                <div style={{ padding: '0.75rem', backgroundColor: '#F0F2F5', display: 'flex', gap: '0.5rem' }}>
                  <input 
                    type="text" 
                    value={newMessage} 
                    onChange={(e) => setNewMessage(e.target.value)} 
                    placeholder="Type a message" 
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    style={{ flex: 1, padding: '0.75rem 1rem', borderRadius: '24px', border: 'none', outline: 'none', backgroundColor: '#fff' }} 
                  />
                  <button className="btn btn-primary" style={{ borderRadius: '24px', padding: '0.5rem 1.25rem' }} disabled={!chatPartnerId} onClick={handleSendMessage}>Send</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
