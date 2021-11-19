import Diagram from 'diagram-js';

import ConnectModule from 'diagram-js/lib/features/connect';
import ConnectionPreviewModule from 'diagram-js/lib/features/connection-preview';
import ContextPadModule from 'diagram-js/lib/features/context-pad';
import CreateModule from 'diagram-js/lib/features/create';
import EditorActionsModule from 'diagram-js/lib/features/editor-actions';
import GridSnappingModule from 'diagram-js/lib/features/grid-snapping';
import GridVisualsModule from 'diagram-js/lib/features/grid-snapping/visuals';
import KeyboardMoveCanvasModule from 'diagram-js/lib/navigation/keyboard-move';
import KeyboardMoveSelectionModule from 'diagram-js/lib/features/keyboard-move-selection';
import LassoTool from 'diagram-js/lib/features/lasso-tool';
import ModelingModule from 'diagram-js/lib/features/modeling';
import MoveModule from 'diagram-js/lib/features/move';
import MoveCanvasModule from 'diagram-js/lib/navigation/movecanvas';
import PaletteModule from 'diagram-js/lib/features/palette';
import ResizeModule from 'diagram-js/lib/features/resize';
import SelectionModule from 'diagram-js/lib/features/selection';
import TouchModule from 'diagram-js/lib/navigation/touch';
import ZoomScrollModule from 'diagram-js/lib/navigation/zoomscroll';

import AppKeyboardModule from './keyboard';
import ProvidersModule from './providers';

/**
 * A module that changes the default diagram look.
 */
const ElementStyleModule = {
  __init__: [
    [ 'defaultRenderer', function(defaultRenderer) {
      // override default styles
      defaultRenderer.CONNECTION_STYLE = { fill: 'none', strokeWidth: 1, stroke: '#000' };
      defaultRenderer.SHAPE_STYLE = { fill: 'white', stroke: '#000', strokeWidth: 2 };
      defaultRenderer.FRAME_STYLE = { fill: 'none', stroke: '#000', strokeDasharray: 4, strokeWidth: 2 };
    } ]
  ]
};

/**
 * Our Editor constructor
 *
 * @param { { container: Element, additionalModules?: Array<any> } } options
 *
 * @return {Diagram}
 */
export function createEditor(options) {

  const {
    container
  } = options;
  
  // Default modules provided by diagram-js
  const builtinModules = [
    ConnectModule,
    ConnectionPreviewModule,
    ContextPadModule,
    CreateModule,
    EditorActionsModule,
    GridSnappingModule,
    GridVisualsModule,
    KeyboardMoveCanvasModule,
    KeyboardMoveSelectionModule,
    LassoTool,    
    ModelingModule,
    MoveModule,
    MoveCanvasModule,
    PaletteModule,
    ResizeModule,
    SelectionModule,
    TouchModule,
    ZoomScrollModule
  ];
  
  // Modules specific for blueprinted diagrams
  const customModules = [
    AppKeyboardModule,
    ElementStyleModule,
    ProvidersModule
  ];

  const diagram = new Diagram({
    canvas: {
      container
    },
    keyboard: {
      bindTo: window.document
    },
    modules: [
      ...builtinModules,
      ...customModules
    ]
  });

  const canvas = diagram.get('canvas');
  const elementFactory = diagram.get('elementFactory');

  var root = elementFactory.createRoot();
  canvas.setRootElement(root);
}