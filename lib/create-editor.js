import Diagram from 'diagram-js';

import BendpointsModule from 'diagram-js/lib/features/bendpoints';
import ConnectModule from 'diagram-js/lib/features/connect';
import ConnectionPreviewModule from 'diagram-js/lib/features/connection-preview';
import ContextPadModule from 'diagram-js/lib/features/context-pad';
import CreateModule from 'diagram-js/lib/features/create';
import EditorActionsModule from 'diagram-js/lib/features/editor-actions';
import GridSnappingModule from 'diagram-js/lib/features/grid-snapping';
import GridVisualsModule from 'diagram-js/lib/features/grid-snapping/visuals';
import InteractionEventsModule from 'diagram-js/lib/features/interaction-events';
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
import SpaceToolModule from 'diagram-js/lib/features/space-tool';
import TouchModule from 'diagram-js/lib/navigation/touch';
import ZoomScrollModule from 'diagram-js/lib/navigation/zoomscroll';


import AppKeyboardModule from './keyboard';
import AppModelingModule from './modeling';
import DirectEditingModule from './direct-editing';
import DrawModule from './draw';
import ProvidersModule from './providers';

import addProjectLogo from './license';

import { deepClone } from './utils/deep-clone';
import { createSvgIconStyle } from './providers/create-svg-icon-style';
import { loadShapes } from './load-shapes';

export function createDiagramEditor(container, blueprint) {

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
    InteractionEventsModule,
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
    SpaceToolModule,
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

  // Register css rules to style the palette and contextpad for blueprint elements
  blueprint.elements.forEach(element => createSvgIconStyle(element));

  // Create the diagram
  const canvas = diagram.get('canvas');
  const elementFactory = diagram.get('elementFactory');
  const elementRegistry = diagram.get('elementRegistry');

  var root = elementFactory.createRoot();
  canvas.setRootElement(root);

  // I read to the license!
  addProjectLogo(container);

  const eventBus = diagram.get('eventBus');

  // This attaches the diagram to the DOM
  eventBus.fire('attach');

  const editor = {
    setViewbox(viewbox) {
      canvas.viewbox({
        x: viewbox.x,
        y: viewbox.y,
        width: viewbox.width,
        height: viewbox.height
      });
    },
    load(elements) {
      loadShapes(blueprint, elements, canvas, elementRegistry, elementFactory);
    },
    onElementChange(callback) {
      eventBus.on(['shape.changed', 'connection.changed'], event => callback(stripElement(event.element)));
    },
    onElementRemove(callback) {
      eventBus.on(['shape.remove', 'connection.remove'], event => callback(event.element.id));
    },
    onElementDoubleClick(callback) {
      eventBus.on('element.dblclick', event => callback(event.element));
    },
    onCanvasMove(callback) {
      eventBus.on('canvas.moved', event => callback(event));
    }
  };
  
  return editor;
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
