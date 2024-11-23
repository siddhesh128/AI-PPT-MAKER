import React from 'react';
import { themes } from '../../themes/presentationThemes';

export const PreviewSlide = ({ content, theme, isActive }) => {
  const { title, subtitle, points, type, image } = content;
  const currentTheme = themes[theme] || themes.modern;

  return (
    <div className="w-full h-full bg-white rounded-lg shadow-lg relative overflow-hidden">
      {/* Background shapes */}
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
        <>
          <div 
            className="absolute top-0 left-0 w-full h-[15%]"
            style={{ backgroundColor: `#${currentTheme.primary}` }}
          />
          <div 
            className="absolute top-[14%] left-[5%] w-[90%] h-[0.2%]"
            style={{ backgroundColor: `#${currentTheme.accent}` }}
          />
          <div className="h-full flex flex-col p-8">
            <h2 className="text-3xl font-bold mb-6 text-white relative z-10">
              {title}
            </h2>
            
            {image && (
              <div className="w-[30%] mx-auto h-[30%] mb-6 ml-[30%]">
                <img 
                  src={image.url} 
                  alt={image.alt || 'Slide image'} 
                  className="w-full h-full object-contain"
                />
              </div>
            )}
            
            <div className="space-y-4 mt-4">
              {points?.map((point, index) => (
                <div key={index} className="ml-6">
                  {typeof point === 'object' ? (
                    <div className="mb-2">
                      <p className="text-xl flex items-start font-bold"
                         style={{ color: `#${currentTheme.primary}` }}>
                        <span className="mr-2">•</span>
                        {point.main}
                      </p>
                      {point.description && (
                        <p className="text-[#666666] ml-6 mt-1 text-base italic">
                          {point.description}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-xl flex items-start"
                       style={{ color: `#${currentTheme.primary}` }}>
                      <span className="mr-2">•</span>
                      {point}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};