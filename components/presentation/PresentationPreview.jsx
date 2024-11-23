import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PreviewSlide } from './PreviewSlide';
import { PreviewHeader } from './PreviewHeader';
import { ThumbnailNav } from './ThumbnailNav';

const PresentationPreview = ({ presentationData, onClose, onDownload, template }) => {
  const [currentTheme, setCurrentTheme] = useState('modern');
  const [isDownloading, setIsDownloading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollContainerRef = useRef(null);

  const slides = presentationData?.slides || [];

  const scrollToSlide = (index) => {
    const container = scrollContainerRef.current;
    if (container) {
      const slideElement = container.children[index];
      slideElement?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start'
      });
    }
    setCurrentSlide(index);
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      if (!presentationData?.slides?.length) {
        throw new Error('No presentation data available');
      }
  
      const downloadData = {
        slides: presentationData.slides,
        template: template, // Use the template prop here
        theme: currentTheme, // Add theme to download data
        images: presentationData.images // Add images to download data
      };

      const response = await fetch('/api/generate-presentation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(downloadData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate presentation');
      }
      
      const data = await response.json();
      
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = data.url;
      link.download = 'presentation.pptx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading presentation:', error);
      alert(error.message || 'Failed to download presentation. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowRight') scrollToSlide(currentSlide + 1);
      if (e.key === 'ArrowLeft') scrollToSlide(currentSlide - 1);
      if (e.key === 'Escape') setIsFullscreen(false);
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentSlide]);

  if (!slides.length) {
    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md">
          <h2 className="text-xl font-semibold mb-4">Error</h2>
          <p className="text-gray-600 mb-4">No presentation data available.</p>
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-7xl h-[90vh] flex flex-col overflow-hidden">
        <PreviewHeader 
          currentTheme={currentTheme}
          setCurrentTheme={setCurrentTheme}
          onDownload={handleDownload}
          onClose={onClose}
        />

        <div className="flex-1 relative overflow-hidden">
          {/* Navigation buttons */}
          <button onClick={() => scrollToSlide(currentSlide - 1)} disabled={currentSlide === 0} className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white shadow-lg disabled:opacity-50">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button onClick={() => scrollToSlide(currentSlide + 1)} disabled={currentSlide === slides.length - 1} className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white shadow-lg disabled:opacity-50">
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Slides container */}
          <div ref={scrollContainerRef} className="flex overflow-x-auto snap-x snap-mandatory h-full hide-scrollbar">
            {slides.map((slide, index) => (
              <div key={index} className="flex-shrink-0 w-full h-full snap-center flex items-center justify-center p-4 md:p-8">
                <div className="w-full max-w-3xl aspect-[16/9] relative mx-auto">
                  <PreviewSlide 
                    content={{ ...slide, index }}
                    isActive={currentSlide === index}
                    theme={currentTheme}
                    images={presentationData?.images}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <ThumbnailNav 
          slides={slides}
          currentSlide={currentSlide}
          currentTheme={currentTheme}
          onSlideSelect={scrollToSlide}
        />
      </div>
    </div>
  );
};

export default PresentationPreview;