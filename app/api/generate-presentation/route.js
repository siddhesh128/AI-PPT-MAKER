import pptxgen from "pptxgenjs";
import { NextResponse } from "next/server";
import path from 'path';
import fs from 'fs/promises';

const themes = {
  modern: {
    primary: '2563eb',
    secondary: '3b82f6',
    accent: '60a5fa',
    background: 'FFFFFF',
  },
  tech: {
    primary: '7c3aed',
    secondary: '8b5cf6',
    accent: 'a78bfa',
    background: 'FFFFFF',
  },
  nature: {
    primary: '059669',
    secondary: '10b981',
    accent: '34d399',
    background: 'FFFFFF',
  }
};

const createCustomStyles = (theme) => ({
  titleSlide: {
    background: { color: theme.background },
    shapes: [
      {
        type: "rect",
        x: 0,
        y: 0,
        w: "100%",
        h: "20%",
        fill: { color: theme.primary }
      },
      {
        type: "rect",
        x: "5%",
        y: "18%",
        w: "90%",
        h: "0.3%",
        fill: { color: theme.accent }
      },
      // Decorative circle
      {
        type: "ellipse",
        x: "70%",
        y: "-10%",
        w: "40%",
        h: "40%",
        fill: { color: theme.secondary },
        opacity: 0.2
      }
    ],
    title: {
      options: {
        x: "5%",
        y: "30%",
        w: "90%",
        h: "20%",
        fontSize: 44,
        color: theme.primary,
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
        color: "404040",
        align: "center",
        fontFace: "Arial"
      }
    }
  },
  contentSlide: {
    background: { color: theme.background },
    shapes: [
      {
        type: "rect",
        x: 0,
        y: 0,
        w: "100%",
        h: "15%",
        fill: { color: theme.primary }
      },
      {
        type: "rect",
        x: "5%",
        y: "14%",
        w: "90%",
        h: "0.2%",
        fill: { color: theme.accent }
      }
    ],
    title: {
      options: {
        x: "5%",
        y: "4%",
        w: "90%",
        h: "10%",
        fontSize: 32,
        color: "FFFFFF",
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
        color: "333333",
        bullet: { type: "bullet" },
        bulletColor: theme.primary,
        lineSpacing: 1.5,
        fontFace: "Arial",
        breakLine: true,
        paraSpaceBefore: 0.2,
        paraSpaceAfter: 0.2
      }
    }
  }
});

export async function POST(req) {
  try {
    const { slides, theme = 'modern', templateName } = await req.json();
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
        
        if (slide.points?.length > 0) {
          let currentY = 25; // Start lower to avoid title overlap

          slide.points.forEach((point) => {
            if (typeof point === 'object') {
              // Add main point
              newSlide.addText(point.main, {
                x: "5%",
                y: `${currentY}%`,
                w: "90%",
                h: "auto",
                fontSize: 24,
                bold: true,
                color: currentTheme.primary,
                bullet: { type: "bullet" },
              });

              currentY += 10; // Adjust position for description

              // Add description if exists
              if (point.description) {
                const estimatedHeight = Math.ceil(point.description.length / 50) * 4; // Adjust for longer descriptions
                newSlide.addText(point.description, {
                  x: "10%",
                  y: `${currentY}%`,
                  w: "85%",
                  h: "auto",
                  fontSize: 20,
                  italic: true,
                  color: "666666",
                  breakLine: true,
                });
                currentY += estimatedHeight + 2; // Add space for description
              }

              currentY += 4; // Add extra spacing between points
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
