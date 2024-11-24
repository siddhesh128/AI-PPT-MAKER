import React from 'react';
import { themes } from '../../themes/presentationThemes';

const CodeBlock = ({ code, language }) => (
  <div className="mt-4 w-full rounded-lg overflow-hidden border border-gray-700">
    {/* Editor-like header */}
    <div className="bg-[#1E1E1E] px-4 py-2 flex items-center justify-between">
      <span className="text-gray-400 text-sm">{language || 'javascript'}</span>
    </div>
    {/* Code content */}
    <div className="bg-[#1E1E1E] p-4">
      <pre className="overflow-x-auto">
        <code className="text-white text-sm font-mono whitespace-pre-wrap break-all">
          {code}
        </code>
      </pre>
    </div>
  </div>
);

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
          <div className="flex h-[85%] p-4">
            {/* Left side - Points */}
            <div className="w-[55%] space-y-2 pr-4 overflow-y-auto">
              {points?.map((point, index) => (
                <div key={index} className="mb-4">
                  {typeof point === 'object' ? (
                    <>
                      <p 
                        className="text-base font-bold flex items-start"
                        style={{ color: `#${currentTheme.primary}` }}
                      >
                        <span className="mr-2">•</span>
                        <span className="line-clamp-2">{point.main}</span>
                      </p>
                      {point.description && (
                        <p className="text-xs text-gray-600 ml-6 mt-1 italic line-clamp-2">
                          {point.description}
                        </p>
                      )}
                      {point.code && (
                        <div className="ml-6 mt-1 w-[85%]">
                          <CodeBlock 
                            code={point.code}
                            language={point.language}
                          />
                        </div>
                      )}
                    </>
                  ) : (
                    <p 
                      className="text-base flex items-start"
                      style={{ color: `#${currentTheme.primary}` }}
                    >
                      <span className="mr-2">•</span>
                      <span className="line-clamp-2">{point}</span>
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Right side - Image */}
            {image && (
              <div className="w-[40%] flex items-center justify-center overflow-hidden">
                <img 
                  src={image.url} 
                  alt={title}
                  className="max-w-full max-h-[90%] object-contain"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};