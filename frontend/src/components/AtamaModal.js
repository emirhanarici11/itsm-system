import React, { useState, useEffect } from 'react';
import { getPersoneller } from '../services/api';

function AtamaModal({ mevcutAtanan, onKapat, onAta }) {
  const [personeller, setPersoneller] = useState([]);
  const [secilen, setSecilen] = useState('');
  const [yukleniyor, setYukleniyor] = useState(false);

  useEffect(() => {
    getPersoneller().then(res => setPersoneller(res.data));
  }, []);

  const handleAta = async () => {
    if (!secilen) return;
    setYukleniyor(true);
    await onAta(secilen);
    setYukleniyor(false);
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h3 style={styles.title}>Kayıt Ata</h3>
          <button style={styles.kapatBtn} onClick={onKapat}>✕</button>
        </div>
        <div style={styles.body}>
          {mevcutAtanan && (
            <div style={styles.mevcutBox}>
              <span style={styles.mevcutLabel}>Şu an atanan:</span>
              <span style={styles.mevcutDeger}>{mevcutAtanan}</span>
            </div>
          )}
          <div style={styles.field}>
            <label style={styles.label}>Personel Seç</label>
            <div style={styles.personelListe}>
              {personeller.map(p => (
                <div
                  key={p.id}
                  style={{
                    ...styles.personelItem,
                    backgroundColor: secilen === `${p.ad} ${p.soyad}` ? '#e8f0fe' : '#fff',
                    borderColor: secilen === `${p.ad} ${p.soyad}` ? '#1a73e8' : '#e0e0e0'
                  }}
                  onClick={() => setSecilen(`${p.ad} ${p.soyad}`)}
                >
                  <div style={styles.personelAvatar}>
                    {p.ad[0]}{p.soyad[0]}
                  </div>
                  <div>
                    <div style={styles.personelAd}>{p.ad} {p.soyad}</div>
                    <div style={styles.personelUsername}>@{p.username}</div>
                  </div>
                  {secilen === `${p.ad} ${p.soyad}` && (
                    <div style={styles.secilenIsaret}>✓</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={styles.footer}>
          <button style={styles.iptalBtn} onClick={onKapat}>İptal</button>
          <button
            style={!secilen || yukleniyor ? styles.btnDisabled : styles.btn}
            onClick={handleAta}
            disabled={!secilen || yukleniyor}
          >
            {yukleniyor ? 'Atanıyor...' : 'Ata'}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal: { backgroundColor: '#fff', borderRadius: '16px', width: '420px', boxShadow: '0 8px 32px rgba(0,0,0,0.2)', overflow: 'hidden' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #f1f3f4' },
  title: { fontSize: '16px', fontWeight: '600', color: '#202124', margin: 0 },
  kapatBtn: { background: 'none', border: 'none', fontSize: '16px', cursor: 'pointer', color: '#5f6368' },
  body: { padding: '24px' },
  mevcutBox: { display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#f8f9fa', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' },
  mevcutLabel: { color: '#5f6368' },
  mevcutDeger: { color: '#202124', fontWeight: '500' },
  field: { marginBottom: '8px' },
  label: { display: 'block', fontSize: '13px', fontWeight: '500', color: '#202124', marginBottom: '10px' },
  personelListe: { display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '240px', overflowY: 'auto' },
  personelItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '10px', border: '1px solid #e0e0e0', cursor: 'pointer', transition: 'all .15s' },
  personelAvatar: { width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#e8f0fe', color: '#1a73e8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '13px', flexShrink: 0 },
  personelAd: { fontSize: '13px', fontWeight: '500', color: '#202124' },
  personelUsername: { fontSize: '12px', color: '#5f6368', marginTop: '2px' },
  secilenIsaret: { marginLeft: 'auto', color: '#1a73e8', fontWeight: '700', fontSize: '16px' },
  footer: { display: 'flex', justifyContent: 'flex-end', gap: '8px', padding: '16px 24px', borderTop: '1px solid #f1f3f4' },
  iptalBtn: { padding: '10px 20px', border: '1px solid #e0e0e0', borderRadius: '8px', backgroundColor: '#fff', cursor: 'pointer', fontSize: '13px', color: '#5f6368' },
  btn: { padding: '10px 20px', background: 'linear-gradient(135deg, #1a73e8, #0d47a1)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '500' },
  btnDisabled: { padding: '10px 20px', backgroundColor: '#ccc', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', cursor: 'not-allowed' },
};

export default AtamaModal;