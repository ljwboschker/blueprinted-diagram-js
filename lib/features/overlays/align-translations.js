/**
 * Add translations to align the overlay as specified. This resets left and right positioning settings of the overlay.
 *
 * @param overlay
 * @param translations any applicable translations are added to this array.
 */
export function getAlignTranslations(overlay, translations) {
  if (overlay.position.type !== 'aligned') {
    return;
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

  translations.push(`translateX(${offset}px)`);
}
