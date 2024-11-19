'use client'
import React, { useState } from 'react';
import InputForm from '../../components/create/InputForm';
import OutlineEditor from '../../components/create/OutlineEditor';
import LoadingState from '../../components/create/LoadingState';
import PresentationPreview from '../../components/presentation/PresentationPreview';
import Header from '../../components/create/Header';
import { generateOutlineAPI, downloadPresentation } from '../../services/presentationService';
import { transformOutlineToPresentation } from '../../utils/presentationTransformer';

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

  const handleTemplateChange = (newTemplate) => {
    setTemplate(newTemplate);
  };

  const handleStyleChange = (newStyle) => {
    setStyle(newStyle);
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

  const handleGeneratePresentation = async () => {
    setIsGenerating(true);
    setStep('generating');
    try {
      if (!outline) throw new Error('Outline is missing');
      const data = transformOutlineToPresentation(outline);
      setPresentationData(data);
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
      const url = await downloadPresentation(presentationData, template);
      const link = document.createElement('a');
      link.href = url;
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
      <Header step={step} />
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
              onStyleChange={handleStyleChange}
              onTemplateChange={handleTemplateChange}
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
              template={template}
            />
          )}
        </div>
      </main>
    </>
  );
};

export default CreatePresentation;