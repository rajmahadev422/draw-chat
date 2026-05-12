import { create } from "zustand";

const useGame = create(() => ({
  PALETTE: [
    "#e5f0e5",
    "#ffdd57",
    "#ff6b6b",
    "#74c7ec",
    "#a6e3a1",
    "#cba6f7",
    "#fab387",
    "#f38ba8",
  ],

  TOOLS: [
    { id: "pen", emoji: "✏️", key: "p" },
    // { id: "line", emoji: "📏", key: "l" },
    // { id: "rect", emoji: "⬜", key: "r" },
    // { id: "circle", emoji: "⭕", key: "c" },
    { id: "eraser", emoji: "🧹", key: "e" },
  ],

  applySegment: (ctx, seg) => {
  const x1 = seg.x1 * ctx.canvas.width;
  const y1 = seg.y1 * ctx.canvas.height;

  const x2 = seg.x2 * ctx.canvas.width;
  const y2 = seg.y2 * ctx.canvas.height;

  ctx.save();

  ctx.globalAlpha = seg.opacity;
  ctx.lineWidth = seg.size;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  if (seg.tool === "eraser") {
    ctx.globalCompositeOperation = "destination-out";
  } else {
    ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = seg.color;
  }

  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();

  ctx.restore();
},

  drawFullStroke: (ctx, stroke) => {
  ctx.save();

  ctx.globalAlpha = stroke.opacity;
  ctx.lineWidth = stroke.size;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  if (stroke.tool === "eraser") {
    ctx.globalCompositeOperation = "destination-out";
  } else {
    ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = stroke.color;
  }

  // PEN / ERASER
  if (
    stroke.tool === "pen" ||
    stroke.tool === "eraser"
  ) {
    if (!stroke.points?.length) return;

    ctx.beginPath();

    const first = stroke.points[0];

    ctx.moveTo(
      first.x * ctx.canvas.width,
      first.y * ctx.canvas.height
    );

    for (let i = 1; i < stroke.points.length; i++) {
      const p = stroke.points[i];

      ctx.lineTo(
        p.x * ctx.canvas.width,
        p.y * ctx.canvas.height
      );
    }

    ctx.stroke();
  }

  // LINE
  else if (stroke.tool === "line") {
    ctx.beginPath();

    ctx.moveTo(
      stroke.x1 * ctx.canvas.width,
      stroke.y1 * ctx.canvas.height
    );

    ctx.lineTo(
      stroke.x2 * ctx.canvas.width,
      stroke.y2 * ctx.canvas.height
    );

    ctx.stroke();
  }

  // RECTANGLE
  else if (stroke.tool === "rect") {
    const x1 = stroke.x1 * ctx.canvas.width;
    const y1 = stroke.y1 * ctx.canvas.height;

    const x2 = stroke.x2 * ctx.canvas.width;
    const y2 = stroke.y2 * ctx.canvas.height;

    ctx.strokeRect(
      x1,
      y1,
      x2 - x1,
      y2 - y1
    );
  }

  // CIRCLE
  else if (stroke.tool === "circle") {
    const x1 = stroke.x1 * ctx.canvas.width;
    const y1 = stroke.y1 * ctx.canvas.height;

    const x2 = stroke.x2 * ctx.canvas.width;
    const y2 = stroke.y2 * ctx.canvas.height;

    const radius = Math.sqrt(
      Math.pow(x2 - x1, 2) +
        Math.pow(y2 - y1, 2)
    );

    ctx.beginPath();
    ctx.arc(x1, y1, radius, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();
},
}));

export default useGame;