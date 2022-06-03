import Overlays from 'diagram-js/lib/features/overlays/Overlays';
import { assignStyle, attr as domAttr } from 'min-dom';

/**
 * Position overlays on connections next to the first waypoint.
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
    if (overlay.element.waypoints) {
      // This is a connection overlay; remove any manual position settings.
      // eslint-disable-next-line no-param-reassign
      overlay.position = {};
    }

    super._addOverlay(overlay);
    this._applyTransformation(overlay);
  }

  _updateOverlayContainer(container) {
    const { html, element } = container;
    if (element.waypoints) {
      // Position overlays for connections near the first waypoint
      const { x, y } = element.waypoints[0];

      assignStyle(html, { left: `${x}px`, top: `${y}.px` });
      domAttr(html, 'data-container-id', element.id);
    } else {
      super._updateOverlayContainer(container);
    }
  }

  _updateOverlay(overlay) {
    const { element } = overlay;
    super._updateOverlay(overlay);

    if (element.waypoints) {
      // Position overlays for connections correctly relative to the first waypoint
      // and the direction of the connection.
      const diffX = element.waypoints[0].x - element.waypoints[1].x;
      const diffY = element.waypoints[0].y - element.waypoints[1].y;

      let translation = '';
      if (diffX > 0) {
        translation += 'translateX(-100%) translateX(-10px)';
      } else {
        translation += 'translateX(10px)';
      }
      if (diffY > 0) {
        translation += 'translateY(-100%) translateY(-10px)';
      } else {
        translation += 'translateY(10px)';
      }

      // eslint-disable-next-line no-param-reassign
      overlay.translation = translation;
      this._applyTransformation(overlay);
    }
  }

  _applyTransformation(overlay) {
    if (overlay.translation) {
      // We need to re-apply the translation because the parent Overlays class resets it :(
      assignStyle(overlay.htmlContainer, { transform: overlay.translation });
    }
  }
}
