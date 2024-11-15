export const generateOutlineAPI = async (topic, slides, style) => {
    const response = await fetch('/api/presentation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        topic: topic.trim(),
        slides: parseInt(slides),
        style: style.toLowerCase(),
      }),
    });
  
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to generate outline');
    }
    return data;
  };
  
  export const transformOutlineToPresentation = (outline) => ({
    slides: [
      {
        type: 'title',
        title: outline.title,
      },
      ...outline.sections.map(section => ({
        type: 'content',
        title: section.title,
        points: section.points.map(point => ({
          main: point.main,
          description: point.description
        }))
      }))
    ]
  });