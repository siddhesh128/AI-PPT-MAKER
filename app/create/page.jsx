'use client'
import React, { useState } from 'react';
import InputForm from '../../components/create/InputForm';
import OutlineEditor from '../..//components/create/OutlineEditor';
import LoadingState from '../../components/create/LoadingState';
import Navigation from '../../components/create/Navigation';
import PresentationPreview from '../../components/presentation/PresentationPreview';
import { generateOutlineAPI, transformOutlineToPresentation } from '../../utils/presenationHelpers';

const CreatePresentation = () => {
  const [step, setStep] = useState('input');
  const [topic, setTopic] = useState('');
  const [slides, setSlides] = useState('10');
  const [style, setStyle] = useState('professional');
  const [isGenerating, setIsGenerating] = useState(false);
  const [outline, setOutline] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [presentationData, setPresentationData] = useState(null);
  const [template, setTemplate] = useState('');

  const handleGenerateOutline = async () => {
    setIsGenerating(true);
    try {
      const data = await generateOutlineAPI(topic, slides, style);
      setOutline(data);
      setStep('outline');
    } catch (error) {
      console.error('Generation error:', error);
      alert(error.message || 'Failed to generate outline. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGeneratePresentation = async () => {
    setIsGenerating(true);
    setStep('generating');
    try {
      const presentationData = transformOutlineToPresentation(outline);
      setPresentationData(presentationData);
      setShowPreview(true);
    } catch (error) {
      console.error('Error generating presentation:', error);
      alert('Failed to generate presentation. Please try again.');
    } finally {
      setIsGenerating(false);
      setStep('outline');
    }
  };

  const handleDownload = async () => {
    try {
      if (!presentationData?.slides?.length) {
        throw new Error('No presentation data available');
      }
  
      const downloadData = {
        slides: presentationData.slides,
        templateName: template || undefined
      };
  
      const response = await fetch('/api/generate-presentation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(downloadData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate presentation');
      }
  
      if (!data.url) {
        throw new Error('No download URL received');
      }
  
      // Create and trigger download
      const link = document.createElement('a');
      link.href = data.url;
      link.download = 'presentation.pptx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading presentation:', error);
      alert(error.message || 'Failed to download presentation. Please try again.');
    }
  };

  return (
    <div className="flex">
      <Navigation />
      
      <div className="flex-1 ml-64 min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Create Presentation</h1>
              <div className="flex items-center space-x-4">
                {/* Progress Steps */}
                <div className="hidden md:flex items-center space-x-4">
                  {['input', 'outline', 'generating'].map((stepName, index) => (
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

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            {step === 'input' && (
              <InputForm
                topic={topic}
                slides={slides}
                style={style}
                template={template}
                isGenerating={isGenerating}
                onTopicChange={setTopic}
                onSlidesChange={setSlides}
                onStyleChange={setStyle}
                onTemplateChange={setTemplate}
                onGenerate={handleGenerateOutline}
              />
            )}
            {step === 'outline' && (
              <OutlineEditor
                outline={outline}
                onOutlineChange={setOutline}
                onBack={() => setStep('input')}
                onGenerate={handleGeneratePresentation}
              />
            )}
            {step === 'generating' && <LoadingState />}
            {showPreview && (
              <PresentationPreview
                presentationData={presentationData}
                onClose={() => setShowPreview(false)}
                onDownload={handleDownload}
                template={template}  // Add this line to pass the template
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreatePresentation;