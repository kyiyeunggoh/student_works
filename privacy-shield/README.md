# Privacy Shield

A privacy protection dashboard built with React, Vite, Express, and Gemini.

## Run locally

```bash
npm install
npm run dev
```

Set `GEMINI_API_KEY` in `.env` for live AI risk audits. Without it, the app uses a simulated audit response.

## Deploy to Render

The repository includes `render.yaml`. Render should build with `npm install && npm run build` and start with `npm start`.
