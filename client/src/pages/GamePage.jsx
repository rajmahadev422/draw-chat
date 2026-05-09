import { useState, useRef, useEffect, useCallback } from "react";
import useRoom from "../store/useRoom";
import { useParams } from "react-router-dom";

const PALETTE = [
  "#e5f0e5",
  "#ffdd57",
  "#ff6b6b",
  "#74c7ec",
  "#a6e3a1",
  "#cba6f7",
  "#fab387",
  "#f38ba8",
];
const TOOLS = [
  { id: "pen", emoji: "✏️", key: "p" },
  { id: "line", emoji: "📏", key: "l" },
  { id: "rect", emoji: "⬜", key: "r" },
  { id: "circle", emoji: "⭕", key: "c" },
  { id: "eraser", emoji: "🧹", key: "e" },
];

// ── draw a single delta segment (pen/eraser tick) ──────────────────
function applySegment(ctx, seg) {
  ctx.save();
  ctx.strokeStyle = seg.color;
  ctx.lineWidth = seg.size;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.globalAlpha = seg.opacity ?? 1;
  if (seg.tool === "eraser") {
    ctx.globalCompositeOperation = "destination-out";
    ctx.globalAlpha = 1;
  }
  ctx.beginPath();
  ctx.moveTo(seg.x1, seg.y1);
  ctx.lineTo(seg.x2, seg.y2);
  ctx.stroke();
  ctx.restore();
}

// ── draw a full committed stroke (for init / shape tools) ──────────
function drawFullStroke(ctx, s) {
  ctx.save();
  ctx.strokeStyle = s.color;
  ctx.lineWidth = s.size;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.globalAlpha = s.opacity ?? 1;
  if (s.tool === "eraser") {
    ctx.globalCompositeOperation = "destination-out";
    ctx.globalAlpha = 1;
  }
  if (s.tool === "pen" || s.tool === "eraser") {
    if (!s.points?.length) {
      ctx.restore();
      return;
    }
    ctx.beginPath();
    ctx.moveTo(s.points[0].x, s.points[0].y);
    s.points.forEach((p) => ctx.lineTo(p.x, p.y));
    ctx.stroke();
  } else if (s.tool === "line") {
    ctx.beginPath();
    ctx.moveTo(s.x1, s.y1);
    ctx.lineTo(s.x2, s.y2);
    ctx.stroke();
  } else if (s.tool === "rect") {
    ctx.strokeRect(s.x1, s.y1, s.x2 - s.x1, s.y2 - s.y1);
  } else if (s.tool === "circle") {
    ctx.beginPath();
    ctx.ellipse(
      (s.x1 + s.x2) / 2,
      (s.y1 + s.y2) / 2,
      Math.abs(s.x2 - s.x1) / 2,
      Math.abs(s.y2 - s.y1) / 2,
      0,
      0,
      Math.PI * 2,
    );
    ctx.stroke();
  }
  ctx.restore();
}

export default function Blackboard() {
  // ── refs ─────────────────────────────────────────────────────────
  const cvRef = useRef(null);
  const wrapRef = useRef(null);
  const socketRef = useRef(null);
  const drRef = useRef({
    drawing: false,
    sx: 0,
    sy: 0,
    path: [],
    snap: null,
    strokes: [],
    remotePath: [],
  });

  const toolR = useRef("pen");
  const colorR = useRef("#e5f0e5");
  const sizeR = useRef(4);
  const opR = useRef(1);

  // ── state ─────────────────────────────────────────────────────────
  const [tool, setToolSt] = useState("pen");
  const [color, setColor] = useState("#e5f0e5");
  const [size, setSize] = useState(4);
  const [opacity, setOpacity] = useState(100);
  const [count, setCount] = useState(0);
  const [roomId, setRoomId] = useState("");
  const [roomInput, setRoomInput] = useState("");
  const [joined, setJoined] = useState(false);
  const [users, setUsers] = useState(1);
  const [toast, setToast] = useState({ msg: "", v: false });
  const toastTm = useRef(null);

  // useRoom

  const { io } = useRoom();
  const id = useParams().roomId;

  const showToast = useCallback((msg) => {
    setToast({ msg, v: true });
    clearTimeout(toastTm.current);
    toastTm.current = setTimeout(
      () => setToast((t) => ({ ...t, v: false })),
      2500,
    );
  }, []);

  // ── helpers ───────────────────────────────────────────────────────
  const setTool = (t) => {
    toolR.current = t;
    setToolSt(t);
  };
  const setColorW = (c) => {
    colorR.current = c;
    setColor(c);
  };
  const setSizeW = (v) => {
    sizeR.current = +v;
    setSize(+v);
  };
  const setOpW = (v) => {
    opR.current = v / 100;
    setOpacity(+v);
  };

  const getCtx = () => cvRef.current?.getContext("2d");

  const redrawAll = useCallback(() => {
    const cv = cvRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    ctx.clearRect(0, 0, cv.width, cv.height);
    drRef.current.strokes.forEach((s) => drawFullStroke(ctx, s));
    setCount(drRef.current.strokes.length);
  }, []);

  const resize = useCallback(() => {
    const cv = cvRef.current,
      wrap = wrapRef.current;
    if (!cv || !wrap) return;
    cv.width = wrap.clientWidth - 32;
    cv.height = wrap.clientHeight - 32;
    redrawAll();
  }, [redrawAll]);

  useEffect(() => {
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [resize]);

  // ── keyboard ──────────────────────────────────────────────────────
  useEffect(() => {
    const h = (e) => {
      if (e.target.tagName === "INPUT") return;
      const m = { p: "pen", l: "line", r: "rect", c: "circle", e: "eraser" };
      if (m[e.key]) setTool(m[e.key]);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  // ── socket setup ──────────────────────────────────────────────────
  useEffect(() => {
    if (!id || !io) return;

    const sock = io;
    socketRef.current = sock;

    sock.emit("join-room", id);
    setRoomId(id);
    setJoined(true);
    showToast(`Joined room "${id}"`);

    // Receive initial stroke history
    sock.on("init-strokes", (strokes) => {
      drRef.current.strokes = strokes;
      redrawAll();
    });

    // Receive live segment from others (pen/eraser tick)
    sock.on("draw-segment", (seg) => {
      drRef.current.remotePath.push(seg);
      applySegment(getCtx(), seg);
    });

    // Remote stroke ended — collect remote segments into a full stroke
    sock.on("stroke-end", () => {
      const rp = drRef.current.remotePath;
      if (rp.length > 0) {
        const first = rp[0];
        const points = rp.map((s) => ({ x: s.x2, y: s.y2 }));
        drRef.current.strokes.push({ ...first, points });
        drRef.current.remotePath = [];
        setCount(drRef.current.strokes.length);
      }
    });

    sock.on("clear-board", () => {
      drRef.current.strokes = [];
      redrawAll();
      showToast("Board cleared by a user");
    });

    sock.on("user-left", () => showToast("A user left the room"));
    sock.on("connect_error", () => showToast("❌ Cannot connect to server"));
  }, [id, io]);

  // ── pointer utils ─────────────────────────────────────────────────
  const gp = (e) => {
    const r = cvRef.current.getBoundingClientRect();
    const s = e.touches ? e.touches[0] : e;
    return { x: s.clientX - r.left, y: s.clientY - r.top };
  };

  const onDown = (e) => {
    e.preventDefault();
    const cv = cvRef.current;
    const ctx = cv.getContext("2d");
    const p = gp(e);
    drRef.current.drawing = true;
    drRef.current.sx = p.x;
    drRef.current.sy = p.y;
    drRef.current.path = [p];
    if (toolR.current !== "pen" && toolR.current !== "eraser") {
      drRef.current.snap = ctx.getImageData(0, 0, cv.width, cv.height);
    }
  };

  const onMove = (e) => {
    if (!drRef.current.drawing) return;
    e.preventDefault();
    const cv = cvRef.current;
    const ctx = cv.getContext("2d");
    const p = gp(e);
    const t = toolR.current;
    const prev = drRef.current.path[drRef.current.path.length - 1];

    if (t === "pen" || t === "eraser") {
      const seg = {
        tool: t,
        color: colorR.current,
        size: sizeR.current,
        opacity: opR.current,
        x1: prev.x,
        y1: prev.y,
        x2: p.x,
        y2: p.y,
      };
      // Draw locally
      applySegment(ctx, seg);
      drRef.current.path.push(p);

      // Send tiny delta — very low bandwidth
      if (joined)
        socketRef.current?.emit("draw-segment", { roomId, segment: seg });
    } else {
      // Shape preview — only local
      ctx.putImageData(drRef.current.snap, 0, 0);
      drawFullStroke(ctx, {
        tool: t,
        color: colorR.current,
        size: sizeR.current,
        opacity: opR.current,
        x1: drRef.current.sx,
        y1: drRef.current.sy,
        x2: p.x,
        y2: p.y,
      });
    }
  };

  const onUp = (e) => {
    if (!drRef.current.drawing) return;
    drRef.current.drawing = false;
    const p = gp(e);
    const t = toolR.current;

    let stroke;
    if (t === "pen" || t === "eraser") {
      stroke = {
        tool: t,
        color: colorR.current,
        size: sizeR.current,
        opacity: opR.current,
        points: [...drRef.current.path],
      };
    } else {
      stroke = {
        tool: t,
        color: colorR.current,
        size: sizeR.current,
        opacity: opR.current,
        x1: drRef.current.sx,
        y1: drRef.current.sy,
        x2: p.x,
        y2: p.y,
      };
    }

    drRef.current.strokes.push(stroke);
    setCount(drRef.current.strokes.length);
    drRef.current.path = [];

    if (joined) socketRef.current?.emit("stroke-end", { roomId });
  };

  const clearBoard = () => {
    drRef.current.strokes = [];
    redrawAll();
    if (joined) socketRef.current?.emit("clear-board", { roomId });
  };

  // ── save PNG ──────────────────────────────────────────────────────
  const savePNG = () => {
    const cv = cvRef.current;
    const tmp = document.createElement("canvas");
    tmp.width = cv.width;
    tmp.height = cv.height;
    const tc = tmp.getContext("2d");
    tc.fillStyle = "#0f1a0e";
    tc.fillRect(0, 0, tmp.width, tmp.height);
    tc.drawImage(cv, 0, 0);
    Object.assign(document.createElement("a"), {
      href: tmp.toDataURL("image/png"),
      download: "blackboard.png",
    }).click();
    showToast("PNG saved! 🖼");
  };

  // ── render ────────────────────────────────────────────────────────
  const Btn = ({ children, onClick, cls = "" }) => (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all duration-150 whitespace-nowrap ${cls || "border-white/10 bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white"}`}
    >
      {children}
    </button>
  );

  return (
    <div className="flex h-full bg-[#111] text-white overflow-hidden select-none">
      {/* CANVAS */}
      <div
        ref={wrapRef}
        className="flex-1 flex items-center justify-center overflow-hidden bg-[#0e0e0e]"
      >
        <canvas
          ref={cvRef}
          className={`block p-0 rounded ${tool === "eraser" ? "cursor-cell" : "cursor-crosshair"}`}
          style={{
            background: "#0c1a0c",
            border: "2px solid #1a2e1a",
            boxShadow:
              "0 0 100px rgba(0,0,0,.9), inset 0 0 60px rgba(0,0,0,.5)",
            touchAction: "none",
          }}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerLeave={onUp}
        />
      </div>
      {/* TOP BAR */}
      <div className="grid items-center gap-1 px-1 bg-[#0a0a0a] border-b border-white/6 w-20 shrink-0">
        {/* Tools */}
        <div className="grid items-center gap-1 pr-3 border-r border-white/[0.07]">
          <span className="text-[9px] text-neutral-700 uppercase tracking-widest mr-1">
            Tool
          </span>
          {TOOLS.map((t) => (
            <button
              key={t.id}
              title={`${t.id} (${t.key.toUpperCase()})`}
              onClick={() => setTool(t.id)}
              className={`w-9 h-9 rounded-xl border text-base flex items-center justify-center transition-all ${
                tool === t.id
                  ? "border-blue-500 bg-blue-600 text-white shadow-lg shadow-blue-900/40"
                  : "border-white/10 bg-white/5 text-neutral-400 hover:bg-white/10 hover:border-white/20"
              }`}
            >
              {t.emoji}
            </button>
          ))}
        </div>

        {/* Size */}
        <div className="grid items-center gap-2 pr-3 border-r border-white/[0.07]">
          <span className="text-[9px] text-neutral-700 uppercase tracking-widest">
            Size
          </span>
          <input
            type="range"
            min="1"
            max="60"
            value={size}
            onChange={(e) => setSizeW(e.target.value)}
            className="w-20 accent-blue-500 cursor-pointer"
          />
          <span className="text-xs text-neutral-600 w-5 font-mono">{size}</span>
        </div>

        {/* Opacity */}
        <div className="grid items-center gap-2 pr-3 border-r border-white/[0.07]">
          <span className="text-[9px] text-neutral-700 uppercase tracking-widest">
            Opacity
          </span>
          <input
            type="range"
            min="10"
            max="100"
            value={opacity}
            onChange={(e) => setOpW(e.target.value)}
            className="w-14 accent-purple-400 cursor-pointer"
          />
          <span className="text-xs text-neutral-600 w-6 font-mono">
            {opacity}%
          </span>
        </div>

        {/* Colors */}
        <div className="grid items-center gap-1.5 pr-3 border-r border-white/[0.07]">
          <span className="text-[9px] text-neutral-700 uppercase tracking-widest mr-1">
            Color
          </span>
          <input
            type="color"
            value={color}
            onChange={(e) => {
              setColorW(e.target.value);
              if (tool === "eraser") setTool("pen");
            }}
            className="w-7 h-7 rounded-full cursor-pointer bg-transparent border-none outline-none"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          <Btn
            onClick={clearBoard}
            cls="border-white/10 bg-white/5 text-neutral-400 hover:bg-red-950/40 hover:border-red-900/60 hover:text-red-400"
          >
            🗑 Clear
          </Btn>
          <Btn onClick={savePNG}>🖼 PNG</Btn>
        </div>

        <span className="ml-auto text-[10px] text-neutral-800 font-mono">
          {count}
        </span>
      </div>
    </div>
  );
}
