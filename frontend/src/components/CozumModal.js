import React, { useState } from 'react';

function CozumModal({ onKapat, onGonder }) {
  const [aciklama, setAciklama] = useState('');
  const [hata, setHata] = useState('');
  const [yukleniyor, setYukleniyor] = useState(false);

  const handleGonder = async () => {
    if (!aciklama.trim()) {
      setHata('Çözüm açıklaması zorunludur');
      return;
    }
    setYukleniyor(true);
    setHata('');
    await onGonder(aciklama);
    setYukleniyor(false);
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h3 style={styles.title}>✅ Kayıt Çözüldü Olarak Kapat</h3>
          <button style={styles.kapatBtn} onClick={onKapat}>✕</button>
        </div>
        <div style={styles.body}>
          <p style={styles.bilgi}>
            Kaydı kapatmadan önce kullanıcıya çözüm açıklaması gönderin. Bu mesaj kullanıcıya yeşil kutucukta görünecektir.
          </p>
          <div style={styles.field}>
            <label style={styles.label}>Çözüm Açıklaması *</label>
            <textarea
              style={styles.textarea}
              rows={4}
              placeholder="Sorunu nasıl çözdüğünüzü açıklayın..."
              value={aciklama}
              onChange={(e) => setAciklama(e.target.value)}
              autoFocus
            />
          </div>
          {hata && <div style={styles.hata}>⚠️ {hata}</div>}
        </div>
        <div style={styles.footer}>
          <button style={styles.iptalBtn} onClick={onKapat}>İptal</button>
          <button
            style={yukleniyor ? styles.btnDisabled : styles.btn}
            onClick={handleGonder}
            disabled={yukleniyor}
          >
            {yukleniyor ? 'Gönderiliyor...' : '✅ Çözüldü Olarak Kapat'}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal: { backgroundColor: '#fff', borderRadius: '16px', width: '480px', boxShadow: '0 8px 32px rgba(0,0,0,0.2)', overflow: 'hidden' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #f1f3f4', backgroundColor: '#e8f5e9' },
  title: { fontSize: '16px', fontWeight: '600', color: '#2e7d32', margin: 0 },
  kapatBtn: { background: 'none', border: 'none', fontSize: '16px', cursor: 'pointer', color: '#5f6368' },
  body: { padding: '24px' },
  bilgi: { fontSize: '13px', color: '#5f6368', marginBottom: '16px', lineHeight: '1.6', backgroundColor: '#f8f9fa', padding: '12px', borderRadius: '8px' },
  field: { marginBottom: '16px' },
  label: { display: 'block', fontSize: '13px', fontWeight: '500', color: '#202124', marginBottom: '6px' },
  textarea: { width: '100%', padding: '10px 14px', fontSize: '14px', border: '1px solid #e0e0e0', borderRadius: '8px', outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box', backgroundColor: '#fafafa' },
  hata: { backgroundColor: '#fce8e6', color: '#c5221f', padding: '10px', borderRadius: '8px', fontSize: '13px' },
  footer: { display: 'flex', justifyContent: 'flex-end', gap: '8px', padding: '16px 24px', borderTop: '1px solid #f1f3f4' },
  iptalBtn: { padding: '10px 20px', border: '1px solid #e0e0e0', borderRadius: '8px', backgroundColor: '#fff', cursor: 'pointer', fontSize: '13px', color: '#5f6368' },
  btn: { padding: '10px 20px', background: 'linear-gradient(135deg, #34a853, #2e7d32)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '500' },
  btnDisabled: { padding: '10px 20px', backgroundColor: '#ccc', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', cursor: 'not-allowed' },
};

export default CozumModal;