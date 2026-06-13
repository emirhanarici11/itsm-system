import React, { useState, useEffect, useRef } from 'react';
import { getPersoneller } from '../services/api';

function YorumKutusu({ onGonder }) {
  const [metin, setMetin] = useState('');
  const [personeller, setPersoneller] = useState([]);
  const [oneri, setOneri] = useState([]);
  const [gosteriyor, setGosteriyor] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    getPersoneller().then(res => setPersoneller(res.data));
  }, []);

  const handleChange = (e) => {
    const val = e.target.value;
    setMetin(val);
    const cursorPos = e.target.selectionStart;
    const textBeforeCursor = val.substring(0, cursorPos);
    const atIndex = textBeforeCursor.lastIndexOf('@');
    if (atIndex !== -1) {
      const aramaMetni = textBeforeCursor.substring(atIndex + 1).toLowerCase();
      if (!aramaMetni.includes(' ')) {
        const eslesen = personeller.filter(p =>
          `${p.username}`.toLowerCase().includes(aramaMetni) ||
          `${p.ad} ${p.soyad}`.toLowerCase().includes(aramaMetni)
        );
        setOneri(eslesen);
        setGosteriyor(eslesen.length > 0);
        return;
      }
    }
    setGosteriyor(false);
  };

  const handleSecim = (p) => {
    const cursorPos = textareaRef.current.selectionStart;
    const textBeforeCursor = metin.substring(0, cursorPos);
    const atIndex = textBeforeCursor.lastIndexOf('@');
    const yeniMetin = metin.substring(0, atIndex) + `@${p.username} ` + metin.substring(cursorPos);
    setMetin(yeniMetin);
    setGosteriyor(false);
    textareaRef.current.focus();
  };

  const handleGonder = () => {
    if (!metin.trim()) return;
    onGonder(metin);
    setMetin('');
  };

  return (
    <div style={styles.container}>
      {gosteriyor && (
        <div style={styles.oneriListe}>
          {oneri.map(p => (
            <div key={p.id} style={styles.oneriItem} onClick={() => handleSecim(p)}>
              <div style={styles.oneriAvatar}>{p.ad[0]}{p.soyad[0]}</div>
              <div>
                <div style={styles.oneriAd}>{p.ad} {p.soyad}</div>
                <div style={styles.oneriUsername}>@{p.username}</div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div style={styles.inputRow}>
        <textarea
          ref={textareaRef}
          style={styles.textarea}
          rows={2}
          placeholder="Yorum ekle... (@kullanici ile etiketleyebilirsiniz)"
          value={metin}
          onChange={handleChange}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setGosteriyor(false);
          }}
        />
        <button style={styles.btn} onClick={handleGonder}>Ekle</button>
      </div>
    </div>
  );
}

const styles = {
  container: { position: 'relative', marginTop: '12px' },
  oneriListe: { position: 'absolute', bottom: '100%', left: 0, right: 0, backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '10px', boxShadow: '0 4px 16px rgba(0,0,0,0.12)', marginBottom: '4px', zIndex: 100, overflow: 'hidden' },
  oneriItem: { display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', cursor: 'pointer', transition: 'background .15s' },
  oneriAvatar: { width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#e8f0fe', color: '#1a73e8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '12px', flexShrink: 0 },
  oneriAd: { fontSize: '13px', fontWeight: '500', color: '#202124' },
  oneriUsername: { fontSize: '12px', color: '#5f6368' },
  inputRow: { display: 'flex', gap: '8px' },
  textarea: { flex: 1, padding: '10px 12px', fontSize: '13px', border: '1px solid #e0e0e0', borderRadius: '8px', resize: 'none', fontFamily: 'inherit', outline: 'none' },
  btn: { padding: '10px 18px', backgroundColor: '#1a73e8', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '500' },
};

export default YorumKutusu;