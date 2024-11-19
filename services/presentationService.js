
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

export const downloadPresentation = async (presentationData, template) => {
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

  return data.url;
};