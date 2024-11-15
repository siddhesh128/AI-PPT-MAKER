import React from 'react';
import { ChevronLeft, ChevronRight, Download, Maximize2 } from 'lucide-react';

const PreviewSlide = ({ content, isActive }) => {
  return (
    <div className={`aspect-video bg-white rounded-lg shadow-sm p-6 ${isActive ? 'border-2 border-blue-500' : 'border border-gray-200'}`}>
      {content.type === 'title' ? (
        <div className="h-full flex flex-col items-center justify-center text-center">
          <h1 className="text-3xl font-bold mb-4">{content.title}</h1>
          {content.subtitle && <p className="text-xl text-gray-600">{content.subtitle}</p>}
        </div>
      ) : (
        <div className="h-full flex flex-col">
          <h2 className="text-2xl font-semibold mb-4">{content.title}</h2>
          <ul className="list-disc ml-6 space-y-2">
            {content.points?.map((point, index) => (
              <li key={index} className="text-lg">{point}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const PresentationPreview = ({ presentationData, onClose, onDownload }) => {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  const nextSlide = () => {
    if (currentSlide < presentationData.slides.length - 1) {
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
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-100 rounded-lg w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Preview Presentation</h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={onDownload}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-lg hover:bg-gray-200"
            >
              <Maximize2 className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
        </div>

        {/* Main Preview Area */}
        <div className="flex-1 p-8 overflow-hidden">
          <div className="max-w-4xl mx-auto h-full flex flex-col">
            {/* Current Slide */}
            <div className="flex-1 mb-4">
              <PreviewSlide
                content={presentationData.slides[currentSlide]}
                isActive={true}
              />
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={previousSlide}
                disabled={currentSlide === 0}
                className={`p-2 rounded-full ${
                  currentSlide === 0 ? 'text-gray-400' : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <span className="text-sm text-gray-600">
                Slide {currentSlide + 1} of {presentationData.slides.length}
              </span>
              <button
                onClick={nextSlide}
                disabled={currentSlide === presentationData.slides.length - 1}
                className={`p-2 rounded-full ${
                  currentSlide === presentationData.slides.length - 1
                    ? 'text-gray-400'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Thumbnail Navigation */}
            <div className="mt-4 grid grid-cols-6 gap-2 overflow-x-auto p-2">
              {presentationData.slides.map((slide, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`aspect-video ${
                    currentSlide === index ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <PreviewSlide content={slide} isActive={currentSlide === index} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PresentationPreview;