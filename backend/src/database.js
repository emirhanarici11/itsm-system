const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');

const db = new Database(path.join(__dirname, '../itsm.db'));

// Tabloları oluştur
db.exec(`
  CREATE TABLE IF NOT EXISTS tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    refNo TEXT NOT NULL,
    tur TEXT DEFAULT 'sorun',
    ad TEXT NOT NULL,
    soyad TEXT NOT NULL,
    departman TEXT,
    kategori TEXT,
    oncelik TEXT,
    konu TEXT NOT NULL,
    aciklama TEXT NOT NULL,
    durum TEXT DEFAULT 'Açık',
    atanan TEXT,
    tarih TEXT NOT NULL,
    sonTarih TEXT,
    userId INTEGER
  );
  CREATE TABLE IF NOT EXISTS gorevler (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ticketId INTEGER NOT NULL,
    baslik TEXT NOT NULL,
    aciklama TEXT,
    atanan TEXT,
    sonTarih TEXT,
    durum TEXT DEFAULT 'Beklemede',
    olusturan TEXT NOT NULL,
    tarih TEXT NOT NULL,
    FOREIGN KEY (ticketId) REFERENCES tickets(id)
  );

  CREATE TABLE IF NOT EXISTS yorumlar (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ticketId INTEGER NOT NULL,
    yazar TEXT NOT NULL,
    metin TEXT NOT NULL,
    tip TEXT DEFAULT 'normal',
    tarih TEXT NOT NULL,
    FOREIGN KEY (ticketId) REFERENCES tickets(id)
  );

  CREATE TABLE IF NOT EXISTS kullanicilar (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ad TEXT NOT NULL,
    soyad TEXT NOT NULL,
    departman TEXT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    durum TEXT DEFAULT 'beklemede',
    tarih TEXT NOT NULL
  );
`);

// Varsayılan admin hesabı oluştur
const adminVar = db.prepare("SELECT * FROM kullanicilar WHERE username = 'bt.admin'").get();
if (!adminVar) {
  db.prepare(`
    INSERT INTO kullanicilar (ad, soyad, username, password, role, durum, tarih)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run('BT', 'Yöneticisi', 'bt.admin', bcrypt.hashSync('bt123456', 8), 'admin', 'aktif', new Date().toISOString());
}

// Örnek ticket verileri
const count = db.prepare('SELECT COUNT(*) as count FROM tickets').get();
if (count.count === 0) {
  const insert = db.prepare(`
    INSERT INTO tickets (refNo, tur, ad, soyad, departman, kategori, oncelik, konu, aciklama, durum, atanan, tarih)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insert.run('SRN-001', 'sorun', 'Ahmet', 'Yılmaz', 'Muhasebe', 'Bilgisayar/Donanım sorunu', 'Yüksek', 'Bilgisayarım açılmıyor', 'Sabahtan beri bilgisayarımı açamıyorum.', 'Açık', null, new Date().toISOString());
  insert.run('SRN-002', 'sorun', 'Fatma', 'Demir', 'İnsan Kaynakları', 'Ağ/İnternet sorunu', 'Orta', 'VPN bağlantı sorunu', 'Evden çalışırken VPN\'e bağlanamıyorum.', 'Beklemede', 'BT Personeli', new Date().toISOString());
  insert.run('TLP-001', 'talep', 'Kemal', 'Arslan', 'Satış', 'Yazılım/Lisans talebi', 'Düşük', 'Yeni bilgisayar talebi', 'Yeni bir bilgisayara ihtiyacım var.', 'Açık', null, new Date().toISOString());
}

module.exports = db;