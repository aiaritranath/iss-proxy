export default async function handler(req, res) {
  // Allow the browser to call this from anywhere
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-api-key');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  // 1. Check your private key
  const provided =
    req.headers['x-api-key'] || req.query.key;
  const validKey = process.env.MY_API_KEY;

  if (!validKey || provided !== validKey) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // 2. Read the hidden upstream URL from env
  const upstream = process.env.ISS_API_URL;
  if (!upstream) {
    return res.status(500).json({ error: 'Server misconfigured' });
  }

  try {
    const upstreamRes = await fetch(upstream, {
      headers: { 'User-Agent': 'iss-proxy/1.0' },
    });

    if (!upstreamRes.ok) {
      return res
        .status(upstreamRes.status)
        .json({ error: 'Upstream error' });
    }

    const data = await upstreamRes.json();

    // Cache for 1s at the edge (ISS moves fast)
    res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate=5');

    return res.status(200).json(data);
  } catch (err) {
    return res.status(502).json({ error: 'Failed to reach upstream' });
  }
}