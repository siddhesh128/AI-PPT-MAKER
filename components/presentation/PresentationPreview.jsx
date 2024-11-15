import React from 'react';
import { ChevronLeft, ChevronRight, Download, Maximize2 } from 'lucide-react';
import { X as XIcon } from 'lucide-react';

const PreviewSlide = ({ content, isActive, template }) => {
  if (!content) return null;

  const baseStyles = {
    wrapper: "h-full relative",
    header: "absolute top-0 left-0 w-full h-[15%] bg-[#2E5090]",
    accentLine: "absolute top-[14%] left-[5%] w-[90%] h-[0.2%] bg-[#FFD700]",
    title: "text-2xl font-semibold px-6 py-3 text-white relative z-10",
    content: "px-6 mt-[18%]",
    bulletPoints: "space-y-6 text-[#333333]",  // Increased spacing for descriptions
    bulletPoint: "flex flex-col gap-1",  // Changed to column layout
    bullet: "mr-2 text-[#2E5090]",
    description: "text-sm text-gray-600 ml-5",  // Style for description
  };

  return (
    <div className={`aspect-[16/9] bg-white rounded-lg shadow-sm overflow-hidden
      ${isActive ? 'border-2 border-blue-500' : 'border border-gray-200'}`}>
      {content.type === 'title' ? (
        <div className="h-full flex flex-col items-center justify-center text-center bg-[#F5F5F5]">
          <div className="absolute top-0 left-0 w-full h-[20%] bg-[#2E5090]" />
          <div className="absolute top-[18%] left-[5%] w-[90%] h-[0.3%] bg-[#FFD700]" />
          <h1 className="text-3xl font-bold mb-4 text-[#2E5090] relative z-10">{content.title}</h1>
          {content.subtitle && (
            <p className="text-xl text-[#404040] relative z-10">{content.subtitle}</p>
          )}
        </div>
      ) : (
        <div className={baseStyles.wrapper}>
          <div className={baseStyles.header} />
          <div className={baseStyles.accentLine} />
          <h2 className={baseStyles.title}>{content.title}</h2>
          <div className={baseStyles.content}>
            <ul className={baseStyles.bulletPoints}>
              {content.points?.map((point, index) => (
                <li key={index} className={baseStyles.bulletPoint}>
                  <div className="flex items-start">
                    <span className={baseStyles.bullet}>•</span>
                    <span className="font-medium">
                      {typeof point === 'object' ? point.main : point}
                    </span>
                  </div>
                  {typeof point === 'object' && point.description && (
                    <p className={baseStyles.description}>{point.description}</p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

const PresentationPreview = ({ presentationData, onClose, onDownload }) => {
  // Add loading state for download
  const [isDownloading, setIsDownloading] = React.useState(false);

  // Ensure presentationData and slides exist with default values
  const slides = presentationData?.slides || [];
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  const scrollContainerRef = React.useRef(null);

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

  // If no slides, show an error state
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

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const previousSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch('/api/generate-presentation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slides: presentationData.slides,
          templateName: template
        }),
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
      alert('Failed to download presentation. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  React.useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') previousSlide();
      if (e.key === 'Escape') setIsFullscreen(false);
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentSlide]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-7xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold">Preview Presentation</h2>
          <div className="flex items-center gap-4">
            <button
              onClick={onDownload}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
            <button onClick={onClose}>
              <XIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Main Preview Area with Horizontal Scroll */}
        <div className="flex-1 relative">
          {/* Navigation Buttons */}
          <button
            onClick={() => scrollToSlide(currentSlide - 1)}
            disabled={currentSlide === 0}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white shadow-lg disabled:opacity-50"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={() => scrollToSlide(currentSlide + 1)}
            disabled={currentSlide === slides.length - 1}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white shadow-lg disabled:opacity-50"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Slides Container */}
          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto snap-x snap-mandatory h-full hide-scrollbar"
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {slides.map((slide, index) => (
              <div 
                key={index}
                className="flex-shrink-0 w-full h-full snap-center flex items-center justify-center p-8"
              >
                <div className="w-full max-w-4xl aspect-[16/9] relative">
                  <PreviewSlide 
                    content={slide} 
                    isActive={currentSlide === index} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Updated Thumbnail Navigation */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex gap-3 overflow-x-auto py-2 px-4 hide-scrollbar">
            {slides.map((slide, index) => (
              <button
                key={index}
                onClick={() => scrollToSlide(index)}
                className={`flex-shrink-0 w-32 h-20 relative border-2 rounded-lg overflow-hidden 
                  transition-all duration-200 hover:ring-2 hover:ring-blue-200
                  ${currentSlide === index ? 'border-blue-500 shadow-md' : 'border-gray-200'}`}
              >
                <div className="absolute inset-0 bg-white">
                  {slide.type === 'title' ? (
                    <div className="h-full flex flex-col items-center justify-center p-1 text-center">
                      <div className="w-full h-[20%] bg-[#2E5090] absolute top-0" />
                      <div className="w-[90%] h-[0.3%] bg-[#FFD700] absolute top-[18%]" />
                      <p className="text-[8px] font-bold text-[#2E5090] mt-4 relative z-10 line-clamp-2 px-1">
                        {slide.title}
                      </p>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col p-1">
                      <div className="w-full h-[15%] bg-[#2E5090] absolute top-0" />
                      <div className="w-[90%] h-[0.3%] bg-[#FFD700] absolute top-[14%] left-[5%]" />
                      <p className="text-[8px] font-bold text-white relative z-10 line-clamp-1 mb-2">
                        {slide.title}
                      </p>
                      <div className="mt-2 space-y-[3px]">
                        {slide.points?.slice(0, 2).map((point, i) => (
                          <div key={i} className="flex items-start gap-1">
                            <span className="text-[6px] text-[#2E5090]">•</span>
                            <p className="text-[6px] text-gray-600 line-clamp-1 flex-1">
                              {typeof point === 'object' ? point.main : point}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="absolute bottom-1 right-1 bg-gray-100 rounded-full px-1.5 py-0.5">
                  <span className="text-[8px] font-medium text-gray-600">
                    {index + 1}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Add this CSS to your global styles or in a style tag
const styles = `
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

export default PresentationPreview;