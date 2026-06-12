import { Rect, Circle, Triangle, Ellipse } from 'fabric';

export const shapeOptions = [
  { type: 'rectangle', label: 'Rectangle' },
  { type: 'circle', label: 'Circle' },
  { type: 'triangle', label: 'Triangle' },
  { type: 'ellipse', label: 'Ellipse' },
];

export function createShape(type, overrides = {}) {
  const common = {
    left: 200,
    top: 150,
    originX: 'center',
    originY: 'center',
    fill: 'rgba(56, 189, 248, 0.45)',
    stroke: '#0ea5e9',
    strokeWidth: 2,
    selectable: true,
    ...overrides,
  };

  switch (type) {
    case 'rectangle':
      return new Rect({ ...common, width: 160, height: 100, rx: 8, ry: 8 });
    case 'circle':
      return new Circle({ ...common, radius: 60 });
    case 'triangle':
      return new Triangle({ ...common, width: 140, height: 120 });
    case 'ellipse':
      return new Ellipse({ ...common, rx: 90, ry: 60 });
    default:
      return new Rect({ ...common, width: 160, height: 100 });
  }
}
