import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import Itinerary from './components/Itinerary';

function App() {
  const [itinerary, setItinerary] = useState(null);
  const [tripDetails, setTripDetails] = useState(null);

  const handleItineraryGenerated = (data, details) => {
    setItinerary(data);
    setTripDetails(details);
  };

  const handleBackToSearch = () => {
    setItinerary(null);
    setTripDetails(null);
  };

  return (
    <div className="app">
      {itinerary ? (
        <Itinerary 
          itinerary={itinerary} 
          tripDetails={tripDetails}
          onBack={handleBackToSearch}
        />
      ) : (
        <LandingPage onItineraryGenerated={handleItineraryGenerated} />
      )}
    </div>
  );
}

export default App;
