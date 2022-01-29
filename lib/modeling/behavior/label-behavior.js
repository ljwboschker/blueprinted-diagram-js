import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';
import inherits from 'inherits';
import TextUtil from 'diagram-js/lib/util/Text';

import { getVisibleLabelAdjustment } from './utils/label-layout-util';
import { createConnection, findBlueprint } from '../../utils/find-utils';
import { createDiagramEvent } from '../../create-diagram-event';

/**
 * A component that adds labels to a shape and a connection.
 */
export default function LabelBehavior(eventBus, blueprint, modeling, elementFactory) {
  CommandInterceptor.call(this, eventBus);

  const text = new TextUtil();

  this.postExecute(['shape.create'], (event) => {
    const { shape } = event.context;
    const blueprintShape = findBlueprint(blueprint, shape).shape;

    if (!blueprintShape.labels) return;

    blueprintShape.labels.forEach((definition) => {
      const diagramEvent = createDiagramEvent(shape);
      const data = definition.data ? definition.data(diagramEvent) : undefined;
      const content = definition.content(data);

      const label = createLabel(content, data, { ...definition.style }, { width: definition.box?.width || shape.width - 20 });
      const labelPosition = {
        x: shape.x + shape.width / 2,
        y: shape.y + definition.y
      };

      modeling.createLabel(shape, labelPosition, label);
    });
  });

  this.postExecute(['connection.create'], (event) => {
    const { source, target } = event.context;

    const connection = createConnection(blueprint, source, target);
    if (!connection?.label) return;

    const { style, box } = connection.label;

    const data = connection.label.data(createDiagramEvent(target));
    const content = connection.label.content(data);

    const label = createLabel(content, data, { ...style }, { width: box?.width || 120 });
    const labelCenter = getConnectionMidpoint(event.context.connection.waypoints);

    modeling.createLabel(event.context.connection, labelCenter, label);
  });

  function createLabel(content, data, style, box) {
    const textOptions = {
      align: 'center-top',
      fitBox: true,
      style,
      box
    };

    const dimension = text.getDimensions(content, textOptions);
    return elementFactory.createLabel({
      content,
      data,
      type: 'label',
      textOptions,
      ...dimension
    });
  }

  /**
   * Get the position for connection labels
   */
  function getConnectionMidpoint(waypoints) {
    // get the waypoints mid
    const mid = waypoints.length / 2 - 1;

    const first = waypoints[Math.floor(mid)];
    const second = waypoints[Math.ceil(mid + 0.01)];

    // get position
    const position = getWaypointsMidpoint(waypoints);

    // calculate angle
    const angle = Math.atan((second.y - first.y) / (second.x - first.x));

    let { x, y } = position;

    const LABEL_INDENT = 15;
    if (Math.abs(angle) < Math.PI / 2) {
      y -= LABEL_INDENT;
    } else {
      x += LABEL_INDENT;
    }

    return { x, y };
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

  this.postExecute(
    ['connection.layout', 'connection.updateWaypoints'],
    (event) => {
      const { label } = event.context.connection;
      if (!label) {
        return;
      }

      const labelAdjustment = getVisibleLabelAdjustment(event);

      modeling.moveShape(label, labelAdjustment);
    }
  );
}

inherits(LabelBehavior, CommandInterceptor);

LabelBehavior.$inject = ['eventBus', 'blueprint', 'modeling', 'elementFactory'];
