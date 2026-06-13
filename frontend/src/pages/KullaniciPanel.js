import React, { useState, useEffect } from 'react';
import { getBenimKayitlar, createTicket } from '../services/api';

function KullaniciPanel() {
  const [sekme, setSekme] = useState('kayitlarim');
  console.log('aktif sekme:', sekme);
  const [kayitlar, setKayitlar] = useState([]);
  const [selectedRefNo, setSelectedRefNo] = useState(null);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [mesaj, setMesaj] = useState('');

  const name = localStorage.getItem('name');
  const ad = localStorage.getItem('ad');
  const soyad = localStorage.getItem('soyad');
  const departman = localStorage.getItem('departman');

  const [form, setForm] = useState({
    ad: ad || '', soyad: soyad || '', departman: departman || '',
    kategori: 'Bilgisayar/Donanım sorunu',
    oncelik: 'Orta', konu: '', aciklama: '', tur: 'sorun'
  });
  const [gonderildi, setGonderildi] = useState(false);
  const [refNo, setRefNo] = useState('');
  const [hata, setHata] = useState('');
  const [formYukleniyor, setFormYukleniyor] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (!token || !role) {
      window.location.href = '/giris';
      return;
    }
    
    if (role === 'admin' || role === 'staff') {
      window.location.href = '/panel';
      return;
    }
    
    fetchKayitlar();
  }, []);

  const fetchKayitlar = async () => {
    try {
      const res = await getBenimKayitlar();
      setKayitlar(res.data);
    } catch (err) {
      console.error('Hata:', err);
      setYukleniyor(false);
    }
    setYukleniyor(false);
  };

  const handleCikis = () => {
    localStorage.clear();
    window.location.href = '/giris';
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.konu || !form.aciklama) {
      setHata('Konu ve açıklama zorunludur');
      return;
    }
    setFormYukleniyor(true);
    setHata('');
    try {
      const tokenData = JSON.parse(atob(localStorage.getItem('token').split('.')[1]));
      const userId = tokenData.id;
      console.log('userId:', userId);
      const res = await createTicket({ ...form, userId });
      setRefNo(res.data.refNo);
      setGonderildi(true);
      fetchKayitlar();
    } catch {
      setHata('Bir hata oluştu, tekrar deneyin');
    }
    setFormYukleniyor(false);
  };

  const durumRenk = (d) => d === 'Açık' ? { bg: '#fef7e0', color: '#b06000' } : d === 'Çözüldü' ? { bg: '#e8f5e9', color: '#2e7d32' } : { bg: '#f1f3f4', color: '#5f6368' };
  const oncelikRenk = (o) => o === 'Yüksek' ? { bg: '#fce8e6', color: '#c5221f' } : o === 'Orta' ? { bg: '#fef7e0', color: '#b06000' } : { bg: '#e8f5e9', color: '#2e7d32' };

  const selected = kayitlar.find(k => k.refNo === selectedRefNo);

  const sorunKategorileri = ['Bilgisayar/Donanım sorunu', 'Yazılım/Program sorunu', 'Ağ/İnternet sorunu'];
  const talepKategorileri = ['Yazılım/Lisans talebi', 'Yeni ekipman talebi', 'Erişim/Yetki talebi', 'Diğer talep'];

  return (
    <div style={styles.app}>
      {/* Üst bar */}
      <div style={styles.topbar}>
        <div style={styles.topbarLeft}>
          <span style={styles.topbarIcon}>⚙️</span>
          <span style={styles.topbarTitle}>ITSM — IT Service Management</span>
        </div>
        <div style={styles.topbarRight}>
          <span style={styles.userName}>👤 {name}</span>
          <button style={styles.cikisBtn} onClick={handleCikis}>Çıkış Yap</button>
        </div>
      </div>

      {mesaj && <div style={styles.toast}>{mesaj}</div>}

      <div style={styles.anaSekmeler}>
        <button style={sekme === 'kayitlarim' ? styles.anaSekmAktif : styles.anaSekmBtn} onClick={() => { setSekme('kayitlarim'); setSelectedRefNo(null); }}>
          📋 Kayıtlarım
          <span style={{ ...styles.sekmeSayi, backgroundColor: '#e8f0fe', color: '#1a73e8' }}>{kayitlar.filter(k => k.durum !== 'Çözüldü').length}</span>
        </button>
        <button style={sekme === 'cozuldu' ? styles.anaSekmAktif : styles.anaSekmBtn} onClick={() => { setSekme('cozuldu'); setSelectedRefNo(null); }}>
          ✅ Çözüldü
          <span style={{ ...styles.sekmeSayi, backgroundColor: '#e8f5e9', color: '#2e7d32' }}>{kayitlar.filter(k => k.durum === 'Çözüldü').length}</span>
        </button>
        <button style={sekme === 'yeni' ? styles.anaSekmAktif : styles.anaSekmBtn} onClick={() => { setSekme('yeni'); setGonderildi(false); }}>
          ➕ Yeni Kayıt
        </button>
      </div>

      {/* Kayıtlarım */}
      {(sekme === 'kayitlarim' || sekme === 'cozuldu') && (
        <div style={styles.main}>
          <div style={styles.sidebar}>
            <div style={styles.sidebarHeader}>
              <span style={styles.sidebarTitle}>Kayıtlarım ({kayitlar.length})</span>
            </div>
            {yukleniyor && <div style={styles.bos}>Yükleniyor...</div>}
            {!yukleniyor && kayitlar.length === 0 && <div style={styles.bos}>Henüz kayıt yok</div>}
            {kayitlar.filter(k => sekme === 'cozuldu' ? k.durum === 'Çözüldü' : k.durum !== 'Çözüldü').map(k => (
              <div key={k.refNo} onClick={() => setSelectedRefNo(k.refNo)} style={{
                ...styles.kayitItem,
                backgroundColor: selectedRefNo === k.refNo ? '#e8f0fe' : '#fff',
                borderLeft: selectedRefNo === k.refNo ? `3px solid ${k.tur === 'sorun' ? '#e53935' : '#1a73e8'}` : '3px solid transparent'
              }}>
                <div style={styles.kayitTop}>
                  <span style={{ ...styles.refNo, color: k.tur === 'sorun' ? '#e53935' : '#1a73e8' }}>{k.refNo}</span>
                  <span style={{ ...styles.tag, backgroundColor: durumRenk(k.durum).bg, color: durumRenk(k.durum).color }}>{k.durum}</span>
                </div>
                <div style={styles.kayitKonu}>{k.konu}</div>
                <div style={styles.kayitMeta}>
                  <span style={{ ...styles.tag, backgroundColor: oncelikRenk(k.oncelik).bg, color: oncelikRenk(k.oncelik).color }}>{k.oncelik}</span>
                  <span style={styles.kayitTarih}>{new Date(k.tarih).toLocaleDateString('tr-TR')}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Detay */}
          <div style={styles.detail}>
            {!selected ? (
              <div style={styles.empty}>
                <span style={{ fontSize: '56px' }}>📋</span>
                <span style={styles.emptyTitle}>Kayıt Seçin</span>
                <span style={styles.emptySubtitle}>Detayları görüntülemek için sol listeden bir kayıt seçin</span>
              </div>
            ) : (
              <div style={styles.detailInner}>
                <div style={styles.detailHeader}>
                  <div>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: selected.tur === 'sorun' ? '#e53935' : '#1a73e8' }}>{selected.refNo}</span>
                    <h2 style={styles.detailKonu}>{selected.konu}</h2>
                    <span style={styles.detailKategori}>📁 {selected.kategori}</span>
                  </div>
                  <span style={{ ...styles.tag, ...durumRenk(selected.durum), fontSize: '13px', padding: '6px 14px' }}>{selected.durum}</span>
                </div>

                <div style={styles.infoGrid}>
                  <div style={styles.infoKart}>
                    <span style={styles.infoLabel}>Öncelik</span>
                    <span style={{ ...styles.infoValue, color: oncelikRenk(selected.oncelik).color }}>{selected.oncelik}</span>
                  </div>
                  <div style={styles.infoKart}>
                    <span style={styles.infoLabel}>Durum</span>
                    <span style={{ ...styles.infoValue, color: durumRenk(selected.durum).color }}>{selected.durum}</span>
                  </div>
                  <div style={styles.infoKart}>
                    <span style={styles.infoLabel}>İnceleme</span>
                    <span style={styles.infoValue}>{selected.atandi ? '✅ İnceleniyor' : '⏳ Bekleniyor'}</span>
                  </div>
                  <div style={styles.infoKart}>
                    <span style={styles.infoLabel}>Oluşturulma</span>
                    <span style={styles.infoValue}>{new Date(selected.tarih).toLocaleString('tr-TR')}</span>
                  </div>
                </div>

                {/* Yorumlar */}
                <div style={styles.yorumlarBox}>
                  <div style={styles.yorumBaslik}>💬 BT Ekibi Yorumları ({selected.yorumlar.length})</div>
                  {selected.yorumlar.length === 0 && <div style={styles.yorumBos}>Henüz yorum yok</div>}
                  {selected.yorumlar.map((y, i) => (
                    <div key={i} style={y.tip === 'cozum' ? styles.cozumYorumItem : styles.yorumItem}>
                      <div style={styles.yorumHeader}>
                        <span style={{ ...styles.yorumYazar, color: y.tip === 'cozum' ? '#2e7d32' : '#1a73e8' }}>
                          {y.tip === 'cozum' ? '✅ Çözüm Açıklaması' : '👤 BT Ekibi'}
                        </span>
                        <span style={styles.yorumTarih}>{new Date(y.tarih).toLocaleString('tr-TR')}</span>
                      </div>
                      <p style={styles.yorumMetin}>{y.metin}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Yeni Kayıt */}
      {sekme === 'yeni' && (
        <div style={styles.formWrap}>
          {gonderildi ? (
            <div style={styles.successCard}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
              <h2 style={styles.successTitle}>Kaydınız Oluşturuldu!</h2>
              <p style={{ fontSize: '14px', color: '#5f6368', marginBottom: '8px' }}>Referans numaranız:</p>
              <div style={styles.refNoBox}>{refNo}</div>
              <p style={{ fontSize: '13px', color: '#5f6368', marginBottom: '24px' }}>IT ekibimiz en kısa sürede ilgilenecektir.</p>
              <button style={styles.yeniBtn} onClick={() => { setGonderildi(false); setForm({ ad, soyad, departman, kategori: 'Bilgisayar/Donanım sorunu', oncelik: 'Orta', konu: '', aciklama: '', tur: 'sorun' }); }}>
                + Yeni Kayıt Oluştur
              </button>
              <button style={{ ...styles.yeniBtn, backgroundColor: '#f1f3f4', color: '#202124', marginLeft: '8px' }} onClick={() => setSekme('kayitlarim')}>
                Kayıtlarıma Git
              </button>
            </div>
          ) : (
            <div style={styles.formCard}>
              <h2 style={styles.formTitle}>Yeni Kayıt Oluştur</h2>

              {/* Tür seçimi */}
              <div style={styles.turBar}>
                <button style={form.tur === 'sorun' ? styles.turAktif : styles.turBtn} onClick={() => setForm({ ...form, tur: 'sorun', kategori: 'Bilgisayar/Donanım sorunu' })}>🔴 Sorun Kaydı</button>
                <button style={form.tur === 'talep' ? { ...styles.turAktif, background: 'linear-gradient(135deg, #1a73e8, #0d47a1)' } : styles.turBtn} onClick={() => setForm({ ...form, tur: 'talep', kategori: 'Yazılım/Lisans talebi' })}>🔵 Talep Kaydı</button>
              </div>

              <div style={styles.infoBox}>
                <span>👤 {ad} {soyad}</span>
                {departman && <span>🏢 {departman}</span>}
              </div>

              <div style={styles.row}>
                <div style={styles.field}>
                  <label style={styles.label}>Kategori</label>
                  <select style={styles.input} name="kategori" value={form.kategori} onChange={handleChange}>
                    {(form.tur === 'sorun' ? sorunKategorileri : talepKategorileri).map(k => <option key={k}>{k}</option>)}
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
                <label style={styles.label}>Konu *</label>
                <input style={styles.input} name="konu" value={form.konu} onChange={handleChange} placeholder="Sorun veya talebinizin kısa başlığı" />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Açıklama *</label>
                <textarea style={styles.textarea} name="aciklama" value={form.aciklama} onChange={handleChange} placeholder="Detaylı açıklayın..." rows={4} />
              </div>

              {hata && <div style={styles.hataBox}>⚠️ {hata}</div>}

              <button style={formYukleniyor ? styles.btnDisabled : { ...styles.submitBtn, background: form.tur === 'sorun' ? 'linear-gradient(135deg, #e53935, #b71c1c)' : 'linear-gradient(135deg, #1a73e8, #0d47a1)' }} onClick={handleSubmit} disabled={formYukleniyor}>
                {formYukleniyor ? '⏳ Gönderiliyor...' : form.tur === 'sorun' ? '🔴 Sorunu Kaydet' : '🔵 Talebi Gönder'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  app: { display: 'flex', flexDirection: 'column', height: '100vh', fontFamily: 'Roboto, Arial, sans-serif', backgroundColor: '#f8f9fa' },
  topbar: { height: '56px', background: 'linear-gradient(135deg, #1a73e8, #0d47a1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', flexShrink: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' },
  topbarLeft: { display: 'flex', alignItems: 'center', gap: '10px' },
  topbarIcon: { fontSize: '20px' },
  topbarTitle: { color: '#fff', fontSize: '16px', fontWeight: '600' },
  topbarRight: { display: 'flex', alignItems: 'center', gap: '16px' },
  userName: { color: 'rgba(255,255,255,0.9)', fontSize: '13px' },
  cikisBtn: { padding: '6px 14px', backgroundColor: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '20px', cursor: 'pointer', fontSize: '12px' },
  toast: { position: 'fixed', top: '64px', right: '24px', backgroundColor: '#323232', color: '#fff', padding: '12px 20px', borderRadius: '8px', fontSize: '13px', zIndex: 999 },
  anaSekmeler: { display: 'flex', backgroundColor: '#fff', borderBottom: '1px solid #e0e0e0', padding: '0 24px', flexShrink: 0 },
  anaSekmBtn: { padding: '14px 20px', border: 'none', borderBottom: '3px solid transparent', backgroundColor: 'transparent', cursor: 'pointer', fontSize: '14px', fontWeight: '500', color: '#5f6368', display: 'flex', alignItems: 'center', gap: '8px' },
  anaSekmAktif: { padding: '14px 20px', border: 'none', borderBottom: '3px solid #1a73e8', backgroundColor: 'transparent', cursor: 'pointer', fontSize: '14px', fontWeight: '600', color: '#1a73e8', display: 'flex', alignItems: 'center', gap: '8px' },
  sekmeSayi: { fontSize: '11px', padding: '2px 8px', borderRadius: '10px', fontWeight: '600' },
  main: { display: 'flex', flex: 1, overflow: 'hidden' },
  sidebar: { width: '300px', borderRight: '1px solid #e0e0e0', overflowY: 'auto', flexShrink: 0, backgroundColor: '#fff' },
  sidebarHeader: { padding: '16px', borderBottom: '1px solid #f1f3f4' },
  sidebarTitle: { fontSize: '14px', fontWeight: '600', color: '#202124' },
  bos: { padding: '24px', textAlign: 'center', color: '#5f6368', fontSize: '13px' },
  kayitItem: { padding: '14px 16px', borderBottom: '1px solid #f1f3f4', cursor: 'pointer' },
  kayitTop: { display: 'flex', justifyContent: 'space-between', marginBottom: '6px' },
  refNo: { fontSize: '11px', fontWeight: '700', letterSpacing: '0.5px' },
  kayitKonu: { fontSize: '13px', color: '#202124', marginBottom: '8px', fontWeight: '500' },
  kayitMeta: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  kayitTarih: { fontSize: '11px', color: '#9aa0a6' },
  tag: { fontSize: '11px', padding: '2px 8px', borderRadius: '12px', fontWeight: '500' },
  detail: { flex: 1, overflowY: 'auto', backgroundColor: '#f8f9fa' },
  empty: { height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' },
  emptyTitle: { fontSize: '16px', fontWeight: '500', color: '#202124' },
  emptySubtitle: { fontSize: '13px', color: '#5f6368' },
  detailInner: { padding: '24px', maxWidth: '700px' },
  detailHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
  detailKonu: { fontSize: '18px', fontWeight: '600', color: '#202124', margin: '6px 0' },
  detailKategori: { fontSize: '12px', color: '#5f6368' },
  infoGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' },
  infoKart: { backgroundColor: '#fff', padding: '14px', borderRadius: '10px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', gap: '4px' },
  infoLabel: { fontSize: '11px', color: '#5f6368', textTransform: 'uppercase', letterSpacing: '0.5px' },
  infoValue: { fontSize: '14px', fontWeight: '500', color: '#202124' },
  yorumlarBox: { backgroundColor: '#fff', padding: '18px', borderRadius: '10px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  yorumBaslik: { fontSize: '13px', fontWeight: '600', color: '#202124', marginBottom: '12px' },
  yorumBos: { fontSize: '13px', color: '#5f6368', textAlign: 'center', padding: '16px 0' },
  yorumItem: { backgroundColor: '#f8f9fa', padding: '12px', borderRadius: '8px', marginBottom: '10px' },
  cozumYorumItem: { backgroundColor: '#e8f5e9', padding: '12px', borderRadius: '8px', marginBottom: '10px', border: '1px solid #a8d5b5' },
  yorumHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '6px' },
  yorumYazar: { fontWeight: '600', fontSize: '12px', color: '#1a73e8' },
  yorumTarih: { fontSize: '11px', color: '#5f6368' },
  yorumMetin: { fontSize: '13px', color: '#3c4043', margin: 0, lineHeight: '1.6' },
  formWrap: { flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', justifyContent: 'center' },
  formCard: { backgroundColor: '#fff', borderRadius: '16px', padding: '32px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', width: '100%', maxWidth: '580px', height: 'fit-content' },
  formTitle: { fontSize: '18px', fontWeight: '600', color: '#202124', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #f1f3f4' },
  turBar: { display: 'flex', gap: '8px', marginBottom: '20px' },
  turBtn: { flex: 1, padding: '10px', border: '1px solid #e0e0e0', borderRadius: '8px', backgroundColor: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: '500', color: '#5f6368' },
  turAktif: { flex: 1, padding: '10px', border: 'none', borderRadius: '8px', background: 'linear-gradient(135deg, #e53935, #b71c1c)', cursor: 'pointer', fontSize: '13px', fontWeight: '600', color: '#fff' },
  infoBox: { display: 'flex', gap: '16px', backgroundColor: '#e8f0fe', padding: '12px 16px', borderRadius: '8px', fontSize: '13px', color: '#1a73e8', marginBottom: '20px', fontWeight: '500' },
  row: { display: 'flex', gap: '16px' },
  field: { flex: 1, marginBottom: '16px' },
  label: { display: 'block', fontSize: '13px', fontWeight: '500', color: '#202124', marginBottom: '6px' },
  input: { width: '100%', padding: '10px 14px', fontSize: '14px', border: '1px solid #e0e0e0', borderRadius: '8px', outline: 'none', boxSizing: 'border-box', backgroundColor: '#fafafa' },
  textarea: { width: '100%', padding: '10px 14px', fontSize: '14px', border: '1px solid #e0e0e0', borderRadius: '8px', outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box', backgroundColor: '#fafafa' },
  submitBtn: { width: '100%', padding: '14px', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' },
  btnDisabled: { width: '100%', padding: '14px', backgroundColor: '#ccc', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', cursor: 'not-allowed' },
  hataBox: { backgroundColor: '#fce8e6', color: '#c5221f', padding: '12px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' },
  successCard: { backgroundColor: '#fff', borderRadius: '16px', padding: '48px 40px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', textAlign: 'center', maxWidth: '400px', width: '100%', margin: '0 auto' },
  successTitle: { fontSize: '22px', fontWeight: '700', color: '#202124', marginBottom: '12px' },
  refNoBox: { fontSize: '26px', fontWeight: '700', color: '#1a73e8', backgroundColor: '#e8f0fe', padding: '14px 28px', borderRadius: '10px', margin: '12px 0 20px', letterSpacing: '1px' },
  yeniBtn: { padding: '12px 24px', background: 'linear-gradient(135deg, #1a73e8, #0d47a1)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },
};

export default KullaniciPanel;