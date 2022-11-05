import { innerSVG } from 'tiny-svg';
import { query as domQuery } from 'min-dom';

export function saveSvg(canvas) {
  const contentNode = canvas.getActiveLayer();
  const defsNode = domQuery('defs', canvas._svg);

  const contents = innerSVG(contentNode);
  const defs = defsNode ? `<defs>${innerSVG(defsNode)}</defs>` : '';
  const bbox = contentNode.getBBox();

  const svg = `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1"
  width="${bbox.width}" height="${bbox.height}"
  viewBox="${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}">
  <style>
    text { font-family: sans-serif }
  </style>
  ${defs}
  ${contents}
</svg>`;

  return svg;
}
