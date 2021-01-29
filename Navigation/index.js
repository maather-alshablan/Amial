import React from 'react';
import { AuthProvider } from '../Navigation/AuthProvider';
import Routes from '../Navigation/Routes';

export default function Providers() {
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
}

