import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { LoadingProvider } from './src/context/LoadingContext';

const App = () => {
  return (
    <LoadingProvider>
      <AppNavigator />
    </LoadingProvider>
  );
};

export default App;
