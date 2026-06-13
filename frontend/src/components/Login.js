import React, { useEffect } from 'react';

function Login({ onLogin }) {
  useEffect(() => {
    window.location.href = '/giris';
  }, []);

  return null;
}

export default Login;