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
import LabelSupportModule from 'diagram-js/lib/features/label-support';
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
import DirectEditingModule from './direct-editing';
import DrawModule from './draw';
import ProvidersModule from './providers';

import addProjectLogo from './license';

import { deepClone } from './utils/deep-clone';

export function createEditor(options) {

  const {
    container,
    blueprint
  } = options;

  const BlueprintModule = {
    __init__: ['blueprint'],
    blueprint: ['value', blueprint]
  };

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
    LabelSupportModule,
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
    BlueprintModule,
    DirectEditingModule,
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

  const {
    elementChanged,
    elementRemoved
  } = options;

  if (elementChanged) {
    eventBus.on(['shape.changed', 'connection.changed'], event => elementChanged(stripElement(event.element)));
  }
  if (elementRemoved) {
    eventBus.on(['shape.remove', 'connection.remove'], event => elementRemoved(event.element.id));
  }

  // This attaches the diagram to the DOM
  eventBus.fire('attach');
}

function stripElement(element) {
  // Create a stripped object without internal properties and functions
  const { children, labels, svg, viewBox, ...stripped } = element;
  const strippedElement = deepClone(stripped);

  switch (element.type) {
    case 'connection':
      return {
        id: element.id,
        parentId: element.parent.id,
        element: strippedElement,
        sourceId: element.source.id,
        targetId: element.target.id
      };
    case 'label':
      return {
        id: element.id,
        parentId: element.parent.id,
        element: strippedElement,
        labelTargetId: element.labelTarget.id
      };
    default:
      return {
        id: element.id,
        parentId: element.parent.id,
        element: strippedElement
      };
  }
}
