import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isLocalDev = mode === 'development'
  const isNetlify = Boolean(process.env.NETLIFY)
  const isVercel = Boolean(process.env.VERCEL_ENV)
  const isGitHubPages = Boolean(process.env.GITHUB_PAGES) || process.env.DEPLOY_TARGET === 'github-pages'

  // Keep root path locally/Netlify/Vercel; only use subpath when explicitly targeting GitHub Pages
  const base = (isLocalDev || isNetlify || isVercel) ? '/' : (isGitHubPages ? '/xandeum-analytics/' : '/')

  return {
    plugins: [react()],
    base,
    server: {
      proxy: {
        // Proxy API requests to avoid CORS issues in development
        // Uses verified public pRPC endpoint from Discord
        '/api': {
          target: 'http://192.190.136.36:6000', // Primary endpoint (verified working)
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
          timeout: 15000, // 15 second timeout for gossip network
          configure: (proxy, _options) => {
            proxy.on('error', (err, _req, _res) => {
              console.log('❌ Proxy error:', err.message);
            });
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              console.log('🔄 Proxying:', req.method, req.url, '->', proxyReq.path);
            });
            proxy.on('proxyRes', (proxyRes, req, _res) => {
              console.log('✅ Proxy response:', proxyRes.statusCode, 'for', req.url);
            });
          },
        },
      },
    },
  }
})
