import react from 'react';
import { Button } from '@/components/ui/button';
import { Image as FabricImage, IText, PencilBrush } from 'fabric';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faFont, faPencil, faDownload } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from 'react';
import { applyBrightness, applyContrast, applyBlur, applyGrayscale, applyInvert, applySaturation } from '@/lib/filters';
const Toolbox = ({ canvas, project }) => {
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
      canvas.requestRenderAll();
      URL.revokeObjectURL(objectUrl);
    });

    e.target.value = '';
  }
  const downloadImage = () => {
    const link = document.createElement('a');
    link.download = 'photo_editor_image.png';
    link.href = canvas.toDataURL();
    link.click();
  }
  const addText = () => {
    if (!canvas) return;
    const text = new IText("Edit this text");
    canvas.add(text);
    canvas.centerObject(text);
    canvas.setActiveObject(text);
  }
  // const brightSlider= document.getElementById("brightnessSlider");
  const [brightness, setBrightness] = useState(0);

  const handleBrightness = (e) => {
    const value = parseFloat(e.target.value);
    if (!canvas) return;

    setBrightness(value);
    applyBrightness(canvas, value);
  };
  const [contrast, setContrast] = useState(0);
  const handleContrast = (e) => {
    const value = parseFloat(e.target.value);
    if (!canvas) return;

    setContrast(value);
    applyContrast(canvas, value);
  }
  const [saturation, setSaturation] = useState(0);
  const handleSaturation = (e) => {
    const value = parseFloat(e.target.value);
    if (!canvas) return;

    setSaturation(value);
    applySaturation(canvas, value);
  }



  const [drawingMode, setDrawingMode] = useState(false);
  const toggleDrawingMode = () => {
    if (!canvas) return;
    canvas.isDrawingMode = !canvas.isDrawingMode;
    setDrawingMode(canvas.isDrawingMode);
  }

  useEffect(() => {
    if (!canvas) return;
    const brush = new PencilBrush(canvas);
    brush.width = 5;
    brush.color = "#000000";
    canvas.freeDrawingBrush = brush;
  }, [canvas]);
  const removeBackground = async () => {
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();
    if (!activeObject) {
      alert("Select an image first");
      return;
    }

    if (activeObject.type !== 'image') {
      alert("Select an image object first.");
      return;
    }

    let url = activeObject.remoteSrc || activeObject.getSrc?.() || activeObject.src;
    if (!url || typeof url !== 'string') {
      alert("Selected image does not have a valid source.");
      return;
    }

    if (!url.startsWith('http')) {
      if (activeObject.originalFile) {
        const formData = new FormData();
        formData.append('file', activeObject.originalFile);
        formData.append('fileName', activeObject.originalFile.name);

        const response = await fetch('/api/imagekit/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          alert('Failed to upload image for background removal.');
          return;
        }

        const json = await response.json();
        url = json.originalImageUrl;
        activeObject.remoteSrc = url;
      } else {
        alert('Background removal requires a remote image URL. Upload the image first.');
        return;
      }
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



  return (
    <div className="toolbox">
      <Button title="Add image">
        <FontAwesomeIcon icon={faImage} />
        <input
          type="file"
          accept=".png, .jpg, .jpeg"
          onChange={fileHandler} />
      </Button>
      <Button title="Add text" onClick={addText}>
        <FontAwesomeIcon icon={faFont} />
      </Button>
      <Button title="Toggle Drawing Mode" onClick={toggleDrawingMode}>
        {drawingMode ? "Disable Drawing" : "Enable Drawing"}
        <FontAwesomeIcon icon={faPencil} />
      </Button>
      <label>Brightness: {brightness}</label>

      <input
        type="range"
        min="-1"
        max="1"
        step="0.01"
        value={brightness}
        onChange={handleBrightness}
      />
      <label>Contrast: {contrast}</label>
      <input
        type="range"
        min="-1"
        max="1"
        step="0.01"
        value={contrast}
        onChange={handleContrast}
      />
      <Button title="Blur" onClick={() => applyBlur(canvas, 0.1)}>
        Blur
      </Button>
      <Button title="Grayscale" onClick={() => applyGrayscale(canvas)}>
        Grayscale
      </Button>
      <Button title="Invert" onClick={() => applyInvert(canvas)}>
        Invert
      </Button>
      <label>Saturation: {saturation}</label>

      <input
        type="range"
        min="-1"
        max="1"
        step="0.01"
        value={saturation}
        onChange={handleSaturation}
      />
      <Button
        title="Remove Background"
        onClick={removeBackground}
      >
        Remove Background
      </Button>
      <Button title="Download as image" onClick={downloadImage}>
        <FontAwesomeIcon icon={faDownload} />
      </Button>


    </div>

  )
}
export default Toolbox;