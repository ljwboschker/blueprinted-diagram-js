/**
 * Get the position for connection labels
 */
export function getConnectionMidpoint(waypoints) {
  // get the waypoints mid
  const mid = waypoints.length / 2 - 1;

  const first = waypoints[Math.floor(mid)];
  const second = waypoints[Math.ceil(mid + 0.01)];

  // get position
  const position = getWaypointsMidpoint(waypoints);

  // calculate angle
  const angle = Math.atan((second.y - first.y) / (second.x - first.x));

  const { x } = position;
  let { y } = position;

  const LABEL_INDENT = 15;
  if (Math.abs(angle) < Math.PI / 2) {
    y -= LABEL_INDENT;
  }

  return {
    x,
    y
  };
}

function getWaypointsMidpoint(waypoints) {
  const mid = waypoints.length / 2 - 1;

  const first = waypoints[Math.floor(mid)];
  const second = waypoints[Math.ceil(mid + 0.01)];

  return {
    x: first.x + (second.x - first.x) / 2,
    y: first.y + (second.y - first.y) / 2
  };
}
