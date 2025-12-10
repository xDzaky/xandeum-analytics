/**
 * Xandeum pNode Analytics Platform
 * 
 * Copyright © 2024-2025 Xandeum pNode Analytics Platform. All Rights Reserved.
 * 
 * PROPRIETARY AND CONFIDENTIAL
 * 
 * This software is the exclusive property of the copyright holder.
 * Unauthorized copying, modification, distribution, or use of this software,
 * via any medium, is strictly prohibited without explicit written permission.
 * 
 * This code is provided for viewing purposes only as part of a portfolio demonstration.
 * No license is granted for any other use.
 * 
 * For licensing inquiries: https://github.com/xDzaky/xandeum-analytics
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
