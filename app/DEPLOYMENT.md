# Deployment Guide

## Build for Production

```bash
cd app
npm run build
```

This creates an optimized production build in `app/dist/`.

## Deployment Options

### Option 1: Static Hosting (Recommended)

The app is a static site and can be deployed to any static hosting service:

#### Vercel
```bash
npm install -g vercel
vercel
```

#### Netlify
```bash
npm install -g netlify-cli
netlify deploy --dir=dist --prod
```

#### GitHub Pages
```bash
npm run build
# Push dist/ folder to gh-pages branch
```

#### AWS S3 + CloudFront
```bash
aws s3 sync dist/ s3://your-bucket-name/
```

### Option 2: Docker

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Build and run:
```bash
docker build -t shape-of-a-night .
docker run -p 80:80 shape-of-a-night
```

## Environment Configuration

### Base Path (Optional)

If deploying to a subdirectory (e.g., `example.com/shape-of-a-night/`), update `vite.config.ts`:

```ts
export default defineConfig({
  base: '/shape-of-a-night/', // Add this
  // ... rest of config
});
```

### Asset Optimization

The build process automatically:
- Minifies JavaScript and CSS
- Tree-shakes unused code
- Optimizes images
- Generates source maps (configurable)

To disable source maps in production:
```ts
// vite.config.ts
export default defineConfig({
  build: {
    sourcemap: false, // Change to false
  },
});
```

## Performance Checklist

- [ ] Enable gzip/brotli compression on server
- [ ] Set appropriate cache headers for `/scenes/*.json` files
- [ ] Use CDN for static assets
- [ ] Monitor bundle size (current: ~300KB gzipped)
- [ ] Consider lazy-loading galaxy.json (~8MB) with loading state

## CDN Setup (Optional)

For large JSON files like `galaxy_min.json`, consider hosting on a CDN:

1. Upload `scenes/*.json` to CDN
2. Update `dataLoader.ts`:

```ts
const CDN_BASE = 'https://cdn.yoursite.com/scenes/';

const module = await import(`${CDN_BASE}${filename}`);
```

## Browser Support

The app targets modern browsers with ES2020 support:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

For wider support, update `tsconfig.json` target to `ES2015`.

## Monitoring

### Recommended Analytics
- **Page views**: Track scene transitions
- **Performance**: Canvas render times, scroll smoothness
- **Errors**: Canvas context failures, JSON load errors

Example with Vercel Analytics:
```bash
npm install @vercel/analytics
```

```tsx
// src/main.tsx
import { Analytics } from '@vercel/analytics/react';

<App />
<Analytics />
```

## Known Issues

1. **Large initial bundle**: `galaxy_min.json` is 8MB
   - Solution: Implement progressive loading or WebGL
   
2. **Safari canvas performance**: May lag with 100k+ dots
   - Solution: Reduce dot count on mobile Safari
   
3. **Memory usage**: Full galaxy keeps ~100k nodes in memory
   - Solution: Implement viewport culling

## Production Checklist

- [ ] Run `npm run build` successfully
- [ ] Test production build with `npm run preview`
- [ ] Verify all 12 scenes render correctly
- [ ] Test on mobile devices
- [ ] Check console for errors/warnings
- [ ] Validate canvas performance (60fps target)
- [ ] Test scroll smoothness
- [ ] Verify JSON files load correctly
- [ ] Check accessibility (keyboard nav, ARIA)
- [ ] Review bundle size (`dist/` folder)
- [ ] Set up error monitoring
- [ ] Configure CDN/caching if needed

