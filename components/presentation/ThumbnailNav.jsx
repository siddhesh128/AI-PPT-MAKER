import React from 'react';
import { PreviewSlide } from './PreviewSlide';

export const ThumbnailNav = ({ slides, currentSlide, currentTheme, onSlideSelect }) => {
  return (
    <div className="border-t border-gray-200 p-4 overflow-x-auto">
      <div className="flex gap-4">
        {slides.map((slide, index) => (
          <button
            key={index}
            onClick={() => onSlideSelect(index)}
            className={`flex-shrink-0 w-32 h-20 rounded-lg overflow-hidden transition-all ${
              currentSlide === index ? 'ring-2 ring-blue-500' : ''
            }`}
          >
            <div className="w-full h-full transform scale-[0.2] origin-top-left">
              <div className="w-[500%] h-[500%]">
                <PreviewSlide
                  content={slide}
                  theme={currentTheme}
                  isActive={false}
                />
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};