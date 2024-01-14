import Overlays from 'diagram-js/lib/features/overlays/Overlays';
import { getBBox } from 'diagram-js/lib/util/Elements';
import { assignStyle } from 'min-dom';

/**
 * Position overlays on connections next to the first or last waypoint.
 */
export default class ConnectionAwareOverlays extends Overlays {
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
    const { waypoints } = overlay.element;
    super._updateOverlay(overlay);

    const translations = [];
    if (waypoints) {
      // Position overlays for connections correctly relative to the reference waypoint
      // and the direction of the connection.
      const bbox = getBBox(overlay.element);
      const waypoint = overlay.nearWaypoint === 'last'
        ? waypoints[waypoints.length - 1]
        : waypoints[0];
      const direction = this._getDirection(overlay.nearWaypoint, waypoints);

      // Position near the reference waypoint
      const deltaX = waypoint.x - bbox.x;
      const deltaY = waypoint.y - bbox.y;
      translations.push(`translateX(${deltaX}px)`);
      translations.push(`translateY(${deltaY}px)`);

      const location = `${direction} ${overlay.nearWaypoint}`;
      switch (location) {
        case 'north first':
        case 'south last':
          translations.push('translateY(-100%)');
          translations.push('translateX(5px) translateY(-5px)');
          break;
        case 'north last':
        case 'south first':
          translations.push('translateX(5px) translateY(5px)');
          break;
        case 'east last':
        case 'west first':
          translations.push('translateX(-100%)');
          translations.push('translateX(-5px) translateY(5px)');
          break;
        case 'east first':
        case 'west last':
          translations.push('translateX(5px) translateY(5px)');
          break;
        default:
          break;
      }
    } else if (overlay.align) {
      let offset;
      switch (overlay.align) {
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

    // eslint-disable-next-line no-param-reassign
    overlay.translation = translations.join(' ');
    this._applyTransformation(overlay);
  }

  _getDirection(nearWaypoint, waypoints) {
    const index = nearWaypoint === 'last'
      ? waypoints.length - 2
      : 0;

    const x = waypoints[index].x - waypoints[index + 1].x;
    const y = waypoints[index].y - waypoints[index + 1].y;

    if (x === 0) {
      return y > 0 ? 'north' : 'south';
    }
    if (y === 0) {
      return x > 0 ? 'west' : 'east';
    }

    throw new Error('Cannot determine direction of the connection.');
  }

  _applyTransformation(overlay) {
    if (overlay.translation) {
      assignStyle(overlay.htmlContainer, { transform: overlay.translation });
    }
  }
}
