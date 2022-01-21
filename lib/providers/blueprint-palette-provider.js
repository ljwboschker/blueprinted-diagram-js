import { createShape } from './create-shape';

/**
 * A palette provider that reads avaiable elements from the Blueprint module
 */
export default function BlueprintPaletteProvider(create, elementFactory, lassoTool, spaceTool, palette, blueprint) {
  this._create = create;
  this._elementFactory = elementFactory;
  this._lassoTool = lassoTool;
  this._spaceTool = spaceTool;
  this._palette = palette;
  this._blueprint = blueprint;

  palette.registerProvider(this);
}

BlueprintPaletteProvider.$inject = [
  'create',
  'elementFactory',
  'lassoTool',
  'spaceTool',
  'palette',
  'blueprint'
];

BlueprintPaletteProvider.prototype.getPaletteEntries = function getPaletteEntries() {
  const create = this._create;
  const elementFactory = this._elementFactory;
  const lassoTool = this._lassoTool;
  const spaceTool = this._spaceTool;
  const blueprint = this._blueprint;

  const tools = {
    'lasso-tool': {
      group: 'tools',
      className: 'bpmn-icon-lasso-tool',
      title: 'Select multiple elements',
      action: {
        click: function click(event) {
          lassoTool.activateSelection(event);
        }
      }
    },
    'space-tool': {
      group: 'tools',
      className: 'bpmn-icon-space-tool',
      title: 'Create space between elements',
      action: {
        click: function click(event) {
          spaceTool.activateSelection(event);
        }
      }
    }
  };

  const seperator = {
    'tool-separator': {
      group: 'tools',
      separator: true
    }
  };

  function createPaletteItem(blueprintItem) {
    return {
      group: 'elements',
      title: `Create new ${blueprintItem.title}`,
      className: `palette-${blueprintItem.type}`,
      action: {
        click: function click(event) {
          const shape = createShape(elementFactory, blueprintItem);
          create.start(event, shape);
        }
      }
    };
  }

  const elements = blueprint.elements.reduce((all, blueprintItem) => {
    const key = `create-${blueprintItem.type}`;
    // eslint-disable-next-line no-param-reassign
    all[key] = createPaletteItem(blueprintItem);
    return all;
  }, {});

  return {
    ...tools,
    ...seperator,
    ...elements
  };
};
