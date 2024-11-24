import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

const generationConfig = {
  temperature: 0.7,
  topP: 0.8,
  topK: 40,
  maxOutputTokens: 8192,
};

function extractJSONFromText(text) {
  try {
    // First attempt: Try to parse the entire text as JSON
    return JSON.parse(text);
  } catch {
    // Second attempt: Try to find JSON content between curly braces
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const jsonStr = jsonMatch[0];
      try {
        return JSON.parse(jsonStr);
      } catch {
        // If parsing fails, try cleaning the JSON string
        return JSON.parse(cleanJSONString(jsonStr));
      }
    }
    throw new Error('No valid JSON object found in response');
  }
}

function cleanJSONString(jsonStr) {
  return jsonStr
    // Fix common JSON issues
    .replace(/[\u201C\u201D\u201E\u201F\u2033\u2036]/g, '"') // Replace smart quotes
    .replace(/[\u2018\u2019\u201A\u201B\u2032\u2035]/g, "'") // Replace smart single quotes
    .replace(/\n\s*\n/g, '\n') // Remove multiple newlines
    .replace(/\t/g, '    ') // Replace tabs with spaces
    // Fix trailing commas
    .replace(/,(\s*[}\]])/g, '$1')
    // Fix missing quotes around property names
    .replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3')
    .trim();
}

function sanitizeCodeInJSON(jsonStr) {
  // Replace backticks in code blocks with escaped quotes
  return jsonStr.replace(/`([^`]*)`/g, (match, code) => {
    // Escape quotes and backslashes in the code
    const escapedCode = code
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/\n/g, '\\n');
    return `"${escapedCode}"`;
  });
}

export async function POST(request) {
  try {
    const { topic, slides, style } = await request.json();
    
    const model = genAI.getGenerativeModel({
      model: "gemini-pro",
      generationConfig,
    });

    const prompt = `Create a presentation outline about "${topic}" with ${slides} slides in ${style} style. 
    Return a valid JSON object with this exact structure:
    {
      "title": "Main Presentation Title",
      "sections": [
        {
          "title": "Section Title",
          "points": [
            {
              "main": "Main Point",
              "description": "Description of the point",
              "code": "Code example here",
              "language": "programming language name" // This will be used for syntax highlighting
            }
          ]
        }
      ]
    }
    
    Requirements:
    1. Include code examples where relevant, using proper indentation
    2. Specify the exact programming language for each code block (e.g., javascript, python, java)
    3. Ensure code is properly escaped and formatted
    4. Keep each description concise
    5. Use modern code examples with best practices`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    try {
      // Process and validate the JSON
      let parsedOutline = extractJSONFromText(text);

      // Validate structure
      if (!parsedOutline.title || !Array.isArray(parsedOutline.sections)) {
        throw new Error('Invalid presentation structure: missing required fields');
      }

      // Sanitize and validate sections
      parsedOutline.sections = parsedOutline.sections.map(section => {
        if (!section.title || !Array.isArray(section.points)) {
          throw new Error('Invalid section structure');
        }

        section.points = section.points.map(point => {
          if (!point.main || !point.description) {
            throw new Error('Invalid point structure');
          }

          // Ensure code and language fields are properly set
          if (point.code && !point.language) {
            point.language = 'javascript'; // Default language
          }

          return point;
        });

        return section;
      });

      return NextResponse.json(parsedOutline);

    } catch (error) {
      console.error('Processing error:', error);
      // Return both the error and the raw text for debugging
      return NextResponse.json(
        { 
          error: 'Failed to process presentation outline',
          details: error.message,
          rawText: text,
          debugInfo: {
            errorType: error.constructor.name,
            errorMessage: error.message,
            stackTrace: error.stack
          }
        }, 
        { status: 422 }
      );
    }

  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate presentation outline',
        details: error.message
      },
      { status: 500 }
    );
  }
}