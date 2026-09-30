import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const N8N_FORM_URL = 'https://yogitha45.app.n8n.cloud/form/0800a9ed-cb58-4880-beaa-d9a1152d2b0c';

// In-memory upload storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB max file size
  },
});

app.use(express.json());

// API: Health & Status
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'ResumePulse AI n8n Connector',
    n8nEndpoint: N8N_FORM_URL,
    timestamp: new Date().toISOString(),
  });
});

// API: Submit Resume to n8n Workflow
app.post(
  '/api/submit-resume',
  upload.single('file'),
  async (req: Request, res: Response) => {
    try {
      const name = (req.body.name || req.body['field-0'] || '').trim();
      const email = (req.body.email || req.body['field-2'] || '').trim();
      const jobRole = (req.body.jobRole || '').trim();
      const experienceLevel = (req.body.experienceLevel || '').trim();
      const targetIndustry = (req.body.targetIndustry || '').trim();
      const file = req.file;

      if (!name) {
        return res.status(400).json({ error: 'Name is required' });
      }
      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }
      if (!file) {
        return res.status(400).json({ error: 'Resume file is required' });
      }

      // Forward to n8n form endpoint
      const n8nFormData = new FormData();
      n8nFormData.append('field-0', name);
      n8nFormData.append('field-2', email);

      // Create blob from buffer with original mime type and file name
      const blob = new Blob([file.buffer as unknown as BlobPart], {
        type: file.mimetype || 'application/pdf',
      });
      n8nFormData.append('field-1', blob, file.originalname);

      // Append optional extra fields if provided
      if (jobRole) {
        n8nFormData.append('target_role', jobRole);
      }
      if (experienceLevel) {
        n8nFormData.append('experience_level', experienceLevel);
      }
      if (targetIndustry) {
        n8nFormData.append('industry', targetIndustry);
      }

      let n8nResponseText = '';
      let n8nStatusCode = 200;

      try {
        const n8nRes = await fetch(N8N_FORM_URL, {
          method: 'POST',
          body: n8nFormData,
        });

        n8nStatusCode = n8nRes.status;
        n8nResponseText = await n8nRes.text();
      } catch (err: unknown) {
        console.error('Failed to forward to n8n:', err);
        // We still treat as accepted if network hiccup occurs to give user clear diagnostic feedback
        n8nStatusCode = 502;
        n8nResponseText = err instanceof Error ? err.message : 'Network error connecting to n8n';
      }

      return res.status(200).json({
        success: n8nStatusCode >= 200 && n8nStatusCode < 300,
        n8nStatus: n8nStatusCode,
        message:
          n8nStatusCode >= 200 && n8nStatusCode < 300
            ? 'Resume submitted successfully to the n8n Resume Analyzer workflow'
            : 'Resume processed locally; n8n webhook reported a notice',
        details: {
          candidateName: name,
          email,
          fileName: file.originalname,
          fileSize: file.size,
          mimetype: file.mimetype,
          jobRole: jobRole || 'General Professional',
          submittedAt: new Date().toISOString(),
          n8nEndpoint: N8N_FORM_URL,
        },
        rawResponse: n8nResponseText.slice(0, 300),
      });
    } catch (error: unknown) {
      console.error('Server error submitting resume:', error);
      const message = error instanceof Error ? error.message : 'Internal Server Error';
      return res.status(500).json({ error: message });
    }
  }
);

// Setup Vite or Static File Serving
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ResumePulse AI server running at http://0.0.0.0:${PORT}`);
    console.log(`Target n8n Form Endpoint: ${N8N_FORM_URL}`);
  });
}

startServer();
