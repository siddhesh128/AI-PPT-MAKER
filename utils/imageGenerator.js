
export const generateImageForSlide = async (searchQuery) => {
  console.log(`Fetching image for query: "${searchQuery}"`);
  
  try {
    const response = await fetch(`/api/unsplash?query=${encodeURIComponent(searchQuery)}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch image');
    }

    const data = await response.json();
    console.log(`Received ${data.photos?.length || 0} images for query "${searchQuery}"`);

    // Select the first image from results
    if (data.photos && data.photos.length > 0) {
      const selectedImage = data.photos[0];
      console.log(`Selected image: ${selectedImage.id}`);
      return {
        url: selectedImage.url,
        alt: searchQuery,
        credit: selectedImage.credit
      };
    }

    console.log(`No images found for query "${searchQuery}"`);
    return null;
  } catch (error) {
    console.error('Image generation error:', error);
    return null;
  }
};