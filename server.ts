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
  app.get('/api/health', async (req, res) => {
    const mauticUrl = process.env.MAUTIC_URL || 'https://crm.nambds.vn';
    try {
      const response = await fetch(mauticUrl, { method: 'HEAD' });
      res.json({ 
        status: 'ok', 
        mautic: {
          url: mauticUrl,
          reachable: response.ok,
          status: response.status
        }
      });
    } catch (error) {
      res.status(500).json({ 
        status: 'error', 
        mautic: {
          url: mauticUrl,
          reachable: false,
          error: error instanceof Error ? error.message : String(error)
        }
      });
    }
  });

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
      mauticParams.append('mauticform[messenger]', '1');
      mauticParams.append('mauticform[submit]', '1');

      const submissionUrl = `${mauticUrl.replace(/\/$/, '')}/form/submit?formId=${mauticFormId}`;
      
      console.log(`[MAUTIC] Forwarding submission to: ${submissionUrl}`);
      console.log(`[MAUTIC] Data: firstname=${firstname}, email=${email}, formId=${mauticFormId}`);

      const response = await fetch(submissionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-Forwarded-For': req.ip || '',
          'User-Agent': req.headers['user-agent'] || 'Vite-Server-Proxy',
        },
        body: mauticParams.toString(),
      });

      console.log(`[MAUTIC] Response status: ${response.status}`);
      
      // Mautic usually redirects (302) or returns 200.
      if (response.ok || response.status === 302) {
        console.log('[MAUTIC] Submission successful');
        return res.json({ success: true });
      } else {
        const errorText = await response.text();
        console.error('[MAUTIC] Submission failed:', response.status, errorText);
        return res.status(response.status).json({ 
          error: `Mautic submission failed with status ${response.status}`,
          details: errorText.substring(0, 200) // Send a snippet of the error back
        });
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
