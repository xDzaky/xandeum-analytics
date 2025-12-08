# Quick Start Guide - Xandeum pNode Analytics Platform

## 🚀 5-Minute Setup

### Prerequisites
- Node.js 18 or higher
- npm or yarn
- Modern web browser

### Installation

```bash
# Navigate to project directory
cd xandeum-analytics

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at **http://localhost:5173**

---

## 📖 Navigation Guide

### 1. Dashboard (/)
**Main overview of the network**
- View total pNodes, active nodes, network health
- See node status distribution
- Check version and location distribution
- View recent nodes table

### 2. Nodes (/nodes)
**Complete pNode explorer**
- Search nodes by ID, IP, or public key
- Filter by status (Active/Inactive/Syncing)
- View full list of all nodes
- See detailed information for each node

### 3. Analytics (/analytics)
**Data visualizations and insights**
- Network timeline (24-hour chart)
- Version distribution (pie chart)
- Geographic distribution (bar chart)
- Top nodes by uptime (bar chart)
- Summary statistics

### 4. About (/about)
**Project information**
- What is Xandeum
- Platform features
- Technology stack
- Links and resources

---

## 🎯 Key Features to Try

### ✨ Auto-Refresh
All data pages automatically update every 30 seconds. Watch the "Last updated" timestamp on the dashboard.

### 🔍 Search & Filter
On the Nodes page:
1. Type in the search box to filter nodes
2. Use the status dropdown to filter by Active/Inactive/Syncing
3. Results update instantly

### 📊 Interactive Charts
On the Analytics page:
- Hover over charts to see detailed tooltips
- View color-coded data
- See top performers and distributions

### 📱 Mobile View
Resize your browser or open on mobile:
- Bottom navigation bar appears
- Cards stack vertically
- Tables scroll horizontally
- Charts adapt to screen size

---

## 🔧 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Lint code
npm run lint
```

---

## 🎨 Customization

### Update API Base URL
Edit `src/services/api.ts`:
```typescript
constructor(baseURL: string = 'https://api.xandeum.network') {
  // Change to your API URL
}
```

### Adjust Refresh Interval
Edit `src/hooks/useNodes.ts`:
```typescript
refetchInterval: 30000, // Change to desired milliseconds
```

### Modify Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  primary: 'rgb(139 92 246)', // Your color here
  // ...
}
```

---

## 📦 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

### Manual Build
```bash
# Build
npm run build

# Upload 'dist' folder to any static hosting
```

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Use different port
npm run dev -- --port 3000
```

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### API Connection Issues
- Check `src/services/api.ts` base URL
- Verify CORS settings
- Check browser console for errors
- Currently using mock data (check console logs)

---

## 💡 Tips

1. **Performance:** The app uses React Query for caching. Data is fresh for 30 seconds.

2. **Mock Data:** Currently showing 50 mock nodes. Replace with real API when available.

3. **Responsive:** Best viewed on desktop, but fully functional on mobile.

4. **Dark Mode:** The app uses a dark theme optimized for reduced eye strain.

5. **Real-time:** All data refreshes automatically. No need to reload the page.

---

## 📚 Documentation Files

- **README.md** - Project overview and setup
- **FEATURES.md** - Complete feature documentation
- **API.md** - API endpoint documentation
- **DEPLOYMENT.md** - Deployment guides
- **CONTRIBUTING.md** - Contribution guidelines
- **PROJECT_STATUS.md** - Current project status

---

## 🔗 Resources

- **Xandeum Network:** https://xandeum.network
- **Discord Community:** https://discord.gg/uqRSmmM5m
- **React Documentation:** https://react.dev
- **Tailwind CSS:** https://tailwindcss.com
- **Recharts:** https://recharts.org

---

## ✅ What's Working

- ✅ All pages rendering correctly
- ✅ Navigation between pages
- ✅ Search and filter functionality
- ✅ All charts displaying data
- ✅ Auto-refresh every 30 seconds
- ✅ Mobile responsive design
- ✅ Loading states
- ✅ Error handling
- ✅ Production build

---

## 🎯 Next Steps

1. **Test the App:** Explore all features
2. **Integrate Real API:** Update API service with actual endpoints
3. **Deploy:** Choose Vercel or Netlify for deployment
4. **Monitor:** Check performance and fix any issues
5. **Submit:** Ready for bounty submission!

---

**Need Help?**
- Check documentation files
- Join Xandeum Discord
- Review code comments
- Check browser console for logs

**Happy Exploring! 🚀**
