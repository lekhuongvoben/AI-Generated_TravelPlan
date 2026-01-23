import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { MapPin, Calendar, Search, Compass } from 'lucide-react';

const LandingPage = ({ onItineraryGenerated }) => {
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const generateItinerary = async () => {
    if (!destination || !startDate || !endDate) {
      setError('Please fill in all fields');
      return;
    }

    if (endDate < startDate) {
      setError('End date must be after start date');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8000/api/generate-itinerary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          destination,
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to generate itinerary');
      }

      const itineraryData = await response.json();

      onItineraryGenerated(itineraryData, {
        destination,
        startDate,
        endDate,
        dayCount: Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1
      });

    } catch (err) {
      console.error('Error generating itinerary:', err);
      setError(err.message || 'Failed to generate itinerary. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="landing-page">
      {/* Background */}
      <div className="hero-background">
        <img src="/beach-sunset.png" alt="Beach sunset" />
      </div>

      {/* Navigation */}
      <nav className="navbar">
        <a href="/" className="logo">
          <Compass className="logo-icon" />
          <span>Wanderlust</span>
        </a>
        <div className="nav-links">
          <a href="#destinations">Destinations</a>
          <a href="#experiences">Experiences</a>
          <a href="#about">About</a>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="hero-content">
        <h1 className="hero-title">
          Discover Your Next
          <span className="hero-title-accent">Adventure</span>
        </h1>
        <p className="hero-subtitle">
          Plan the perfect getaway with personalized travel itineraries crafted just for you
        </p>

        {/* Search Card */}
        <div className="search-card">
          <div className="search-form">
            <div className="input-group">
              <label>Destination</label>
              <div className="input-wrapper">
                <MapPin className="icon" />
                <input
                  type="text"
                  placeholder="Where do you want to go?"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
              </div>
            </div>

            <div className="input-group">
              <label>Start Date</label>
              <div className="input-wrapper">
                <Calendar className="icon" />
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  minDate={new Date()}
                  placeholderText="Start date"
                  dateFormat="MMM d, yyyy"
                />
              </div>
            </div>

            <div className="input-group">
              <label>End Date</label>
              <div className="input-wrapper">
                <Calendar className="icon" />
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate || new Date()}
                  placeholderText="End date"
                  dateFormat="MMM d, yyyy"
                />
              </div>
            </div>

            <button 
              className="explore-btn" 
              onClick={generateItinerary}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="spinner"></div>
                  <span>Planning...</span>
                </>
              ) : (
                <>
                  <Search size={18} />
                  <span>Explore</span>
                </>
              )}
            </button>
          </div>

          {error && <div className="error-message">{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
