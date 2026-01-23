import { GoogleGenAI } from "@google/genai";

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({apiKey: "AIzaSyB7I132h0lDXTgEI0JuBto7H8H9POnu_u8"});

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: "Provide me a travel itinerary for a week-long trip to Japan.",
  });
  console.log(response.text);
}

main();
