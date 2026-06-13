const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../database');

const SECRET = process.env.JWT_SECRET || 'bt-sistemi-gizli-anahtar';

// Token doğrulama middleware
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

// Sonraki referans numarasını hesapla
const getNextRefNo = (tur) => {
  const prefix = tur === 'talep' ? 'TLP' : 'SRN';
  const last = db.prepare(`SELECT refNo FROM tickets WHERE tur = ? ORDER BY id DESC LIMIT 1`).get(tur);
  if (!last) return `${prefix}-001`;
  const num = parseInt(last.refNo.split('-')[1]) + 1;
  return `${prefix}-${String(num).padStart(3, '0')}`;
};
// Önceliğe göre son tarih hesapla
const getSonTarih = (tur, oncelik) => {
  const simdi = new Date();
  let dakika = 0;
  if (tur === 'sorun') {
    dakika = oncelik === 'Yüksek' ? 15 : oncelik === 'Orta' ? 30 : 35;
  } else {
    dakika = oncelik === 'Yüksek' ? 240 : oncelik === 'Orta' ? 1440 : 4320;
  }
  simdi.setMinutes(simdi.getMinutes() + dakika);
  return simdi.toISOString();
};

// Yeni kayıt oluştur (herkese açık)
router.post('/', (req, res) => {
  const { tur, ad, soyad, departman, kategori, oncelik, konu, aciklama, userId } = req.body;
  if (!ad || !soyad || !konu || !aciklama) {
    return res.status(400).json({ hata: 'Zorunlu alanlar eksik' });
  }
  const refNo = getNextRefNo(tur || 'sorun');
  const sonTarih = getSonTarih(tur || 'sorun', oncelik || 'Orta');
  db.prepare(`
    INSERT INTO tickets (refNo, tur, ad, soyad, departman, kategori, oncelik, konu, aciklama, durum, atanan, tarih, sonTarih, userId)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Açık', null, ?, ?, ?)
  `).run(refNo, tur || 'sorun', ad, soyad, departman, kategori, oncelik, konu, aciklama, new Date().toISOString(), sonTarih, userId || null);

  res.status(201).json({ mesaj: 'Kaydınız alındı', refNo });
});

// Tüm kayıtları getir (BT paneli)
router.get('/', authMiddleware, (req, res) => {
  const { tur } = req.query;
  const tickets = tur
    ? db.prepare('SELECT * FROM tickets WHERE tur = ? ORDER BY id DESC').all(tur)
    : db.prepare('SELECT * FROM tickets ORDER BY id DESC').all();
  const yorumlar = db.prepare('SELECT * FROM yorumlar').all();
  const result = tickets.map(t => ({
    ...t,
    yorumlar: yorumlar.filter(y => y.ticketId === t.id)
  }));
  res.json(result);
});
router.get('/benim', authMiddleware, (req, res) => {
  const tickets = db.prepare('SELECT * FROM tickets WHERE userId = ? ORDER BY id DESC').all(req.user.id);
  const yorumlar = db.prepare('SELECT * FROM yorumlar').all();
  const result = tickets.map(t => ({
    refNo: t.refNo,
    tur: t.tur,
    konu: t.konu,
    kategori: t.kategori,
    oncelik: t.oncelik,
    durum: t.durum,
    atandi: t.atanan ? true : false,
    tarih: t.tarih,
    sonTarih: t.sonTarih,
    yorumlar: yorumlar.filter(y => y.ticketId === t.id).map(y => ({
      yazar: y.yazar,
      metin: y.metin,
      tip: y.tip,
      tarih: y.tarih
    }))
  }));
  res.json(result);
});
// Tek kayıt getir (BT paneli)
router.get('/:id', authMiddleware, (req, res) => {
  const ticket = db.prepare('SELECT * FROM tickets WHERE id = ?').get(req.params.id);
  if (!ticket) return res.status(404).json({ hata: 'Kayıt bulunamadı' });
  const yorumlar = db.prepare('SELECT * FROM yorumlar WHERE ticketId = ?').all(req.params.id);
  res.json({ ...ticket, yorumlar });
});

// Durum güncelle
router.patch('/:id/durum', authMiddleware, (req, res) => {
  db.prepare('UPDATE tickets SET durum = ? WHERE id = ?').run(req.body.durum, req.params.id);
  const ticket = db.prepare('SELECT * FROM tickets WHERE id = ?').get(req.params.id);
  res.json(ticket);
});

// Yorum ekle
router.post('/:id/yorum', authMiddleware, (req, res) => {
  const tarih = new Date().toISOString();
  const tip = req.body.tip || 'normal';
  const result = db.prepare(
    'INSERT INTO yorumlar (ticketId, yazar, metin, tip, tarih) VALUES (?, ?, ?, ?, ?)'
  ).run(req.params.id, req.user.name, req.body.metin, tip, tarih);
  const yorum = db.prepare('SELECT * FROM yorumlar WHERE id = ?').get(result.lastInsertRowid);
  res.json(yorum);
});

// Atama yap
router.patch('/:id/ata', authMiddleware, (req, res) => {
  db.prepare('UPDATE tickets SET atanan = ? WHERE id = ?').run(req.body.atanan, req.params.id);
  const ticket = db.prepare('SELECT * FROM tickets WHERE id = ?').get(req.params.id);
  res.json(ticket);
});

// Görev oluştur
router.post('/:id/gorev', authMiddleware, (req, res) => {
  const { baslik, aciklama, atanan, sonTarih } = req.body;
  if (!baslik) return res.status(400).json({ hata: 'Görev başlığı zorunludur' });
  const result = db.prepare(`
    INSERT INTO gorevler (ticketId, baslik, aciklama, atanan, sonTarih, durum, olusturan, tarih)
    VALUES (?, ?, ?, ?, ?, 'Beklemede', ?, ?)
  `).run(req.params.id, baslik, aciklama, atanan, sonTarih, req.user.name, new Date().toISOString());
  const gorev = db.prepare('SELECT * FROM gorevler WHERE id = ?').get(result.lastInsertRowid);
  res.json(gorev);
});

// Görevleri getir
router.get('/:id/gorevler', authMiddleware, (req, res) => {
  const gorevler = db.prepare('SELECT * FROM gorevler WHERE ticketId = ?').all(req.params.id);
  res.json(gorevler);
});

// Görev durumu güncelle
router.patch('/gorev/:gorevId/durum', authMiddleware, (req, res) => {
  db.prepare('UPDATE gorevler SET durum = ? WHERE id = ?').run(req.body.durum, req.params.gorevId);
  const gorev = db.prepare('SELECT * FROM gorevler WHERE id = ?').get(req.params.gorevId);
  res.json(gorev);
});

// Görev sil
router.delete('/gorev/:gorevId', authMiddleware, (req, res) => {
  db.prepare('DELETE FROM gorevler WHERE id = ?').run(req.params.gorevId);
  res.json({ mesaj: 'Görev silindi' });
});
// Referans numarasıyla kayıt takibi (herkese açık)
router.get('/takip/:refNo', (req, res) => {
  const ticket = db.prepare('SELECT * FROM tickets WHERE refNo = ?').get(req.params.refNo);
  if (!ticket) return res.status(404).json({ hata: 'Kayıt bulunamadı' });
  const yorumlar = db.prepare('SELECT yazar, metin, tarih FROM yorumlar WHERE ticketId = ?').all(ticket.id);
  res.json({
    refNo: ticket.refNo,
    tur: ticket.tur,
    konu: ticket.konu,
    kategori: ticket.kategori,
    oncelik: ticket.oncelik,
    durum: ticket.durum,
    atandi: ticket.atanan ? true : false,
    tarih: ticket.tarih,
    sonTarih: ticket.sonTarih,
    yorumlar
  });
});
// Kullanıcının kendi kayıtlarını getir
// Analiz verileri (sadece admin)
router.get('/analiz/ozet', authMiddleware, (req, res) => {
  const toplamTickets = db.prepare('SELECT COUNT(*) as sayi FROM tickets').get();
  const turDagilim = db.prepare('SELECT tur, COUNT(*) as sayi FROM tickets GROUP BY tur').all();
  const durumDagilim = db.prepare('SELECT durum, COUNT(*) as sayi FROM tickets GROUP BY durum').all();
  const kategoriDagilim = db.prepare('SELECT kategori, COUNT(*) as sayi FROM tickets GROUP BY kategori ORDER BY sayi DESC').all();
  const personelPerformans = db.prepare(`
    SELECT atanan, COUNT(*) as kapatilan
    FROM tickets
    WHERE durum = 'Çözüldü' AND atanan IS NOT NULL
    GROUP BY atanan
    ORDER BY kapatilan DESC
  `).all();
  const ortalamaCapma = db.prepare(`
    SELECT AVG((julianday(datetime('now')) - julianday(tarih)) * 24 * 60) as dakika
    FROM tickets
    WHERE durum = 'Çözüldü'
  `).get();

  res.json({
    toplam: toplamTickets.sayi,
    turDagilim,
    durumDagilim,
    kategoriDagilim,
    personelPerformans,
    ortalamaCapmaDakika: Math.round(ortalamaCapma.dakika || 0)
  });
});
module.exports = router;