const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function testAPI() {
  console.log("Testing Gemini API Key...\n");
  
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.log("❌ No GEMINI_API_KEY found in .env file");
    return;
  }
  
  console.log("✅ API Key found:", apiKey.substring(0, 10) + "...\n");
  
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    console.log("🔄 Making test request to gemini-1.5-flash...");
    
    const result = await model.generateContent("Hello, just say 'API working!'");
    const response = await result.response;
    const text = response.text();
    
    console.log("✅ API is working!");
    console.log("📝 Response:", text);
    console.log("\n✨ Your API credits are NOT finished. The API key is valid.");
    
  } catch (error) {
    console.log("\n❌ API Error:");
    if (error.status === 429) {
      console.log("Status: RATE LIMITED (429)");
      console.log("Message: Rate limit exceeded. This is temporary.");
      console.log("\n💡 Solution: Wait a few minutes and try again.");
    } else if (error.status === 401 || error.status === 403) {
      console.log("Status: INVALID KEY (401/403)");
      console.log("Message: Your API key is invalid or has no quota left.");
      console.log("\n💡 Solution: Check your API key at https://aistudio.google.com/app/apikey");
    } else {
      console.log("Status:", error.status);
      console.log("Message:", error.message);
    }
  }
}

testAPI();
