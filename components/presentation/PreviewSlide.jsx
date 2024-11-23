import React from 'react';
import { themes } from '../../themes/presentationThemes';

export const PreviewSlide = ({ content, theme, isActive }) => {
  const { title, subtitle, points, type, image } = content;
  const currentTheme = themes[theme] || themes.modern;

  return (
    <div className="w-full h-full bg-white rounded-lg shadow-lg relative overflow-hidden">
      {type === 'title' ? (
        <>
          <div 
            className="absolute top-0 left-0 w-full h-[20%]"
            style={{ backgroundColor: `#${currentTheme.primary}` }}
          />
          <div 
            className="absolute top-[18%] left-[5%] w-[90%] h-[0.3%]"
            style={{ backgroundColor: `#${currentTheme.accent}` }}
          />
          <div 
            className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full opacity-20"
            style={{ backgroundColor: `#${currentTheme.secondary}` }}
          />
          <div className="h-full flex flex-col items-center justify-center p-8">
            <h1 
              className="text-4xl font-bold mb-4 text-center"
              style={{ color: `#${currentTheme.primary}` }}
            >
              {title}
            </h1>
            {subtitle && (
              <p className="text-2xl text-[#404040] text-center">{subtitle}</p>
            )}
          </div>
        </>
      ) : (
        <div className="h-full flex flex-col">
          {/* Header area */}
          <div 
            className="w-full h-[15%] relative"
            style={{ backgroundColor: `#${currentTheme.primary}` }}
          >
            <h2 className="text-2xl font-bold text-white px-8 py-4">
              {title}
            </h2>
            <div 
              className="absolute bottom-0 left-[5%] w-[90%] h-[2px]"
              style={{ backgroundColor: `#${currentTheme.accent}` }}
            />
          </div>

          {/* Content area */}
          <div className="flex h-[85%] p-8">
            {/* Left side - Points */}
            <div className="w-[50%] space-y-4 pr-4">
              {points?.map((point, index) => (
                <div key={index} className="mb-6">
                  {typeof point === 'object' ? (
                    <>
                      <p 
                        className="text-lg font-bold flex items-start"
                        style={{ color: `#${currentTheme.primary}` }}
                      >
                        <span className="mr-2">•</span>
                        <span className="line-clamp-1">{point.main}</span>
                      </p>
                      {point.description && (
                        <p className="text-sm text-gray-600 ml-6 mt-2 italic">
                          {point.description}
                        </p>
                      )}
                    </>
                  ) : (
                    <p 
                      className="text-lg flex items-start"
                      style={{ color: `#${currentTheme.primary}` }}
                    >
                      <span className="mr-2">•</span>
                      <span className="line-clamp-1">{point}</span>
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Right side - Image */}
            {image && (
              <div className="w-[45%] flex items-center justify-center">
                <img 
                  src={image.url} 
                  alt={title}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};