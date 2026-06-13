const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../database');

const SECRET = process.env.JWT_SECRET || 'bt-sistemi-gizli-anahtar';

const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ hata: 'Token gerekli' });
  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(401).json({ hata: 'Geçersiz token' });
  }
};

const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ hata: 'Yetkisiz erişim' });
  next();
};

// Login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = db.prepare('SELECT * FROM kullanicilar WHERE username = ?').get(username);
  if (!user) return res.status(404).json({ hata: 'Kullanıcı bulunamadı' });
  if (user.durum === 'beklemede') return res.status(403).json({ hata: 'Hesabınız henüz onaylanmadı.' });
  if (user.durum === 'reddedildi') return res.status(403).json({ hata: 'Hesabınız reddedildi.' });
  const sifreDogruMu = bcrypt.compareSync(password, user.password);
  if (!sifreDogruMu) return res.status(401).json({ hata: 'Hatalı şifre' });
  const token = jwt.sign(
    { id: user.id, role: user.role, name: `${user.ad} ${user.soyad}`, ad: user.ad, soyad: user.soyad, departman: user.departman },
    SECRET,
    { expiresIn: '8h' }
  );
  res.json({ token, role: user.role, name: `${user.ad} ${user.soyad}`, ad: user.ad, soyad: user.soyad, departman: user.departman });
});

// Kayıt ol
router.post('/kayit', (req, res) => {
  const { ad, soyad, departman, username, password } = req.body;
  if (!ad || !soyad || !username || !password) {
    return res.status(400).json({ hata: 'Tüm zorunlu alanlar doldurulmalıdır' });
  }
  if (password.length < 6) {
    return res.status(400).json({ hata: 'Şifre en az 6 karakter olmalıdır' });
  }
  const varMi = db.prepare('SELECT * FROM kullanicilar WHERE username = ?').get(username);
  if (varMi) return res.status(400).json({ hata: 'Bu kullanıcı adı zaten alınmış' });
  db.prepare(`
    INSERT INTO kullanicilar (ad, soyad, departman, username, password, role, durum, tarih)
    VALUES (?, ?, ?, ?, ?, 'user', 'beklemede', ?)
  `).run(ad, soyad, departman, username, bcrypt.hashSync(password, 8), new Date().toISOString());
  res.status(201).json({ mesaj: 'Kayıt talebiniz alındı. Yöneticinizin onayı bekleniyor.' });
});

// Tüm kullanıcıları getir (sadece admin)
router.get('/kullanicilar', authMiddleware, adminMiddleware, (req, res) => {
  const kullanicilar = db.prepare('SELECT id, ad, soyad, departman, username, role, durum, tarih FROM kullanicilar').all();
  res.json(kullanicilar);
});

// Kullanıcı onayla (sadece admin)
router.patch('/kullanicilar/:id/onayla', authMiddleware, adminMiddleware, (req, res) => {
  db.prepare("UPDATE kullanicilar SET durum = 'aktif' WHERE id = ?").run(req.params.id);
  res.json({ mesaj: 'Kullanıcı onaylandı' });
});

// Kullanıcı reddet (sadece admin)
router.patch('/kullanicilar/:id/reddet', authMiddleware, adminMiddleware, (req, res) => {
  db.prepare("UPDATE kullanicilar SET durum = 'reddedildi' WHERE id = ?").run(req.params.id);
  res.json({ mesaj: 'Kullanıcı reddedildi' });
});

// BT yetkisi ver (sadece admin)
router.patch('/kullanicilar/:id/rol', authMiddleware, adminMiddleware, (req, res) => {
  const { role } = req.body;
  if (!['user', 'staff', 'admin'].includes(role)) {
    return res.status(400).json({ hata: 'Geçersiz rol' });
  }
  db.prepare('UPDATE kullanicilar SET role = ? WHERE id = ?').run(role, req.params.id);
  res.json({ mesaj: 'Rol güncellendi' });
});

// Kullanıcı sil (sadece admin)
router.delete('/kullanicilar/:id', authMiddleware, adminMiddleware, (req, res) => {
  db.prepare('DELETE FROM kullanicilar WHERE id = ?').run(req.params.id);
  res.json({ mesaj: 'Kullanıcı silindi' });
});

// Şifre değiştir
router.patch('/sifre-degistir', authMiddleware, (req, res) => {
  const { eskiSifre, yeniSifre } = req.body;
  if (!eskiSifre || !yeniSifre) return res.status(400).json({ hata: 'Tüm alanlar zorunludur' });
  if (yeniSifre.length < 6) return res.status(400).json({ hata: 'Yeni şifre en az 6 karakter olmalıdır' });
  const user = db.prepare('SELECT * FROM kullanicilar WHERE id = ?').get(req.user.id);
  if (!user) return res.status(404).json({ hata: 'Kullanıcı bulunamadı' });
  const dogruMu = bcrypt.compareSync(eskiSifre, user.password);
  if (!dogruMu) return res.status(401).json({ hata: 'Mevcut şifre hatalı' });
  db.prepare('UPDATE kullanicilar SET password = ? WHERE id = ?').run(bcrypt.hashSync(yeniSifre, 8), req.user.id);
  res.json({ mesaj: 'Şifre başarıyla değiştirildi' });
});
// BT personel listesi (staff ve admin)
router.get('/personeller', authMiddleware, (req, res) => {
  const personeller = db.prepare(
    "SELECT id, ad, soyad, username FROM kullanicilar WHERE role IN ('staff', 'admin') AND durum = 'aktif'"
  ).all();
  res.json(personeller);
});

module.exports = router;