import React, { useState } from 'react';
import { gorevOlustur } from '../services/api';

function GorevModal({ ticketId, onKapat, onGorevEklendi }) {
  const [form, setForm] = useState({ baslik: '', aciklama: '', atanan: '', sonTarih: '' });
  const [hata, setHata] = useState('');
  const [yukleniyor, setYukleniyor] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.baslik) {
      setHata('Görev başlığı zorunludur');
      return;
    }
    setYukleniyor(true);
    setHata('');
    try {
      const res = await gorevOlustur(ticketId, form);
      onGorevEklendi(res.data);
      onKapat();
    } catch {
      setHata('Bir hata oluştu');
    }
    setYukleniyor(false);
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h3 style={styles.title}>📋 Görev Oluştur</h3>
          <button style={styles.kapatBtn} onClick={onKapat}>✕</button>
        </div>
        <div style={styles.body}>
          <div style={styles.field}>
            <label style={styles.label}>Görev Başlığı *</label>
            <input style={styles.input} name="baslik" value={form.baslik} onChange={handleChange} placeholder="Görevin kısa başlığı" />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Açıklama</label>
            <textarea style={styles.textarea} name="aciklama" value={form.aciklama} onChange={handleChange} placeholder="Görev detayları..." rows={3} />
          </div>
          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Atanan Kişi</label>
              <input style={styles.input} name="atanan" value={form.atanan} onChange={handleChange} placeholder="Personel adı" />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Son Tarih</label>
              <input style={styles.input} type="datetime-local" name="sonTarih" value={form.sonTarih} onChange={handleChange} />
            </div>
          </div>
          {hata && <div style={styles.hata}>⚠️ {hata}</div>}
        </div>
        <div style={styles.footer}>
          <button style={styles.iptalBtn} onClick={onKapat}>İptal</button>
          <button style={yukleniyor ? styles.btnDisabled : styles.btn} onClick={handleSubmit} disabled={yukleniyor}>
            {yukleniyor ? 'Oluşturuluyor...' : '📋 Görevi Oluştur'}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal: { backgroundColor: '#fff', borderRadius: '16px', width: '480px', boxShadow: '0 8px 32px rgba(0,0,0,0.2)', overflow: 'hidden' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #f1f3f4' },
  title: { fontSize: '16px', fontWeight: '600', color: '#202124', margin: 0 },
  kapatBtn: { background: 'none', border: 'none', fontSize: '16px', cursor: 'pointer', color: '#5f6368' },
  body: { padding: '24px' },
  row: { display: 'flex', gap: '12px' },
  field: { flex: 1, marginBottom: '16px' },
  label: { display: 'block', fontSize: '13px', fontWeight: '500', color: '#202124', marginBottom: '6px' },
  input: { width: '100%', padding: '10px 14px', fontSize: '14px', border: '1px solid #e0e0e0', borderRadius: '8px', outline: 'none', boxSizing: 'border-box', backgroundColor: '#fafafa' },
  textarea: { width: '100%', padding: '10px 14px', fontSize: '14px', border: '1px solid #e0e0e0', borderRadius: '8px', outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box', backgroundColor: '#fafafa' },
  hata: { backgroundColor: '#fce8e6', color: '#c5221f', padding: '10px', borderRadius: '8px', fontSize: '13px' },
  footer: { display: 'flex', justifyContent: 'flex-end', gap: '8px', padding: '16px 24px', borderTop: '1px solid #f1f3f4' },
  iptalBtn: { padding: '10px 20px', border: '1px solid #e0e0e0', borderRadius: '8px', backgroundColor: '#fff', cursor: 'pointer', fontSize: '13px', color: '#5f6368' },
  btn: { padding: '10px 20px', background: 'linear-gradient(135deg, #1a73e8, #0d47a1)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '500' },
  btnDisabled: { padding: '10px 20px', backgroundColor: '#ccc', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', cursor: 'not-allowed' },
};

export default GorevModal;