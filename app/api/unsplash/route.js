import { createApi } from 'unsplash-js';
import { NextResponse } from 'next/server';
import nodeFetch from 'node-fetch';

const unsplash = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
  fetch: nodeFetch,
});

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');
  
  try {
    const result = await unsplash.search.getPhotos({
      query,
      perPage: 9,
      orientation: 'landscape',
    });
    
    const photos = result.response.results.map(photo => ({
      id: photo.id,
      url: photo.urls.regular,
      thumbnail: photo.urls.thumb,
      credit: {
        name: photo.user.name,
        link: photo.user.links.html,
      },
    }));

    return NextResponse.json({ photos });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}