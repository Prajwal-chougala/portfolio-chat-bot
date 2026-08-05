# Portfolio Chatbot

An AI chatbot that answers questions about Prajwal's skills, projects, and
experience — grounded strictly in `backend/profile.json` so it never invents
information.

## Structure

```
portfolio-chatbot/
├── backend/          FastAPI server (Python) — calls Claude API
│   ├── main.py
│   ├── profile.json  Your data — edit this to update what the bot knows
│   ├── requirements.txt
│   ├── .env.example
│   └── render.yaml
└── frontend/          Chat UI (drop into an existing Next.js app, or a new one)
    └── app/chat/page.tsx
```

## 1. Backend setup (local)

```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env
# edit .env and paste your real ANTHROPIC_API_KEY (get one at console.anthropic.com)

uvicorn main:app --reload
```

Server runs at `http://localhost:8000`. Test it:

```bash
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What projects has Prajwal built?"}'
```

## 2. Frontend setup

If you don't have a Next.js app yet:

```bash
npx create-next-app@latest frontend --typescript --app
```

Then copy `frontend/app/chat/page.tsx` into your project at the same path,
and create `frontend/.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Run it:

```bash
cd frontend
npm run dev
```

Visit `http://localhost:3000/chat`.

## 3. Deploying

**Backend (Render):**
1. Push the `backend/` folder to a GitHub repo.
2. On Render: New → Web Service → connect the repo.
3. Render will detect `render.yaml` automatically. Set the `ANTHROPIC_API_KEY`
   and `ALLOWED_ORIGINS` (your Vercel frontend URL) as environment variables
   in the Render dashboard — don't put them in the repo.

**Frontend (Vercel):**
1. Push `frontend/` to GitHub (or add the chat page to your existing portfolio repo).
2. Import into Vercel.
3. Set `NEXT_PUBLIC_API_URL` in Vercel's environment variables to your live
   Render backend URL (e.g. `https://portfolio-chatbot-backend.onrender.com`).

## Updating what the bot knows

Just edit `backend/profile.json` and redeploy the backend. No retraining,
no vector database — the whole file is fed to Claude as context on every
request, so it always reflects exactly what's in that file.

## Notes

- `temperature: 0.2` in `main.py` keeps answers close to the literal data
  instead of "creative."
- The system prompt explicitly tells the model to say "I don't know" rather
  than guess — this is what keeps the bot honest.
- Free tiers: Render's free web service spins down after inactivity (first
  request after idle will be slow, ~30s cold start). Fine for a portfolio site.
