import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  // API Endpoint for Mautic Form Submission
  app.post('/api/submit-form', async (req, res) => {
    const { firstname, email } = req.body;
    
    // Use environment variables or defaults
    const mauticUrl = process.env.MAUTIC_URL || 'https://crm.nambds.vn';
    const mauticFormId = process.env.MAUTIC_FORM_ID;

    if (!mauticFormId) {
      console.error('MAUTIC_FORM_ID is not configured');
      return res.status(500).json({ error: 'Mautic configuration error' });
    }

    try {
      // Mautic expects application/x-www-form-urlencoded for its form submission endpoint
      const mauticParams = new URLSearchParams();
      mauticParams.append('mauticform[firstname]', firstname);
      mauticParams.append('mauticform[email]', email);
      mauticParams.append('mauticform[formId]', mauticFormId);
      mauticParams.append('mauticform[return]', req.headers.referer || '');

      const submissionUrl = `${mauticUrl.replace(/\/$/, '')}/form/submit?formId=${mauticFormId}`;
      
      console.log(`Forwarding submission to Mautic: ${submissionUrl}`);

      const response = await fetch(submissionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-Forwarded-For': req.ip || '',
        },
        body: mauticParams.toString(),
      });

      // Mautic usually redirects or returns 200. We'll just check if it was successful.
      if (response.ok || response.status === 302) {
        console.log('Mautic submission successful');
        return res.json({ success: true });
      } else {
        const errorText = await response.text();
        console.error('Mautic submission failed:', response.status, errorText);
        return res.status(response.status).json({ error: 'Mautic submission failed' });
      }
    } catch (error) {
      console.error('Server error during Mautic submission:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
