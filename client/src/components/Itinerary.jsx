import React, { useRef, useState } from 'react';
import { format, addDays } from 'date-fns';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { 
  ArrowLeft, 
  Download, 
  Hotel, 
  MapPin, 
  Coffee, 
  Utensils, 
  Wine,
  Compass
} from 'lucide-react';

const Itinerary = ({ itinerary, tripDetails, onBack }) => {
  const [isExporting, setIsExporting] = useState(false);
  const itineraryRef = useRef(null);

  const formatDateRange = () => {
    const start = format(tripDetails.startDate, 'MMMM d');
    const end = format(tripDetails.endDate, 'MMMM d, yyyy');
    return `${start} - ${end}`;
  };

  const getDayDate = (dayIndex) => {
    const date = addDays(tripDetails.startDate, dayIndex);
    return format(date, 'EEEE, MMMM d');
  };

  const exportToPDF = async () => {
    setIsExporting(true);
    
    try {
      const element = itineraryRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      
      // Calculate how many pages we need
      const scaledHeight = imgHeight * ratio;
      const pageCount = Math.ceil(scaledHeight / pdfHeight);
      
      for (let i = 0; i < pageCount; i++) {
        if (i > 0) {
          pdf.addPage();
        }
        pdf.addImage(
          imgData,
          'PNG',
          imgX,
          -(i * pdfHeight),
          imgWidth * ratio,
          imgHeight * ratio
        );
      }
      
      pdf.save(`${tripDetails.destination.replace(/\s+/g, '-')}-itinerary.pdf`);
    } catch (err) {
      console.error('Error exporting PDF:', err);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut'
      }
    }
  };

  return (
    <div className="itinerary-page">
      {/* Sticky Header */}
      <header className="itinerary-header">
        <div className="header-content">
          <button className="back-btn" onClick={onBack}>
            <ArrowLeft size={20} />
            <span>New Search</span>
          </button>
          <div className="header-actions">
            <button 
              className="export-btn" 
              onClick={exportToPDF}
              disabled={isExporting}
            >
              <Download size={18} />
              <span>{isExporting ? 'Exporting...' : 'Export PDF'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div ref={itineraryRef}>
        <motion.div 
          className="trip-overview"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Trip Hero */}
          <motion.div className="trip-hero" variants={itemVariants}>
            <h1 className="trip-destination">{tripDetails.destination}</h1>
            <p className="trip-dates">{formatDateRange()}</p>
          </motion.div>

          {/* Hotel Section */}
          <motion.section className="hotel-section" variants={itemVariants}>
            <div className="section-label">
              <Hotel size={16} />
              <span>Your Accommodation</span>
            </div>
            <div className="hotel-card">
              <div className="hotel-content">
                <div className="hotel-icon-wrapper">
                  <Hotel />
                </div>
                <div className="hotel-details">
                  <h2 className="hotel-name">{itinerary.hotel.name}</h2>
                  <div className="hotel-location">
                    <MapPin size={16} />
                    <span>{itinerary.hotel.location}</span>
                  </div>
                  <p className="hotel-description">{itinerary.hotel.description}</p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Timeline Section */}
          <section className="timeline-section">
            <div className="timeline-line"></div>
            
            {itinerary.days.map((day, index) => (
              <motion.div 
                key={index} 
                className="day-card"
                variants={itemVariants}
              >
                <div className="day-marker">{day.dayNumber}</div>
                <div className="day-content">
                  <div className="day-header">
                    <h3 className="day-title">Day {day.dayNumber}</h3>
                    <p className="day-date">{getDayDate(index)}</p>
                  </div>
                  
                  <div className="day-schedule">
                    {/* Breakfast */}
                    <div className="schedule-item">
                      <div className="schedule-icon breakfast">
                        <Coffee />
                      </div>
                      <div className="schedule-details">
                        <span className="schedule-type">Breakfast</span>
                        <h4 className="schedule-name">{day.breakfast.name}</h4>
                        <p className="schedule-description">{day.breakfast.description}</p>
                      </div>
                    </div>

                    {/* Activity */}
                    <div className="schedule-item">
                      <div className="schedule-icon activity">
                        <Compass />
                      </div>
                      <div className="schedule-details">
                        <span className="schedule-type">Activity</span>
                        <h4 className="schedule-name">{day.activity.name}</h4>
                        <p className="schedule-description">{day.activity.description}</p>
                      </div>
                    </div>

                    {/* Lunch */}
                    <div className="schedule-item">
                      <div className="schedule-icon lunch">
                        <Utensils />
                      </div>
                      <div className="schedule-details">
                        <span className="schedule-type">Lunch</span>
                        <h4 className="schedule-name">{day.lunch.name}</h4>
                        <p className="schedule-description">{day.lunch.description}</p>
                      </div>
                    </div>

                    {/* Dinner */}
                    <div className="schedule-item">
                      <div className="schedule-icon dinner">
                        <Wine />
                      </div>
                      <div className="schedule-details">
                        <span className="schedule-type">Dinner</span>
                        <h4 className="schedule-name">{day.dinner.name}</h4>
                        <p className="schedule-description">{day.dinner.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </section>

          {/* Footer spacing */}
          <div style={{ height: '4rem' }}></div>
        </motion.div>
      </div>
    </div>
  );
};

export default Itinerary;
