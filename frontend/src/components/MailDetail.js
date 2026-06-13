import React, { useState } from 'react';
import { updateStatus, sendReply } from '../services/api';

function MailDetail({ mail, onStatusChange }) {
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');

  if (!mail) {
    return (
      <div style={styles.empty}>
        <span style={styles.emptyIcon}>📭</span>
        <span style={styles.emptyText}>Bir mail seçin</span>
      </div>
    );
  }

  const handleReply = async () => {
    if (!replyText.trim()) return;
    setSending(true);
    try {
      await sendReply(mail.id, replyText);
      await updateStatus(mail.id, 'closed');
      setReplyText('');
      setMessage('✅ Yanıt gönderildi ve mail kapatıldı.');
      onStatusChange(mail.id, 'closed');
    } catch (err) {
      setMessage('❌ Hata oluştu, tekrar deneyin.');
    }
    setSending(false);
  };

  const handleStatus = async (status) => {
    try {
      await updateStatus(mail.id, status);
      onStatusChange(mail.id, status);
      setMessage(`✅ Durum güncellendi: ${status === 'closed' ? 'Kapalı' : 'Beklemede'}`);
    } catch (err) {
      setMessage('❌ Hata oluştu.');
    }
  };

  return (
    <div style={styles.container}>
      {/* Başlık */}
      <div style={styles.header}>
        <h2 style={styles.subject}>{mail.subject}</h2>
        <div style={styles.meta}>
          <span><b>Kimden:</b> {mail.sender} &lt;{mail.email}&gt;</span>
          <span><b>Tarih:</b> {new Date(mail.date).toLocaleString('tr-TR')}</span>
        </div>
        <div style={styles.actions}>
          <button style={styles.btnSecondary} onClick={() => handleStatus('pending')}>Beklemede</button>
          <button style={styles.btnSecondary} onClick={() => handleStatus('closed')}>Kapat</button>
        </div>
      </div>

      {/* İçerik */}
      <div style={styles.body}>
        {mail.body.split('\n').map((line, i) => (
          <p key={i} style={{ margin: '4px 0' }}>{line}</p>
        ))}
      </div>

      {/* Yanıt */}
      <div style={styles.replyBox}>
        <div style={styles.replyHeader}>
          <span style={styles.replyLabel}>Yanıt Yaz</span>
          <span style={styles.replyTo}>Kime: {mail.email}</span>
        </div>
        <textarea
          style={styles.textarea}
          rows={4}
          placeholder="Yanıtınızı buraya yazın..."
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
        />
        {message && <div style={styles.message}>{message}</div>}
        <div style={styles.replyFooter}>
          <button
            style={sending ? styles.btnDisabled : styles.btnPrimary}
            onClick={handleReply}
            disabled={sending}
          >
            {sending ? 'Gönderiliyor...' : '📤 Gönder'}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' },
  empty: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' },
  emptyIcon: { fontSize: '48px' },
  emptyText: { fontSize: '14px', color: '#5f6368' },
  header: { padding: '20px 24px', borderBottom: '1px solid #e0e0e0' },
  subject: { fontSize: '18px', fontWeight: '600', color: '#202124', marginBottom: '8px' },
  meta: { display: 'flex', gap: '24px', fontSize: '13px', color: '#5f6368', marginBottom: '12px' },
  actions: { display: 'flex', gap: '8px' },
  body: { flex: 1, padding: '20px 24px', fontSize: '14px', color: '#202124', lineHeight: '1.7', overflowY: 'auto' },
  replyBox: { borderTop: '1px solid #e0e0e0', padding: '16px 24px', backgroundColor: '#f8f9fa' },
  replyHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' },
  replyLabel: { fontSize: '13px', fontWeight: '600', color: '#202124' },
  replyTo: { fontSize: '12px', color: '#5f6368' },
  textarea: { width: '100%', padding: '10px', fontSize: '13px', border: '1px solid #e0e0e0', borderRadius: '6px', resize: 'none', fontFamily: 'inherit', outline: 'none' },
  message: { fontSize: '12px', margin: '8px 0', color: '#202124' },
  replyFooter: { display: 'flex', justifyContent: 'flex-end', marginTop: '8px' },
  btnPrimary: { padding: '8px 16px', backgroundColor: '#1a73e8', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' },
  btnSecondary: { padding: '6px 12px', backgroundColor: '#fff', color: '#5f6368', border: '1px solid #e0e0e0', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' },
  btnDisabled: { padding: '8px 16px', backgroundColor: '#ccc', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '13px' }
};

export default MailDetail;