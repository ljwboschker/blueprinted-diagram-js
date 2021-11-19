import Diagram from 'diagram-js';

import BendpointsModule from 'diagram-js/lib/features/bendpoints'
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
import SnappingModule from 'diagram-js/lib/features/snapping';
import TouchModule from 'diagram-js/lib/navigation/touch';
import ZoomScrollModule from 'diagram-js/lib/navigation/zoomscroll';

import AppKeyboardModule from './keyboard';
import AppModelingModule from './modeling';
import DrawModule from './draw';
import ProvidersModule from './providers';

import addProjectLogo from './license';

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
    BendpointsModule,
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
    SnappingModule,
    TouchModule,
    ZoomScrollModule
  ];
  
  // Modules specific for blueprinted diagrams
  const customModules = [
    AppKeyboardModule,
    AppModelingModule,
    DrawModule,
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
  const eventBus = diagram.get('eventBus');

  var root = elementFactory.createRoot();
  canvas.setRootElement(root);

  addProjectLogo(container);

  // This attaches the diagram to the DOM
  eventBus.fire('attach');
}