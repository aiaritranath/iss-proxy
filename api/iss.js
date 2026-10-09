export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-api-key');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const provided = req.headers['x-api-key'] || req.query.key;
  const validKey = process.env.MY_API_KEY;

  if (!validKey || provided !== validKey) {
    return res.status(401).json({
      creator: {
        name: 'Aritra Nath',
        instagram: '@its_aritra_nath',
        instagram_url: 'https://instagram.com/its_aritra_nath'
      },
      error: 'Unauthorized'
    });
  }

  const upstream = process.env.ISS_API_URL;
  if (!upstream) {
    return res.status(500).json({
      creator: {
        name: 'Aritra Nath',
        instagram: '@its_aritra_nath',
        instagram_url: 'https://instagram.com/its_aritra_nath'
      },
      error: 'Server misconfigured'
    });
  }

  try {
    const upstreamRes = await fetch(upstream, {
      headers: { 'User-Agent': 'iss-proxy/1.0' },
    });

    if (!upstreamRes.ok) {
      return res.status(upstreamRes.status).json({
        creator: {
          name: 'Aritra Nath',
          instagram: '@its_aritra_nath',
          instagram_url: 'https://instagram.com/its_aritra_nath'
        },
        error: 'Upstream error'
      });
    }

    const data = await upstreamRes.json();

    res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate=5');

    // Merge ISS data + creator info
    return res.status(200).json({
      creator: {
        name: 'Aritra Nath',
        instagram: '@its_aritra_nath',
        instagram_url: 'https://instagram.com/its_aritra_nath'
      },
      ...data
    });
  } catch (err) {
    return res.status(502).json({
      creator: {
        name: 'Aritra Nath',
        instagram: '@its_aritra_nath',
        instagram_url: 'https://instagram.com/its_aritra_nath'
      },
      error: 'Failed to reach upstream'
    });
  }
}
