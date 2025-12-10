/**
 * Xandeum pNode Analytics Platform
 * 
 * Copyright © 2024-2025 Xandeum pNode Analytics Platform. All Rights Reserved.
 * PROPRIETARY SOFTWARE - Unauthorized use is strictly prohibited.
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import NodeList from './pages/NodeList';
import Analytics from './pages/Analytics';
import About from './pages/About';
import NodeDetailPage from './pages/NodeDetailPage';

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000, // 30 seconds
      refetchOnWindowFocus: true,
      retry: 3,
    },
  },
});

function App() {
  // Auto-detect base path: use root for Vercel, subpath for GitHub Pages
  const basename = import.meta.env.PROD && window.location.hostname.includes('github.io') 
    ? '/xandeum-analytics' 
    : '/';

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename={basename}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="nodes" element={<NodeList />} />
            <Route path="nodes/:id" element={<NodeDetailPage />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="about" element={<About />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
