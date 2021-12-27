import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';
import inherits from 'inherits';
import TextUtil from 'diagram-js/lib/util/Text';

import { getVisibleLabelAdjustment } from './utils/label-layout-util';
import { findBlueprint, findConnectionRule } from '../../utils/find-utils';

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
      const content = blueprintShape.label ? blueprintShape.label(shape.data, definition.key) : 'Undefined';
      const label = createLabel(definition.key, content, { ...definition.style }, { width: shape.width - 20 });
      const labelPosition = {
        x: shape.x + shape.width / 2,
        y: shape.y + definition.y
      };

      modeling.createLabel(shape, labelPosition, label);
    });
  });

  this.postExecute(['connection.create'], (event) => {
    const { connection, source, target } = event.context;

    const rule = findConnectionRule(blueprint, source, target);
    if (!rule) throw new Error('Connection rule to target not found.');

    const label = createLabel(rule.label.key, rule.label.text, { ...rule.label.textOptions.style }, { ...rule.label.textOptions.box });
    const labelCenter = getConnectionMidpoint(connection.waypoints);

    modeling.createLabel(connection, labelCenter, label);
  });

  function createLabel(key, content, style, box) {
    const textOptions = {
      align: 'center-top',
      fitBox: true,
      style,
      box
    };

    const dimension = text.getDimensions(content, textOptions);
    return elementFactory.createLabel({
      key,
      content,
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
