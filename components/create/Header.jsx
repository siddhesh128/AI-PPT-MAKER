import React from 'react';

const Header = ({ step }) => {
  const steps = ['input', 'outline', 'generating'];
  
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Create Presentation</h1>
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-4">
              {steps.map((stepName, index) => (
                <React.Fragment key={stepName}>
                  {index > 0 && <div className="w-8 h-px bg-gray-300" />}
                  <div className={`flex items-center space-x-2 ${step === stepName ? 'text-blue-600' : 'text-gray-400'}`}>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      step === stepName ? 'border-blue-600' : 'border-gray-400'
                    }`}>
                      <span>{index + 1}</span>
                    </div>
                    <span>{stepName.charAt(0).toUpperCase() + stepName.slice(1)}</span>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;