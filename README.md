# Xandeum pNode Analytics Platform# React + TypeScript + Vite



<div align="center">This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

  

  **Real-time Analytics Platform for Xandeum pNodes**Currently, two official plugins are available:

  

  [![Live Demo](https://img.shields.io/badge/demo-live-success)](https://your-demo-url.vercel.app)- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh

  [![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

</div>

## React Compiler

---

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## 📋 Overview

## Expanding the ESLint configuration

A comprehensive, real-time analytics platform for monitoring Xandeum pNodes (storage provider nodes). Built with modern web technologies to provide network insights, node health monitoring, and performance metrics.

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

## ✨ Features

```js

### Core Featuresexport default defineConfig([

- 🔴 **Real-time Monitoring** - Auto-refresh every 30 seconds  globalIgnores(['dist']),

- 📊 **Network Dashboard** - Overview of all network statistics  {

- 🔍 **Advanced Search & Filter** - Find nodes by ID, IP, or public key    files: ['**/*.{ts,tsx}'],

- 📈 **Performance Metrics** - Track uptime, health, and storage    extends: [

- 📱 **Mobile Responsive** - Works seamlessly on all devices      // Other configs...



### Advanced Features      // Remove tseslint.configs.recommended and replace with this

- ⚡ **Live Status Updates** - Real-time node status indicators      tseslint.configs.recommendedTypeChecked,

- 🎨 **Modern UI/UX** - Clean, intuitive interface with dark mode      // Alternatively, use this for stricter rules

- 📉 **Network Health Score** - Calculated network health metrics      tseslint.configs.strictTypeChecked,

- 🔄 **Smart Caching** - Optimized API calls with React Query      // Optionally, add this for stylistic rules

- 🎯 **Type-Safe** - Built with TypeScript for reliability      tseslint.configs.stylisticTypeChecked,



## 🛠️ Tech Stack      // Other configs...

    ],

- **Frontend Framework:** React 18 + TypeScript    languageOptions: {

- **Styling:** Tailwind CSS      parserOptions: {

- **State Management:** React Query (TanStack Query)        project: ['./tsconfig.node.json', './tsconfig.app.json'],

- **Routing:** React Router v6        tsconfigRootDir: import.meta.dirname,

- **Icons:** Lucide React      },

- **Charts:** Recharts (ready to implement)      // other options...

- **Build Tool:** Vite    },

- **Deployment:** Vercel/Netlify  },

])

## 🚀 Getting Started```



### PrerequisitesYou can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:



- Node.js 18+ ```js

- npm or yarn// eslint.config.js

import reactX from 'eslint-plugin-react-x'

### Installationimport reactDom from 'eslint-plugin-react-dom'



1. Clone the repositoryexport default defineConfig([

```bash  globalIgnores(['dist']),

git clone https://github.com/yourusername/xandeum-analytics.git  {

cd xandeum-analytics    files: ['**/*.{ts,tsx}'],

```    extends: [

      // Other configs...

2. Install dependencies      // Enable lint rules for React

```bash      reactX.configs['recommended-typescript'],

npm install      // Enable lint rules for React DOM

```      reactDom.configs.recommended,

    ],

3. Start development server    languageOptions: {

```bash      parserOptions: {

npm run dev        project: ['./tsconfig.node.json', './tsconfig.app.json'],

```        tsconfigRootDir: import.meta.dirname,

      },

4. Open your browser at `http://localhost:5173`      // other options...

    },

### Building for Production  },

])

```bash```

npm run build
```

## 📁 Project Structure

```
xandeum-analytics/
├── src/
│   ├── components/         # React components
│   ├── pages/             # Page components
│   ├── services/          # API services
│   ├── hooks/             # Custom hooks
│   ├── types/             # TypeScript types
│   └── utils/             # Utility functions
├── public/
└── package.json
```

## 🔌 API Integration

This platform integrates with Xandeum pRPC endpoints to fetch node data. Currently using mock data for development.

Update the base URL in `src/services/api.ts` when Xandeum API is available.

## 🎯 Performance

- **Initial Load:** < 2 seconds
- **Time to Interactive:** < 3 seconds  
- **Auto-refresh:** Every 30 seconds
- **Caching:** 30 second stale time

## 🚢 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import repository in Vercel
3. Deploy automatically

## 📞 Contact & Links

- **Xandeum Website:** https://xandeum.network
- **Discord:** https://discord.gg/uqRSmmM5m

---

<div align="center">
  Built with ❤️ for the Xandeum Bounty Program
</div>
