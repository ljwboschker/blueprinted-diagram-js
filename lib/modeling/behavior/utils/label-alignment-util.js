/* eslint-disable no-unused-vars */
export function calculatePositionInShape(shape, label) {
  const align = parseAlign(label.position.anchor);
  const x = positioning[align.horizontal](shape, label) + (label.position.offset?.x || 0);
  const y = positioning[align.vertical](shape, label) + (label.position.offset?.y || 0);

  return {
    x,
    y,
    width: label.textOptions.box.width
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

export function repositionInShape(label, oldBounds, newBounds) {
  const align = parseAlign(label.position.anchor);

  const x = reposition[align.horizontal](oldBounds, newBounds);
  const y = reposition[align.vertical](oldBounds, newBounds);

  return {
    x,
    y
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

const reposition = {
  left: (oldBounds, newBounds) => newBounds.x - oldBounds.x,
  center: (oldBounds, newBounds) => (newBounds.x === oldBounds.x ? newBounds.width - oldBounds.width : newBounds.x - oldBounds.x) / 2,
  right: (oldBounds, newBounds) => (newBounds.x + newBounds.width) - (oldBounds.x + oldBounds.width),
  top: (oldBounds, newBounds) => newBounds.y - oldBounds.y,
  middle: (oldBounds, newBounds) => (newBounds.y === oldBounds.y ? newBounds.height - oldBounds.height : newBounds.y - oldBounds.y) / 2,
  bottom: (oldBounds, newBounds) => (newBounds.y + newBounds.height) - (oldBounds.y + oldBounds.height)
};
