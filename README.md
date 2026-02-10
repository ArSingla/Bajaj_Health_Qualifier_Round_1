# BFHL REST API (Node.js)

Production-ready Node.js API implementing:
- `GET /health`
- `POST /bfhl`

## Tech Stack
- Node.js (LTS)
- Express.js
- Google Gemini API (`@google/genai`)

## Project Structure
```text
.
├── .env.example
├── package.json
├── src
│   ├── ai.js
│   ├── app.js
│   ├── math.js
│   └── server.js
└── test
    └── api.test.js
```

## Setup
1. Install dependencies:
```bash
npm install
```
2. Copy env file and fill values:
```bash
cp .env.example .env
```
3. Start server:
```bash
npm start
```

Default local URL: `http://localhost:3000`

## Environment Variables
- `PORT`: Server port (default `3000`)
- `OFFICIAL_EMAIL`: Your Chitkara email used in success responses
- `GEMINI_API_KEY`: Gemini API key (required for `{ "AI": "..." }`)
- `GEMINI_MODEL`: Optional, default `gemini-2.5-flash`

## API Contract

### GET `/health`
Returns service health.

Response `200`:
```json
{
  "is_success": true,
  "official_email": "YOUR_CHITKARA_EMAIL"
}
```

### POST `/bfhl`
Rules:
- Body must be valid JSON
- Body must contain **exactly one key**
- Allowed keys: `fibonacci`, `prime`, `lcm`, `hcf`, `AI`

Success response:
```json
{
  "is_success": true,
  "official_email": "YOUR_CHITKARA_EMAIL",
  "data": "<result>"
}
```

Error response:
```json
{
  "is_success": false,
  "error": "Descriptive error message"
}
```

#### Supported Inputs
1. Fibonacci
```json
{ "fibonacci": 7 }
```
2. Prime Filter
```json
{ "prime": [2,4,7,9,11] }
```
3. LCM
```json
{ "lcm": [12,18,24] }
```
4. HCF
```json
{ "hcf": [24,36,60] }
```
5. AI
```json
{ "AI": "What is the capital city of Maharashtra?" }
```

## Security and Reliability
- `helmet` for secure HTTP headers
- `cors` enabled for public access
- `express-rate-limit` basic protection
- 32kb JSON body limit
- Input validation with `zod`
- BigInt math for large integer safety in Fibonacci/LCM/HCF
- JSON-only error responses, including invalid JSON payloads

## Test
```bash
npm test
```

## Deployment (Render / Railway / Vercel)
Set environment variables in your platform:
- `OFFICIAL_EMAIL`
- `GEMINI_API_KEY`
- `PORT` (if required by platform)

### Render (quick steps)
1. Push this project to GitHub.
2. Create new Web Service from repo.
3. Build command: `npm install`
4. Start command: `npm start`
5. Add env vars listed above.

### After Deployment
Share these links:
- GitHub Repo URL
- `https://<your-domain>/health`
- `https://<your-domain>/bfhl`
