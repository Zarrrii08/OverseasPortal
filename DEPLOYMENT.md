# Deployment Guide for Linguist Portal

## Production URL Structure
- **Base URL**: `https://devtpm.language-empire.net/ODOverseasPortal/`
- **Login Page**: `https://devtpm.language-empire.net/ODOverseasPortal/loginpage`
- **Dashboard**: `https://devtpm.language-empire.net/ODOverseasPortal/dashboardpage`

## Build Configuration

### 1. Build the Application
```bash
npm run build
```

This creates a `dist` folder with your production-ready files.

### 2. Server Configuration

The application is configured to run under the `/ODOverseasPortal/` base path.

#### For Apache Servers
The `.htaccess` file in the `public` folder will be copied to `dist` during build. It ensures:
- All routes under `/ODOverseasPortal/` serve `index.html`
- Client-side routing works correctly
- Direct URL access to routes like `/ODOverseasPortal/dashboard` works

#### For IIS Servers (Windows)
The `web.config` file in the `public` folder handles URL rewriting for IIS.

#### For Nginx
Add this to your nginx configuration:

```nginx
location /ODOverseasPortal/ {
    alias /path/to/your/dist/;
    try_files $uri $uri/ /ODOverseasPortal/index.html;
    index index.html;
}
```

### 3. Deployment Steps

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Upload the `dist` folder contents** to your server at:
   ```
   /var/www/html/ODOverseasPortal/
   ```
   (or your server's equivalent path)

3. **Ensure server configuration** is in place:
   - For Apache: `.htaccess` should be in the root of `/ODOverseasPortal/`
   - For IIS: `web.config` should be in the root of `/ODOverseasPortal/`
   - For Nginx: Update nginx config as shown above

4. **Verify the deployment**:
   - Visit: `https://devtpm.language-empire.net/ODOverseasPortal/`
   - Should redirect to: `https://devtpm.language-empire.net/ODOverseasPortal/loginpage`
   - After login, should go to: `https://devtpm.language-empire.net/ODOverseasPortal/dashboardpage`

## Troubleshooting

### Issue: Routes show 404 or redirect to wrong app
**Solution**: Ensure server configuration (`.htaccess`, `web.config`, or nginx config) is properly set up to serve `index.html` for all routes under `/ODOverseasPortal/`.

### Issue: Assets not loading
**Solution**: Check that the `base` in `vite.config.mjs` is set to `/ODOverseasPortal/`.

### Issue: API calls failing
**Solution**: 
- Check `.env.production` has correct `VITE_API_BASE`
- Verify CORS settings on the API server
- Check network tab in browser DevTools

## Environment Variables

### Development (`.env`)
```
VITE_API_BASE=/ODOverseasPortalAPI/api
VITE_URL_DIR=/ODOverseasPortal
```

### Production (`.env.production`)
```
VITE_API_BASE=https://odenhanced.language-empire.net/ODOverseasPortalAPI/api
VITE_URL_DIR=/ODOverseasPortal
```

## Authentication Flow

1. **Unauthenticated users** → Redirected to `/loginpage`
2. **Authenticated users** accessing `/loginpage` → Redirected to `/dashboardpage`
3. **Unknown routes** → Redirected to `/loginpage`
4. **Session persistence** → Token stored in sessionStorage

## Important Notes

- The app uses `basename` from `VITE_URL_DIR` environment variable in React Router
- All routes are relative to this base path
- Server must be configured to serve `index.html` for all routes under `/ODOverseasPortal/`
- This prevents conflicts with other apps on the same domain
- The `vite.config.mjs` uses `loadEnv()` to read environment variables at build time

## Netlify Deployment (React + Vite)

### 1) Connect repository
- Create a Netlify account and click "Add new site" → "Import an existing project".
- Select your Git provider and this repository.
- Branch to deploy: `main`.

### 2) Build settings
- Build command: `npm run build`
- Publish directory: `dist`
- Netlify will detect `netlify.toml` and apply SPA redirects and headers automatically.

### 3) Environment variables (Site settings → Build & deploy → Environment)
- Set the following for production:
  - `VITE_API_BASE` = `https://odenhanced.language-empire.net/ODOverseasPortalAPI/api`
  - `VITE_URL_DIR` = `/ODOverseasPortal`
- Note: Only `VITE_` prefixed variables are exposed to client builds by Vite.
- Do NOT put Twilio Account SID/Auth Token in client env vars. These are server-side only.

### 4) Automatic deployments
- After initial deploy, all pushes to `main` will trigger a new build and deploy.
- You can enable Preview Deploys for PRs under Site settings → Deploys.

### 5) Local production preview (optional)
```bash
npm run build
npm run preview -- --port 4173
# Open http://localhost:4173/ODOverseasPortal/
```

## Environment Variable and Security Best Practices
- Only expose non-sensitive values via `VITE_` variables. Everything else must live on your backend.
- Twilio Voice requires generating a short-lived access token on the server. The browser should fetch that token from your backend (never embed Twilio Account SID/Auth Token in the frontend).
- Keep `.env` files out of version control. Use `.env.example` to document required keys.
- Rotate credentials periodically and restrict API keys by origin/permissions where possible.
- Avoid committing the `dist/` build output; Netlify builds from source.

## Post-Deploy Verification Checklist
- Visit your Netlify site base URL, e.g. `https://<your-site>.netlify.app/ODOverseasPortal/`.
- Routing works: navigating directly to `/ODOverseasPortal/loginpage` and `/ODOverseasPortal/dashboardpage` loads without 404 (SPA redirect in `netlify.toml`).
- Assets load correctly (no 404s in Network tab) and correct base path is used (controlled by `VITE_URL_DIR` and `base` in `vite.config.mjs`).
- API calls succeed against `VITE_API_BASE`:
  - Login: `POST /Auth/login`
  - Me: `GET /Auth/me`
  - Refresh: `POST /Auth/refresh`
- Twilio Voice:
  - Client fetches voice access token from your backend endpoint (see network logs).
  - Device registers and can receive/place calls.
- Check Console for warnings/errors; fix CORS or missing env vars if present.
