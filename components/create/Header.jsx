import React from 'react';

const Header = ({ step }) => {
  const steps = [
    { id: 'input', label: 'Input Details' },
    { id: 'outline', label: 'Edit Outline' },
    { id: 'generating', label: 'Generating' },
    { id: 'preview', label: 'Preview' }
  ];
  
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-2 py-2">
        <div className="flex items-center justify-between">
          <h1 className="text-sm font-bold text-gray-900">Create Presentation</h1>
          <div className="flex items-center space-x-2">
            <div className="hidden md:flex items-center space-x-2">
              {steps.map((stepObj, index) => (
                <React.Fragment key={stepObj.id}>
                  {index > 0 && <div className="w-4 h-px bg-gray-300" />}
                  <div className={`flex items-center space-x-1 ${step === stepObj.id ? 'text-blue-600' : 'text-gray-400'}`}>
                    <div className={`w-4 h-4 text-xs rounded-full border flex items-center justify-center ${
                      step === stepObj.id ? 'border-blue-600' : 'border-gray-400'
                    }`}>
                      {index + 1}
                    </div>
                    <span className="text-xs">{stepObj.label}</span>
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