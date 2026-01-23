from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import date
from google import genai
import os
import json
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Wanderlust API")

# CORS - allows React frontend to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Gemini client
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


class TripRequest(BaseModel):
    destination: str
    start_date: date
    end_date: date


class MealOrActivity(BaseModel):
    name: str
    description: str


class DayPlan(BaseModel):
    dayNumber: int
    breakfast: MealOrActivity
    lunch: MealOrActivity
    dinner: MealOrActivity
    activity: MealOrActivity


class Hotel(BaseModel):
    name: str
    location: str
    description: str


class ItineraryResponse(BaseModel):
    hotel: Hotel
    days: list[DayPlan]


@app.get("/")
def root():
    return {"message": "Wanderlust API is running"}


@app.post("/api/generate-itinerary", response_model=ItineraryResponse)
async def generate_itinerary(trip: TripRequest):
    if not os.getenv("GEMINI_API_KEY"):
        raise HTTPException(status_code=500, detail="Gemini API key not configured")

    day_count = (trip.end_date - trip.start_date).days + 1

    if day_count < 1:
        raise HTTPException(status_code=400, detail="End date must be after start date")

    if day_count > 30:
        raise HTTPException(status_code=400, detail="Trip cannot exceed 30 days")

    prompt = f"""You are a travel planner. Create a detailed travel itinerary for a trip to {trip.destination} for {day_count} days.

Please respond with ONLY valid JSON in exactly this format, no markdown or extra text:
{{
  "hotel": {{
    "name": "Hotel name here",
    "location": "Specific location/neighborhood",
    "description": "2-3 sentence description of why this hotel is recommended"
  }},
  "days": [
    {{
      "dayNumber": 1,
      "breakfast": {{
        "name": "Restaurant name",
        "description": "Brief description of the food spot and what to try"
      }},
      "lunch": {{
        "name": "Restaurant name",
        "description": "Brief description of the food spot and what to try"
      }},
      "dinner": {{
        "name": "Restaurant name",
        "description": "Brief description of the food spot and what to try"
      }},
      "activity": {{
        "name": "Activity or attraction name",
        "description": "What to do and why it's worth visiting"
      }}
    }}
  ]
}}

Create entries for all {day_count} days. Make sure each day has unique, varied recommendations. Include local favorites, popular spots, and hidden gems. The hotel should be well-located and suitable for tourists."""

    try:
        response = client.models.generate_content(
            model="gemini-3-flash-preview",
            contents=prompt
        )
        text = response.text

        # Clean up response - remove markdown code blocks if present
        text = text.replace("```json", "").replace("```", "").strip()

        itinerary_data = json.loads(text)
        return itinerary_data

    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Failed to parse itinerary from AI response")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating itinerary: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
