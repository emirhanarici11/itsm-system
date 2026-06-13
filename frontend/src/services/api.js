import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3001/api'
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const createTicket = (data) => API.post('/tickets', data);
export const getTickets = (tur) => API.get('/tickets', { params: tur ? { tur } : {} });
export const getTicket = (id) => API.get(`/tickets/${id}`);
export const updateDurum = (id, durum) => API.patch(`/tickets/${id}/durum`, { durum });
export const addYorum = (id, metin, tip = 'normal') => API.post(`/tickets/${id}/yorum`, { metin, tip });
export const ataPersonel = (id, atanan) => API.patch(`/tickets/${id}/ata`, { atanan });
export const login = (username, password) => API.post('/auth/login', { username, password });
export const getKullanicilar = () => API.get('/auth/kullanicilar');
export const onaylaKullanici = (id) => API.patch(`/auth/kullanicilar/${id}/onayla`);
export const reddetKullanici = (id) => API.patch(`/auth/kullanicilar/${id}/reddet`);
export const rolGuncelle = (id, role) => API.patch(`/auth/kullanicilar/${id}/rol`, { role });
export const silKullanici = (id) => API.delete(`/auth/kullanicilar/${id}`);
export const sifreDegistir = (eskiSifre, yeniSifre) => API.patch('/auth/sifre-degistir', { eskiSifre, yeniSifre });
// Görev oluştur
export const gorevOlustur = (ticketId, data) => API.post(`/tickets/${ticketId}/gorev`, data);

// Görevleri getir
export const getGorevler = (ticketId) => API.get(`/tickets/${ticketId}/gorevler`);

// Görev durumu güncelle
export const gorevDurumGuncelle = (gorevId, durum) => API.patch(`/tickets/gorev/${gorevId}/durum`, { durum });

// Görev sil
export const gorevSil = (gorevId) => API.delete(`/tickets/gorev/${gorevId}`);
// Referans numarasıyla takip (herkese açık)
export const takipEt = (refNo) => API.get(`/tickets/takip/${refNo}`);
// Kullanıcının kendi kayıtlarını getir
export const getBenimKayitlar = () => API.get('/tickets/benim');

// Mevcut kullanıcı bilgisi
export const getBenimBilgilerim = () => API.get('/auth/ben');
// Analiz verileri
export const getAnaliz = () => API.get('/tickets/analiz/ozet');
// Personel listesi
export const getPersoneller = () => API.get('/auth/personeller');

// Kayıt atama
export const ataTiket = (id, atanan) => API.patch(`/tickets/${id}/ata`, { atanan });