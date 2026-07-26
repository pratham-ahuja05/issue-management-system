# AI Incident Management Frontend

Run the app:

```bash
npm install
npm run dev
```

## API configuration

- Development uses relative `/api` by default (via Vite proxy to `http://localhost:8080`).
- Production requires `VITE_API_BASE` to be set to an absolute backend URL.

Example:

```bash
cp .env.example .env
# set VITE_API_BASE only for production builds
```
