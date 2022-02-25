/* eslint-disable no-unused-vars */
export function calculatePositionInShape(shape, label, position) {
  const align = parseAlign(position.alignment);
  const x = positioning[align.horizontal](shape, label) + (position.offset?.x || 0);
  const y = positioning[align.vertical](shape, label) + (position.offset?.y || 0);

  return {
    x,
    y,
    width: label.textOptions.box.width
  };
}

export function parseAlign(align) {
  const parts = align.split('-');
  if (parts.length !== 2) throw new Error(`Invalid textOptions.align value '${align}'.`);

  return {
    horizontal: parts[0],
    vertical: parts[1]
  };
}

const positioning = {
  left: (shape, label) => shape.x,
  center: (shape, label) => shape.x + (shape.width - label.textOptions.box.width) / 2,
  right: (shape, label) => shape.x + (shape.width - label.textOptions.box.width),
  top: (shape, label) => shape.y,
  middle: (shape, label) => shape.y + (shape.height - label.height) / 2,
  bottom: (shape, label) => shape.y + (shape.height - label.height)
};
