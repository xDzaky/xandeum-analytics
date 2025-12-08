# Deployment Guide

## Deployment to Vercel

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/xandeum-analytics)

### Manual Deployment

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy**
```bash
vercel --prod
```

### Environment Variables

Set these in Vercel Dashboard:
- `VITE_API_BASE_URL` - Xandeum API base URL
- `VITE_REFRESH_INTERVAL` - Refresh interval in ms

## Deployment to Netlify

### Using Netlify CLI

1. **Install Netlify CLI**
```bash
npm install -g netlify-cli
```

2. **Login**
```bash
netlify login
```

3. **Deploy**
```bash
netlify deploy --prod
```

### Build Settings

- **Build command:** `npm run build`
- **Publish directory:** `dist`

## Manual Build

```bash
# Install dependencies
npm install

# Build for production
npm run build

# The built files will be in the 'dist' directory
```

## Post-Deployment Checklist

- [ ] Test all pages load correctly
- [ ] Verify API calls are working
- [ ] Check mobile responsiveness
- [ ] Test search and filter functionality
- [ ] Verify auto-refresh is working
- [ ] Check performance (Lighthouse score)
- [ ] Test cross-browser compatibility

## Custom Domain Setup

### Vercel
1. Go to Project Settings
2. Navigate to Domains
3. Add your custom domain
4. Update DNS records

### Netlify
1. Go to Site Settings
2. Navigate to Domain Management
3. Add custom domain
4. Update DNS records

## Performance Optimization

- Enable Gzip compression
- Use CDN for static assets
- Enable caching headers
- Optimize images
- Code splitting (already configured with Vite)

## Monitoring

Consider adding:
- Google Analytics
- Sentry for error tracking
- Vercel Analytics (if using Vercel)

## Troubleshooting

### Build Fails

Check:
- Node version (should be 18+)
- All dependencies are installed
- TypeScript compilation errors
- Environment variables are set

### API Not Working

- Verify `VITE_API_BASE_URL` is correct
- Check CORS settings
- Verify API endpoints are accessible
