import pptxgen from "pptxgenjs";
import { NextResponse } from "next/server";
import path from 'path';
import fs from 'fs/promises';

// Define custom presentation styling
const customStyles = {
  titleSlide: {
    background: { color: "F5F5F5" },
    shapes: [
      {
        type: "rect",
        x: 0,
        y: 0,
        w: "100%",
        h: "20%",
        fill: { color: "2E5090" }  // Dark blue header
      },
      {
        type: "rect",
        x: "5%",
        y: "18%",
        w: "90%",
        h: "0.3%",
        fill: { color: "FFD700" }  // Gold accent line
      }
    ],
    title: {
      options: {
        x: "5%",
        y: "30%",
        w: "90%",
        h: "20%",
        fontSize: 44,
        color: "2E5090",  // Dark blue
        bold: true,
        align: "center",
        fontFace: "Arial"
      }
    },
    subtitle: {
      options: {
        x: "10%",
        y: "55%",
        w: "80%",
        h: "15%",
        fontSize: 28,
        color: "404040",  // Dark gray
        align: "center",
        fontFace: "Arial"
      }
    }
  },
  contentSlide: {
    background: { color: "FFFFFF" },
    shapes: [
      {
        type: "rect",
        x: 0,
        y: 0,
        w: "100%",
        h: "15%",
        fill: { color: "2E5090" }  // Dark blue header
      },
      {
        type: "rect",
        x: "5%",
        y: "14%",
        w: "90%",
        h: "0.2%",
        fill: { color: "FFD700" }  // Gold accent line
      }
    ],
    title: {
      options: {
        x: "5%",
        y: "4%",
        w: "90%",
        h: "10%",
        fontSize: 32,
        color: "FFFFFF",  // White text for header
        bold: true,
        align: "left",
        fontFace: "Arial"
      }
    },
    content: {
      options: {
        x: "5%",
        y: "20%",
        w: "90%",
        fontSize: 24,
        color: "333333",  // Dark gray text
        bullet: { type: "bullet" },
        bulletColor: "2E5090",  // Dark blue bullets
        lineSpacing: 1.5,  // Increased line spacing
        fontFace: "Arial",
        breakLine: true,
        paraSpaceBefore: 0.2,  // Add space before paragraphs
        paraSpaceAfter: 0.2    // Add space after paragraphs
      }
    }
  }
};

export async function POST(req) {
  try {
    const { slides } = await req.json();
    const pres = new pptxgen();

    slides.forEach((slide) => {
      const newSlide = pres.addSlide();
      const style = slide.type === 'title' ? customStyles.titleSlide : customStyles.contentSlide;

      // Set background
      newSlide.background = style.background;

      // Add shapes
      style.shapes.forEach(shape => {
        newSlide.addShape(shape.type, shape);
      });

      if (slide.type === 'title') {
        newSlide.addText(slide.title, style.title.options);
        if (slide.subtitle) {
          newSlide.addText(slide.subtitle, style.subtitle.options);
        }
      } else {
        newSlide.addText(slide.title, style.title.options);
        
        // Process bullet points with descriptions
        if (slide.points?.length > 0) {
          let currentY = 22; // Start position for the first point

          slide.points.forEach((point) => {
            if (typeof point === 'object') {
              // Add main point
              newSlide.addText(point.main, {
                ...style.content.options,
                y: `${currentY}%`,
                h: "auto",  // Automatically adjust height based on content
                indentLevel: 0
              });
              
              currentY += 6; // Move down for description

              // Add description if it exists
              if (point.description) {
                newSlide.addText(point.description, {
                  ...style.content.options,
                  y: `${currentY}%`,
                  h: "auto",  // Automatically adjust height based on content
                  fontSize: 20,
                  color: '666666',
                  indentLevel: 1,
                  bullet: false
                });

                // Estimate additional space based on content length
                currentY += point.description.length > 100 ? 10 : 6;
              }
            } else {
              // Simple point without description
              newSlide.addText(point, {
                ...style.content.options,
                y: `${currentY}%`,
                h: "auto"
              });
              currentY += 6;
            }

            // Add extra spacing between points
            currentY += 2;
          });
        }
      }
    });

    const buffer = await pres.write('base64');
    // Create a proper data URL
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
