# 🛰️ ISS Proxy API

A lightweight serverless API proxy for retrieving live International Space Station (ISS) data from an upstream JSON API. The proxy keeps the upstream URL on the server, checks an API key, and returns the upstream JSON response to your application.

## ✨ Features

- **Serverless endpoint** using a Vercel-style API function.
- **API-key authentication** through the `x-api-key` request header (or `key` query parameter).
- **Upstream URL kept server-side** in an environment variable.
- **CORS support** for browser clients.
- **Short edge cache** to reduce upstream requests while keeping ISS data fresh.
- **Simple demo page** that displays the returned JSON and refreshes every five seconds.
- **JSON error responses** for authorization, configuration, upstream, and network failures.

## 🧰 Tech Stack

- JavaScript (ES modules)
- Serverless Functions / Vercel-style deployment
- HTML and browser Fetch API
- JSON over HTTP

## 📁 Project Structure

```text
iss-proxy/
├── api/
│   └── iss.js          # Authenticated proxy endpoint
├── public/
│   └── index.html      # Basic ISS response demo
├── package.json
└── README.md
```

## ⚙️ Configuration

Configure these environment variables in your deployment platform:

| Variable | Required | Description |
|---|---|---|
| `MY_API_KEY` | Yes | Secret key required to access the proxy. |
| `ISS_API_URL` | Yes | Full URL of the upstream ISS data endpoint that returns JSON. |

Do not commit real secrets or private upstream URLs to GitHub. Set environment variables in your hosting provider's project settings, then redeploy.

### Local environment

If testing locally with a platform that supports serverless functions, create a local environment file supported by that platform (for example, `.env.local`):

```env
MY_API_KEY=replace-with-a-long-random-secret
ISS_API_URL=https://example.com/your-iss-json-endpoint
```

Replace the example URL with the actual upstream API URL. The repository does not define a default upstream service, so the correct URL must be supplied by you.

## 🚀 Deploy to Vercel

1. Push this repository to GitHub.
2. Import the repository into [Vercel](https://vercel.com/).
3. In **Project Settings → Environment Variables**, add `MY_API_KEY` and `ISS_API_URL`.
4. Deploy or redeploy the project.
5. Open the deployed site's root URL to view the demo page.

Vercel maps `api/iss.js` to the `/api/iss` endpoint.

## 🔌 API Usage

### Endpoint

```http
GET /api/iss
```

### Authentication

Send your key in the `x-api-key` header:

```bash
curl -H "x-api-key: YOUR_API_KEY" \
  https://YOUR-PROJECT.vercel.app/api/iss
```

The implementation also accepts a `key` query parameter, but headers are preferred because query parameters can be recorded in browser history, logs, and analytics.

### Successful response

On success, the proxy returns the JSON received from the configured upstream API. The response fields depend on that upstream service.

### Error responses

| Status | Meaning |
|---|---|
| `401 Unauthorized` | The API key is missing or incorrect, or `MY_API_KEY` is not configured. |
| `500 Server misconfigured` | `ISS_API_URL` is missing. |
| Upstream HTTP status | The upstream service returned a non-success status. |
| `502 Failed to reach upstream` | The upstream request failed or did not return parseable JSON. |
| `204 No Content` | CORS preflight (`OPTIONS`) request. |

## 🖥️ Demo Page

The included `public/index.html` requests `/api/iss`, displays the returned JSON, and refreshes every five seconds.

**Important security note:** the demo currently includes a hard-coded API key in client-side JavaScript. Anyone can inspect the page and recover that key. Do not use this pattern for a public production deployment. For production, authenticate users through a backend or another secure mechanism, or restrict access to the endpoint. A key embedded in frontend code is not a secret.

Also consider narrowing `Access-Control-Allow-Origin` from `*` to the specific origins that should be allowed to call your API. CORS is not authentication and does not prevent non-browser clients from making requests.

## 🧪 Testing

After deployment, test the endpoint with a valid key:

```bash
curl -i -H "x-api-key: YOUR_API_KEY" \
  https://YOUR-PROJECT.vercel.app/api/iss
```

Test unauthorized access by omitting the header or using an incorrect key:

```bash
curl -i https://YOUR-PROJECT.vercel.app/api/iss
```

The second request should return `401 Unauthorized` when the environment variables are configured.

## 🔒 Security Recommendations

- Use a long, randomly generated API key.
- Never commit `.env` files, credentials, or private upstream URLs.
- Avoid exposing `MY_API_KEY` in client-side JavaScript.
- Prefer the `x-api-key` header over query-string keys.
- Restrict CORS to trusted origins where practical.
- Add rate limiting and monitoring if the endpoint is publicly accessible.
- Check that the upstream service permits proxying and that you comply with its terms and rate limits.

## 🤝 Contributing

Contributions and improvements are welcome. Open an issue to discuss a proposed change, or submit a pull request.

## 📄 License

No license file is currently included. Unless you add a license, reuse and redistribution are not automatically granted. Add a `LICENSE` file if you want to specify how others may use this project.

---

Built for experimenting with live ISS data and serverless API proxies. 🛰️
