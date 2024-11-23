export const generateOutlineAPI = async (topic, slides, style) => {
  try {
    const response = await fetch('/api/presentation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
    const downloadData = {
      slides: presentationData.slides,
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