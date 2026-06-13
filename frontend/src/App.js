import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Panel from './pages/Panel';
import Kayit from './pages/Kayit';
import KullaniciPanel from './pages/KullaniciPanel';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Kayit />} />
        <Route path="/giris" element={<Kayit />} />
        <Route path="/panel" element={<Panel />} />
        <Route path="/kayitlarim" element={<KullaniciPanel />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;