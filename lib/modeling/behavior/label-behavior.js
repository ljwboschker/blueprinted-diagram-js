import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';
import TextUtil from 'diagram-js/lib/util/Text';

import { getVisibleLabelAdjustment } from './utils/label-layout-util';
import { findConnectionRule, findBlueprint } from '../../utils/find-utils';
import { calculatePositionInShape, repositionInShape } from './utils/label-alignment-util';
import { getConnectionMidpoint } from './utils/connection-utils';

export default class LabelBehavior extends CommandInterceptor {
  constructor(eventBus, blueprint, modeling, elementFactory) {
    super(eventBus);
    this._blueprint = blueprint;
    this._modeling = modeling;
    this._elementFactory = elementFactory;

    this._textUtil = new TextUtil();

    this.postExecute(['shape.create'], (event) => this._createShapeLabel(event));
    this.postExecute(['shape.resize'], (event) => this._moveShapeLabel(event));
    this.postExecute(['connection.create'], (event) => this._createConnectionLabel(event));
    this.postExecute(['connection.layout', 'connection.updateWaypoints'], (event) => this._moveConnectionLabel(event));
  }

  _createShapeLabel(event) {
    const { shape } = event.context;
    const blueprintShape = findBlueprint(this._blueprint, shape).shape;

    if (!blueprintShape.labels) return;

    const data = shape.data;
    blueprintShape.labels.forEach((definition) => {
      const content = definition.content(definition.key, data);

      const textOptions = {
        ...definition.textOptions
      };
      const position = {
        ...definition.position
      };

      const dimension = this._textUtil.getDimensions(content, textOptions);
      textOptions.box.height = dimension.height;

      const label = this._elementFactory.createLabel({
        key: definition.key,
        content,
        type: 'label',
        textOptions,
        position,
        ...dimension
      });

      const labelPosition = calculatePositionInShape(shape, label);
      this._modeling.createLabel(shape, labelPosition, label);
    });
  }

  _moveShapeLabel(event) {
    const { shape, oldBounds, newBounds } = event.context;

    if (shape.type === 'label') {
      shape.textOptions.box.width = newBounds.width;
      shape.textOptions.box.height = newBounds.height;
    } else if (shape.type === 'shape') {
      shape.labels?.forEach((label) => this._modeling.moveShape(label, repositionInShape(label, oldBounds, newBounds)));
    }
  }

  _createConnectionLabel(event) {
    const { source, connection } = event.context;

    const connectionRule = findConnectionRule(this._blueprint, source);
    const labelDefinition = connectionRule?.label;
    if (!labelDefinition) return;

    const textOptions = {
      ...labelDefinition.textOptions,
      align: 'center'
    };

    const key = labelDefinition.key;
    const data = connection.data;
    const content = labelDefinition.content(key, data);

    const dimension = this._textUtil.getDimensions(content, textOptions);
    textOptions.box.height = dimension.height;

    const label = this._elementFactory.createLabel({
      content,
      key,
      type: 'label',
      textOptions,
      ...dimension
    });

    const connectionMidpoint = getConnectionMidpoint(connection.waypoints);

    // A magic number, but otherwise the labels are positioned a bit off on vertical connections.
    const labelPosition = {
      x: connectionMidpoint.x - (textOptions.box.width) / 2,
      y: connectionMidpoint.y - (textOptions.box.height / 2),
      width: textOptions.box.width
    };
    this._modeling.createLabel(connection, labelPosition, label);
  }

  _moveConnectionLabel(event) {
    const { label } = event.context.connection;
    if (!label) {
      return;
    }

    const labelAdjustment = getVisibleLabelAdjustment(event);

    this._modeling.moveShape(label, labelAdjustment);
  }
}

LabelBehavior.$inject = ['eventBus', 'blueprint', 'modeling', 'elementFactory'];
