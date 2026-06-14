'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Image as FabricImage, IText, PencilBrush } from 'fabric';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faFont, faPencil, faDownload, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useRef } from 'react';
import { applyBrightness, applyContrast, applyBlur, applyGrayscale, applyInvert, applySaturation } from '@/lib/filters';
import { createShape, shapeOptions } from '@/lib/elements';

/* ─── inline styles ─────────────────────────────────────────── */
const S = {
  root: {
    fontFamily: "'Inter', sans-serif",
    background: '#0d0d0d',
    width: '100%',
    minHeight: '100vh',
    color: '#e8e8e8',
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
  },

  /* top header bar */
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    background: 'rgba(255,255,255,0.02)',
    backdropFilter: 'blur(20px)',
    position: 'sticky',
    top: 0,
    zIndex: 50,
    flexWrap: 'wrap',
    gap: '8px',
  },
  logo: {
    fontFamily: "'Syne', sans-serif",
    fontWeight: 800,
    fontSize: '18px',
    letterSpacing: '-0.5px',
    color: '#fff',
  },
  logoAccent: { color: '#c8ff00' },

  /* section card */
  section: {
    margin: '8px 10px 0',
    borderRadius: '12px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.07)',
    backdropFilter: 'blur(20px)',
    overflow: 'hidden',
  },
  sectionHead: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 14px',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    cursor: 'pointer',
    userSelect: 'none',
  },
  sectionIcon: {
    width: '26px',
    height: '26px',
    borderRadius: '7px',
    background: 'rgba(200,255,0,0.12)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    color: '#c8ff00',
    flexShrink: 0,
  },
  sectionTitle: {
    fontFamily: "'Syne', sans-serif",
    fontWeight: 700,
    fontSize: '12px',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#aaa',
  },
  sectionChevron: {
    marginLeft: 'auto',
    fontSize: '10px',
    color: '#555',
    transition: 'transform 0.2s',
  },
  sectionBody: {
    padding: '12px 14px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },

  /* primary action buttons */
  actionBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    width: '100%',
    padding: '10px 14px',
    borderRadius: '8px',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'rgba(255,255,255,0.09)',
    background: 'rgba(255,255,255,0.05)',
    color: '#e8e8e8',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.15s',
    outline: 'none',
    fontFamily: 'inherit',
    position: 'relative',
    overflow: 'hidden',
  },
  backButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    borderRadius: '10px',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'rgba(255,255,255,0.12)',
    background: 'rgba(255,255,255,0.08)',
    color: '#fff',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  actionBtnAccent: {
    background: '#c8ff00',
    color: '#080808',
    borderWidth: '0',
    borderStyle: 'none',
    fontWeight: 700,
  },
  actionBtnActive: {
    background: 'rgba(200,255,0,0.12)',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'rgba(200,255,0,0.4)',
    color: '#c8ff00',
  },
  actionBtnDanger: {
    background: 'rgba(139,92,246,0.10)',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'rgba(139,92,246,0.25)',
    color: '#c4b5fd',
  },

  /* two-col grid for buttons */
  grid2: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px',
  },

  /* label above a control */
  label: {
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    color: '#666',
    marginBottom: '4px',
  },

  /* color row */
  colorRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  colorSwatch: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.12)',
    cursor: 'pointer',
    flexShrink: 0,
    position: 'relative',
    overflow: 'hidden',
  },
  colorInput: {
    position: 'absolute',
    inset: 0,
    opacity: 0,
    cursor: 'pointer',
    width: '100%',
    height: '100%',
  },
  colorLabel: {
    fontSize: '12px',
    color: '#888',
    minWidth: '38px',
  },

  /* slider */
  sliderWrap: { display: 'flex', flexDirection: 'column', gap: '4px' },
  sliderRow: { display: 'flex', alignItems: 'center', gap: '10px' },
  sliderValue: {
    fontSize: '11px',
    color: '#c8ff00',
    fontFamily: 'monospace',
    minWidth: '36px',
    textAlign: 'right',
  },

  /* shape pill buttons */
  shapePill: {
    padding: '7px 12px',
    borderRadius: '20px',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'rgba(255,255,255,0.09)',
    background: 'rgba(255,255,255,0.04)',
    color: '#ccc',
    fontSize: '12px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.15s',
    whiteSpace: 'nowrap',
    fontFamily: 'inherit',
  },
  shapeGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
  },

  /* font select */
  select: {
    flex: 1,
    background: 'rgba(255,255,255,0.05)',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'rgba(255,255,255,0.09)',
    borderRadius: '8px',
    color: '#e8e8e8',
    fontSize: '12px',
    padding: '8px 10px',
    outline: 'none',
    fontFamily: 'inherit',
    cursor: 'pointer',
    minWidth: 0,
  },

  /* hidden file input */
  fileInputWrap: {
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    width: '100%',
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1.5px dashed rgba(200,255,0,0.3)',
    background: 'rgba(200,255,0,0.04)',
    color: '#c8ff00',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.15s',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
  },

  /* download button */
  downloadBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    width: '100%',
    padding: '11px 14px',
    borderRadius: '8px',
    background: '#c8ff00',
    color: '#080808',
    fontWeight: 800,
    fontSize: '13px',
    border: 'none',
    cursor: 'pointer',
    fontFamily: "'Syne', sans-serif",
    letterSpacing: '0.03em',
    transition: 'opacity 0.15s',
  },

  /* divider */
  divider: {
    height: '1px',
    background: 'rgba(255,255,255,0.05)',
    margin: '2px 0',
  },

  /* bottom spacer */
  spacer: { height: '20px' },
};

/* ─── tiny helpers ────────────────────────────────────────────── */
const Swatch = ({ value, onChange, label }) => (
  <div style={S.colorRow}>
    <div style={{ ...S.colorSwatch, background: value }}>
      <input type="color" value={value} onChange={onChange} style={S.colorInput} />
    </div>
    <span style={S.colorLabel}>{label}</span>
    <span style={{ fontSize: '12px', color: '#555', fontFamily: 'monospace' }}>{value}</span>
  </div>
);

const Slider = ({ label, value, min, max, step, onChange, format }) => (
  <div style={S.sliderWrap}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={S.label}>{label}</span>
      <span style={S.sliderValue}>{format ? format(value) : value}</span>
    </div>
    <input
      type="range"
      min={min} max={max} step={step} value={value}
      onChange={onChange}
      style={{ width: '100%', accentColor: '#c8ff00', cursor: 'pointer' }}
    />
  </div>
);

const Section = ({ icon, title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={S.section}>
      <div style={S.sectionHead} onClick={() => setOpen(o => !o)}>
        <div style={S.sectionIcon}>{icon}</div>
        <span style={S.sectionTitle}>{title}</span>
        <span style={{ ...S.sectionChevron, transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>▲</span>
      </div>
      {open && <div style={S.sectionBody}>{children}</div>}
    </div>
  );
};

const ActionBtn = ({ onClick, children, variant, style: extra }) => {
  const [hovered, setHovered] = useState(false);
  const base = variant === 'accent' ? S.actionBtnAccent
    : variant === 'active' ? S.actionBtnActive
    : variant === 'danger' ? S.actionBtnDanger
    : {};
  return (
    <button
      onClick={onClick}
      style={{
        ...S.actionBtn,
        ...base,
        ...(hovered && variant !== 'accent' ? { background: 'rgba(255,255,255,0.09)', borderColor: 'rgba(255,255,255,0.15)' } : {}),
        ...(hovered && variant === 'accent' ? { opacity: 0.85 } : {}),
        ...extra,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </button>
  );
};

/* ─── main component ──────────────────────────────────────────── */
const Toolbox = ({ canvas, project }) => {
  const router = useRouter();
  const [color, setColor] = useState("#000000");
  const [textColor, setTextColor] = useState("#000000");
  const [fontFamily, setFontFamily] = useState("Arial");
  const [fontStyleOption, setFontStyleOption] = useState("normal");
  const [elementFillColor, setElementFillColor] = useState("#38bdf8");
  const [elementFillOpacity, setElementFillOpacity] = useState(0.45);
  const [elementStrokeColor, setElementStrokeColor] = useState("#0ea5e9");
  const [elementStrokeWidth, setElementStrokeWidth] = useState(2);
  const [shapeMenuOpen, setShapeMenuOpen] = useState(false);
  const brushRef = useRef(null);

  const getFontProps = (option) => {
    switch (option) {
      case 'italic': return { fontStyle: 'italic', fontWeight: 'normal' };
      case 'bold': return { fontStyle: 'normal', fontWeight: 'bold' };
      case 'bold-italic': return { fontStyle: 'italic', fontWeight: 'bold' };
      default: return { fontStyle: 'normal', fontWeight: 'normal' };
    }
  };

  const isTextObject = (o) => Boolean(o && (o.type === 'i-text' || o.type === 'textbox' || o.type === 'text'));
  const isShapeObject = (o) => Boolean(o && !isTextObject(o) && o.fill !== undefined && o.stroke !== undefined);

  const createRgbaFill = (hexColor, opacity) => {
    const hex = hexColor.replace('#', '').trim();
    const n = hex.length === 3 ? hex.split('').map(c => c + c).join('') : hex;
    return `rgba(${parseInt(n.slice(0,2),16)}, ${parseInt(n.slice(2,4),16)}, ${parseInt(n.slice(4,6),16)}, ${opacity})`;
  };

  const extractFillColor = (fillValue) => {
    if (!fillValue) return { hex: '#38bdf8', alpha: 0.45 };
    if (typeof fillValue === 'string' && fillValue.startsWith('rgba')) {
      const m = fillValue.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
      if (m) {
        const hex = [m[1],m[2],m[3]].map(v => Number(v).toString(16).padStart(2,'0')).join('');
        return { hex: `#${hex}`, alpha: Number(m[4]) };
      }
    }
    return { hex: fillValue, alpha: 1 };
  };

  const applyTextPropertiesToActiveObject = ({ fill=textColor, family=fontFamily, styleOption=fontStyleOption }={}) => {
    if (!canvas) return;
    const o = canvas.getActiveObject();
    if (!o || !isTextObject(o)) return;
    const { fontStyle, fontWeight } = getFontProps(styleOption);
    o.set({ fill, fontFamily: family, fontStyle, fontWeight });
    canvas.requestRenderAll();
  };

  const applyShapePropertiesToActiveObject = ({ fill=createRgbaFill(elementFillColor, elementFillOpacity), stroke=elementStrokeColor, strokeWidth=elementStrokeWidth }={}) => {
    if (!canvas) return;
    const o = canvas.getActiveObject();
    if (!o || !isShapeObject(o)) return;
    o.set({ fill, stroke, strokeWidth });
    canvas.requestRenderAll();
  };

  useEffect(() => { if (!canvas) return; applyTextPropertiesToActiveObject(); }, [canvas, textColor, fontFamily, fontStyleOption]);
  useEffect(() => { if (!canvas) return; applyShapePropertiesToActiveObject(); }, [canvas, elementFillColor, elementStrokeColor, elementStrokeWidth]);

  useEffect(() => {
    if (!canvas) return;
    const updateText = () => {
      const o = canvas.getActiveObject();
      if (!o || !isTextObject(o)) return;
      setTextColor(o.fill || '#000000');
      setFontFamily(o.fontFamily || 'Arial');
      const b = o.fontWeight === 'bold', i = o.fontStyle === 'italic';
      setFontStyleOption(b && i ? 'bold-italic' : b ? 'bold' : i ? 'italic' : 'normal');
    };
    const resetAll = () => {
      setTextColor('#000000'); setFontFamily('Arial'); setFontStyleOption('normal');
      setElementFillColor('#38bdf8'); setElementFillOpacity(0.45);
      setElementStrokeColor('#0ea5e9'); setElementStrokeWidth(2);
    };
    const updateShape = () => {
      const o = canvas.getActiveObject();
      if (!o || !isShapeObject(o)) return;
      const { hex, alpha } = extractFillColor(o.fill);
      setElementFillColor(hex); setElementFillOpacity(alpha);
      setElementStrokeColor(o.stroke || '#0ea5e9');
      setElementStrokeWidth(o.strokeWidth || 2);
    };
    canvas.on('selection:created', () => { updateText(); updateShape(); });
    canvas.on('selection:updated', () => { updateText(); updateShape(); });
    canvas.on('selection:cleared', resetAll);
    return () => {
      canvas.off('selection:created', updateText);
      canvas.off('selection:updated', updateText);
      canvas.off('selection:cleared', resetAll);
    };
  }, [canvas]);

  function fileHandler(e) {
    if (!canvas) return;
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    FabricImage.fromURL(objectUrl).then((image) => {
      image.scale(0.5);
      image.set({ remoteSrc: null, originalFile: file });
      canvas.add(image);
      canvas.centerObject(image);
      canvas.setActiveObject(image);
    });
    e.target.value = '';
  }

  const downloadImage = () => {
    const link = document.createElement('a');
    link.download = 'photo_editor_image.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const addText = () => {
    if (!canvas) return;
    const { fontStyle, fontWeight } = getFontProps(fontStyleOption);
    const text = new IText("Edit this text", { fill: textColor, fontFamily, fontStyle, fontWeight });
    canvas.add(text);
    canvas.centerObject(text);
    canvas.setActiveObject(text);
  };

  const addShape = (type) => {
    if (!canvas) return;
    const shape = createShape(type, {
      fill: createRgbaFill(elementFillColor, elementFillOpacity),
      stroke: elementStrokeColor, strokeWidth: elementStrokeWidth,
    });
    canvas.add(shape);
    canvas.centerObject(shape);
    canvas.setActiveObject(shape);
    canvas.requestRenderAll();
    setShapeMenuOpen(false);
  };

  const [brightness, setBrightness] = useState(0);
  const handleBrightness = (e) => {
    const v = parseFloat(e.target.value);
    if (!canvas) return;
    setBrightness(v);
    applyBrightness(canvas, v);
  };

  const [contrast, setContrast] = useState(0);
  const handleContrast = (e) => {
    const v = parseFloat(e.target.value);
    if (!canvas) return;
    setContrast(v);
    applyContrast(canvas, v);
  };

  const [saturation, setSaturation] = useState(0);
  const handleSaturation = (e) => {
    const v = parseFloat(e.target.value);
    if (!canvas) return;
    setSaturation(v);
    applySaturation(canvas, v);
  };

  const [drawingMode, setDrawingMode] = useState(false);
  const toggleDrawingMode = () => {
    if (!canvas) return;
    canvas.isDrawingMode = !canvas.isDrawingMode;
    if (!canvas.freeDrawingBrush) {
      const brush = new PencilBrush(canvas);
      brush.width = 5; brush.color = color;
      canvas.freeDrawingBrush = brush;
      brushRef.current = brush;
    } else {
      canvas.freeDrawingBrush.color = color;
      if (brushRef.current) brushRef.current.color = color;
    }
    setDrawingMode(canvas.isDrawingMode);
  };

  useEffect(() => {
    if (!canvas) return;
    const brush = new PencilBrush(canvas);
    brush.width = 5; brush.color = color;
    canvas.freeDrawingBrush = brush;
    brushRef.current = brush;
    return () => { if (canvas?.freeDrawingBrush === brush) canvas.freeDrawingBrush = null; };
  }, [canvas]);

  useEffect(() => {
    if (!canvas || !brushRef.current) return;
    brushRef.current.color = color;
    canvas.freeDrawingBrush = brushRef.current;
  }, [color, canvas]);

  const removeBackground = async () => {
    if (!canvas) return;
    const activeObject = canvas.getActiveObject();
    if (!activeObject) { alert("Select an image first"); return; }
    if (activeObject.type !== 'image') { alert("Select an image object first."); return; }
    let url = activeObject.remoteSrc || activeObject.getSrc?.() || activeObject.src;
    if (!url || typeof url !== 'string') { alert("Selected image does not have a valid source."); return; }
    if (!url.startsWith('http')) {
      if (activeObject.originalFile) {
        const formData = new FormData();
        formData.append('file', activeObject.originalFile);
        formData.append('fileName', activeObject.originalFile.name);
        const response = await fetch('/api/imagekit/upload', { method: 'POST', body: formData });
        if (!response.ok) { alert('Failed to upload image for background removal.'); return; }
        const json = await response.json();
        url = json.originalImageUrl;
        activeObject.remoteSrc = url;
      } else { alert('Background removal requires a remote image URL.'); return; }
    }
    const bgRemovedUrl = `${url}${url.includes('?') ? '&' : '?'}tr=e-bgremove`;
    const newImage = await FabricImage.fromURL(bgRemovedUrl, { crossOrigin: 'anonymous' });
    const { left, top, angle, scaleX, scaleY, originX, originY } = activeObject;
    const width = activeObject.getScaledWidth();
    canvas.remove(activeObject);
    newImage.set({ left, top, angle, scaleX, scaleY, originX, originY, remoteSrc: url });
    newImage.scaleToWidth(width);
    canvas.add(newImage);
    canvas.setActiveObject(newImage);
    canvas.requestRenderAll();
  };

  const enhanceImage = async () => {
    if (!canvas) return;
    const activeObject = canvas.getActiveObject();
    if (!activeObject) { alert("Select an image first"); return; }
    if (activeObject.type !== 'image') { alert("Select an image object first."); return; }
    let url = activeObject.remoteSrc || activeObject.getSrc?.() || activeObject.src;
    if (!url || typeof url !== 'string') { alert("Selected image does not have a valid source."); return; }
    if (!url.startsWith('http')) {
      if (activeObject.originalFile) {
        const formData = new FormData();
        formData.append('file', activeObject.originalFile);
        formData.append('fileName', activeObject.originalFile.name);
        const response = await fetch('/api/imagekit/upload', { method: 'POST', body: formData });
        if (!response.ok) { alert('Failed to upload image for enhancement.'); return; }
        const json = await response.json();
        url = json.originalImageUrl;
        activeObject.remoteSrc = url;
      } else { alert('Image enhancement requires a remote image URL.'); return; }
    }
    try {
      const enhancedUrl = `${url}${url.includes('?') ? '&' : '?'}tr=e-enhance`;
      const newImage = await FabricImage.fromURL(enhancedUrl, { crossOrigin: 'anonymous' });
      const { left, top, angle, scaleX, scaleY, originX, originY } = activeObject;
      const width = activeObject.getScaledWidth();
      canvas.remove(activeObject);
      newImage.set({ left, top, angle, scaleX, scaleY, originX, originY, remoteSrc: url });
      newImage.scaleToWidth(width);
      canvas.add(newImage);
      canvas.setActiveObject(newImage);
      canvas.requestRenderAll();
    } catch {
      alert('Failed to enhance image. Please try again.');
    }
  };

  /* ─── render ──────────────────────────────────────────────── */
  return (
    <>
      {/* Google Fonts */}
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />

      <div style={S.root}>

        {/* ── Header ── */}
        <div style={S.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <button type="button" onClick={() => router.push('/dashboard')} style={S.backButton}>
              <FontAwesomeIcon icon={faArrowLeft} />
              Back to dashboard
            </button>
            <span style={S.logo}>
              Off<span style={S.logoAccent}>Image</span>
            </span>
          </div>
          <span style={{ fontSize: '11px', color: '#555', letterSpacing: '0.04em' }}>
            {project?.name || 'Untitled project'}
          </span>
        </div>

        {/* ── Media ── */}
        <Section icon="🖼" title="Media">
          <label style={{ ...S.fileInputWrap }}>
            <span style={{ fontSize: '16px' }}>＋</span>
            <span>Upload image</span>
            <input type="file" accept=".png,.jpg,.jpeg" onChange={fileHandler}
              style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }} />
          </label>
        </Section>

        {/* ── Text ── */}
        <Section icon="T" title="Text" defaultOpen={false}>
          <ActionBtn onClick={addText}>
            <FontAwesomeIcon icon={faFont} style={{ fontSize: '12px' }} />
            Add text layer
          </ActionBtn>

          <div style={S.divider} />

          <Swatch value={textColor} onChange={e => setTextColor(e.target.value)} label="Color" />

          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={S.label}>Font</span>
              <select value={fontFamily} onChange={e => setFontFamily(e.target.value)} style={S.select}>
                {['Arial','Helvetica','Georgia','Times New Roman','Courier New','Verdana'].map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={S.label}>Style</span>
              <select value={fontStyleOption} onChange={e => setFontStyleOption(e.target.value)} style={S.select}>
                <option value="normal">Regular</option>
                <option value="italic">Italic</option>
                <option value="bold">Bold</option>
                <option value="bold-italic">Bold Italic</option>
              </select>
            </div>
          </div>
        </Section>

        {/* ── Shapes ── */}
        <Section icon="◇" title="Shapes" defaultOpen={false}>
          <div style={S.shapeGrid}>
            {shapeOptions.map(opt => (
              <button key={opt.type} onClick={() => addShape(opt.type)} style={S.shapePill}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(200,255,0,0.10)'; e.currentTarget.style.borderColor = 'rgba(200,255,0,0.35)'; e.currentTarget.style.color = '#c8ff00'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)'; e.currentTarget.style.color = '#ccc'; }}>
                {opt.label}
              </button>
            ))}
          </div>

          <div style={S.divider} />

          <Swatch value={elementFillColor} onChange={e => setElementFillColor(e.target.value)} label="Fill" />
          <Slider label="Fill opacity" value={elementFillOpacity} min={0} max={1} step={0.01}
            onChange={e => setElementFillOpacity(Number(e.target.value))}
            format={v => `${Math.round(v * 100)}%`} />

          <Swatch value={elementStrokeColor} onChange={e => setElementStrokeColor(e.target.value)} label="Stroke" />
          <Slider label="Stroke width" value={elementStrokeWidth} min={1} max={20} step={1}
            onChange={e => setElementStrokeWidth(Number(e.target.value))}
            format={v => `${v}px`} />
        </Section>

        {/* ── Draw ── */}
        <Section icon="✏" title="Draw" defaultOpen={false}>
          <ActionBtn
            onClick={toggleDrawingMode}
            variant={drawingMode ? 'active' : undefined}
          >
            <FontAwesomeIcon icon={faPencil} style={{ fontSize: '12px' }} />
            {drawingMode ? 'Drawing on  —  click to stop' : 'Enable freehand draw'}
          </ActionBtn>

          {drawingMode && (
            <>
              <div style={S.divider} />
              <Swatch value={color} onChange={e => {
                const c = e.target.value;
                setColor(c);
                if (canvas?.freeDrawingBrush) canvas.freeDrawingBrush.color = c;
                if (brushRef.current) brushRef.current.color = c;
              }} label="Brush color" />
            </>
          )}
        </Section>

        {/* ── Adjustments ── */}
        <Section icon="◐" title="Adjustments" defaultOpen={false}>
          <Slider label="Brightness" value={brightness} min={-1} max={1} step={0.01}
            onChange={handleBrightness} format={v => v.toFixed(2)} />
          <Slider label="Contrast" value={contrast} min={-1} max={1} step={0.01}
            onChange={handleContrast} format={v => v.toFixed(2)} />
          <Slider label="Saturation" value={saturation} min={-1} max={1} step={0.01}
            onChange={handleSaturation} format={v => v.toFixed(2)} />

          <div style={S.divider} />

          <div style={S.grid2}>
            <ActionBtn onClick={() => applyBlur(canvas, 0.1)}>Blur</ActionBtn>
            <ActionBtn onClick={() => applyGrayscale(canvas)}>Grayscale</ActionBtn>
            <ActionBtn onClick={() => applyInvert(canvas)}>Invert</ActionBtn>
          </div>
        </Section>

        {/* ── AI Tools ── */}
        <Section icon="✦" title="AI Tools" defaultOpen={false}>
          <ActionBtn onClick={removeBackground} variant="danger">
            <span style={{ fontSize: '14px' }}>✂</span>
            Remove background
          </ActionBtn>
          <ActionBtn onClick={enhanceImage} variant="danger">
            <span style={{ fontSize: '14px' }}>✦</span>
            Enhance image
          </ActionBtn>
        </Section>

        {/* ── Export ── */}
        <div style={{ ...S.section, margin: '8px 10px 0' }}>
          <div style={{ padding: '12px 14px' }}>
            <button onClick={downloadImage} style={S.downloadBtn}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
              <FontAwesomeIcon icon={faDownload} />
              Export PNG
            </button>
          </div>
        </div>

        <div style={S.spacer} />
      </div>
    </>
  );
};

export default Toolbox;