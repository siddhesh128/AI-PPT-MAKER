export const transformOutlineToPresentation = (outline) => {
  console.log('Transforming outline with code blocks:', outline); // Debug log
  
  return {
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
          description: point.description,
          code: point.code || null,
          language: point.language || 'javascript'
        }))
      }))
    ]
  };
};