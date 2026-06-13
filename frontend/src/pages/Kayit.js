import React, { useState } from 'react';
import { login } from '../services/api';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

function Kayit() {
  const [sekme, setSekme] = useState('login');
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [kayitForm, setKayitForm] = useState({ ad: '', soyad: '', departman: '', username: '', password: '', passwordTekrar: '', role: 'user' });
  const [hata, setHata] = useState('');
  const [basari, setBasari] = useState('');
  const [yukleniyor, setYukleniyor] = useState(false);

  const handleLoginChange = (e) => setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  const handleKayitChange = (e) => setKayitForm({ ...kayitForm, [e.target.name]: e.target.value });

  const handleLogin = async () => {
    if (!loginForm.username || !loginForm.password) {
      setHata('Kullanıcı adı ve şifre zorunludur');
      return;
    }
    setYukleniyor(true);
    setHata('');
    try {
      const res = await login(loginForm.username, loginForm.password);
      const { token, role, name, ad, soyad, departman } = res.data;
      
      await Promise.all([
        localStorage.setItem('token', token),
        localStorage.setItem('role', role),
        localStorage.setItem('name', name),
        localStorage.setItem('ad', ad || ''),
        localStorage.setItem('soyad', soyad || ''),
        localStorage.setItem('departman', departman || ''),
      ]);

      setTimeout(() => {
        if (role === 'user') {
          window.location.href = '/kayitlarim';
        } else {
          window.location.href = '/panel';
        }
      }, 100);

    } catch (err) {
      setHata(err.response?.data?.hata || 'Giriş başarısız');
    }
    setYukleniyor(false);
  };

  const handleKayit = async () => {
    if (!kayitForm.ad || !kayitForm.soyad || !kayitForm.username || !kayitForm.password) {
      setHata('Ad, soyad, kullanıcı adı ve şifre zorunludur');
      return;
    }
    if (kayitForm.password !== kayitForm.passwordTekrar) {
      setHata('Şifreler eşleşmiyor');
      return;
    }
    if (kayitForm.password.length < 6) {
      setHata('Şifre en az 6 karakter olmalıdır');
      return;
    }
    setYukleniyor(true);
    setHata('');
    try {
      const res = await axios.post(`${API_URL}/auth/kayit`, {
        ad: kayitForm.ad,
        soyad: kayitForm.soyad,
        departman: kayitForm.departman,
        username: kayitForm.username,
        password: kayitForm.password,
        role: kayitForm.role
      });
      setBasari(res.data.mesaj);
      setKayitForm({ ad: '', soyad: '', departman: '', username: '', password: '', passwordTekrar: '' });
    } catch (err) {
      setHata(err.response?.data?.hata || 'Kayıt başarısız');
    }
    setYukleniyor(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logo}>⚙️</div>
        <h2 style={styles.title}>ITSM</h2>
        <p style={styles.subtitle}>IT Service Management</p>

        <div style={styles.sekmeBar}>
          <button style={sekme === 'login' ? styles.sekmeAktif : styles.sekme} onClick={() => { setSekme('login'); setHata(''); setBasari(''); }}>Giriş Yap</button>
          <button style={sekme === 'kayit' ? styles.sekmeAktif : styles.sekme} onClick={() => { setSekme('kayit'); setHata(''); setBasari(''); }}>Kayıt Ol</button>
        </div>

        {sekme === 'login' && (
          <div>
            <input style={styles.input} type="text" name="username" placeholder="Kullanıcı adı" value={loginForm.username} onChange={handleLoginChange} onKeyDown={(e) => e.key === 'Enter' && handleLogin()} />
            <input style={styles.input} type="password" name="password" placeholder="Şifre" value={loginForm.password} onChange={handleLoginChange} onKeyDown={(e) => e.key === 'Enter' && handleLogin()} />
            {hata && <div style={styles.hata}>{hata}</div>}
            <button style={yukleniyor ? styles.btnDisabled : styles.btn} onClick={handleLogin} disabled={yukleniyor}>
              {yukleniyor ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </button>
          </div>
        )}

        {sekme === 'kayit' && (
          <div>
            {basari ? (
              <div style={styles.basariBox}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>✅</div>
                <p style={{ fontWeight: '600', marginBottom: '8px' }}>Kayıt Talebiniz Alındı!</p>
                <p style={{ fontSize: '13px', color: '#5f6368', lineHeight: '1.6' }}>{basari}</p>
                <button style={{ ...styles.btn, marginTop: '16px' }} onClick={() => setSekme('login')}>Giriş Sayfasına Dön</button>
              </div>
            ) : (
              <div>
                <div style={styles.row}>
                  <input style={styles.inputHalf} type="text" name="ad" placeholder="Ad *" value={kayitForm.ad} onChange={handleKayitChange} />
                  <input style={styles.inputHalf} type="text" name="soyad" placeholder="Soyad *" value={kayitForm.soyad} onChange={handleKayitChange} />
                </div>
                <input style={styles.input} type="text" name="departman" placeholder="Departman" value={kayitForm.departman} onChange={handleKayitChange} />
                <input style={styles.input} type="text" name="username" placeholder="Kullanıcı adı *" value={kayitForm.username} onChange={handleKayitChange} />
                <input style={styles.input} type="password" name="password" placeholder="Şifre (en az 6 karakter) *" value={kayitForm.password} onChange={handleKayitChange} />
                <input style={styles.input} type="password" name="passwordTekrar" placeholder="Şifre tekrar *" value={kayitForm.passwordTekrar} onChange={handleKayitChange} />
                {hata && <div style={styles.hata}>{hata}</div>}
                <button style={yukleniyor ? styles.btnDisabled : styles.btn} onClick={handleKayit} disabled={yukleniyor}>
                  {yukleniyor ? 'Kayıt yapılıyor...' : 'Kayıt Ol'}
                </button>
                <p style={styles.bilgi}>Kayıt talebiniz yönetici onayına gönderilecektir.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1a73e8, #0d47a1)', fontFamily: 'Roboto, Arial, sans-serif' },
  card: { backgroundColor: '#fff', padding: '40px', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.2)', width: '380px' },
  logo: { fontSize: '48px', textAlign: 'center', marginBottom: '8px' },
  title: { fontSize: '24px', fontWeight: '700', color: '#202124', textAlign: 'center', marginBottom: '4px' },
  subtitle: { fontSize: '13px', color: '#5f6368', textAlign: 'center', marginBottom: '24px' },
  sekmeBar: { display: 'flex', backgroundColor: '#f1f3f4', borderRadius: '10px', padding: '4px', marginBottom: '24px', gap: '4px' },
  sekme: { flex: 1, padding: '8px', border: 'none', borderRadius: '8px', backgroundColor: 'transparent', cursor: 'pointer', fontSize: '13px', fontWeight: '500', color: '#5f6368' },
  sekmeAktif: { flex: 1, padding: '8px', border: 'none', borderRadius: '8px', backgroundColor: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: '600', color: '#1a73e8', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' },
  input: { width: '100%', padding: '12px', fontSize: '14px', border: '1px solid #e0e0e0', borderRadius: '8px', marginBottom: '12px', outline: 'none', boxSizing: 'border-box', backgroundColor: '#fafafa' },
  row: { display: 'flex', gap: '8px' },
  inputHalf: { flex: 1, padding: '12px', fontSize: '14px', border: '1px solid #e0e0e0', borderRadius: '8px', marginBottom: '12px', outline: 'none', boxSizing: 'border-box', backgroundColor: '#fafafa' },
  btn: { width: '100%', padding: '12px', background: 'linear-gradient(135deg, #1a73e8, #0d47a1)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 12px rgba(26,115,232,0.3)' },
  btnDisabled: { width: '100%', padding: '12px', backgroundColor: '#ccc', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', cursor: 'not-allowed' },
  hata: { backgroundColor: '#fce8e6', color: '#c5221f', padding: '10px', borderRadius: '8px', fontSize: '13px', marginBottom: '12px' },
  basariBox: { textAlign: 'center', padding: '16px 0' },
  bilgi: { fontSize: '12px', color: '#5f6368', textAlign: 'center', marginTop: '12px', lineHeight: '1.6' },
  rolSecim: { display: 'flex', gap: '8px', marginBottom: '12px' },
  rolBtn: { flex: 1, padding: '10px', border: '1px solid #e0e0e0', borderRadius: '8px', backgroundColor: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: '500', color: '#5f6368' },
  rolAktif: { flex: 1, padding: '10px', border: 'none', borderRadius: '8px', background: 'linear-gradient(135deg, #1a73e8, #0d47a1)', cursor: 'pointer', fontSize: '13px', fontWeight: '600', color: '#fff' },
};

export default Kayit;