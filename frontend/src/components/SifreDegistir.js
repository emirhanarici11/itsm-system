import React, { useState } from 'react';
import { sifreDegistir } from '../services/api';

function SifreDegistir({ onKapat }) {
  const [form, setForm] = useState({ eskiSifre: '', yeniSifre: '', yeniSifreTekrar: '' });
  const [hata, setHata] = useState('');
  const [basari, setBasari] = useState('');
  const [yukleniyor, setYukleniyor] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.eskiSifre || !form.yeniSifre || !form.yeniSifreTekrar) {
      setHata('Tüm alanlar zorunludur');
      return;
    }
    if (form.yeniSifre !== form.yeniSifreTekrar) {
      setHata('Yeni şifreler eşleşmiyor');
      return;
    }
    if (form.yeniSifre.length < 6) {
      setHata('Yeni şifre en az 6 karakter olmalıdır');
      return;
    }
    setYukleniyor(true);
    setHata('');
    try {
      await sifreDegistir(form.eskiSifre, form.yeniSifre);
      setBasari('Şifreniz başarıyla değiştirildi!');
      setForm({ eskiSifre: '', yeniSifre: '', yeniSifreTekrar: '' });
      setTimeout(() => onKapat(), 2000);
    } catch (err) {
      setHata(err.response?.data?.hata || 'Bir hata oluştu');
    }
    setYukleniyor(false);
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h3 style={styles.title}>🔐 Şifre Değiştir</h3>
          <button style={styles.kapatBtn} onClick={onKapat}>✕</button>
        </div>

        <div style={styles.body}>
          <div style={styles.field}>
            <label style={styles.label}>Mevcut Şifre</label>
            <input
              style={styles.input}
              type="password"
              name="eskiSifre"
              placeholder="Mevcut şifreniz"
              value={form.eskiSifre}
              onChange={handleChange}
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Yeni Şifre</label>
            <input
              style={styles.input}
              type="password"
              name="yeniSifre"
              placeholder="En az 6 karakter"
              value={form.yeniSifre}
              onChange={handleChange}
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Yeni Şifre Tekrar</label>
            <input
              style={styles.input}
              type="password"
              name="yeniSifreTekrar"
              placeholder="Yeni şifrenizi tekrar girin"
              value={form.yeniSifreTekrar}
              onChange={handleChange}
            />
          </div>

          {hata && <div style={styles.hata}>⚠️ {hata}</div>}
          {basari && <div style={styles.basari}>✅ {basari}</div>}
        </div>

        <div style={styles.footer}>
          <button style={styles.iptalBtn} onClick={onKapat}>İptal</button>
          <button
            style={yukleniyor ? styles.btnDisabled : styles.btn}
            onClick={handleSubmit}
            disabled={yukleniyor}
          >
            {yukleniyor ? 'Değiştiriliyor...' : 'Şifreyi Değiştir'}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal: { backgroundColor: '#fff', borderRadius: '16px', width: '400px', boxShadow: '0 8px 32px rgba(0,0,0,0.2)', overflow: 'hidden' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #f1f3f4' },
  title: { fontSize: '16px', fontWeight: '600', color: '#202124', margin: 0 },
  kapatBtn: { background: 'none', border: 'none', fontSize: '16px', cursor: 'pointer', color: '#5f6368', padding: '4px 8px' },
  body: { padding: '24px' },
  field: { marginBottom: '16px' },
  label: { display: 'block', fontSize: '13px', fontWeight: '500', color: '#202124', marginBottom: '6px' },
  input: { width: '100%', padding: '10px 14px', fontSize: '14px', border: '1px solid #e0e0e0', borderRadius: '8px', outline: 'none', boxSizing: 'border-box', backgroundColor: '#fafafa' },
  hata: { backgroundColor: '#fce8e6', color: '#c5221f', padding: '10px', borderRadius: '8px', fontSize: '13px', marginTop: '8px' },
  basari: { backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '10px', borderRadius: '8px', fontSize: '13px', marginTop: '8px' },
  footer: { display: 'flex', justifyContent: 'flex-end', gap: '8px', padding: '16px 24px', borderTop: '1px solid #f1f3f4' },
  iptalBtn: { padding: '10px 20px', border: '1px solid #e0e0e0', borderRadius: '8px', backgroundColor: '#fff', cursor: 'pointer', fontSize: '13px', color: '#5f6368' },
  btn: { padding: '10px 20px', background: 'linear-gradient(135deg, #1a73e8, #0d47a1)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '500' },
  btnDisabled: { padding: '10px 20px', backgroundColor: '#ccc', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', cursor: 'not-allowed' },
};

export default SifreDegistir;