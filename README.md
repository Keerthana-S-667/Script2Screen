# Script2Screen 🎥

> AI-powered short-form video creator — **Topic → Script → Voice → Avatar Video → Download**

## Live Services

| Feature | Service |
|---------|---------|
| Script Generation | [Groq](https://console.groq.com) (Llama 3.1) |
| Translation | [Sarvam AI](https://www.sarvam.ai) (Indian languages) |
| Text-to-Speech | Microsoft Edge TTS (no API key required) |
| Avatar Video | [D-ID](https://www.d-id.com) Talks API |
| Media Hosting | [Cloudinary](https://cloudinary.com) |
| Lip-sync Video | [Replicate](https://replicate.com) SadTalker |

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, Vite 7, TailwindCSS v4, Framer Motion, React Router DOM |
| Backend | Python 3.12, Flask 3.1, Flask-CORS |
| Icons | Lucide React |

## Project Structure

```
Script2Screen/
├── frontend/
│   ├── src/
│   │   ├── components/        # Shared UI components
│   │   ├── pages/             # Page-level views (Dashboard, CreateVideo, etc.)
│   │   ├── styles/            # Global styles
│   │   ├── App.tsx            # Router root
│   │   └── main.tsx           # React entry point
│   ├── index.html
│   ├── vite.config.ts         # Dev proxy: /api → localhost:5000
│   └── package.json
│
├── backend/
│   ├── app.py                 # Flask app + blueprint registration
│   ├── routes/                # API route handlers
│   ├── services/              # Business logic + API integrations
│   │   ├── script_service.py          # Groq LLM script generation
│   │   ├── translation_service.py     # Sarvam AI translation
│   │   ├── voice_service.py           # Edge TTS voice generation
│   │   ├── video_service.py           # D-ID avatar video generation
│   │   └── cloudinary_service.py      # Cloudinary media hosting
│   ├── audio/                 # Generated TTS audio files (gitignored)
│   ├── requirements.txt
│   ├── .env.example           # ← copy this to .env and fill in keys
│   └── dev_scratch/           # Development test scripts (reference only)
│
├── test_script.py             # Quick script generation smoke test
├── test_translation.py        # Quick translation smoke test
└── README.md
```

## Setup & Running Locally

### Prerequisites
- Python 3.12+
- Node.js 18+
- API keys (see **Environment Variables** below)

---

### 1 — Backend

```bash
cd backend

# Create a virtual environment
python -m venv venv

# Activate it
# Windows PowerShell:
venv\Scripts\Activate.ps1
# macOS / Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env and fill in your API keys

# Start the Flask server
python app.py
# → http://localhost:5000
```

### 2 — Frontend

```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

The Vite dev server proxies all `/api/*` requests to the Flask backend at `localhost:5000`, so both must be running simultaneously.

---

## Environment Variables

Copy `backend/.env.example` to `backend/.env` and fill in your values:

| Variable | Required | Where to get it |
|----------|----------|-----------------|
| `GROQ_API_KEY` | ✅ Yes | https://console.groq.com |
| `SARVAM_API_KEY` | ✅ Yes | https://www.sarvam.ai |
| `DID_API_USER` | ✅ Yes | https://www.d-id.com (base64-encoded email) |
| `DID_API_SECRET` | ✅ Yes | https://www.d-id.com |
| `CLOUDINARY_CLOUD_NAME` | ✅ Yes | https://cloudinary.com |
| `CLOUDINARY_API_KEY` | ✅ Yes | https://cloudinary.com |
| `CLOUDINARY_API_SECRET` | ✅ Yes | https://cloudinary.com |
| `REPLICATE_API_TOKEN` | ✅ Yes | https://replicate.com/account/api-tokens |
| `SECRET_KEY` | ✅ Yes | Any random secret string |
| `FLASK_ENV` | Optional | `development` or `production` |
| `PORT` | Optional | Default: `5000` |

> ⚠️ **Never commit your `.env` file.** It is excluded by `.gitignore`.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Server health check |
| `POST` | `/api/script/generate` | Generate script from topic (Groq LLM) |
| `POST` | `/api/script/translate` | Translate script to Indian language (Sarvam AI) |
| `POST` | `/api/voice/generate` | Generate TTS audio (Edge TTS) |
| `GET` | `/audio/<filename>` | Serve generated audio files |
| `POST` | `/api/video/generate` | Generate avatar video (D-ID) |
| `POST` | `/api/avatar/generate` | Avatar placeholder |
| `POST` | `/api/caption/generate` | Caption & hashtag placeholder |

### Health Check

```bash
curl http://localhost:5000/api/health
# {"status": "ok", "service": "Script2Screen API"}
```

---

## Deployment Notes

- The `backend/.env` file is **gitignored** — set your API keys as environment variables on your hosting platform (Railway, Render, Heroku, etc.)
- The `backend/audio/` directory is created automatically at runtime
- The `backend/venv/` directory is **gitignored** — run `pip install -r requirements.txt` on the server
- For production, set `FLASK_ENV=production` to disable the debug server
