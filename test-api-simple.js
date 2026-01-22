const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testAPI() {
  console.log("🔍 Testing Gemini API Key...\n");
  
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.log("❌ ERROR: No GEMINI_API_KEY found in environment");
    console.log("💡 Make sure you have a .env file with GEMINI_API_KEY=your_key_here");
    process.exit(1);
  }
  
  console.log("✅ API Key present:", apiKey.substring(0, 8) + "..." + apiKey.substring(apiKey.length - 4));
  
  const genAI = new GoogleGenerativeAI(apiKey);
  
  // Try common model names
  const models = [
    "gemini-flash",
    "gemini-flash-latest", 
    "gemini-1.5-flash-latest",
    "gemini-1.5-flash-001",
    "gemini-pro",
    "gemini-1.5-pro-latest"
  ];
  
  for (const modelName of models) {
    try {
      console.log(`\n🔄 Testing model: ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Say 'OK' if you can read this");
      const response = await result.response;
      const text = response.text();
      
      console.log(`✅ SUCCESS with model: ${modelName}`);
      console.log(`📝 Response: ${text}`);
      console.log(`\n✨ Your API is WORKING! You have available credits.`);
      
      // Update the route file with working model
      const fs = require('fs');
      const routePath = './app/api/ai/gemini/route.ts';
      let routeContent = fs.readFileSync(routePath, 'utf8');
      routeContent = routeContent.replace(/model: "gemini-[^"]*"/, `model: "${modelName}"`);
      fs.writeFileSync(routePath, routeContent);
      console.log(`\n📝 Updated route.ts to use: ${modelName}`);
      
      return;
      
    } catch (error) {
      if (error.status === 404) {
        console.log(`   ❌ Model not found: ${modelName}`);
      } else if (error.status === 429) {
        console.log(`   ⚠️  Rate limited (429) - API working but quota exceeded`);
        console.log(`   💡 Your credits are TEMPORARILY exhausted. Wait a few minutes.`);
        return;
      } else if (error.status === 401 || error.status === 403) {
        console.log(`   ❌ ${error.status} - API key invalid or NO CREDITS LEFT`);
        console.log(`   💡 Check: https://aistudio.google.com/app/apikey`);
        return;
      } else {
        console.log(`   ❌ Error: ${error.message}`);
      }
    }
  }
  
  console.log("\n❌ Could not find a working model");
}

testAPI();
