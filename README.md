# ITSM — IT Service Management System

Bir BT birimi için geliştirilmiş, tam işlevsel IT Service Management (ITSM) web uygulaması. Kullanıcılar sorun ve talep kaydı oluşturabilir, BT personeli bu kayıtları yönetebilir.

## 🚀 Özellikler

### Kullanıcı Tarafı
- Sorun ve talep kaydı oluşturma
- Kayıt durumunu takip etme (Açık / Beklemede / Çözüldü)
- BT ekibinin yorumlarını görüntüleme
- Çözüm açıklamasını yeşil kutucukta görme

### BT Personeli
- Sorun ve talep kayıtlarını listeleme ve filtreleme
- Kayıt atama ve yeniden atama
- Yorum ekleme
- Görev oluşturma
- SLA süre takibi 
- Çözüm açıklaması ile kayıt kapatma

### Yönetici (Admin)
- Tüm BT personeli özelliklerine ek olarak:
- Kullanıcı kayıt onaylama / reddetme
- BT yetkisi verme / kaldırma
- Analiz paneli (personel performansı, kategori dağılımı, ortalama çözüm süresi)

## 🛠️ Teknolojiler

### Backend
- Node.js + Express.js
- SQLite (better-sqlite3)
- JWT kimlik doğrulama
- bcryptjs şifre şifreleme

### Frontend
- React.js
- Axios
- React Router DOM
- Font Awesome ikonlar

## 📦 Kurulum

### Gereksinimler
- Node.js (v18+)
- npm

### Backend Kurulumu

```bash
cd backend
npm install
node src/index.js
```

Sunucu `http://localhost:3001` adresinde çalışacaktır.

### Frontend Kurulumu

```bash
cd frontend
npm install
npm start
```

Uygulama `http://localhost:3000` adresinde açılacaktır.

## 👤 Varsayılan Admin Hesabı

| Kullanıcı Adı | Şifre |
|---------------|-------|
| bt.admin | bt123456 |

> ⚠️ Güvenlik için ilk girişten sonra şifreyi değiştirin.

## 📁 Proje Yapısı
bt-mail-sistemi/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.js       # Kimlik doğrulama
│   │   │   └── tickets.js    # Kayıt yönetimi
│   │   ├── database.js       # SQLite bağlantısı
│   │   └── index.js          # Ana sunucu
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/       # Yeniden kullanılabilir bileşenler
│   │   ├── pages/            # Sayfa bileşenleri
│   │   ├── services/         # API servisleri
│   │   └── App.js
│   └── package.json
│
└── README.md


## 🔐 Rol Sistemi

| Rol | Yetki |
|-----|-------|
| `user` | Kayıt oluşturma, kendi kayıtlarını takip etme |
| `staff` | BT paneli, kayıt yönetimi |
| `admin` | Tüm özellikler + kullanıcı yönetimi + analiz |

## 📊 SLA Süreleri

### Sorun Kayıtları
| Öncelik | Süre |
|---------|------|
| Yüksek | 15 dakika |
| Orta | 30 dakika |
| Düşük | 35 dakika |

### Talep Kayıtları
| Öncelik | Süre |
|---------|------|
| Yüksek | 4 saat |
| Orta | 24 saat |
| Düşük | 72 saat |

## 📸 Ekran Görüntüleri

> Ekran görüntüleri eklenecek

## 📝 Lisans

Bu proje eğitim amaçlı geliştirilmiştir.




