/**
 * Add translations to align the overlay as specified. This resets left and right positioning settings of the overlay.
 *
 * @param overlay
 * @returns array with translations to apply
 */
export function getAlignTranslations(overlay) {
  if (overlay.position.type !== 'aligned') {
    return [];
  }

  let offset;
  switch (overlay.position.align) {
    case 'center':
      offset = (overlay.element.width - overlay.htmlContainer.clientWidth) / 2;
      break;
    case 'right':
      offset = overlay.element.width - overlay.htmlContainer.clientWidth;
      break;
    default:
      offset = 0;
      break;
  }

  return [`translateX(${offset}px)`];
}
