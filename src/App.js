import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './_pages/Login';
import './_scss/App.scss';

const App = () => {
  return (
    <AuthProvider>
      <Login />
    </AuthProvider>
  );
};

export default App;