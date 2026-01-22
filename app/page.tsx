"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [destination, setDestination] = useState("");
  const [dates, setDates] = useState("");
  const [budget, setBudget] = useState("");
  const [travelers, setTravelers] = useState("2");
  const [travelStyle, setTravelStyle] = useState("adventure");
  const [interests, setInterests] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [savedPlans, setSavedPlans] = useState<any[]>([]);

  const travelStyles = [
    { value: "adventure", label: "🏔️ Adventure", icon: "🏔️" },
    { value: "relaxation", label: "🏖️ Relaxation", icon: "🏖️" },
    { value: "cultural", label: "🏛️ Cultural", icon: "🏛️" },
    { value: "foodie", label: "🍜 Foodie", icon: "🍜" },
    { value: "romantic", label: "💕 Romantic", icon: "💕" },
    { value: "family", label: "👨‍👩‍👧‍👦 Family", icon: "👨‍👩‍👧‍👦" },
  ];

  // Load saved plans on mount
  useEffect(() => {
    const saved = localStorage.getItem("travelPlans");
    if (saved) setSavedPlans(JSON.parse(saved));
  }, []);

  const handleExplore = async () => {
    if (!destination) return;

    setLoading(true);
    setResult("");
    try {
      const response = await fetch("/api/ai/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Create a detailed, visually appealing travel plan for ${destination}${dates ? ` from ${dates}` : ""}.

Details:
- Budget: ${budget || "Not specified"}
- Number of travelers: ${travelers}
- Travel style: ${travelStyle}
- Special interests: ${interests || "General sightseeing"}

Please format the response with clear sections using emojis:
📍 Destination Overview
✨ Top Attractions
🍽️ Food & Dining
🏨 Accommodation Suggestions
💡 Travel Tips
📅 Suggested Itinerary

Make it detailed, practical, and exciting!`,
        }),
      });

      const text = await response.text();
      setResult(text);
    } catch (error) {
      setResult("Error generating travel plan. Please try again.");
    }
    setLoading(false);
  };

  const savePlan = () => {
    if (!result) return;
    const newPlan = {
      id: Date.now(),
      destination,
      date: new Date().toLocaleDateString(),
      plan: result,
    };
    const updated = [newPlan, ...savedPlans];
    setSavedPlans(updated);
    localStorage.setItem("travelPlans", JSON.stringify(updated));
    alert("Plan saved successfully!");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    alert("Plan copied to clipboard!");
  };

  const exportPlan = () => {
    const blob = new Blob([result], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `travel-plan-${destination}.txt`;
    a.click();
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-gray-900" : "bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-900"}`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Dark Mode Toggle */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="fixed top-4 right-4 z-50 p-3 bg-white/20 backdrop-blur-lg rounded-full hover:bg-white/30 transition-all shadow-lg"
      >
        {darkMode ? "☀️" : "🌙"}
      </button>

      <main className="relative min-h-screen flex items-center justify-center px-4 py-12">
        <div className="max-w-6xl w-full space-y-8">
          {/* Logo & Header */}
          <div className="text-center space-y-4">
            {/* Custom Logo */}
            <div className="flex justify-center mb-6">
              <div className="relative animate-float">
                <svg className="w-28 h-28 text-white drop-shadow-2xl" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Globe */}
                  <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="3" fill="rgba(255,255,255,0.1)" />
                  {/* Latitude lines */}
                  <ellipse cx="50" cy="50" rx="40" ry="15" stroke="currentColor" strokeWidth="2" />
                  <ellipse cx="50" cy="50" rx="40" ry="25" stroke="currentColor" strokeWidth="2" />
                  {/* Longitude lines */}
                  <ellipse cx="50" cy="50" rx="15" ry="40" stroke="currentColor" strokeWidth="2" />
                  <ellipse cx="50" cy="50" rx="30" ry="40" stroke="currentColor" strokeWidth="2" />
                  {/* Airplane */}
                  <g transform="translate(50, 50)">
                    <path d="M -15 -5 L 15 -5 L 20 0 L 15 5 L -15 5 L -10 0 Z" fill="currentColor" className="text-cyan-300" />
                    <path d="M -5 0 L -8 -12 L 0 -15 L 8 -12 L 5 0" fill="currentColor" className="text-cyan-300" />
                  </g>
                  {/* Orbiting dots */}
                  <circle cx="90" cy="50" r="4" fill="#22d3ee" className="animate-pulse" />
                  <circle cx="10" cy="50" r="3" fill="#22d3ee" opacity="0.6" />
                  <circle cx="50" cy="10" r="3" fill="#22d3ee" opacity="0.4" />
                </svg>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white drop-shadow-lg animate-fade-in">
              AI Travel Planner ✈️
            </h1>
            <p className="text-xl text-emerald-100 max-w-2xl mx-auto animate-fade-in-up">
              Create personalized travel itineraries in seconds with AI
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Form Card */}
            <div className={`lg:col-span-2 backdrop-blur-lg rounded-3xl shadow-2xl p-8 space-y-6 ${darkMode ? "bg-gray-800/95" : "bg-white/95"}`}>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <span className="text-3xl">🗺️</span> Plan Your Trip
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Destination Input */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <span className="text-lg">🌍</span> Destination *
                  </label>
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="e.g., Paris, Tokyo, Bali..."
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 outline-none transition-all ${darkMode ? "bg-gray-700 border-gray-600 focus:border-cyan-500 focus:ring-cyan-200 text-white" : "border-gray-200 focus:border-emerald-500 focus:ring-emerald-200 text-gray-800"} placeholder-gray-400`}
                  />
                </div>

                {/* Dates Input */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <span className="text-lg">📅</span> Travel Dates
                  </label>
                  <input
                    type="text"
                    value={dates}
                    onChange={(e) => setDates(e.target.value)}
                    placeholder="e.g., Dec 25 - Jan 5"
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 outline-none transition-all ${darkMode ? "bg-gray-700 border-gray-600 focus:border-cyan-500 focus:ring-cyan-200 text-white" : "border-gray-200 focus:border-emerald-500 focus:ring-emerald-200 text-gray-800"} placeholder-gray-400`}
                  />
                </div>

                {/* Budget Input */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <span className="text-lg">💰</span> Budget
                  </label>
                  <input
                    type="text"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="e.g., $2000, Budget-friendly"
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 outline-none transition-all ${darkMode ? "bg-gray-700 border-gray-600 focus:border-cyan-500 focus:ring-cyan-200 text-white" : "border-gray-200 focus:border-emerald-500 focus:ring-emerald-200 text-gray-800"} placeholder-gray-400`}
                  />
                </div>

                {/* Travelers */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <span className="text-lg">👥</span> Travelers
                  </label>
                  <select
                    value={travelers}
                    onChange={(e) => setTravelers(e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 outline-none transition-all ${darkMode ? "bg-gray-700 border-gray-600 focus:border-cyan-500 focus:ring-cyan-200 text-white" : "border-gray-200 focus:border-emerald-500 focus:ring-emerald-200 text-gray-800"}`}
                  >
                    {[1, 2, 3, 4, 5, 6, "7+"].map((num) => (
                      <option key={num} value={num}>{num} {num === 1 ? "Traveler" : "Travelers"}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Travel Style */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <span className="text-lg">✨</span> Travel Style
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {travelStyles.map((style) => (
                    <button
                      key={style.value}
                      onClick={() => setTravelStyle(style.value)}
                      className={`p-3 rounded-xl border-2 transition-all text-sm font-medium ${
                        travelStyle === style.value
                          ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-cyan-900 dark:border-cyan-500 dark:text-cyan-300"
                          : darkMode
                          ? "border-gray-600 bg-gray-700 text-gray-300 hover:border-cyan-500"
                          : "border-gray-200 bg-white text-gray-600 hover:border-emerald-500"
                      }`}
                    >
                      {style.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Special Interests */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <span className="text-lg">🎯</span> Special Interests (Optional)
                </label>
                <input
                  type="text"
                  value={interests}
                  onChange={(e) => setInterests(e.target.value)}
                  placeholder="e.g., Museums, Beaches, Hiking, Nightlife"
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 outline-none transition-all ${darkMode ? "bg-gray-700 border-gray-600 focus:border-cyan-500 focus:ring-cyan-200 text-white" : "border-gray-200 focus:border-emerald-500 focus:ring-emerald-200 text-gray-800"} placeholder-gray-400`}
                />
              </div>

              {/* Generate Button */}
              <button
                onClick={handleExplore}
                disabled={loading || !destination}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-4 px-8 rounded-xl transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl flex items-center justify-center gap-3 text-lg"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating Your Perfect Plan...
                  </>
                ) : (
                  <>
                    <span className="text-2xl">✨</span>
                    Generate Travel Plan
                  </>
                )}
              </button>

              {/* Result Section */}
              {result && (
                <div className={`mt-6 p-6 rounded-xl border-2 ${darkMode ? "bg-gray-700 border-cyan-500" : "bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200"}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                      <span className="text-2xl">🎉</span> Your Travel Plan
                    </h3>
                    <div className="flex gap-2">
                      <button
                        onClick={copyToClipboard}
                        className="p-2 bg-white rounded-lg shadow hover:shadow-md transition-all text-gray-700 hover:text-emerald-600"
                        title="Copy to clipboard"
                      >
                        📋
                      </button>
                      <button
                        onClick={exportPlan}
                        className="p-2 bg-white rounded-lg shadow hover:shadow-md transition-all text-gray-700 hover:text-emerald-600"
                        title="Export plan"
                      >
                        💾
                      </button>
                      <button
                        onClick={savePlan}
                        className="p-2 bg-white rounded-lg shadow hover:shadow-md transition-all text-gray-700 hover:text-emerald-600"
                        title="Save plan"
                      >
                        ⭐
                      </button>
                    </div>
                  </div>
                  <div className="text-gray-700 dark:text-gray-200 whitespace-pre-wrap prose prose-sm max-w-none">
                    {result}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar - Saved Plans */}
            <div className={`backdrop-blur-lg rounded-3xl shadow-2xl p-6 ${darkMode ? "bg-gray-800/95" : "bg-white/95"}`}>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">📚</span> Saved Plans
              </h2>
              {savedPlans.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-8">
                  No saved plans yet.<br/>Generate one and save it here!
                </p>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {savedPlans.map((plan) => (
                    <div
                      key={plan.id}
                      onClick={() => setResult(plan.plan)}
                      className={`p-3 rounded-lg cursor-pointer transition-all ${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-50 hover:bg-emerald-50"}`}
                    >
                      <div className="font-semibold text-gray-800 dark:text-white text-sm">{plan.destination}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{plan.date}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { emoji: "🌍", title: "Global Coverage", desc: "Any destination worldwide" },
              { emoji: "🤖", title: "AI-Powered", desc: "Smart personalized plans" },
              { emoji: "⚡", title: "Instant Results", desc: "Get plans in seconds" },
              { emoji: "💾", title: "Save & Export", desc: "Keep your plans forever" },
            ].map((feature, idx) => (
              <div key={idx} className={`backdrop-blur rounded-xl p-4 text-center ${darkMode ? "bg-gray-800/50" : "bg-white/10"}`}>
                <div className="text-4xl mb-2">{feature.emoji}</div>
                <h3 className="font-bold text-white text-sm">{feature.title}</h3>
                <p className="text-xs text-emerald-100">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }
      `}</style>
    </div>
  );
}
