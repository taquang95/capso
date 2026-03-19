import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const mauticUrl = process.env.MAUTIC_URL || 'https://crm.nambds.vn';
  try {
    const response = await fetch(mauticUrl, { method: 'HEAD' });
    res.status(200).json({ 
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
}
