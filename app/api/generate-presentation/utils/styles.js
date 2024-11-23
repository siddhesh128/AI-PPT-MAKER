export const createCustomStyles = (theme) => ({
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