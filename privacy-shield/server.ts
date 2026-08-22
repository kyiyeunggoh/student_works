import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  app.use(express.json());

  app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'Privacy Shield' }));

  app.post('/api/ai-risk-audit', async (req, res) => {
    const { targetUrl } = req.body ?? {};
    if (!targetUrl || typeof targetUrl !== 'string') return res.status(400).json({ error: 'targetUrl string is required' });
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.json({ privacyScore: 68, riskLevel: 'Moderate Risk', summary: `Simulated privacy audit for ${targetUrl}: standard analytics, advertising and session fingerprinting may be present.`, isSimulated: true });
    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Analyze the privacy risks of ${targetUrl}. Return JSON with privacyScore (0-100), riskLevel, and summary. Do not claim to have directly inspected the site unless evidence is provided.`
      });
      const text = (response.text || '').replace(/```json|```/g, '').trim();
      res.json(JSON.parse(text));
    } catch (err) {
      console.error(err);
      res.status(502).json({ error: 'AI audit failed' });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => res.sendFile(path.join(distPath, 'index.html')));
  }

  app.listen(PORT, '0.0.0.0', () => console.log(`Privacy Shield listening on ${PORT}`));
}

startServer();
