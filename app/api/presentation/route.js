import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

const generationConfig = {
  temperature: 0.7,
  topP: 0.8,
  topK: 40,
  maxOutputTokens: 8192,
};

// Function to clean and sanitize JSON strings
function cleanJSONString(jsonStr) {
  return jsonStr
    .replace(/^[^{]*|[^}]*$/g, "") // Remove leading/trailing non-JSON content
    .replace(/[\u201C\u201D\u201E\u201F]/g, '"') // Replace smart quotes
    .replace(/[\u2018\u2019]/g, "'") // Replace smart single quotes
    .replace(/`([^`]*)`/g, (match, code) => `"${code.replace(/"/g, '\\"')}"`) // Replace backticks
    .replace(/\n\s*\n/g, "\n") // Remove multiple newlines
    .replace(/\t/g, "    ") // Replace tabs with spaces
    .replace(/,(\s*[}\]])/g, "$1") // Fix trailing commas
    .trim();
}

// Function to extract JSON from raw text
function extractJSONFromText(text) {
  try {
    return JSON.parse(text); // First, try parsing the entire text as JSON
  } catch {
    const jsonMatch = text.match(/\{[\s\S]*\}/); // Match content between curly braces
    if (jsonMatch) {
      const jsonStr = cleanJSONString(jsonMatch[0]);
      return JSON.parse(jsonStr); // Try parsing cleaned JSON
    }
    throw new Error("No valid JSON object found in response text");
  }
}

export async function POST(request) {
  try {
    // Extract input from request body
    const { topic, slides, style } = await request.json();
    const model = genAI.getGenerativeModel({
      model: "gemini-pro",
      generationConfig,
    });

    // Define the AI prompt
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
              "language": "programming language name"
            }
          ]
        }
      ]
    }`;

    // Generate content from the AI
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const rawText = await response.text(); // Capture raw text

    console.log("Raw AI response text:", rawText);

    try {
      // Process and validate the JSON output
      const parsedOutline = extractJSONFromText(rawText);

      // Validate the structure
      if (!parsedOutline.title || !Array.isArray(parsedOutline.sections)) {
        throw new Error("Invalid JSON structure: Missing required fields");
      }

      // Sanitize and validate sections
      parsedOutline.sections = parsedOutline.sections.map((section) => {
        if (!section.title || !Array.isArray(section.points)) {
          throw new Error("Invalid section structure");
        }

        section.points = section.points.map((point) => {
          if (!point.main || !point.description) {
            throw new Error("Invalid point structure");
          }
          if (point.code && !point.language) {
            point.language = "javascript"; // Default language
          }
          return point;
        });

        return section;
      });

      return NextResponse.json(parsedOutline); // Return validated JSON
    } catch (error) {
      console.error("Error processing AI response:", error);

      // Return debugging details and raw text for further analysis
      return NextResponse.json(
        {
          error: "Failed to process presentation outline",
          details: error.message,
          rawText,
        },
        { status: 422 }
      );
    }
  } catch (error) {
    console.error("Error generating presentation:", error);

    return NextResponse.json(
      {
        error: "Failed to generate presentation outline",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
