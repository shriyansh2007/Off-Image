import { filters } from 'fabric';

const ensureFilters = (obj) => {
  if (!obj.filters) obj.filters = [];
};

export const applyBrightness = (canvas, value) => {
  const obj = canvas.getActiveObject();

  if (!obj) return;
  ensureFilters(obj);

  obj.filters[0] = new filters.Brightness({
    brightness: value
  });

  obj.applyFilters();
  canvas.renderAll();
};

export const applyContrast = (canvas, value) => {
  const obj = canvas.getActiveObject();

  if (!obj) return;
  ensureFilters(obj);

  obj.filters[1] = new filters.Contrast({
    contrast: value
  });

  obj.applyFilters();
  canvas.renderAll();
};

export const applyBlur = (canvas, value) => {
  const obj = canvas.getActiveObject();

  if (!obj) return;
  ensureFilters(obj);

  obj.filters[2] = new filters.Blur({
    blur: value
  });

  obj.applyFilters();
  canvas.renderAll();
};

export const applyGrayscale = (canvas) => {
  const obj = canvas.getActiveObject();

  if (!obj) return;
  ensureFilters(obj);

  obj.filters[3] = new filters.Grayscale();

  obj.applyFilters();

  canvas.renderAll();
};

export const applyInvert=(canvas)=>{
    const obj= canvas.getActiveObject();
    if(!obj) return;
    ensureFilters(obj);
    obj.filters[4]= new filters.Invert();
    obj.applyFilters();
    canvas.renderAll();
}

export const applySaturation=(canvas, value)=>{
    const obj= canvas.getActiveObject();
    if(!obj) return;
    ensureFilters(obj);
    obj.filters[5]= new filters.Saturation({
        saturation: value
    });
    obj.applyFilters();
    canvas.renderAll();

}

const applySepia=(canvas)=>{
    const obj= canvas.getActiveObject();
    if(!obj) return;
    ensureFilters(obj);
    obj.filters[6]= new filters.Sepia();
    obj.applyFilters();
    canvas.renderAll();
}
