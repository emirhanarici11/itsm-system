import React, { useState } from 'react';
import { createTicket } from '../services/api';

function TalepFormu() {
  const [aktifSekme, setAktifSekme] = useState('sorun');
  const [form, setForm] = useState({
    ad: '', soyad: '', departman: '',
    kategori: 'Bilgisayar/Donanım sorunu',
    oncelik: 'Orta', konu: '', aciklama: ''
  });
  const [gonderildi, setGonderildi] = useState(false);
  const [refNo, setRefNo] = useState('');
  const [hata, setHata] = useState('');
  const [yukleniyor, setYukleniyor] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSekme = (sekme) => {
    setAktifSekme(sekme);
    setHata('');
    setForm({ ad: '', soyad: '', departman: '', kategori: sekme === 'sorun' ? 'Bilgisayar/Donanım sorunu' : 'Yazılım/Lisans talebi', oncelik: 'Orta', konu: '', aciklama: '' });
  };

  const handleSubmit = async () => {
    if (!form.ad || !form.soyad || !form.konu || !form.aciklama) {
      setHata('Lütfen zorunlu alanları doldurun.');
      return;
    }
    setYukleniyor(true);
    setHata('');
    try {
      const res = await createTicket({ ...form, tur: aktifSekme });
      setRefNo(res.data.refNo);
      setGonderildi(true);
    } catch {
      setHata('Bir hata oluştu, lütfen tekrar deneyin.');
    }
    setYukleniyor(false);
  };

  const sorunKategorileri = [
    'Bilgisayar/Donanım sorunu',
    'Yazılım/Program sorunu',
    'Ağ/İnternet sorunu',
  ];

  const talepKategorileri = [
    'Yazılım/Lisans talebi',
    'Yeni ekipman talebi',
    'Erişim/Yetki talebi',
    'Diğer talep',
  ];

  if (gonderildi) {
    return (
      <div style={styles.page}>
        <div style={styles.topbar}>
          <span style={styles.topbarIcon}>⚙️</span>
          <span style={styles.topbarTitle}>ITSM — IT Service Management</span>
          <a href="/panel" style={styles.panelLink}>BT Paneli →</a>
        </div>
        <div style={styles.successWrap}>
          <div style={styles.successCard}>
            <div style={styles.successIconWrap}>
              <span style={styles.successIcon}>✅</span>
            </div>
            <h2 style={styles.successTitle}>
              {aktifSekme === 'sorun' ? 'Sorun Kaydınız Alındı!' : 'Talep Kaydınız Alındı!'}
            </h2>
            <p style={styles.successText}>Referans numaranız:</p>
            <div style={styles.refNoBox}>{refNo}</div>
            <p style={styles.successAlt}>IT ekibimiz en kısa sürede sizinle iletişime geçecektir.</p>
            <button style={styles.yeniBtn} onClick={() => {
              setGonderildi(false);
              setForm({ ad: '', soyad: '', departman: '', kategori: 'Bilgisayar/Donanım sorunu', oncelik: 'Orta', konu: '', aciklama: '' });
            }}>
              + Yeni Kayıt Oluştur
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {/* Üst bar */}
      <div style={styles.topbar}>
        <span style={styles.topbarIcon}>⚙️</span>
        <span style={styles.topbarTitle}>ITSM — IT Service Management</span>
        <a href="/panel" style={styles.panelLink}>BT Paneli →</a>
      </div>

      {/* Hero */}
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Nasıl yardımcı olabiliriz?</h1>
        <p style={styles.heroSubtitle}>Sorun bildirimi veya hizmet talebi oluşturmak için aşağıdaki formu doldurun.</p>
      </div>

      {/* Sekmeler */}
      <div style={styles.sekmeWrap}>
        <div style={styles.sekmeBar}>
          <button
            style={aktifSekme === 'sorun' ? styles.sekmeAktif : styles.sekme}
            onClick={() => handleSekme('sorun')}
          >
            🔴 Sorun Kaydı
          </button>
          <button
            style={aktifSekme === 'talep' ? styles.sekmeAktif : styles.sekme}
            onClick={() => handleSekme('talep')}
          >
            🔵 Talep Kaydı
          </button>
        </div>
      </div>

      {/* Form */}
      <div style={styles.formWrap}>
        <div style={styles.formCard}>
          <div style={styles.formBaslik}>
            {aktifSekme === 'sorun' ? (
              <div>
                <h2 style={styles.formTitle}>🔴 Sorun Kaydı</h2>
                <p style={styles.formAlt}>Yaşadığınız teknik sorunu bildirin, ekibimiz en kısa sürede müdahale edecektir.</p>
              </div>
            ) : (
              <div>
                <h2 style={styles.formTitle}>🔵 Talep Kaydı</h2>
                <p style={styles.formAlt}>Yeni ekipman, yazılım veya erişim talebinizi oluşturun.</p>
              </div>
            )}
          </div>

          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Ad <span style={styles.required}>*</span></label>
              <input style={styles.input} name="ad" value={form.ad} onChange={handleChange} placeholder="Adınız" />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Soyad <span style={styles.required}>*</span></label>
              <input style={styles.input} name="soyad" value={form.soyad} onChange={handleChange} placeholder="Soyadınız" />
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Departman</label>
            <input style={styles.input} name="departman" value={form.departman} onChange={handleChange} placeholder="Çalıştığınız departman" />
          </div>

          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Kategori</label>
              <select style={styles.input} name="kategori" value={form.kategori} onChange={handleChange}>
                {(aktifSekme === 'sorun' ? sorunKategorileri : talepKategorileri).map(k => (
                  <option key={k}>{k}</option>
                ))}
              </select>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Öncelik</label>
              <select style={styles.input} name="oncelik" value={form.oncelik} onChange={handleChange}>
                <option>Düşük</option>
                <option>Orta</option>
                <option>Yüksek</option>
              </select>
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>
              {aktifSekme === 'sorun' ? 'Sorun Başlığı' : 'Talep Başlığı'}
              <span style={styles.required}> *</span>
            </label>
            <input
              style={styles.input}
              name="konu"
              value={form.konu}
              onChange={handleChange}
              placeholder={aktifSekme === 'sorun' ? 'Sorunun kısa başlığı' : 'Talebinizin kısa başlığı'}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>
              {aktifSekme === 'sorun' ? 'Sorun Açıklaması' : 'Talep Açıklaması'}
              <span style={styles.required}> *</span>
            </label>
            <textarea
              style={styles.textarea}
              name="aciklama"
              value={form.aciklama}
              onChange={handleChange}
              placeholder={aktifSekme === 'sorun' ? 'Sorununuzu detaylıca açıklayın...' : 'Talebinizi detaylıca açıklayın...'}
              rows={4}
            />
          </div>

          {hata && <div style={styles.hata}>⚠️ {hata}</div>}

          <button
            style={{
              ...( yukleniyor ? styles.btnDisabled : styles.btn),
              background: aktifSekme === 'sorun'
                ? 'linear-gradient(135deg, #e53935, #b71c1c)'
                : 'linear-gradient(135deg, #1a73e8, #0d47a1)'
            }}
            onClick={handleSubmit}
            disabled={yukleniyor}
          >
            {yukleniyor ? '⏳ Gönderiliyor...' : aktifSekme === 'sorun' ? '🔴 Sorunu Kaydet' : '🔵 Talebi Gönder'}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', backgroundColor: '#f8f9fa', fontFamily: 'Roboto, Arial, sans-serif' },
  topbar: { height: '56px', background: 'linear-gradient(135deg, #1a73e8, #0d47a1)', display: 'flex', alignItems: 'center', padding: '0 24px', gap: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' },
  topbarIcon: { fontSize: '20px' },
  topbarTitle: { color: '#fff', fontSize: '16px', fontWeight: '600', flex: 1 },
  panelLink: { color: 'rgba(255,255,255,0.85)', fontSize: '13px', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.3)', padding: '5px 12px', borderRadius: '20px' },
  hero: { background: 'linear-gradient(135deg, #1a73e8, #0d47a1)', padding: '40px 24px', textAlign: 'center', color: '#fff' },
  heroTitle: { fontSize: '28px', fontWeight: '700', marginBottom: '10px' },
  heroSubtitle: { fontSize: '15px', opacity: 0.85, maxWidth: '500px', margin: '0 auto', lineHeight: '1.6' },
  sekmeWrap: { display: 'flex', justifyContent: 'center', padding: '24px 24px 0' },
  sekmeBar: { display: 'flex', backgroundColor: '#fff', borderRadius: '12px', padding: '4px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', gap: '4px' },
  sekme: { padding: '10px 28px', border: 'none', borderRadius: '10px', backgroundColor: 'transparent', cursor: 'pointer', fontSize: '14px', fontWeight: '500', color: '#5f6368' },
  sekmeAktif: { padding: '10px 28px', border: 'none', borderRadius: '10px', backgroundColor: '#f1f3f4', cursor: 'pointer', fontSize: '14px', fontWeight: '600', color: '#202124', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' },
  formWrap: { maxWidth: '640px', margin: '16px auto', padding: '0 24px 40px' },
  formCard: { backgroundColor: '#fff', borderRadius: '16px', padding: '32px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
  formBaslik: { marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #f1f3f4' },
  formTitle: { fontSize: '18px', fontWeight: '600', color: '#202124', marginBottom: '6px' },
  formAlt: { fontSize: '13px', color: '#5f6368' },
  row: { display: 'flex', gap: '16px' },
  field: { flex: 1, marginBottom: '18px' },
  label: { display: 'block', fontSize: '13px', fontWeight: '500', color: '#202124', marginBottom: '6px' },
  required: { color: '#c5221f' },
  input: { width: '100%', padding: '10px 14px', fontSize: '14px', border: '1px solid #e0e0e0', borderRadius: '8px', outline: 'none', boxSizing: 'border-box', backgroundColor: '#fafafa' },
  textarea: { width: '100%', padding: '10px 14px', fontSize: '14px', border: '1px solid #e0e0e0', borderRadius: '8px', outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box', backgroundColor: '#fafafa' },
  btn: { width: '100%', padding: '14px', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', marginTop: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' },
  btnDisabled: { width: '100%', padding: '14px', backgroundColor: '#ccc', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', cursor: 'not-allowed', marginTop: '8px' },
  hata: { backgroundColor: '#fce8e6', color: '#c5221f', padding: '12px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' },
  successWrap: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 56px)' },
  successCard: { backgroundColor: '#fff', borderRadius: '16px', padding: '48px 40px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', textAlign: 'center', maxWidth: '400px', width: '100%' },
  successIconWrap: { width: '72px', height: '72px', backgroundColor: '#e8f5e9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' },
  successIcon: { fontSize: '36px' },
  successTitle: { fontSize: '22px', fontWeight: '700', color: '#202124', marginBottom: '12px' },
  successText: { fontSize: '14px', color: '#5f6368', marginBottom: '8px' },
  refNoBox: { fontSize: '26px', fontWeight: '700', color: '#1a73e8', backgroundColor: '#e8f0fe', padding: '14px 28px', borderRadius: '10px', margin: '12px 0 20px', letterSpacing: '1px' },
  successAlt: { fontSize: '13px', color: '#5f6368', lineHeight: '1.6', marginBottom: '24px' },
  yeniBtn: { padding: '12px 24px', background: 'linear-gradient(135deg, #1a73e8, #0d47a1)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },
};

export default TalepFormu;