'use client'
import React, { useState } from 'react';
import InputForm from '../../components/create/InputForm';
import OutlineEditor from '../..//components/create/OutlineEditor';
import LoadingState from '../../components/create/LoadingState';
import PresentationPreview from '../../components/presentation/PresentationPreview';
// Remove Navigation import

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

  const generateOutlineAPI = async (topic, slides, style) => {
    try {
      const response = await fetch('/api/presentation', {  // Changed from /api/generate-outline
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic, slides, style }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to generate outline');
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };

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

  const transformOutlineToPresentation = (outline) => {
    if (!outline || !outline.sections) {
      throw new Error('Invalid outline format');
    }
  
    const slides = [];
  
    // Add title slide
    slides.push({
      type: 'title',
      title: outline.title,
      subtitle: outline.description
    });
  
    // Transform sections into content slides
    outline.sections.forEach(section => {
      slides.push({
        type: 'content',
        title: section.title,
        points: section.points.map(point => {
          if (typeof point === 'object' && point.main) {
            return {
              main: point.main,
              description: point.description
            };
          }
          return point;
        })
      });
    });
  
    return { slides };
  };

  const handleGeneratePresentation = async () => {
    setIsGenerating(true);
    setStep('generating');
    try {
      if (!outline) {
        throw new Error('Outline is missing');
      }
      const presentationData = transformOutlineToPresentation(outline);
      if (!presentationData.slides || presentationData.slides.length === 0) {
        throw new Error('Failed to transform outline to presentation');
      }
      setPresentationData(presentationData);
      setShowPreview(true);
    } catch (error) {
      console.error('Error generating presentation:', error);
      alert(error.message || 'Failed to generate presentation. Please try again.');
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
    <>
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
              template={template}  // Ensure this prop is being passed
            />
          )}
        </div>
      </main>
    </>
  );
};

export default CreatePresentation;