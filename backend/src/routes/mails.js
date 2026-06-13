const express = require('express');
const router = express.Router();
const mailService = require('../services/mailService');

// Mock mail verileri
const mails = [
  {
    id: 1,
    sender: "Ahmet Yılmaz",
    email: "ahmet.yilmaz@sirket.com",
    subject: "Bilgisayarım açılmıyor — acil",
    body: "Merhaba,\n\nSabahtan beri bilgisayarımı açmaya çalışıyorum fakat hiç ses gelmiyor. Toplantım 1 saat sonra, lütfen yardımcı olabilir misiniz?\n\nTeşekkürler,\nAhmet",
    date: "2026-05-13T09:14:00",
    priority: "high",
    status: "open",
    unread: true,
    assigned: null
  },
  {
    id: 2,
    sender: "Fatma Demir",
    email: "fatma.demir@sirket.com",
    subject: "VPN bağlantı sorunu",
    body: "İyi günler,\n\nEvden çalışırken VPN'e bağlanamıyorum. Authentication failed hatası alıyorum.\n\nSaygılarımla,\nFatma Demir",
    date: "2026-05-13T10:32:00",
    priority: "med",
    status: "pending",
    unread: true,
    assigned: "Mehmet K."
  },
  {
    id: 3,
    sender: "Kemal Arslan",
    email: "kemal.arslan@sirket.com",
    subject: "Yeni yazıcı kurulumu hk.",
    body: "Merhaba BT ekibi,\n\n3. kattaki toplantı odasına yeni bir yazıcı kurulması gerekiyor. Hangi tarihte gelebilirsiniz?\n\nİyi çalışmalar",
    date: "2026-05-13T11:05:00",
    priority: "low",
    status: "open",
    unread: false,
    assigned: null
  }
];

// Tüm mailleri getir
router.get('/', (req, res) => {
  res.json(mails);
});

// Tek mail getir
router.get('/:id', (req, res) => {
  const mail = mails.find(m => m.id === parseInt(req.params.id));
  if (!mail) return res.status(404).json({ hata: 'Mail bulunamadı' });
  res.json(mail);
});

// Mail durumunu güncelle
router.patch('/:id/status', (req, res) => {
  const mail = mails.find(m => m.id === parseInt(req.params.id));
  if (!mail) return res.status(404).json({ hata: 'Mail bulunamadı' });
  mail.status = req.body.status;
  res.json(mail);
});

// Maili okundu yap
router.patch('/:id/read', (req, res) => {
  const mail = mails.find(m => m.id === parseInt(req.params.id));
  if (!mail) return res.status(404).json({ hata: 'Mail bulunamadı' });
  mail.unread = false;
  res.json(mail);
});

// Yanıt gönder
router.post('/:id/reply', async (req, res) => {
  const mail = mails.find(m => m.id === parseInt(req.params.id));
  if (!mail) return res.status(404).json({ hata: 'Mail bulunamadı' });

  const { body } = req.body;
  if (!body) return res.status(400).json({ hata: 'Yanıt içeriği boş olamaz' });

  const sent = await mailService.sendReply(mail.email, mail.subject, body);
  mail.status = 'closed';

  res.json({ mesaj: 'Yanıt gönderildi', sent });
});

// Gönderilen mailleri getir
router.get('/sent/all', (req, res) => {
  res.json(mailService.getSentMails());
});

module.exports = router;