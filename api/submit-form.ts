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

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { firstname, email } = req.body || {};
  
  if (!firstname || !email) {
    return res.status(400).json({ error: 'Missing firstname or email' });
  }

  // Use environment variables or defaults
  const mauticUrl = process.env.MAUTIC_URL || 'https://crm.nambds.vn';
  const mauticFormId = process.env.MAUTIC_FORM_ID;

  if (!mauticFormId) {
    console.error('MAUTIC_FORM_ID is not configured');
    return res.status(500).json({ error: 'Mautic configuration error' });
  }

  try {
    const mauticParams = new URLSearchParams();
    mauticParams.append('mauticform[firstname]', firstname);
    mauticParams.append('mauticform[email]', email);
    mauticParams.append('mauticform[formId]', mauticFormId);
    mauticParams.append('mauticform[return]', req.headers.referer || '');
    mauticParams.append('mauticform[messenger]', '1');
    mauticParams.append('mauticform[submit]', '1');

    const submissionUrl = `${mauticUrl.replace(/\/$/, '')}/form/submit?formId=${mauticFormId}`;
    
    console.log(`[MAUTIC] Forwarding submission to: ${submissionUrl}`);

    const response = await fetch(submissionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Forwarded-For': (req.headers['x-forwarded-for'] as string) || '',
        'User-Agent': req.headers['user-agent'] || 'Vercel-Serverless-Function',
      },
      body: mauticParams.toString(),
    });

    if (response.ok || response.status === 302) {
      return res.status(200).json({ success: true });
    } else {
      const errorText = await response.text();
      return res.status(response.status).json({ 
        error: `Mautic submission failed with status ${response.status}`,
        details: errorText.substring(0, 200)
      });
    }
  } catch (error) {
    console.error('Server error during Mautic submission:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
