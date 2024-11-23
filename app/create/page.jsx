'use client'
import React, { useState } from 'react';
import InputForm from '../../components/create/InputForm';
import OutlineEditor from '../../components/create/OutlineEditor';
import LoadingState from '../../components/create/LoadingState';
import PresentationPreview from '../../components/presentation/PresentationPreview';
import Header from '../../components/create/Header';
import { generateOutlineAPI, downloadPresentation } from '../../services/presentationService';
import { transformOutlineToPresentation } from '../../utils/presentationTransformer';
import { generateImageForSlide } from '../../utils/imageGenerator';

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
  const [generationProgress, setGenerationProgress] = useState({ current: 0, total: 0 });

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

  const generateImagesForSlides = async (slides) => {
    console.log('Starting image generation for slides');
    const total = slides.length;
    setGenerationProgress({ current: 0, total });
    
    const slidesWithImages = await Promise.all(slides.map(async (slide, index) => {
      try {
        // Generate image based on slide title and first point
        const searchQuery = slide.type === 'title' ? 
          slide.title : 
          `${slide.title} ${slide.points?.[0]?.main || slide.points?.[0] || ''}`;
        
        console.log(`Generating image for slide ${index + 1}/${total}: "${searchQuery}"`);
        
        const imageData = await generateImageForSlide(searchQuery);
        setGenerationProgress(prev => ({ ...prev, current: index + 1 }));
        
        return { ...slide, image: imageData };
      } catch (error) {
        console.error(`Failed to generate image for slide ${index + 1}:`, error);
        return slide;
      }
    }));

    console.log('Completed image generation for all slides');
    return slidesWithImages;
  };

  const handleGeneratePresentation = async () => {
    setIsGenerating(true);
    setStep('generating');
    try {
      if (!outline) throw new Error('Outline is missing');
      
      // Transform outline to initial presentation structure
      const initialData = transformOutlineToPresentation(outline);
      console.log('Initial presentation structure created');

      // Generate images for slides
      const slidesWithImages = await generateImagesForSlides(initialData.slides);
      const finalData = { ...initialData, slides: slidesWithImages };
      
      setPresentationData(finalData);
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