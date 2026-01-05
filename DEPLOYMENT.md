# 🚀 Deployment Guide

## GitHub Pages Setup

### Quick Setup (Recommended)

1. **Go to your repository settings**
   - Navigate to `Settings` → `Pages`

2. **Configure source**
   - Source: `Deploy from a branch`
   - Branch: Select your branch (e.g., `main` or `claude/brescia-travel-guide-app-7yIFz`)
   - Folder: `/ (root)`

3. **Save and wait**
   - GitHub will build and deploy (1-2 minutes)
   - Your app will be available at:
     ```
     https://[username].github.io/Brescia-travel-guide/
     ```

### Custom Domain (Optional)

1. Add a `CNAME` file with your domain:
   ```
   brescia.yourdomain.com
   ```

2. Configure DNS:
   - Add CNAME record pointing to `[username].github.io`

3. Enable HTTPS in repository settings

## Alternative Hosting Options

### Netlify

1. Connect your GitHub repository
2. Build settings:
   - Build command: (leave empty)
   - Publish directory: `/`
3. Deploy!

**Live in 30 seconds** with automatic HTTPS

### Vercel

```bash
npm i -g vercel
vercel
```

Follow the prompts - done!

### Cloudflare Pages

1. Connect GitHub repository
2. Build settings:
   - Build command: (none needed)
   - Build output: `/`
3. Deploy

**Includes global CDN** for fast worldwide access

### Traditional Web Server

Upload all files via FTP/SFTP to your web server:
- No special configuration needed
- Works with any HTTP server (Apache, Nginx, etc.)
- Just point to the directory containing `index.html`

## Verification

After deployment, test these features:

- ✅ Map loads and displays markers
- ✅ Category filters work
- ✅ Search functions properly
- ✅ Mobile menu toggles
- ✅ Geolocation requests permission
- ✅ Modal opens with place details
- ✅ Responsive on mobile devices

## Troubleshooting

### Map doesn't load
- Check browser console for errors
- Verify internet connection (Leaflet.js loads from CDN)
- Ensure CORS isn't blocking resources

### Markers don't appear
- Check `data.js` is loaded
- Verify coordinates are correct
- Check browser console for JavaScript errors

### Mobile menu doesn't work
- Clear browser cache
- Test on actual mobile device (not just desktop responsive mode)
- Check JavaScript is enabled

### GitHub Pages shows 404
- Wait 2-3 minutes after first deployment
- Check branch is set correctly in Settings
- Verify `.nojekyll` file exists
- Check repository is public (or you have Pages enabled for private repos)

## Performance Tips

### For Heavy Traffic

1. **Enable Cloudflare** in front of GitHub Pages
   - Free CDN
   - DDoS protection
   - Auto minification

2. **Optimize Images** (if you add photos later)
   ```bash
   # Use ImageOptim, TinyPNG, or similar
   ```

3. **Add Service Worker** for offline support
   ```javascript
   // Cache map tiles and assets
   ```

### Mobile Performance

The app is already optimized for mobile:
- ✅ No build process (instant loading)
- ✅ Minimal dependencies
- ✅ Efficient CSS
- ✅ Responsive images
- ✅ Touch-optimized controls

## Monitoring

### Analytics (Optional)

Add to `index.html` before `</head>`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=YOUR-ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'YOUR-ID');
</script>
```

Or use privacy-friendly alternatives:
- Plausible Analytics
- Fathom Analytics
- Simple Analytics

## Updates

To update the app:

1. Edit files locally
2. Test changes
3. Commit and push:
   ```bash
   git add .
   git commit -m "Update: description of changes"
   git push
   ```
4. GitHub Pages auto-deploys (1-2 min)

## Backup

Your app is already backed up on GitHub! To download:

```bash
git clone https://github.com/[username]/Brescia-travel-guide.git
```

---

**Need help?** Open an issue on GitHub or check the main README.md
