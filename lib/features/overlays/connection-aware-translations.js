import { getBBox } from 'diagram-js/lib/util/Elements';

/**
 * Position overlays on connections next to the first or last waypoint.
 */
export function getConnectionAwareTranslations(overlay, translations) {
  if (overlay.position.type !== 'connection' || !overlay.element.waypoints) {
    return;
  }

  const bbox = getBBox(overlay.element);
  const { waypoints } = overlay.element;
  const nearWaypoint = overlay.position.nearWaypoint || 'first';

  const waypoint = nearWaypoint === 'last'
    ? waypoints[waypoints.length - 1]
    : waypoints[0];

  // Position near the reference waypoint
  const deltaX = waypoint.x - bbox.x;
  const deltaY = waypoint.y - bbox.y;
  translations.push(`translateX(${deltaX}px)`);
  translations.push(`translateY(${deltaY}px)`);

  const direction = _getDirection(nearWaypoint, waypoints);
  const location = `${direction} ${nearWaypoint}`;
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
}

function _getDirection(nearWaypoint, waypoints) {
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
