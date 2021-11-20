import {
  create as svgCreate,
  innerSVG as svgInner
} from 'tiny-svg';

// Create a global, dynamic stylesheet for the palette icons
const style = document.createElement('style');
style.appendChild(document.createTextNode(''));

document.head.appendChild(style);

const sheet = style.sheet;

/**
 * Create a css class with the element's shape as background-url,
 * to be used in the palette. 
 * 
 * @param {object} element
 * @returns name of the created css class
 */
export function createSvgIconStyle(element) {
  // Create an svg image in icon-format from the element
  const svg = svgCreate('svg', {
    viewBox: element.shape.viewBox,
    width: element.shape.width,
    height: element.shape.height
  });
  svgInner(svg, element.shape.svg);

  const svgString = new XMLSerializer().serializeToString(svg);

  // Remove any characters outside the Latin1 range and convert to base64
  const decoded = unescape(encodeURIComponent(svgString));
  const base64 = btoa(decoded);
    
  // Add icon class with svg as background image to stylesheet
  const imgSource = `data:image/svg+xml;base64,${base64}`;
  const className = `palette-icon-${element.type}`;
  sheet.insertRule(`.${className} { background-image: url(${imgSource}) }`);

  return className;
}
