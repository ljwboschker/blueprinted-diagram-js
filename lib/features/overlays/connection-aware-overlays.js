import Overlays from 'diagram-js/lib/features/overlays/Overlays';
import { assignStyle, attr as domAttr } from 'min-dom';

/**
 * Position overlays on connections next to the first waypoint.
 */
export default class ConnectionAwareOverlays extends Overlays {
  constructor(config, eventBus, canvas, elementRegistry) {
    super(config, eventBus, canvas, elementRegistry);

    // For connection overlays; Keep track of the waypoint to position next to.
    this._waypoint = undefined;

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
    this._setReferenceWaypoint(overlay);

    super._addOverlay(overlay);
    this._applyTransformation(overlay);
  }

  _updateOverlay(overlay) {
    this._setReferenceWaypoint(overlay);

    const { element } = overlay;
    super._updateOverlay(overlay);

    if (this._waypoint) {
      // Position overlays for connections correctly relative to the reference waypoint
      // and the direction of the connection.
      const direction = this._getDirection(element.waypoints);

      let translation = '';
      if (this._waypoint.type === 'last') {
        if (direction.x < 0) {
          translation += 'translateX(-100%) translateX(-10px)';
        } else {
          translation += 'translateX(10px)';
        }
        if (direction.y < 0) {
          translation += ' translateY(-100%) translateY(-10px)';
        } else {
          translation += ' translateY(10px)';
        }
      } else {
        if (direction.x > 0) {
          translation += 'translateX(-100%) translateX(-10px)';
        } else {
          translation += 'translateX(10px)';
        }
        if (direction.y > 0) {
          translation += ' translateY(-100%) translateY(-10px)';
        } else {
          translation += ' translateY(10px)';
        }
      }

      // eslint-disable-next-line no-param-reassign
      overlay.translation = translation;
      this._applyTransformation(overlay);
    }
  }

  _getDirection(waypoints) {
    const x = waypoints[0].x - waypoints[1].x;
    const y = waypoints[0].y - waypoints[1].y;
    return { x, y };
  }

  _setReferenceWaypoint(overlay) {
    const { waypoints } = overlay.element;

    if (waypoints) {
      this._waypoint = overlay.nearWaypoint === 'last'
        ? { ...waypoints[waypoints.length - 1], type: overlay.nearWaypoint }
        : { ...waypoints[0], type: overlay.nearWaypoint };
    } else {
      this._waypoint = undefined;
    }
  }

  _updateOverlayContainer(container) {
    const { html, element } = container;
    if (this._waypoint) {
      // Position overlays for connections near the first waypoint
      const { x, y } = this._waypoint;

      assignStyle(html, { left: `${x}px`, top: `${y}.px` });
      domAttr(html, 'data-container-id', element.id);
    } else {
      super._updateOverlayContainer(container);
    }
  }

  _applyTransformation(overlay) {
    if (overlay.translation) {
      // We need to re-apply the translation because the parent Overlays class resets it :(
      assignStyle(overlay.htmlContainer, { transform: overlay.translation });
    }
  }
}
