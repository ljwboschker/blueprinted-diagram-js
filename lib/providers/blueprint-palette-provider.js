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

  console.log(blueprint);

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
    return {
      group: 'elements',
      title: element.title,
      className: element.iconClassName,
      action: {
        click: function(event) {
          const shape = elementFactory.createShape(element.shape);
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

  // const elements = {
  //   'create-shape': {
  //     group: 'elements',
  //     className: 'palette-icon-create-shape',
  //     title: 'Create Shape',
  //     action: {
  //       click: function(event) {
  //         var shape = elementFactory.createShape({
  //           width: 100,
  //           height: 80
  //         });

  //         create.start(event, shape);
  //       }
  //     }
  //   },
    // 'create-frame': {
    //   group: 'elements',
    //   className: 'palette-icon-create-frame',
    //   title: 'Create Frame',
    //   action: {
    //     click: function(event) {
    //       var shape = elementFactory.createShape({
    //         width: 300,
    //         height: 200,
    //         isFrame: true
    //       });

    //       create.start(event, shape);
    //     }
    //   }
    // }
  // };

  return {
    ...tools,
    ...seperator,
    ...elements
  };
};