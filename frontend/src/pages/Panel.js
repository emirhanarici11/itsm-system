import React, { useState, useEffect } from 'react';
import { getTickets, updateDurum, addYorum, ataPersonel, getKullanicilar, onaylaKullanici, reddetKullanici, silKullanici, getGorevler, gorevDurumGuncelle, gorevSil, rolGuncelle, getAnaliz, getPersoneller, ataTiket } from '../services/api';
import SifreDegistir from '../components/SifreDegistir';
import GorevModal from '../components/GorevModal';
import CozumModal from '../components/CozumModal';
import AtamaModal from '../components/AtamaModal';
import YorumKutusu from '../components/YorumKutusu';
import Login from '../components/Login';

function Panel() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('token'));
  const [role, setRole] = useState(localStorage.getItem('role'));
  const [name, setName] = useState(localStorage.getItem('name'));
  const [tickets, setTickets] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [yorum, setYorum] = useState('');
  const [aktifSekme, setAktifSekme] = useState('sorun');
  const [filtre, setFiltre] = useState('Tümü');
  const [arama, setArama] = useState('');
  const [mesaj, setMesaj] = useState('');
  const [kullanicilar, setKullanicilar] = useState([]);
  const [kulSekme, setKulSekme] = useState('beklemede');
  const [sifreModal, setSifreModal] = useState(false);
  const [gorevModal, setGorevModal] = useState(false);
  const [gorevler, setGorevler] = useState([]);
  const [analiz, setAnaliz] = useState(null);
  const [cozumModal, setCozumModal] = useState(false);
  const [atamaModal, setAtamaModal] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (loggedIn) fetchTickets();
  }, [loggedIn]);

  const fetchTickets = async () => {
    try {
      const res = await getTickets();
      setTickets(res.data);
    } catch {
      handleCikis();
    }
  };

  const fetchKullanicilar = async () => {
    try {
      const res = await getKullanicilar();
      setKullanicilar(res.data);
    } catch {
      console.error('Kullanıcılar yüklenemedi');
    }
  };

  const fetchAnaliz = async () => {
    try {
      const res = await getAnaliz();
      setAnaliz(res.data);
    } catch {
      console.error('Analiz yüklenemedi');
    }
  };

  const handleLogin = (role, name) => {
    setRole(role);
    setName(name);
    setLoggedIn(true);
  };

  const handleCikis = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    setLoggedIn(false);
    setTickets([]);
    setSelectedId(null);
  };

  const handleDurum = async (id, durum) => {
    await updateDurum(id, durum);
    setTickets(prev => prev.map(t => t.id === id ? { ...t, durum } : t));
    goster('Durum güncellendi ✅');
  };

  const handleCozum = async (aciklama) => {
    await addYorum(selectedId, aciklama, 'cozum');
    await updateDurum(selectedId, 'Çözüldü');
    setTickets(prev => prev.map(t => t.id === selectedId ? {
      ...t,
      durum: 'Çözüldü',
      yorumlar: [...t.yorumlar, { yazar: name, metin: aciklama, tip: 'cozum', tarih: new Date().toISOString() }]
    } : t));
    setCozumModal(false);
    goster('Kayıt çözüldü olarak kapatıldı ✅');
  };

  const handleYorum = async () => {
    if (!yorum.trim()) return;
    const res = await addYorum(selectedId, yorum);
    setTickets(prev => prev.map(t => t.id === selectedId ? { ...t, yorumlar: [...t.yorumlar, res.data] } : t));
    setYorum('');
  };

  const handleAta = async (id) => {
    await ataPersonel(id, name);
    setTickets(prev => prev.map(t => t.id === id ? { ...t, atanan: name } : t));
    goster('Talep üstlenildi ✅');
  };

  const handleAtaPersonel = async (atanan) => {
    await ataTiket(selectedId, atanan);
    setTickets(prev => prev.map(t => t.id === selectedId ? { ...t, atanan } : t));
    setAtamaModal(false);
    goster(`Kayıt ${atanan} kişisine atandı ✅`);
  };

  const handleSekme = (sekme) => {
    setAktifSekme(sekme);
    setSelectedId(null);
    setFiltre('Tümü');
    setArama('');
    if (sekme === 'kullanicilar') fetchKullanicilar();
    if (sekme === 'analiz') fetchAnaliz();
  };

  const handleOnayla = async (id) => {
    await onaylaKullanici(id);
    setKullanicilar(prev => prev.map(k => k.id === id ? { ...k, durum: 'aktif' } : k));
    goster('Kullanıcı onaylandı ✅');
  };

  const handleReddet = async (id) => {
    await reddetKullanici(id);
    setKullanicilar(prev => prev.map(k => k.id === id ? { ...k, durum: 'reddedildi' } : k));
    goster('Kullanıcı reddedildi ❌');
  };

  const handleSil = async (id) => {
    await silKullanici(id);
    setKullanicilar(prev => prev.filter(k => k.id !== id));
    goster('Kullanıcı silindi 🗑️');
  };

  const handleRolGuncelle = async (id, role) => {
    await rolGuncelle(id, role);
    setKullanicilar(prev => prev.map(k => k.id === id ? { ...k, role } : k));
    goster(role === 'staff' ? 'BT yetkisi verildi 🔧' : role === 'admin' ? 'Yönetici yetkisi verildi 👑' : 'Yetki kaldırıldı 👤');
  };

  const goster = (msg) => {
    setMesaj(msg);
    setTimeout(() => setMesaj(''), 2500);
  };

  if (!loggedIn) return <Login onLogin={handleLogin} />;

  const sekmeTiketleri = tickets.filter(t => t.tur === aktifSekme);
  const filtreliTickets = sekmeTiketleri
    .filter(t => filtre === 'Tümü' || t.durum === filtre)
    .filter(t => arama === '' ||
      t.konu.toLowerCase().includes(arama.toLowerCase()) ||
      t.ad.toLowerCase().includes(arama.toLowerCase()) ||
      t.soyad.toLowerCase().includes(arama.toLowerCase()) ||
      t.refNo.toLowerCase().includes(arama.toLowerCase())
    );

  const selected = tickets.find(t => t.id === selectedId);

  const istatistik = {
    toplam: sekmeTiketleri.length,
    acik: sekmeTiketleri.filter(t => t.durum === 'Açık').length,
    beklemede: sekmeTiketleri.filter(t => t.durum === 'Beklemede').length,
    cozuldu: sekmeTiketleri.filter(t => t.durum === 'Çözüldü').length,
  };

  const oncelikRenk = (o) => o === 'Yüksek' ? { bg: '#fce8e6', color: '#c5221f' } : o === 'Orta' ? { bg: '#fef7e0', color: '#b06000' } : { bg: '#e8f5e9', color: '#2e7d32' };
  const durumRenk = (d) => d === 'Açık' ? { bg: '#fef7e0', color: '#b06000' } : d === 'Çözüldü' ? { bg: '#e8f5e9', color: '#2e7d32' } : { bg: '#f1f3f4', color: '#5f6368' };

  const sureDolduMu = (t) => {
    if (t.durum === 'Çözüldü' || !t.sonTarih) return false;
    return new Date() > new Date(t.sonTarih);
  };

  const kalanSure = (sonTarih) => {
    if (!sonTarih) return '';
    const kalan = new Date(sonTarih) - new Date();
    if (kalan <= 0) return 'Süre doldu';
    const saat = Math.floor(kalan / 3600000);
    const dakika = Math.floor((kalan % 3600000) / 60000);
    if (saat > 0) return `${saat}s ${dakika}dk kaldı`;
    return `${dakika}dk kaldı`;
  };

  const panelMi = aktifSekme === 'sorun' || aktifSekme === 'talep';

  return (
    <div style={styles.app}>
      <div style={styles.topbar}>
        <div style={styles.topbarLeft}>
          <i className="fa-solid fa-gear" style={{ fontSize: '18px', color: '#fff' }}></i>
          <span style={styles.topbarTitle}>ITSM — IT Service Management</span>
        </div>
        <div style={styles.topbarRight}>
          <span style={styles.userName}><i className="fa-solid fa-user" style={{ marginRight: '5px' }}></i>{name} · {role === 'admin' ? 'Yönetici' : 'Personel'}</span>
          <button style={styles.sifreBtn} onClick={() => setSifreModal(true)}><i className="fa-solid fa-lock" style={{ marginRight: '5px' }}></i>Şifre Değiştir</button>
          <button style={styles.cikisBtn} onClick={handleCikis}><i className="fa-solid fa-right-from-bracket" style={{ marginRight: '5px' }}></i>Çıkış Yap</button>
        </div>
      </div>

      {mesaj && <div style={styles.toast}>{mesaj}</div>}

      <div style={styles.anaSekmeler}>
        <button style={aktifSekme === 'sorun' ? styles.anaSekmAktif : styles.anaSekmBtn} onClick={() => handleSekme('sorun')}>
          <i className="fa-solid fa-triangle-exclamation" style={{ marginRight: '6px', color: aktifSekme === 'sorun' ? '#e53935' : '#5f6368' }}></i>Sorun Kayıtları
          <span style={{ ...styles.sekmeSayi, backgroundColor: aktifSekme === 'sorun' ? '#fce8e6' : '#f1f3f4', color: aktifSekme === 'sorun' ? '#c5221f' : '#5f6368' }}>
            {tickets.filter(t => t.tur === 'sorun').length}
          </span>
        </button>
        <button style={aktifSekme === 'talep' ? styles.anaSekmAktif : styles.anaSekmBtn} onClick={() => handleSekme('talep')}>
          <i className="fa-solid fa-clipboard-list" style={{ marginRight: '6px', color: aktifSekme === 'talep' ? '#1a73e8' : '#5f6368' }}></i>Talep Kayıtları
          <span style={{ ...styles.sekmeSayi, backgroundColor: aktifSekme === 'talep' ? '#e8f0fe' : '#f1f3f4', color: aktifSekme === 'talep' ? '#1a73e8' : '#5f6368' }}>
            {tickets.filter(t => t.tur === 'talep').length}
          </span>
        </button>
        {role === 'admin' && (
          <>
            <button style={aktifSekme === 'kullanicilar' ? styles.anaSekmAktif : styles.anaSekmBtn} onClick={() => handleSekme('kullanicilar')}>
              <i className="fa-solid fa-users" style={{ marginRight: '6px', color: aktifSekme === 'kullanicilar' ? '#1a73e8' : '#5f6368' }}></i>Kullanıcı Yönetimi
              <span style={{ ...styles.sekmeSayi, backgroundColor: aktifSekme === 'kullanicilar' ? '#fef7e0' : '#f1f3f4', color: aktifSekme === 'kullanicilar' ? '#b06000' : '#5f6368' }}>
                {kullanicilar.filter(k => k.durum === 'beklemede').length}
              </span>
            </button>
            <button style={aktifSekme === 'analiz' ? styles.anaSekmAktif : styles.anaSekmBtn} onClick={() => handleSekme('analiz')}>
              <i className="fa-solid fa-chart-bar" style={{ marginRight: '6px', color: aktifSekme === 'analiz' ? '#1a73e8' : '#5f6368' }}></i>Analiz
            </button>
          </>
        )}
      </div>

      {/* Kullanıcı yönetimi */}
      {aktifSekme === 'kullanicilar' && (
        <div style={styles.kulYonetim}>
          <div style={styles.kulFiltreler}>
            {['beklemede', 'aktif', 'reddedildi'].map(d => (
              <button key={d} style={kulSekme === d ? styles.filtreAktif : styles.filtre} onClick={() => setKulSekme(d)}>
                {d === 'beklemede' ? '⏳ Beklemede' : d === 'aktif' ? '✅ Aktif' : '❌ Reddedildi'}
                <span style={{ marginLeft: '6px', fontSize: '11px' }}>({kullanicilar.filter(k => k.durum === d).length})</span>
              </button>
            ))}
          </div>
          <div style={styles.kulListe}>
            {kullanicilar.filter(k => k.durum === kulSekme).length === 0 && <div style={styles.bos}>Bu kategoride kullanıcı yok</div>}
            {kullanicilar.filter(k => k.durum === kulSekme).map(k => (
              <div key={k.id} style={styles.kulKart}>
                <div style={styles.kulInfo}>
                  <div style={styles.kulAvatar}>{k.ad[0]}{k.soyad[0]}</div>
                  <div>
                    <div style={styles.kulAd}>{k.ad} {k.soyad}</div>
                    <div style={styles.kulUsername}>@{k.username}</div>
                    <div style={{ ...styles.kulUsername, color: k.role === 'admin' ? '#c5221f' : k.role === 'staff' ? '#1a73e8' : '#5f6368' }}>
                      {k.role === 'admin' ? '👑 Yönetici' : k.role === 'staff' ? '🔧 BT Personeli' : `🏢 ${k.departman || 'Departman belirtilmemiş'}`}
                    </div>
                    <div style={styles.kulTarih}>{new Date(k.tarih).toLocaleString('tr-TR')}</div>
                  </div>
                </div>
                <div style={styles.kulActions}>
                  {k.durum === 'beklemede' && (
                    <>
                      <button style={styles.onayBtn} onClick={() => handleOnayla(k.id)}>✅ Onayla</button>
                      <button style={styles.redBtn} onClick={() => handleReddet(k.id)}>❌ Reddet</button>
                    </>
                  )}
                  {k.durum === 'aktif' && k.role !== 'admin' && (
                    <>
                      {k.role === 'user' && <button style={styles.onayBtn} onClick={() => handleRolGuncelle(k.id, 'staff')}>🔧 BT Yetkisi Ver</button>}
                      {k.role === 'staff' && (
                        <>
                          <button style={styles.onayBtn} onClick={() => handleRolGuncelle(k.id, 'admin')}>👑 Admin Yap</button>
                          <button style={styles.silBtn} onClick={() => handleRolGuncelle(k.id, 'user')}>🔧 Yetkiyi Al</button>
                        </>
                      )}
                      <button style={styles.redBtn} onClick={() => handleSil(k.id)}>🗑️ Sil</button>
                    </>
                  )}
                  {k.durum === 'reddedildi' && <button style={styles.silBtn} onClick={() => handleSil(k.id)}>🗑️ Sil</button>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analiz */}
      {aktifSekme === 'analiz' && (
        <div style={styles.kulYonetim}>
          {!analiz ? (
            <div style={styles.bos}>Yükleniyor...</div>
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
                <div style={{ ...styles.istatKart, backgroundColor: '#e8f0fe' }}>
                  <span style={{ ...styles.istatSayi, color: '#1a73e8' }}>{analiz.toplam}</span>
                  <span style={styles.istatLabel}>Toplam Kayıt</span>
                </div>
                {analiz.durumDagilim.map(d => (
                  <div key={d.durum} style={{ ...styles.istatKart, backgroundColor: d.durum === 'Açık' ? '#fef7e0' : d.durum === 'Çözüldü' ? '#e8f5e9' : '#f1f3f4' }}>
                    <span style={{ ...styles.istatSayi, color: d.durum === 'Açık' ? '#b06000' : d.durum === 'Çözüldü' ? '#2e7d32' : '#5f6368' }}>{d.sayi}</span>
                    <span style={styles.istatLabel}>{d.durum}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div style={styles.analizKart}>
                  <div style={styles.analizBaslik}>🏆 Personel Performansı</div>
                  {analiz.personelPerformans.length === 0 && <div style={styles.yorumBos}>Henüz çözülen kayıt yok</div>}
                  {analiz.personelPerformans.map((p, i) => (
                    <div key={i} style={styles.analizSatir}>
                      <div style={styles.analizPersonel}>
                        <div style={styles.kulAvatar}>{p.atanan?.split(' ').map(n => n[0]).join('').slice(0, 2)}</div>
                        <span style={{ fontSize: '13px', fontWeight: '500' }}>{p.atanan}</span>
                      </div>
                      <div style={styles.analizBar}>
                        <div style={{ ...styles.analizBarDolu, width: `${Math.min((p.kapatilan / analiz.toplam) * 100 * 3, 100)}%` }} />
                      </div>
                      <span style={styles.analizSayi}>{p.kapatilan} kayıt</span>
                    </div>
                  ))}
                  <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#e8f0fe', borderRadius: '8px', fontSize: '13px', color: '#1a73e8' }}>
                    ⏱️ Ort. çözüm süresi: <b>{analiz.ortalamaCapmaDakika < 60 ? `${analiz.ortalamaCapmaDakika} dk` : `${Math.round(analiz.ortalamaCapmaDakika / 60)} saat`}</b>
                  </div>
                </div>
                <div style={styles.analizKart}>
                  <div style={styles.analizBaslik}>📁 Kategori Dağılımı</div>
                  {analiz.kategoriDagilim.map((k, i) => (
                    <div key={i} style={styles.analizSatir}>
                      <span style={{ fontSize: '12px', flex: 1 }}>{k.kategori || 'Belirtilmemiş'}</span>
                      <div style={styles.analizBar}>
                        <div style={{ ...styles.analizBarDolu, width: `${Math.min((k.sayi / analiz.toplam) * 100, 100)}%`, backgroundColor: '#34a853' }} />
                      </div>
                      <span style={styles.analizSayi}>{k.sayi}</span>
                    </div>
                  ))}
                  <div style={{ marginTop: '16px' }}>
                    <div style={styles.analizBaslik}>📋 Tür Dağılımı</div>
                    {analiz.turDagilim.map((t, i) => (
                      <div key={i} style={styles.analizSatir}>
                        <span style={{ fontSize: '13px', flex: 1 }}>{t.tur === 'sorun' ? '🔴 Sorun Kaydı' : '🔵 Talep Kaydı'}</span>
                        <span style={styles.analizSayi}>{t.sayi}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* İstatistik ve ana panel */}
      {panelMi && (
        <>
          <div style={styles.istatistikBar}>
            {[
              { label: 'Toplam', value: istatistik.toplam, color: '#1a73e8', bg: '#e8f0fe' },
              { label: 'Açık', value: istatistik.acik, color: '#b06000', bg: '#fef7e0' },
              { label: 'Beklemede', value: istatistik.beklemede, color: '#5f6368', bg: '#f1f3f4' },
              { label: 'Çözüldü', value: istatistik.cozuldu, color: '#2e7d32', bg: '#e8f5e9' },
            ].map(k => (
              <div key={k.label} style={{ ...styles.istatKart, backgroundColor: k.bg }}>
                <span style={{ ...styles.istatSayi, color: k.color }}>{k.value}</span>
                <span style={styles.istatLabel}>{k.label}</span>
              </div>
            ))}
          </div>
          <div style={styles.main}>
            <div style={styles.sidebar}>
              <div style={styles.aramaBox}>
                <div style={{ position: 'relative' }}>
                  <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#5f6368', fontSize: '12px' }}></i>
                  <input style={{ ...styles.aramaInput, paddingLeft: '30px' }} placeholder="Ara..." value={arama} onChange={(e) => setArama(e.target.value)} />
                </div>
              </div>
              <div style={styles.filtreler}>
                {['Tümü', 'Açık', 'Beklemede', 'Çözüldü'].map(f => (
                  <button key={f} style={filtre === f ? styles.filtreAktif : styles.filtre} onClick={() => setFiltre(f)}>{f}</button>
                ))}
              </div>
              <div style={styles.ticketSayisi}>{filtreliTickets.length} kayıt</div>
              {filtreliTickets.length === 0 && <div style={styles.bos}>Kayıt bulunamadı</div>}
              {filtreliTickets.map(t => (
                <div key={t.id} onClick={async () => { setSelectedId(t.id); const res = await getGorevler(t.id); setGorevler(res.data); }} style={{
                  ...styles.ticketItem,
                  backgroundColor: selectedId === t.id ? '#e8f0fe' : sureDolduMu(t) ? '#fff5f5' : '#fff',
                  borderLeft: selectedId === t.id ? `3px solid ${aktifSekme === 'sorun' ? '#e53935' : '#1a73e8'}` : '3px solid transparent'
                }}>
                  <div style={styles.ticketTop}>
                    <span style={{ ...styles.refNo, color: aktifSekme === 'sorun' ? '#e53935' : '#1a73e8' }}>{t.refNo}</span>
                    <span style={{ ...styles.tag, backgroundColor: oncelikRenk(t.oncelik).bg, color: oncelikRenk(t.oncelik).color }}>{t.oncelik}</span>
                  </div>
                  <div style={styles.ticketKonu}>{t.konu}</div>
                  <div style={styles.ticketMeta}>
                    <span style={styles.ticketKisi}>👤 {t.ad} {t.soyad}</span>
                    <span style={{ ...styles.tag, backgroundColor: durumRenk(t.durum).bg, color: durumRenk(t.durum).color }}>{t.durum}</span>
                  </div>
                  {t.atanan && <div style={styles.atanan}>📌 {t.atanan}</div>}
                  {t.sonTarih && t.durum !== 'Çözüldü' && (
                    <div style={{ fontSize: '11px', marginTop: '4px', color: sureDolduMu(t) ? '#c5221f' : '#2e7d32', fontWeight: '500' }}>
                      ⏱️ {kalanSure(t.sonTarih)}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div style={styles.detail}>
              {!selected ? (
                <div style={styles.empty}>
                  <span style={{ fontSize: '56px' }}>{aktifSekme === 'sorun' ? '🔴' : '🔵'}</span>
                  <span style={styles.emptyTitle}>{aktifSekme === 'sorun' ? 'Sorun Kayıtları' : 'Talep Kayıtları'}</span>
                  <span style={styles.emptySubtitle}>Detayları görüntülemek için sol listeden bir kayıt seçin</span>
                </div>
              ) : (
                <div style={styles.detailInner}>
                  <div style={styles.detailHeader}>
                    <div>
                      <span style={{ ...styles.detailRef, color: selected.tur === 'sorun' ? '#e53935' : '#1a73e8' }}>{selected.refNo}</span>
                      <h2 style={styles.detailKonu}>{selected.konu}</h2>
                      <span style={styles.detailKategori}>📁 {selected.kategori}</span>
                    </div>
                    <div style={styles.detailActions}>
                      <button style={styles.actionBtn} onClick={() => handleDurum(selected.id, 'Beklemede')}><i className="fa-solid fa-clock" style={{ marginRight: '5px' }}></i>Beklemede</button>
                      <button style={styles.actionBtnSuccess} onClick={() => setCozumModal(true)}><i className="fa-solid fa-circle-check" style={{ marginRight: '5px' }}></i>Çözüldü</button>
                      <button style={styles.actionBtnPrimary} onClick={() => setAtamaModal(true)}>
                        <i className="fa-solid fa-user-plus" style={{ marginRight: '5px' }}></i>{selected.atanan ? 'Yeniden Ata' : 'Ata'}
                      </button>
                      <button style={styles.actionBtnGorev} onClick={() => setGorevModal(true)}><i className="fa-solid fa-list-check" style={{ marginRight: '5px' }}></i>Görev Oluştur</button>
                    </div>
                  </div>
                  <div style={styles.infoGrid}>
                    {[
                      { label: 'Kişi', value: `${selected.ad} ${selected.soyad}` },
                      { label: 'Departman', value: selected.departman || '-' },
                      { label: 'Öncelik', value: selected.oncelik, color: oncelikRenk(selected.oncelik).color },
                      { label: 'Durum', value: selected.durum, color: durumRenk(selected.durum).color },
                      { label: 'Atanan', value: selected.atanan || 'Atanmamış' },
                      { label: 'Oluşturulma', value: new Date(selected.tarih).toLocaleString('tr-TR') },
                      { label: 'Son Tarih', value: selected.sonTarih ? new Date(selected.sonTarih).toLocaleString('tr-TR') : '-', color: sureDolduMu(selected) ? '#c5221f' : '#2e7d32' },
                      { label: 'Kalan Süre', value: selected.durum === 'Çözüldü' ? 'Çözüldü ✅' : kalanSure(selected.sonTarih), color: sureDolduMu(selected) ? '#c5221f' : '#2e7d32' },
                    ].map(item => (
                      <div key={item.label} style={styles.infoKart}>
                        <span style={styles.infoLabel}>{item.label}</span>
                        <span style={{ ...styles.infoValue, color: item.color || '#202124' }}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                  <div style={styles.aciklamaBox}>
                    <div style={styles.aciklamaBaslik}>📝 Açıklama</div>
                    <p style={styles.aciklamaMetin}>{selected.aciklama}</p>
                  </div>
                  <div style={styles.yorumlarBox}>
                    <div style={styles.yorumBaslik}>💬 Yorumlar ({selected.yorumlar.length})</div>
                    {selected.yorumlar.length === 0 && <div style={styles.yorumBos}>Henüz yorum yok</div>}
                    {selected.yorumlar.map(y => (
                      <div key={y.id} style={y.tip === 'cozum' ? styles.cozumYorumItem : styles.yorumItem}>
                        <div style={styles.yorumHeader}>
                          <span style={{ ...styles.yorumYazar, color: y.tip === 'cozum' ? '#2e7d32' : '#202124' }}>
                            {y.tip === 'cozum' ? '✅ Çözüm Açıklaması — ' : ''}{y.yazar}
                          </span>
                          <span style={styles.yorumTarih}>{new Date(y.tarih).toLocaleString('tr-TR')}</span>
                        </div>
                        <p style={styles.yorumMetin}>
                          {y.metin.split(/(@\w+\.\w+)/g).map((parca, i) =>
                            parca.match(/^@\w+\.\w+$/) ? (
                              <span key={i} style={styles.etiket}>{parca}</span>
                            ) : parca
                          )}
                        </p>
                      </div>
                    ))}
                    <YorumKutusu onGonder={(metin) => {
                      addYorum(selectedId, metin).then(res => {
                        setTickets(prev => prev.map(t => t.id === selectedId ? { ...t, yorumlar: [...t.yorumlar, res.data] } : t));
                      });
                    }} />
                  </div>
                  <div style={styles.gorevlerBox}>
                    <div style={styles.yorumBaslik}>📋 Görevler ({gorevler.length})</div>
                    {gorevler.length === 0 && <div style={styles.yorumBos}>Henüz görev yok</div>}
                    {gorevler.map(g => (
                      <div key={g.id} style={{ ...styles.gorevItem, borderLeft: `3px solid ${g.durum === 'Tamamlandı' ? '#2e7d32' : new Date() > new Date(g.sonTarih) ? '#c5221f' : '#1a73e8'}` }}>
                        <div style={styles.gorevHeader}>
                          <span style={styles.gorevBaslik}>{g.baslik}</span>
                          <div style={styles.gorevActions}>
                            {g.durum !== 'Tamamlandı' && (
                              <button style={styles.gorevTamamBtn} onClick={() => { gorevDurumGuncelle(g.id, 'Tamamlandı').then(() => { setGorevler(prev => prev.map(x => x.id === g.id ? { ...x, durum: 'Tamamlandı' } : x)); }); }}>✅</button>
                            )}
                            <button style={styles.gorevSilBtn} onClick={() => { gorevSil(g.id).then(() => { setGorevler(prev => prev.filter(x => x.id !== g.id)); }); }}>🗑️</button>
                          </div>
                        </div>
                        {g.aciklama && <p style={styles.gorevAciklama}>{g.aciklama}</p>}
                        <div style={styles.gorevMeta}>
                          {g.atanan && <span>👤 {g.atanan}</span>}
                          {g.sonTarih && <span>⏰ {new Date(g.sonTarih).toLocaleString('tr-TR')}</span>}
                          <span style={{ color: g.durum === 'Tamamlandı' ? '#2e7d32' : '#b06000' }}>{g.durum}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {sifreModal && <SifreDegistir onKapat={() => setSifreModal(false)} />}
      {gorevModal && selected && <GorevModal ticketId={selected.id} onKapat={() => setGorevModal(false)} onGorevEklendi={(g) => setGorevler(prev => [...prev, g])} />}
      {cozumModal && <CozumModal onKapat={() => setCozumModal(false)} onGonder={handleCozum} />}
      {atamaModal && selected && <AtamaModal mevcutAtanan={selected.atanan} onKapat={() => setAtamaModal(false)} onAta={handleAtaPersonel} />}
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
  sifreBtn: { padding: '6px 14px', backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '20px', cursor: 'pointer', fontSize: '12px' },
  cikisBtn: { padding: '6px 14px', backgroundColor: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '20px', cursor: 'pointer', fontSize: '12px' },
  toast: { position: 'fixed', top: '64px', right: '24px', backgroundColor: '#323232', color: '#fff', padding: '12px 20px', borderRadius: '8px', fontSize: '13px', zIndex: 999, boxShadow: '0 4px 12px rgba(0,0,0,0.2)' },
  anaSekmeler: { display: 'flex', backgroundColor: '#fff', borderBottom: '1px solid #e0e0e0', padding: '0 24px', flexShrink: 0 },
  anaSekmBtn: { padding: '14px 20px', border: 'none', borderBottom: '3px solid transparent', backgroundColor: 'transparent', cursor: 'pointer', fontSize: '14px', fontWeight: '500', color: '#5f6368', display: 'flex', alignItems: 'center', gap: '8px' },
  anaSekmAktif: { padding: '14px 20px', border: 'none', borderBottom: '3px solid #1a73e8', backgroundColor: 'transparent', cursor: 'pointer', fontSize: '14px', fontWeight: '600', color: '#1a73e8', display: 'flex', alignItems: 'center', gap: '8px' },
  sekmeSayi: { fontSize: '11px', padding: '2px 8px', borderRadius: '10px', fontWeight: '600' },
  istatistikBar: { display: 'flex', gap: '16px', padding: '16px 24px', backgroundColor: '#fff', borderBottom: '1px solid #e0e0e0', flexShrink: 0 },
  istatKart: { flex: 1, padding: '12px 16px', borderRadius: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' },
  istatSayi: { fontSize: '24px', fontWeight: '700' },
  istatLabel: { fontSize: '12px', color: '#5f6368' },
  main: { display: 'flex', flex: 1, overflow: 'hidden' },
  sidebar: { width: '320px', borderRight: '1px solid #e0e0e0', overflowY: 'auto', flexShrink: 0, backgroundColor: '#fff' },
  aramaBox: { padding: '12px 16px', borderBottom: '1px solid #f1f3f4' },
  aramaInput: { width: '100%', padding: '8px 12px', fontSize: '13px', border: '1px solid #e0e0e0', borderRadius: '20px', outline: 'none', boxSizing: 'border-box', backgroundColor: '#f8f9fa' },
  filtreler: { display: 'flex', gap: '6px', padding: '10px 16px', borderBottom: '1px solid #f1f3f4', flexWrap: 'wrap' },
  filtre: { fontSize: '12px', padding: '4px 12px', border: '1px solid #e0e0e0', borderRadius: '16px', backgroundColor: '#fff', cursor: 'pointer', color: '#5f6368' },
  filtreAktif: { fontSize: '12px', padding: '4px 12px', border: 'none', borderRadius: '16px', backgroundColor: '#1a73e8', cursor: 'pointer', color: '#fff' },
  ticketSayisi: { padding: '8px 16px', fontSize: '12px', color: '#5f6368', borderBottom: '1px solid #f1f3f4' },
  bos: { padding: '24px', textAlign: 'center', color: '#5f6368', fontSize: '13px' },
  ticketItem: { padding: '14px 16px', borderBottom: '1px solid #f1f3f4', cursor: 'pointer' },
  ticketTop: { display: 'flex', justifyContent: 'space-between', marginBottom: '6px' },
  refNo: { fontSize: '11px', fontWeight: '700', letterSpacing: '0.5px' },
  ticketKonu: { fontSize: '13px', color: '#202124', marginBottom: '8px', fontWeight: '500', lineHeight: '1.4' },
  ticketMeta: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  ticketKisi: { fontSize: '12px', color: '#5f6368' },
  atanan: { fontSize: '11px', color: '#1a73e8', marginTop: '6px' },
  tag: { fontSize: '11px', padding: '2px 8px', borderRadius: '12px', fontWeight: '500' },
  detail: { flex: 1, overflowY: 'auto', backgroundColor: '#f8f9fa' },
  empty: { height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' },
  emptyTitle: { fontSize: '16px', fontWeight: '500', color: '#202124' },
  emptySubtitle: { fontSize: '13px', color: '#5f6368' },
  detailInner: { padding: '24px', maxWidth: '800px' },
  detailHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
  detailRef: { fontSize: '12px', fontWeight: '700', letterSpacing: '0.5px' },
  detailKonu: { fontSize: '18px', fontWeight: '600', color: '#202124', margin: '6px 0' },
  detailKategori: { fontSize: '12px', color: '#5f6368' },
  detailActions: { display: 'flex', gap: '8px', flexShrink: 0 },
  actionBtn: { padding: '8px 14px', border: '1px solid #e0e0e0', borderRadius: '8px', backgroundColor: '#fff', cursor: 'pointer', fontSize: '12px', color: '#5f6368' },
  actionBtnSuccess: { padding: '8px 14px', border: 'none', borderRadius: '8px', backgroundColor: '#e8f5e9', cursor: 'pointer', fontSize: '12px', color: '#2e7d32', fontWeight: '500' },
  actionBtnPrimary: { padding: '8px 14px', border: 'none', borderRadius: '8px', backgroundColor: '#1a73e8', cursor: 'pointer', fontSize: '12px', color: '#fff', fontWeight: '500' },
  actionBtnGorev: { padding: '8px 14px', border: 'none', borderRadius: '8px', backgroundColor: '#e8f0fe', cursor: 'pointer', fontSize: '12px', color: '#1a73e8', fontWeight: '500' },
  infoGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '16px' },
  infoKart: { backgroundColor: '#fff', padding: '14px', borderRadius: '10px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', gap: '4px' },
  infoLabel: { fontSize: '11px', color: '#5f6368', textTransform: 'uppercase', letterSpacing: '0.5px' },
  infoValue: { fontSize: '14px', fontWeight: '500' },
  aciklamaBox: { backgroundColor: '#fff', padding: '18px', borderRadius: '10px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: '16px' },
  aciklamaBaslik: { fontSize: '13px', fontWeight: '600', color: '#202124', marginBottom: '10px' },
  aciklamaMetin: { fontSize: '14px', color: '#3c4043', lineHeight: '1.7', margin: 0 },
  yorumlarBox: { backgroundColor: '#fff', padding: '18px', borderRadius: '10px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: '16px' },
  yorumBaslik: { fontSize: '13px', fontWeight: '600', color: '#202124', marginBottom: '12px' },
  yorumBos: { fontSize: '13px', color: '#5f6368', textAlign: 'center', padding: '16px 0' },
  yorumItem: { backgroundColor: '#f8f9fa', padding: '12px', borderRadius: '8px', marginBottom: '10px' },
  cozumYorumItem: { backgroundColor: '#e8f5e9', padding: '12px', borderRadius: '8px', marginBottom: '10px', border: '1px solid #a8d5b5' },
  etiket: { backgroundColor: '#e8f0fe', color: '#1a73e8', padding: '2px 6px', borderRadius: '4px', fontWeight: '600', fontSize: '12px' },
  yorumHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '6px' },
  yorumYazar: { fontWeight: '600', fontSize: '12px', color: '#202124' },
  yorumTarih: { fontSize: '11px', color: '#5f6368' },
  yorumMetin: { fontSize: '13px', color: '#3c4043', margin: 0, lineHeight: '1.6' },
  yorumEkle: { display: 'flex', gap: '8px', marginTop: '12px' },
  yorumInput: { flex: 1, padding: '10px 12px', fontSize: '13px', border: '1px solid #e0e0e0', borderRadius: '8px', resize: 'none', fontFamily: 'inherit', outline: 'none' },
  yorumBtn: { padding: '10px 18px', backgroundColor: '#1a73e8', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '500' },
  gorevlerBox: { backgroundColor: '#fff', padding: '18px', borderRadius: '10px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginTop: '16px' },
  gorevItem: { backgroundColor: '#f8f9fa', padding: '12px', borderRadius: '8px', marginBottom: '10px', paddingLeft: '12px' },
  gorevHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' },
  gorevBaslik: { fontSize: '13px', fontWeight: '600', color: '#202124' },
  gorevActions: { display: 'flex', gap: '6px' },
  gorevTamamBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' },
  gorevSilBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' },
  gorevAciklama: { fontSize: '13px', color: '#5f6368', margin: '4px 0 8px', lineHeight: '1.5' },
  gorevMeta: { display: 'flex', gap: '12px', fontSize: '11px', color: '#5f6368' },
  kulYonetim: { flex: 1, overflowY: 'auto', padding: '24px', backgroundColor: '#f8f9fa' },
  kulFiltreler: { display: 'flex', gap: '8px', marginBottom: '20px' },
  kulListe: { display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '700px' },
  kulKart: { backgroundColor: '#fff', padding: '16px 20px', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  kulInfo: { display: 'flex', alignItems: 'center', gap: '14px' },
  kulAvatar: { width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#e8f0fe', color: '#1a73e8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '16px' },
  kulAd: { fontSize: '14px', fontWeight: '600', color: '#202124' },
  kulUsername: { fontSize: '12px', color: '#5f6368', marginTop: '2px' },
  kulTarih: { fontSize: '11px', color: '#9aa0a6', marginTop: '2px' },
  kulActions: { display: 'flex', gap: '8px' },
  onayBtn: { padding: '7px 14px', backgroundColor: '#e8f5e9', color: '#2e7d32', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '500' },
  redBtn: { padding: '7px 14px', backgroundColor: '#fce8e6', color: '#c5221f', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '500' },
  silBtn: { padding: '7px 14px', backgroundColor: '#f1f3f4', color: '#5f6368', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '500' },
  analizKart: { backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
  analizBaslik: { fontSize: '14px', fontWeight: '600', color: '#202124', marginBottom: '16px' },
  analizSatir: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' },
  analizPersonel: { display: 'flex', alignItems: 'center', gap: '8px', width: '140px', flexShrink: 0 },
  analizBar: { flex: 1, height: '8px', backgroundColor: '#f1f3f4', borderRadius: '4px', overflow: 'hidden' },
  analizBarDolu: { height: '100%', backgroundColor: '#1a73e8', borderRadius: '4px' },
  analizSayi: { fontSize: '12px', fontWeight: '600', color: '#5f6368', width: '60px', textAlign: 'right', flexShrink: 0 },
};

export default Panel;