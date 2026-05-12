import { useState, useRef, useEffect, useCallback } from "react";
import useRoom from "../store/useRoom";
import { useParams } from "react-router-dom";
import { MdDeleteOutline } from "react-icons/md";
import useGame from "../store/useGame";

export default function Blackboard() {
  const { PALETTE, applySegment, TOOLS, drawFullStroke } = useGame();
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
    const cv = cvRef.current;
    const wrap = wrapRef.current;

    if (!cv || !wrap) return;

    const aspect = 16 / 9;

    let w = wrap.clientWidth - 32;
    let h = w / aspect;

    if (h > wrap.clientHeight - 32) {
      h = wrap.clientHeight - 32;
      w = h * aspect;
    }

    cv.width = w;
    cv.height = h;

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

    return {
      x: (s.clientX - r.left) / cvRef.current.width,
      y: (s.clientY - r.top) / cvRef.current.height,
    };
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
      ctx.clearRect(0, 0, cv.width, cv.height);

      drRef.current.strokes.forEach((s) => drawFullStroke(ctx, s));
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
  // ── render ────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full bg-[#0e0e0e] text-white overflow-hidden select-none">
      {/* ── TOP TOOLBAR ── */}
      <div className="flex items-center gap-0.5 px-2 py-1.5 bg-[#0a0a0a] border-b border-white/6 flex-wrap shrink-0">
        {/* Tools */}
        <div className="flex items-center gap-1 px-2 border-r border-white/[0.07]">
          <span className="text-[9px] text-white/20 uppercase tracking-widest mr-1">
            Tool
          </span>
          {TOOLS.map((t) => (
            <button
              key={t.id}
              title={`${t.id} (${t.key.toUpperCase()})`}
              onClick={() => setTool(t.id)}
              className={`w-8 h-8 rounded-lg border text-sm flex items-center justify-center transition-all ${
                tool === t.id
                  ? "border-purple-500 bg-purple-700 text-white shadow-lg shadow-purple-900/40"
                  : "border-white/10 bg-white/4 text-white/40 hover:bg-white/9 hover:text-white"
              }`}
            >
              {t.emoji}
            </button>
          ))}
        </div>

        {/* Size */}
        <div className="flex items-center gap-2 px-3 border-r border-white/[0.07]">
          <span className="text-[9px] text-white/20 uppercase tracking-widest">
            Size
          </span>
          <input
            type="range"
            min="1"
            max="60"
            value={size}
            onChange={(e) => setSizeW(e.target.value)}
            className="w-20 accent-purple-500 cursor-pointer"
          />
          <span className="text-[11px] text-white/30 font-mono w-5">
            {size}
          </span>
        </div>

        {/* Opacity */}
        <div className="flex items-center gap-2 px-3 border-r border-white/[0.07]">
          <span className="text-[9px] text-white/20 uppercase tracking-widest">
            Opacity
          </span>
          <input
            type="range"
            min="10"
            max="100"
            value={opacity}
            onChange={(e) => setOpW(e.target.value)}
            className="w-16 accent-violet-400 cursor-pointer"
          />
          <span className="text-[11px] text-white/30 font-mono w-8">
            {opacity}%
          </span>
        </div>

        {/* Colors */}
        <div className="flex items-center gap-1.5 px-3 border-r border-white/[0.07]">
          <span className="text-[9px] text-white/20 uppercase tracking-widest mr-1">
            Color
          </span>
          {PALETTE.map((c) => (
            <button
              key={c}
              onClick={() => {
                setColorW(c);
                if (tool === "eraser") setTool("pen");
              }}
              title={c}
              className={`w-5 h-5 rounded-full shrink-0 transition-transform hover:scale-110 ${
                color === c
                  ? "ring-2 ring-white/70 ring-offset-1 ring-offset-black"
                  : ""
              }`}
              style={{ background: c }}
            />
          ))}
          <input
            type="color"
            value={color}
            onChange={(e) => {
              setColorW(e.target.value);
              if (tool === "eraser") setTool("pen");
            }}
            title="Custom color"
            className="w-6 h-6 rounded-full cursor-pointer bg-transparent border-none outline-none ml-0.5"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 px-2 ml-auto">
          <span className="text-[10px] text-white/15 font-mono mr-1">
            {count} strokes
          </span>
          <button
            onClick={savePNG}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-white/9 bg-white/4 text-white/50 hover:bg-white/9 hover:text-white text-xs transition-all"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            PNG
          </button>
          <button
            onClick={clearBoard}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-white/9 bg-white/4 text-white/50 hover:bg-red-500/15 hover:border-red-500/30 hover:text-red-400 text-xs transition-all"
          >
            <MdDeleteOutline />
            Clear
          </button>
        </div>
      </div>

      {/* ── CANVAS ── */}
      <div
        ref={wrapRef}
        className="flex-1 flex items-center justify-center overflow-hidden bg-[#0e0e0e] p-4"
      >
        <canvas
          ref={cvRef}
          className={
            tool === "eraser"
              ? "cursor-cell rounded"
              : "cursor-crosshair rounded"
          }
          style={{
            width: "100%",
            height: "100%",
            maxWidth: "100%",
            maxHeight: "100%",
            background: "#0c1a0c",
            border: "1.5px solid #1a2e1a",
            boxShadow: "0 0 80px rgba(0,0,0,.9), inset 0 0 40px rgba(0,0,0,.5)",
            touchAction: "none",
          }}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerLeave={onUp}
        />
      </div>

      {/* ── TOAST ── */}
      {toast.v && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 bg-slate-800 border border-white/1 text-white/80 text-xs px-4 py-2 rounded-full shadow-xl pointer-events-none">
          {toast.msg}
        </div>
      )}
    </div>
  );
}
