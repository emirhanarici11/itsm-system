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
- **Node.js** (v18 veya üzeri) — https://nodejs.org adresinden "LTS" sürümünü indirin
- **npm** (Node.js ile birlikte otomatik gelir)
- **Git** (opsiyonel, klonlama için) — https://git-scm.com adresinden indirin

Kurulumu doğrulamak için terminalde:
```bash
node -v
npm -v
```
İkisi de bir versiyon numarası döndürmelidir. Eğer "tanınmıyor" hatası alırsanız, Node.js kurulumunu yapın ve **terminali tamamen kapatıp yeniden açın**.

---

### 1. Projeyi İndir

**Yöntem A — Git ile klonlama (önerilen):**
```bash
git clone https://github.com/emirhanarici11/itsm-system.git
cd itsm-system
```

**Yöntem B — ZIP olarak indirme:**
1. GitHub'da [proje sayfasına](https://github.com/emirhanarici11/itsm-system) git
2. Sağ üstteki yeşil **"Code"** butonuna tıkla
3. **"Download ZIP"** seçeneğine tıkla
4. İndirilen ZIP dosyasını istediğin klasöre çıkar
5. Çıkarılan klasöre terminalde git

---

### 2. Backend Kurulumu

Bir terminal açın ve proje klasöründeyken:
```bash
cd backend
npm install
```

Kurulum bitince sunucuyu başlatın:
```bash
node src/index.js
```

✅ Şu mesajı gördüğünüzde backend hazırdır:
Sunucu 3001 portunda çalışıyor

### 3. Frontend Kurulumu

**Backend terminalini açık bırakın** ve **yeni bir terminal** açın:
```bash
cd frontend
npm install
npm start
```

✅ Tarayıcı otomatik olarak `http://localhost:3000` adresini açacaktır.

---

### 4. İlk Giriş

| Kullanıcı Adı | Şifre |
|---------------|-------|
| bt.admin | bt123456 |

> ⚠️ İlk girişten sonra **Şifre Değiştir** butonundan şifrenizi güncellemeniz önerilir.

---

## 🔧 Sık Karşılaşılan Sorunlar (Troubleshooting)

### "npm/node tanınmıyor" hatası
**Sebep:** Node.js kurulu değil veya PATH'e eklenmemiş.
**Çözüm:** Node.js'i https://nodejs.org adresinden kurun, kurulumdan sonra **terminali tamamen kapatıp yeniden açın**.

### "running scripts is disabled on this system" hatası (PowerShell)
**Sebep:** Windows PowerShell güvenlik politikası npm script'lerini engelliyor.
**Çözüm:** PowerShell'i normal (yönetici olmadan) açıp şu komutu çalıştırın:
```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```
Onay isteğinde `Y` yazıp Enter'a basın, sonra `npm install` komutunu tekrar çalıştırın.

### "Cannot find path" / klasör bulunamıyor hatası
**Sebep:** Terminal, projenin bulunduğu klasörde değil.
**Çözüm:** `cd` komutuyla projenin tam yoluna gidin, örneğin:
```bash
cd C:\Users\KULLANICI_ADI\itsm-system\backend
```
Klasörün doğru yerde olduğunu `dir` (Windows) veya `ls` (Mac/Linux) komutuyla kontrol edin.

### "EADDRINUSE" veya port hatası
**Sebep:** 3000 veya 3001 portu başka bir uygulama tarafından kullanılıyor.
**Çözüm:** İlgili uygulamayı kapatın veya bilgisayarı yeniden başlatıp tekrar deneyin.

### Sayfa açılıyor ama veriler gelmiyor / "Network Error"
**Sebep:** Backend çalışmıyor.
**Çözüm:** Backend terminalinin açık ve `Sunucu 3001 portunda çalışıyor` mesajının göründüğünden emin olun. Frontend, backend olmadan çalışmaz.

### Giriş yapılamıyor
**Sebep:** Veritabanı henüz oluşmamış veya admin hesabı yok.
**Çözüm:** Backend'i ilk kez çalıştırdığınızda `itsm.db` dosyası ve varsayılan admin hesabı (`bt.admin` / `bt123456`) otomatik oluşur. Backend'in en az bir kez başarıyla başladığından emin olun.

---

### ⚠️ Önemli Notlar
- Backend (**port 3001**) ve frontend (**port 3000**) **aynı anda** çalışır durumda olmalıdır
- Veritabanı dosyası (`backend/itsm.db`) ilk çalıştırmada **otomatik olarak oluşturulur**
- `.db` dosyaları `.gitignore` ile GitHub'a yüklenmez; her yeni kurulumda sıfır/temiz bir veritabanı oluşur
- `npm install` sırasında uyarı (warning) mesajları görülebilir — bunlar genellikle hata değildir, kurulum işlemine engel olmaz

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
