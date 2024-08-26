import React from 'react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {GlobalContextProvider} from './src/context/GlobalContextProvider';
import reducer, {initState} from './src/context/reducer';
import Main from './src/Main';
const queryClient = new QueryClient();

export default function App() {
  return (
    // <GlobalContextProvider initialState={initState} reducer={reducer}>
    <GlobalContextProvider initialState={initState} reducer={reducer}>
      <QueryClientProvider client={queryClient}>
        <Main />
      </QueryClientProvider>
    </GlobalContextProvider>
  );
}
