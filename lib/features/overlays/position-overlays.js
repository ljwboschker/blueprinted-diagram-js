import Overlays from 'diagram-js/lib/features/overlays/Overlays';
import { assignStyle } from 'min-dom';
import { getAlignTranslations } from './align-translations';
import { getWaypointTranslations } from './connection-aware-translations';

/**
 * Position overlays based on configuration.
 */
export default class PositionOverlays extends Overlays {
  constructor(config, eventBus, canvas, elementRegistry) {
    super(config, eventBus, canvas, elementRegistry);

    eventBus.on('canvas.viewbox.changed', () => {
      Object
        .values(this._overlays)
        .filter((overlay) => overlay.translation !== undefined)
        .forEach((overlay) => {
          this._applyTransformation(overlay);
        });
    });
  }

  _addOverlay(overlay) {
    super._addOverlay(overlay);
    this._applyTransformation(overlay);
  }

  _updateOverlay(overlay) {
    super._updateOverlay(overlay);

    let translations = [];
    switch (overlay.position.type) {
      case 'aligned':
        translations = getAlignTranslations(overlay);
        break;
      case 'waypoint':
        translations = getWaypointTranslations(overlay);
        break;
      default:
        break;
    }

    // eslint-disable-next-line no-param-reassign
    overlay.translation = translations.join(' ');
    this._applyTransformation(overlay);
  }

  _applyTransformation(overlay) {
    if (overlay.translation) {
      assignStyle(overlay.htmlContainer, { transform: overlay.translation });
    }
  }
}
