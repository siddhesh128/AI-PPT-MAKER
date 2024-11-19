
export const transformOutlineToPresentation = (outline) => {
  if (!outline || !outline.sections) {
    throw new Error('Invalid outline format');
  }

  const slides = [
    {
      type: 'title',
      title: outline.title,
      subtitle: outline.description
    },
    ...outline.sections.map(section => ({
      type: 'content',
      title: section.title,
      points: section.points.map(point => {
        if (typeof point === 'object' && point.main) {
          return { main: point.main, description: point.description };
        }
        return point;
      })
    }))
  ];

  return { slides };
};