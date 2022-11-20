import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';
import inherits from 'inherits';
import TextUtil from 'diagram-js/lib/util/Text';

import { getVisibleLabelAdjustment } from './utils/label-layout-util';
import { findConnectionRule, findBlueprint } from '../../utils/find-utils';
import { createDiagramEvent } from '../../create-diagram-event';
import { calculatePositionInShape, repositionInShape } from './utils/label-alignment-util';

/**
 * A component that adds labels to a shape and a connection.
 */
export default function LabelBehavior(eventBus, blueprint, modeling, elementFactory) {
  CommandInterceptor.call(this, eventBus);

  const textUtil = new TextUtil();

  this.postExecute(['shape.create'], (event) => {
    const { shape } = event.context;
    const blueprintShape = findBlueprint(blueprint, shape).shape;

    if (!blueprintShape.labels) return;

    blueprintShape.labels.forEach((definition) => {
      const diagramEvent = createDiagramEvent(shape);
      const data = definition.data ? definition.data(diagramEvent) : undefined;
      const content = definition.content(data);

      const textOptions = {
        ...definition.textOptions
      };
      const position = {
        ...definition.position
      };

      const dimension = textUtil.getDimensions(content, textOptions);
      textOptions.box.height = dimension.height;

      const label = elementFactory.createLabel({
        content,
        data,
        type: 'label',
        textOptions,
        position,
        ...dimension
      });

      const labelPosition = calculatePositionInShape(shape, label);
      modeling.createLabel(shape, labelPosition, label);
    });
  });

  this.postExecute(['connection.create'], (event) => {
    const { source, connection } = event.context;

    const labelDefinition = findConnectionRule(blueprint, source)?.label;
    if (!labelDefinition) return;

    const textOptions = {
      ...labelDefinition.textOptions,
      align: 'center'
    };

    const data = labelDefinition.data ? labelDefinition.data(createDiagramEvent(connection)) : undefined;
    const content = labelDefinition.content(data);

    const dimension = textUtil.getDimensions(content, textOptions);
    textOptions.box.height = dimension.height;

    const label = elementFactory.createLabel({
      content,
      data,
      type: 'label',
      textOptions,
      ...dimension
    });

    const connectionMidpoint = getConnectionMidpoint(event.context.connection.waypoints);

    const labelPosition = {
      x: connectionMidpoint.x - (textOptions.box.width / 2),
      y: connectionMidpoint.y - (textOptions.box.height / 2),
      width: textOptions.box.width
    };
    modeling.createLabel(event.context.connection, labelPosition, label);
  });

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

  this.postExecute(
    ['shape.resize'],
    (event) => {
      const { shape, oldBounds, newBounds } = event.context;

      if (shape.type === 'label') {
        shape.textOptions.box.width = newBounds.width;
        shape.textOptions.box.height = newBounds.height;
      } else if (shape.type === 'shape') {
        shape.labels?.forEach((label) => modeling.moveShape(label, repositionInShape(label, oldBounds, newBounds)));
      }
    }
  );
}

inherits(LabelBehavior, CommandInterceptor);

LabelBehavior.$inject = ['eventBus', 'blueprint', 'modeling', 'elementFactory'];
