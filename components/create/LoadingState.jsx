import React from 'react';

const LoadingState = ({ progress }) => {
  return (
    <div className="text-center p-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <h3 className="text-xl font-semibold mb-2">Generating Your Presentation</h3>
      {progress && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${(progress.current / progress.total) * 100}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Generating images: {progress.current} of {progress.total} slides
          </p>
        </div>
      )}
    </div>
  );
};

export default LoadingState;