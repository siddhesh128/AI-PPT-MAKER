export const generateOutlineAPI = async (topic, slides, style) => {
  try {
    if (!topic || !slides || !style) {
      throw new Error('Missing required parameters');
    }

    const response = await fetch('/api/presentation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, slides, style }),
    });

    const data = await response.json();

    if (!response.ok || data.status === 'error') {
      throw new Error(data.error || data.details || 'Failed to generate outline');
    }

    return data.data || data;

  } catch (error) {
    console.error('API Error:', error);
    throw new Error(`Failed to generate presentation: ${error.message}`);
  }
};

export const fetchImageForKeyword = async (keyword) => {
  if (!keyword) return null;
  
  try {
    console.log('Fetching image for keyword:', keyword);
    const response = await fetch(`/api/unsplash?query=${encodeURIComponent(keyword)}`);
    if (!response.ok) throw new Error('Failed to fetch image');
    const data = await response.json();
    
    if (!data.photos || data.photos.length === 0) {
      console.log('No images found for:', keyword);
      return null;
    }
    
    // Download and convert image to base64
    const imageUrl = data.photos[0].url;
    console.log('Converting image to base64:', imageUrl);
    const imageResponse = await fetch(imageUrl);
    const blob = await imageResponse.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log('Base64 conversion complete for:', keyword);
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error fetching image:', error);
    return null;
  }
};

export const downloadPresentation = async (presentationData, template) => {
  try {
    // Debug log for code blocks
    console.log('Code blocks check:', presentationData.slides.map(slide => ({
      title: slide.title,
      codeBlocks: slide.points?.filter(p => p.code).length || 0
    })));

    // Ensure code blocks are properly structured
    const processedSlides = presentationData.slides.map(slide => {
      if (slide.points) {
        return {
          ...slide,
          points: slide.points.map(point => ({
            ...point,
            code: point.code || null,
            language: point.language || 'javascript'
          }))
        };
      }
      return slide;
    });

    const downloadData = {
      slides: processedSlides,
      images: presentationData.images, // Make sure images are included
      templateName: template || undefined,
      theme: presentationData.theme || 'modern'
    };

    // Debug logging for image data
    console.log('Image data check before sending:');
    Object.entries(downloadData.images || {}).forEach(([key, value]) => {
      console.log(`Image ${key}: ${value?.substring(0, 50)}...`);
    });

    console.log('Sending presentation data:', {
      slideCount: downloadData.slides.length,
      slideContent: downloadData.slides.map(s => ({
        type: s.type,
        pointsCount: s.points?.length,
        hasCode: s.points?.some(p => p.code)
      })),
      imageCount: Object.keys(downloadData.images || {}).length,
      imageKeys: Object.keys(downloadData.images || {}),
      template: downloadData.templateName,
      theme: downloadData.theme
    });

    const response = await fetch('/api/generate-presentation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(downloadData),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to generate presentation');
    }

    return data.url;
  } catch (error) {
    console.error('Error in downloadPresentation:', error);
    throw error;
  }
};