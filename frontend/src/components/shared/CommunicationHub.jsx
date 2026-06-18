import React, { useState, useEffect } from 'react';
import { getNotifications, markNotificationRead, getConversation, sendMessage, getTenants, getCaretakers } from '../../services/api';
import { Bell, MessageSquare, X } from 'lucide-react';

export default function CommunicationHub({ onClose }) {
  const [activeTab, setActiveTab] = useState('notifications');
  const [notifications, setNotifications] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatPartners, setChatPartners] = useState([]);
  const [chatPartnerId, setChatPartnerId] = useState('');

  useEffect(() => {
    fetchNotifications();
    fetchChatPartners();
  }, []);

  useEffect(() => {
    if (chatPartnerId) {
      fetchMessages();
    } else {
      setMessages([]);
    }
  }, [chatPartnerId]);

  const fetchChatPartners = async () => {
    try {
      const [tenantsRes, caretakersRes] = await Promise.all([
        getTenants().catch(() => []),
        getCaretakers().catch(() => [])
      ]);
      
      const partners = [];
      
      const tenants = Array.isArray(tenantsRes) ? tenantsRes : (tenantsRes.data || []);
      tenants.forEach(t => {
        if (t.user_id) partners.push({ id: t.user_id, name: `${t.first_name} ${t.last_name} (Tenant)` });
      });

      const caretakers = Array.isArray(caretakersRes) ? caretakersRes : (caretakersRes.data || []);
      caretakers.forEach(c => {
        if (c.user_id && c.name) partners.push({ id: c.user_id, name: `${c.name} (Caretaker)` });
      });

      setChatPartners(partners);
      if (partners.length > 0) {
        setChatPartnerId(partners[0].id);
      }
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
      await sendMessage({ receiverId: chatPartnerId, content: newMessage });
      setNewMessage('');
      fetchMessages();
    } catch (err) {
      alert("Failed to send message: Recipient not found or database error.");
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, right: 0, width: '400px', height: '100vh',
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
          onClick={() => setActiveTab('notifications')}
        >
          Notifications
        </button>
        <button 
          style={{ flex: 1, padding: '1rem', background: 'transparent', border: 'none', borderBottom: activeTab === 'messages' ? '2px solid var(--color-primary)' : 'none', fontWeight: activeTab === 'messages' ? 600 : 400, cursor: 'pointer' }}
          onClick={() => setActiveTab('messages')}
        >
          Messages
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', backgroundColor: '#F8FAFC' }}>
        {activeTab === 'notifications' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
            {chatPartners.length > 0 ? (
              <div style={{ padding: '0.5rem', borderBottom: '1px solid #E2E8F0' }}>
                <select 
                  value={chatPartnerId} 
                  onChange={(e) => setChatPartnerId(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #CBD5E1' }}
                >
                  {chatPartners.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            ) : (
              <div style={{ padding: '1rem', textAlign: 'center', color: '#64748B', fontSize: '0.875rem' }}>
                No active tenants or caretakers available to message.
              </div>
            )}

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '0.5rem 0' }}>
              {messages.map(m => (
                <div key={m.id} style={{ 
                  padding: '0.75rem', borderRadius: '8px', maxWidth: '80%',
                  alignSelf: m.sender_id === parseInt(chatPartnerId) ? 'flex-start' : 'flex-end',
                  backgroundColor: m.sender_id === parseInt(chatPartnerId) ? '#E2E8F0' : 'var(--color-primary)',
                  color: m.sender_id === parseInt(chatPartnerId) ? '#1E293B' : '#fff'
                }}>
                  {m.content}
                </div>
              ))}
              {messages.length === 0 && chatPartnerId && <p style={{ textAlign: 'center', color: '#94A3B8' }}>No messages yet.</p>}
            </div>
            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
              <input 
                type="text" 
                value={newMessage} 
                onChange={(e) => setNewMessage(e.target.value)} 
                placeholder="Type a message..." 
                style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0' }} 
              />
              <button className="btn btn-primary" disabled={!chatPartnerId} onClick={handleSendMessage}>Send</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
