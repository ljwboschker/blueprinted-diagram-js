import { create as svgCreate, innerSVG as svgInner } from 'tiny-svg';

// Create a global, dynamic stylesheet for the palette icons
const style = document.createElement('style');
style.id = 'diagramjs-icons';

document.head.appendChild(style);

const { sheet } = style;

/**
 * Clear all rules on the svg
 */
export function resetSvgIconStyles() {
  while (sheet.cssRules.length > 0) {
    sheet.deleteRule(0);
  }
}

/**
 * Create two css classes that display this element's svg as background-url:
 * .palette-{element.Type} for the palette
 * .context-pad-{element.Type} for the context pad
 *
 * @param {object} element
 * @returns name of the created css class
 */
export function createSvgIconStyle(element) {
  // Create an svg image in icon-format from the element
  const svg = svgCreate('svg', {
    viewBox: `0 0 ${element.shape.width} ${element.shape.height}`,
    width: element.shape.width,
    height: element.shape.height
  });

  const icon = element.shape.iconSvg ? element.shape.iconSvg(element.data) : element.shape.svg(element.data);
  svgInner(svg, icon);

  const svgString = new XMLSerializer().serializeToString(svg);

  // Remove any characters outside the Latin1 range and convert to base64
  const decoded = unescape(encodeURIComponent(svgString));
  const base64 = btoa(decoded);

  // Add icon class with svg as background image to stylesheet
  const imgSource = `data:image/svg+xml;base64,${base64}`;
  sheet.insertRule(`.palette-${element.type} { background-image: url(${imgSource}); }`);
  sheet.insertRule(` .context-pad-${element.type}, .context-pad-${element.type}:hover { background-image: url(${imgSource}) !important; }`);
}
