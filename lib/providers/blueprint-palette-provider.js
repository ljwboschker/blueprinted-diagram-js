import { createSvgIconStyle } from "./create-svg-icon-style";

/**
 * A palette provider that reads avaiable elements from the Blueprint module
 */
 export default function BlueprintPaletteProvider(create, elementFactory, lassoTool, palette, blueprint) {
  this._create = create;
  this._elementFactory = elementFactory;
  this._lassoTool = lassoTool;
  this._palette = palette;
  this._blueprint = blueprint;

  palette.registerProvider(this);
}

BlueprintPaletteProvider.$inject = [
  'create',
  'elementFactory',
  'lassoTool',
  'palette',
  'blueprint'
];


BlueprintPaletteProvider.prototype.getPaletteEntries = function() {
  var create = this._create,
      elementFactory = this._elementFactory,
      lassoTool = this._lassoTool,
      blueprint = this._blueprint;

  const tools = {
    'lasso-tool': {
      group: 'tools',
      className: 'palette-icon-lasso-tool',
      title: 'Activate Lasso Tool',
      action: {
        click: function(event) {
          lassoTool.activateSelection(event);
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
    const className = createSvgIconStyle(element);

    return {
      group: 'elements',
      title: element.title,
      className,
      action: {
        click: function(event) {
          const shape = elementFactory.createShape({ type: element.type, ...element.shape });
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