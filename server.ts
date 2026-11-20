import 'dotenv/config';
import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';

const PORT = Number(process.env.PORT) || 3000;
const ttsCache = new Map<string, Buffer>();

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function startServer() {
  const app = express();
  app.use(express.json());

  app.get('/api/tts', async (req, res) => {
    const rawText = typeof req.query.text === 'string' ? req.query.text.trim() : '';
    const rawVoice =
      typeof req.query.voice === 'string' && req.query.voice.trim()
        ? req.query.voice.trim()
        : 'Kore';

    if (!rawText) {
      res.status(400).json({ error: 'Texto do áudio não informado.' });
      return;
    }

    if (rawText.length > 400) {
      res.status(400).json({ error: 'Texto excede o limite máximo permitido.' });
      return;
    }

    const allowedVoices = new Set(['Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr']);
    const voiceName = allowedVoices.has(rawVoice) ? rawVoice : 'Kore';
    const cacheKey = `${voiceName}:${rawText}`;

    const cached = ttsCache.get(cacheKey);
    if (cached) {
      res.setHeader('Content-Type', 'audio/wav');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      res.send(cached);
      return;
    }

    const ai = getGeminiClient();
    if (!ai) {
      res.status(503).json({
        error:
          'Chave GEMINI_API_KEY não configurada no servidor para gerar o áudio.',
      });
      return;
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash-lite-tts',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: rawText,
                speechMetadata: {
                  style:
                    'Warm, affectionate Brazilian Portuguese (pt-BR) female voice conversing naturally at a cozy bakery table.',
                },
              },
            ],
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName },
            },
          },
        },
      });

      const base64Audio =
        response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

      if (!base64Audio) {
        res.status(502).json({
          error: 'O serviço de voz não retornou dados de áudio válidos.',
        });
        return;
      }

      const wavBuffer = Buffer.from(base64Audio, 'base64');
      ttsCache.set(cacheKey, wavBuffer);

      res.setHeader('Content-Type', 'audio/wav');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      res.send(wavBuffer);
    } catch (error) {
      console.error('Erro ao gerar áudio via Gemini TTS:', error);
      res.status(502).json({
        error: 'Não foi possível gerar a locução em português no momento.',
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
