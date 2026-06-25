# ITSM — IT Service Management System
# BT Ticket / Talep Yönetim Sistemi

[![Node.js](https://img.shields.io/badge/node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/react-18.x-blue.svg)](https://react.dev/)
[![License](https://img.shields.io/badge/license-Educational-orange.svg)](#lisans)

Şirket içi BT destek taleplerini takip eden ve yöneten, rol tabanlı, SLA destekli bir web ticket/talep yönetim sistemi. Backend (Node.js/Express) ve Frontend (React) ile geliştirilmiştir.

---

## 📋 Proje Özeti

### Problem Tanımı
Şirketlerin BT birimlerine gelen destek talepleri ve sorun bildirimleri genellikle e-posta, telefon veya sözlü iletişim yoluyla iletilmektedir. Bu durum kayıtların takibini zorlaştırmakta, önceliklendirme yapılamamakta ve çözüm süreçleri uzamaktadır.

### Hedef Kullanıcı Kitlesi
- **Kullanıcılar:** Şirket çalışanları — BT birimine sorun bildiren veya hizmet talebinde bulunan kişiler
- **BT Personeli:** Gelen kayıtları yöneten, çözen ve takip eden teknik ekip
- **BT Yöneticisi:** Tüm sistemi yöneten, kullanıcıları onaylayan ve analiz raporlarını görüntüleyen yetkili

### Çözüm
ITSM sistemi; sorun bildirimi, talep yönetimi, SLA takibi, personel atama ve analiz paneli gibi özellikleri tek bir platformda bir araya getiren tam işlevli bir web uygulamasıdır.

### Temel Değer Önerisi
- Kayıtların merkezi olarak takip edilmesi
- SLA süreleriyle önceliklendirme
- Şeffaf iletişim — kullanıcı kaydının her aşamasını görebilir
- Analiz paneli ile performans takibi

---

## 🤖 Kullanılan AI Araçları

| Araç | Kullanım Amacı |
|------|---------------|
| **Claude (Anthropic)** | Sistem tasarımı, kod geliştirme, hata ayıklama ve dokümantasyon desteği |

> Bu projede geliştirme sürecinde **Claude AI**'dan destek alınmıştır. Sistem mimarisi, veritabanı tasarımı ve özellik kararları geliştirici tarafından belirlenmiş; Claude kod yazımı, hata ayıklama ve dokümantasyon süreçlerinde yardımcı araç olarak kullanılmıştır.

---

---
## 💬 Prompt Kütüphanesi

### Sistem Tasarımı Promptu
Bir şirketin BT birimi için gönderilen mailleri web sitesinde gösterecek,

web sitesinde verilen cevapları kullanıcıya yanıt olarak mail atacak bir web sitesi yapacağız.

### Veritabanı Tasarımı Promptu
QLite ile ticket sistemi için veritabanı tasarla.

Tablolar: tickets (refNo, tur, ad, soyad, departman, kategori, oncelik,

konu, aciklama, durum, atanan, tarih, sonTarih, userId),

yorumlar (ticketId, yazar, metin, tip, tarih),

gorevler (ticketId, baslik, aciklama, atanan, sonTarih, durum, olusturan, tarih),

kullanicilar (ad, soyad, departman, username, password, role, durum, tarih)

### Kullanıcı Rol Sistemi Promptu
Üç rol olsun: user, staff, admin

Herkes aynı kayıt formundan kaydolsun

Admin onaylar, sonra BT yetkisi verebilir

BT yetkisi olan kullanıcılar paneli görür

Normal kullanıcılar sadece kendi kayıtlarını takip eder

## 🚀 Özellikler

### Kullanıcı Tarafı
- ✅ Sorun ve talep kaydı oluşturma
- ✅ Kayıt durumunu takip etme (Açık / Beklemede / Çözüldü)
- ✅ BT ekibinin yorumlarını görüntüleme
- ✅ Çözüm açıklamasını yeşil kutucukta görme

### BT Personeli
- ✅ Sorun ve talep kayıtlarını listeleme ve filtreleme
- ✅ Kayıt atama ve yeniden atama
- ✅ Yorum ekleme ve @ ile personel etiketleme
- ✅ Görev oluşturma
- ✅ SLA süre takibi (süre dolunca kırmızı uyarı)
- ✅ Çözüm açıklaması ile kayıt kapatma

### Yönetici (Admin)
Tüm BT personeli özelliklerine ek olarak:
- ✅ Kullanıcı kayıt onaylama / reddetme
- ✅ BT yetkisi verme / kaldırma
- ✅ Analiz paneli (personel performansı, kategori dağılımı, ortalama çözüm süresi)

---

## 📁 Proje Yapısı
itsm-system/

├── backend/

│   ├── src/

│   │   ├── routes/

│   │   │   ├── auth.js         # Kimlik doğrulama, kullanıcı yönetimi

│   │   │   └── tickets.js      # Kayıt yönetimi, görevler, yorumlar

│   │   ├── database.js         # SQLite bağlantısı ve tablo tanımları

│   │   └── index.js            # Ana sunucu

│   └── package.json

│

├── frontend/

│   ├── src/

│   │   ├── components/         # Yeniden kullanılabilir bileşenler

│   │   │   ├── Login.js

│   │   │   ├── SifreDegistir.js

│   │   │   ├── GorevModal.js

│   │   │   ├── AtamaModal.js

│   │   │   ├── CozumModal.js

│   │   │   └── YorumKutusu.js

│   │   ├── pages/              # Sayfa bileşenleri

│   │   │   ├── Panel.js        # BT paneli

│   │   │   ├── KullaniciPanel.js

│   │   │   └── Kayit.js        # Giriş / kayıt

│   │   ├── services/

│   │   │   └── api.js          # API servisleri

│   │   └── App.js

│   └── package.json

│

└── README.md
---

## 🛠️ Kurulum

### Gereksinimler
```bash
Node.js 18+
npm
Git
```

### 1. Projeyi İndir
```bash
git clone https://github.com/emirhanarici11/itsm-system.git
cd itsm-system
```

### 2. Backend Kurulumu
```bash
cd backend
npm install
node src/index.js
```
✅ `Sunucu 3001 portunda çalışıyor` mesajını gördüğünüzde backend hazır demektir.

### 3. Frontend Kurulumu
**Yeni bir terminal** açın (backend terminali açık kalsın):
```bash
cd frontend
npm install
npm start
```
✅ Tarayıcı otomatik olarak `http://localhost:3000` adresini açacaktır.

### 4. İlk Giriş

| Kullanıcı Adı | Şifre |
|---------------|-------|
| bt.admin | bt123456 |

> ⚠️ İlk girişten sonra **Şifre Değiştir** butonundan şifreyi güncellemeniz önerilir.

### ⚠️ Önemli Notlar
- Backend (**3001**) ve frontend (**3000**) **aynı anda** çalışmalıdır
- Veritabanı (`itsm.db`) ilk çalıştırmada **otomatik oluşturulur**
- `.db` dosyaları `.gitignore` ile hariç tutulmuştur, her kurulumda sıfır veritabanı oluşur

---

## 📖 Kullanım

### Kullanıcı Akışı
1. `http://localhost:3000` adresinden kayıt ol
2. Admin onayını bekle
3. Giriş yap → "Yeni Kayıt" sekmesinden sorun/talep oluştur
4. "Kayıtlarım" sekmesinden durumu takip et

### BT Personeli Akışı
1. Admin tarafından "BT Yetkisi" verilmiş hesapla giriş yap
2. `/panel` sayfasında gelen kayıtları gör
3. Kaydı üstlen, yorum ekle, gerekirse görev oluştur
4. Çözüldüğünde açıklama yazarak kapat

### Admin Akışı
1. `bt.admin` hesabıyla giriş yap
2. "Kullanıcı Yönetimi" sekmesinden bekleyen kayıtları onayla
3. Gerekirse personele "BT Yetkisi" ver
4. "Analiz" sekmesinden performans raporlarını incele

---

## 🔐 Rol Sistemi

| Rol | Yetki |
|-----|-------|
| `user` | Kayıt oluşturma, kendi kayıtlarını takip etme |
| `staff` | BT paneli, kayıt yönetimi, yorum, görev |
| `admin` | Tüm özellikler + kullanıcı yönetimi + analiz |

---

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

---

## 🐛 Bilinen Sınırlamalar ve Geliştirmeler

### Yapılacaklar
- [ ] E-posta bildirim sistemi
- [ ] Microsoft Outlook / Graph API entegrasyonu
- [ ] Gerçek zamanlı (WebSocket) bildirimler
- [ ] Çözüldü sekmesi filtrelemesinde iyileştirme
- [ ] Azure /bul ut ortamına deploy

---

## 🔮 Gelecek Vizyonu

### Kısa Vadeli
- **E-posta bildirimi** — kayıt açıldığında/güncellendiğinde otomatik mail
- **Outlook entegrasyonu** — gelen mailleri otomatik ticket'a dönüştürme
- **Mobil uygulama** — React Native ile iOS/Android desteği

### Orta Vadeli
- **AI destekli önceliklendirme** — kayıt içeriğine göre otomatik öncelik belirleme
- **Chatbot** — sık sorulan sorulara anında cevap
- **Raporlama modülü** — haftalık/aylık PDF rapor

### Uzun Vadeli
- **Çok şirket desteği** — SaaS modeline geçiş
- **Azure deploy** — Microsoft ekosistemiyle tam entegrasyon
- **Makine öğrenmesi** — geçmiş kayıtlardan çözüm önerisi

---

## 📝 Lisans

Bu proje eğitim amaçlı geliştirilmiştir.

---

## 👨‍💻 Geliştirici

**Emirhan Arıcı**
- GitHub: [@emirhanarici11](https://github.com/emirhanarici11)
- Ders: Programlamada Yeni Eğilimler
