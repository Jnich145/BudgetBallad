// src/App.tsx

import React from 'react';
import { ChakraProvider, CSSReset } from '@chakra-ui/react';
import FinanceDashboard from './components/FinanceDashboard';
import theme from './theme'; // We'll create this custom theme file

function App() {
  return (
    <ChakraProvider theme={theme}>
      <CSSReset />
      <FinanceDashboard />
    </ChakraProvider>
  );
}

export default App;
