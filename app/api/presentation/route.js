import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

const generationConfig = {
  temperature: 0.7, // Lower temperature for more focused outputs
  topP: 0.8,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

export async function POST(request) {
  try {
    const { topic, slides, style } = await request.json();
    
    const model = genAI.getGenerativeModel({
      model: "gemini-pro",
      generationConfig,
    });

    const structuredPrompt = {
      topic,
      slides: parseInt(slides),
      style,
      format: `You must respond with only a JSON object in this exact format:
      {
        "title": "<A clear, concise title>",
        "sections": [
          {
            "title": "<Section title>",
            "points": [
              {
                "main": "<Key point 1>",
                "description": "<2-3 sentences explaining the key point>"
              },
              {
                "main": "<Key point 2>",
                "description": "<2-3 sentences explaining the key point>"
              }
            ]
          }
        ]
      }
      Each point should have a main bullet point and a detailed description. Keep descriptions concise but informative.
      Do not include any additional text or explanations.`
    };

    const prompt = `Generate a presentation outline with these requirements:
    Topic: ${structuredPrompt.topic}
    Number of slides: ${structuredPrompt.slides}
    Style: ${structuredPrompt.style}
    ${structuredPrompt.format}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean up the response text to ensure valid JSON
    const cleanedText = text.replace(/^\s*```json\s*|\s*```\s*$/g, '') // Remove code blocks
                           .replace(/[\u201C\u201D]/g, '"') // Replace smart quotes
                           .replace(/[\n\r]+/g, ' ') // Remove newlines
                           .trim();

    // Parse the cleaned JSON
    let parsedOutline;
    try {
      parsedOutline = JSON.parse(cleanedText);
    } catch (error) {
      console.error('JSON parsing error:', error);
      return NextResponse.json(
        { error: 'Failed to generate valid presentation outline' },
        { status: 422 }
      );
    }

    // Validate the structure
    if (!parsedOutline.title || !Array.isArray(parsedOutline.sections)) {
      return NextResponse.json(
        { error: 'Invalid presentation outline structure' },
        { status: 422 }
      );
    }

    return NextResponse.json(parsedOutline);

  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate presentation outline' },
      { status: 500 }
    );
  }
}