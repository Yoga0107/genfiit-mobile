import React from 'react';
import { Button } from 'react-native';

const LogoutButton: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  return (
    <Button title="Logout" onPress={onLogout} />
  );
};

export default LogoutButton;
