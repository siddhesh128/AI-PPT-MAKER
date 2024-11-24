import pptxgen from "pptxgenjs";
import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { themes } from "./constants/themes";
import { createCustomStyles } from "./utils/styles";

export async function POST(req) {
  try {
    const { slides, theme = "modern", templateName, images } = await req.json();
    const pres = new pptxgen();
    const currentTheme = themes[theme] || themes.modern;
    const customStyles = createCustomStyles(currentTheme);

    slides.forEach((slide) => {
      const newSlide = pres.addSlide();
      const style =
        slide.type === "title"
          ? customStyles.titleSlide
          : customStyles.contentSlide;

      // Apply background and shapes
      newSlide.background = style.background;
      style.shapes.forEach((shape) => newSlide.addShape(shape.type, shape));

      if (slide.type === "title") {
        // Title slide layout
        newSlide.addText(slide.title, style.title.options);
        if (slide.subtitle) {
          newSlide.addText(slide.subtitle, style.subtitle.options);
        }
      } else {
        // Content slide layout
        newSlide.addText(slide.title, {
          ...style.title.options,
          w: "100%", // Full width for title
          y: "5%", // Position at top
        });

        // Add image on the right side if present
        if (slide.image) {
          newSlide.addImage({
            path: slide.image.url,
            x: "55%", // Start at 55% from left
            y: "30%", // Start below title
            w: "40%", // Take 40% of slide width
            h: "50%", // Take 50% of slide height
            sizing: { type: "contain" },
          });
        }

        // Add points container on the left side
        if (slide.points?.length > 0) {
          let currentY = 20; // Start below title

          slide.points.forEach((point) => {
            if (typeof point === "object") {
              // Add main point
              newSlide.addText(point.main, {
                x: "5%",
                y: `${currentY}%`,
                w: "50%", // Limit width to left side
                h: "auto",
                fontSize: 20,
                bold: true,
                color: currentTheme.primary,
                bullet: { type: "bullet" },
                breakLine: true, // Ensure bullet point wraps to the next line
                // Add max width to ensure proper wrapping
                maxWidth: "90%",
              });
              currentY += 8;

              // Add description if exists (now properly styled)
              if (point.description) {
                // Height calculation: ~3% per line of text
                const estimatedHeight = Math.ceil(point.description.length / 30) * 3;
              
                // Add the description text directly
                newSlide.addText(point.description, {
                  x: "8%", // Left margin
                  y: `${currentY}%`, // Position it dynamically based on currentY
                  w: "42%", // Set a slightly smaller width to allow space on the right
                  h: "auto", // Let height adjust dynamically
                  fontSize: 14, // Keep a moderate font size
                  italic: true, // Use italics for the description text
                  color: "666666",
                  bullet: { type: "bullet" }, // Lighter color for description text
                  breakLine: true, // Ensure text breaks correctly within the box
                });
              
                // Adjust currentY for the next block after description
                currentY += estimatedHeight + 2; // Tight spacing after description
              }
            
              // Add code if exists as plain text with monospace font
              if (point.code) {
                // Dynamic height: 2.5% per line + 3% padding
                const codeLines = point.code.split("\n");
                const rectangleHeight = Math.ceil(codeLines.length * 2.5) + 3;
              
                newSlide.addShape("rect", {
                  x: "8%", // Position from the left
                  y: `${currentY}%`, // Position from the top
                  w: "40%", // Set rectangle width to 50%
                  h: `${rectangleHeight}%`, // Keep height dynamic
                  fill: { color: "444444" }, // Slightly lighter background
                  line: { color: "AAAAAA" }, // Optional border
                });
              
                // Add code text inside the rectangle
                codeLines.forEach((line, idx) => {
                  newSlide.addText(line, {
                    x: "9%", // Align text inside the rectangle
                    y: `${currentY + idx * 2.5 + 1}%`, // Adjust vertical position more tightly
                    w: "38%", // Match the width slightly smaller than the rectangle
                    h: "auto",
                    fontSize: 10, // Smaller font size
                    fontFace: "Consolas", // Monospace font
                    color: "FFFFFF", // Text color
                    align: "left", // Align text to the left
                  });
                });
              
                // Update currentY for the next block after the code (tightened space)
                currentY += rectangleHeight + 1; // Minimal space after code block
              }
            
              // Adjust space between points (even tighter)
              currentY += 2; // Minimal spacing between point groups
            } else {
              // Simple bullet point
              newSlide.addText(point, {
                x: "5%",
                y: `${currentY}%`,
                w: "50%", // Limit width to left side
                h: "auto",
                fontSize: 18,
                bullet: { type: "bullet" },
                breakLine: true, // Ensure simple bullet point wraps to next line if needed
                maxWidth: "90%", // Ensuring wrapping occurs within the available space
              });
              currentY += 8; // Standard spacing for simple bullet points
            }
          });
        }
      }
    });

    const buffer = await pres.write("base64");
    const url = `data:application/vnd.openxmlformats-officedocument.presentationml.presentation;base64,${buffer}`;
    return NextResponse.json({ url });
  } catch (error) {
    console.error("Error generating presentation:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const templatesPath = path.join(process.cwd(), "public", "templates");

    // Create templates directory if it doesn't exist
    try {
      await fs.access(templatesPath);
    } catch {
      await fs.mkdir(templatesPath, { recursive: true });
    }

    const files = await fs.readdir(templatesPath);
    console.log("Available template files:", files); // Debug log

    const templates = files
      .filter((file) => file.endsWith(".pptx"))
      .map((file) => ({
        name: file.replace(".pptx", ""),
        path: path.join(templatesPath, file),
      }));

    console.log("Processed templates:", templates); // Debug log
    return NextResponse.json({ templates: templates.map((t) => t.name) });
  } catch (error) {
    console.error("Error loading templates:", error);
    return NextResponse.json({ templates: [], error: error.message });
  }
}
