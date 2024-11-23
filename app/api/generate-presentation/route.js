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
        newSlide.addText(slide.title, style.title.options);

        // Add image if present
        if (slide.image) {
          newSlide.addImage({
            path: slide.image.url,
            x: '30%',
            y: '20%',
            w: '30%',
            h: '30%',
            sizing: { type: 'contain' }
          });
        }

        // Adjust starting position for points based on whether there's an image
        let currentY = slide.image ? 55 : 25;
        
        if (slide.points?.length > 0) {
          slide.points.forEach((point) => {
            if (typeof point === 'object') {
              // Add main point
              newSlide.addText(point.main, {
                x: "5%",
                y: `${currentY}%`,
                w: "90%",
                h: "auto",
                fontSize: 20,
                bold: true,
                color: currentTheme.primary,
                bullet: { type: "bullet" },
              });

              currentY += 7; // Adjust position for description

              // Add description if exists
              if (point.description) {
                const estimatedHeight = Math.ceil(point.description.length / 50) * 4; // Adjust for longer descriptions
                newSlide.addText(point.description, {
                  x: "10%",
                  y: `${currentY}%`,
                  w: "85%",
                  h: "auto",
                  fontSize: 10,
                  italic: true,
                  color: "666666",
                  breakLine: true,
                });
                currentY += estimatedHeight + 2; // Add space for description
              }

              currentY += 2; // Add extra spacing between points
            } else {
              // Simple bullet point
              newSlide.addText(point, {
                x: "5%",
                y: `${currentY}%`,
                w: "90%",
                h: "auto",
                fontSize: 22,
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