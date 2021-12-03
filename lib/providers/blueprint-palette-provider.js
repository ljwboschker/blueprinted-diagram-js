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


BlueprintPaletteProvider.prototype.getPaletteEntries = function() {
  var create = this._create,
      elementFactory = this._elementFactory,
      lassoTool = this._lassoTool,
      spaceTool = this._spaceTool,
      blueprint = this._blueprint;

  const tools = {
    'lasso-tool': {
      group: 'tools',
      className: 'bpmn-icon-lasso-tool',
      title: 'Select multiple elements',
      action: {
        click: function(event) {
          lassoTool.activateSelection(event);
        }
      }
    },
    'space-tool': {
      group: 'tools',
      className: 'bpmn-icon-space-tool',
      title: 'Create space between elements',
      action: {
        click: function(event) {
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

  function createPaletteItem(element) {
    return {
      group: 'elements',
      title: element.title,
      className: `palette-${element.type}`,
      action: {
        click: function(event) {
          const shape = createShape(elementFactory, element);
          create.start(event, shape);
        }
      }
    };
  }

  const elements = blueprint.elements.reduce((all, element) => {
    const key = `create-${element.type}`;
    all[key] = createPaletteItem(element);
    return all;
  }, {});

  return {
    ...tools,
    ...seperator,
    ...elements
  };
};