# Legal.AI frontend (React + Vite)

    npm install
    cp .env.example .env      # set VITE_API_BASE_URL (default http://127.0.0.1:8000)
    npm run dev               # http://localhost:5173
    npm run build

All backend calls live in `src/services/api.js`. If the FastAPI backend cannot be reached, the app falls back to
sample data and labels it as such. Icons are an internal set in `src/components/ui/Icon.jsx` (no extra dependency).
