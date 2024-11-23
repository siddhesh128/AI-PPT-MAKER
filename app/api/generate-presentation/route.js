import pptxgen from "pptxgenjs";
import { NextResponse } from "next/server";
import path from 'path';
import fs from 'fs/promises';
import { themes } from './constants/themes';
import { createCustomStyles } from './utils/styles';

export async function POST(req) {
  try {
    const { slides, theme = 'modern', templateName, images } = await req.json();
    const pres = new pptxgen();
    const currentTheme = themes[theme] || themes.modern;
    const customStyles = createCustomStyles(currentTheme);

    slides.forEach((slide) => {
      const newSlide = pres.addSlide();
      const style = slide.type === 'title' ? customStyles.titleSlide : customStyles.contentSlide;

      // Apply background and shapes
      newSlide.background = style.background;
      style.shapes.forEach(shape => newSlide.addShape(shape.type, shape));

      if (slide.type === 'title') {
        // Title slide layout remains the same
        newSlide.addText(slide.title, style.title.options);
        if (slide.subtitle) {
          newSlide.addText(slide.subtitle, style.subtitle.options);
        }
      } else {
        // Content slide layout
        // Add title at the top
        newSlide.addText(slide.title, {
          ...style.title.options,
          w: '100%',  // Full width for title
          y: '5%'     // Position at top
        });

        // Add image on the right side if present
        if (slide.image) {
          newSlide.addImage({
            path: slide.image.url,
            x: '55%',    // Start at 55% from left
            y: '30%',    // Start below title
            w: '40%',    // Take 40% of slide width
            h: '50%',    // Take 70% of slide height
            sizing: { type: 'contain' }
          });
        }
        
        // Add points container on the left side
        if (slide.points?.length > 0) {
          let currentY = 20; // Start below title
          
          slide.points.forEach((point) => {
            if (typeof point === 'object') {
              // Add main point
              newSlide.addText(point.main, {
                x: "5%",
                y: `${currentY}%`,
                w: "60%", // Limit width to left side
                h: "auto",
                fontSize: 20,
                bold: true,
                color: currentTheme.primary,
                bullet: { type: "bullet" },
              });

              currentY += 12; // Increased from 7/10 to 12 for more space

              // Add description if exists
              if (point.description) {
                const estimatedHeight = Math.ceil(point.description.length / 30) * 4;
                newSlide.addText(point.description, {
                  x: "8%",
                  y: `${currentY}%`,
                  w: "42%", // Slightly less width for indentation
                  h: "auto",
                  fontSize: 16,
                  italic: true,
                  color: "666666",
                  breakLine: true,
                });
                currentY += estimatedHeight + 5; // Increased from 2 to 5 for more space after description
              }

              currentY += 5; // Added extra spacing between point groups
            } else {
              // Simple bullet point
              newSlide.addText(point, {
                x: "5%",
                y: `${currentY}%`,
                w: "45%", // Limit width to left side
                h: "auto",
                fontSize: 18,
                bullet: { type: "bullet" },
              });
              currentY += 8;
            }
          });
        }
      }
    });

    const buffer = await pres.write('base64');
    const url = `data:application/vnd.openxmlformats-officedocument.presentationml.presentation;base64,${buffer}`;
    return NextResponse.json({ url });
  } catch (error) {
    console.error('Error generating presentation:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const templatesPath = path.join(process.cwd(), 'public', 'templates');
    
    // Create templates directory if it doesn't exist
    try {
      await fs.access(templatesPath);
    } catch {
      await fs.mkdir(templatesPath, { recursive: true });
    }

    const files = await fs.readdir(templatesPath);
    console.log('Available template files:', files); // Debug log

    const templates = files
      .filter(file => file.endsWith('.pptx'))
      .map(file => ({
        name: file.replace('.pptx', ''),
        path: path.join(templatesPath, file)
      }));
    
    console.log('Processed templates:', templates); // Debug log
    return NextResponse.json({ templates: templates.map(t => t.name) });
  } catch (error) {
    console.error('Error loading templates:', error);
    return NextResponse.json({ templates: [], error: error.message });
  }
}