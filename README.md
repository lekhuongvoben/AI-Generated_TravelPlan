# Wanderlust - AI-Powered Travel Itinerary Generator

A full-stack application that generates personalized travel itineraries using Google's Gemini AI. Built with a **Python FastAPI backend** and **React frontend**.

## Features

- 🌍 **AI-Generated Itineraries** - Powered by Google Gemini API
- 🏨 **Hotel Recommendations** - One carefully selected hotel for your entire stay
- 🍽️ **Meal Planning** - Breakfast, lunch, and dinner spots for each day
- 🎯 **Daily Activities** - Unique activities and attractions for each day
- 📱 **Responsive Design** - Works beautifully on desktop and mobile
- 📄 **PDF Export** - Download your itinerary as a PDF

## Project Structure

```
WANDERLUST-APP/
├── client/                 # React Frontend
│   ├── public/
│   │   ├── index.html
│   │   └── beach-sunset.png
│   └── src/
│       ├── components/
│       │   ├── LandingPage.jsx
│       │   └── Itinerary.jsx
│       ├── App.jsx
│       ├── index.js
│       └── index.css
│
└── server/                 # Python FastAPI Backend
    ├── main.py
    ├── requirements.txt
    └── .env.example
```

## Setup Instructions

### 1. Backend Setup (Python FastAPI)

```bash
cd server

# Create virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure API key
cp .env.example .env
# Edit .env and add your Gemini API key
```

Get your Gemini API key from: https://makersuite.google.com/app/apikey

### 2. Frontend Setup (React)

```bash
cd client

# Install dependencies
npm install
```

## Running the Application

You need **two terminal windows** - one for the backend, one for the frontend.

### Terminal 1: Start the Backend

```bash
cd server
source venv/bin/activate  # If using virtual environment
python main.py
```

The API will be running at `http://localhost:8000`

You can test it by visiting `http://localhost:8000` in your browser - you should see:
```json
{"message": "Wanderlust API is running"}
```

### Terminal 2: Start the Frontend

```bash
cd client
npm start
```

The app will open at `http://localhost:3000`

## Usage

1. Enter your destination (e.g., "Tokyo, Japan", "Paris, France")
2. Select your start and end dates
3. Click "Explore" to generate your itinerary
4. Scroll through your personalized day-by-day plan
5. Click "Export PDF" to download your itinerary

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| POST | `/api/generate-itinerary` | Generate travel itinerary |

### Request Body for `/api/generate-itinerary`

```json
{
  "destination": "Tokyo, Japan",
  "start_date": "2024-03-15",
  "end_date": "2024-03-20"
}
```

## Technologies Used

### Backend
- **FastAPI** - Modern Python web framework
- **Google Generative AI** - Gemini API
- **Pydantic** - Data validation
- **Uvicorn** - ASGI server

### Frontend
- **React 18** - UI framework
- **Framer Motion** - Smooth animations
- **date-fns** - Date formatting
- **react-datepicker** - Date selection
- **html2canvas & jsPDF** - PDF export
- **Lucide React** - Icons

## Troubleshooting

### "CORS error" or "Failed to fetch"
Make sure the backend is running on port 8000 before starting the frontend.

### "Gemini API key not configured"
1. Make sure you created a `.env` file (not just `.env.example`)
2. Add your actual API key to the `.env` file
3. Restart the backend server

### "Failed to parse itinerary"
This occasionally happens when the AI returns malformed JSON. Click "Explore" again to regenerate.

## License

MIT License - feel free to use this for personal or commercial projects!
