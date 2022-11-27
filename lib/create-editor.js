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
import MoveModule from 'diagram-js/lib/features/move';
import MoveCanvasModule from 'diagram-js/lib/navigation/movecanvas';
import PaletteModule from 'diagram-js/lib/features/palette';
import PopupMenuModule from 'diagram-js/lib/features/popup-menu';
import ResizeModule from 'diagram-js/lib/features/resize';
import SelectionModule from 'diagram-js/lib/features/selection';
import SnappingModule from 'diagram-js/lib/features/snapping';
import SpaceToolModule from 'diagram-js/lib/features/space-tool';
import TouchModule from 'diagram-js/lib/navigation/touch';
import ZoomScrollModule from 'diagram-js/lib/navigation/zoomscroll';

import AlignToOrigin from './features/align-to-origin';
import AppKeyboardModule from './keyboard';
import AppModelingModule from './modeling';
import BlueprintAutoResizeModule from './features/auto-resize';
import DrawModule from './draw';
import DirectEditingModule from './features/direct-editing';
import OverlaysModule from './features/overlays';
import ProvidersModule from './providers';

import { resetSvgIconStyles, createSvgIconStyle } from './providers/create-svg-icon-style';
import { createShape } from './providers/create-shape';
import { loadItems } from './load-items';
import { createDiagramEvent } from './create-diagram-event';
import { saveSvg } from './utils/save-svg';

export function createDiagramEditor(container, blueprint) {
  const BlueprintModule = {
    __init__: ['blueprint'],
    blueprint: ['value', blueprint],
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
    MoveModule,
    MoveCanvasModule,
    OverlaysModule,
    PaletteModule,
    PopupMenuModule,
    ResizeModule,
    SelectionModule,
    SnappingModule,
    SpaceToolModule,
    TouchModule,
    ZoomScrollModule
  ];

  // Modules specific for blueprinted diagrams
  const customModules = [
    AlignToOrigin,
    AppKeyboardModule,
    AppModelingModule,
    BlueprintModule,
    BlueprintAutoResizeModule,
    DrawModule,
    DirectEditingModule,
    ProvidersModule,
  ];

  const diagram = new Diagram({
    canvas: {
      container,
    },
    keyboard: {
      bindTo: window.document,
    },
    modules: [
      ...builtinModules,
      ...customModules,
    ],
  });

  // Register css rules to style the palette and contextpad for blueprint elements
  resetSvgIconStyles();
  blueprint.elements.forEach((element) => createSvgIconStyle(element));

  // Create the diagram
  const canvas = diagram.get('canvas');
  const elementFactory = diagram.get('elementFactory');
  const elementRegistry = diagram.get('elementRegistry');
  const create = diagram.get('create');
  const alignToOrigin = diagram.get('alignToOrigin');

  const root = elementFactory.createRoot({ type: 'root' });
  canvas.setRootElement(root);

  const eventBus = diagram.get('eventBus');
  const modeling = diagram.get('modeling');
  const overlays = diagram.get('overlays');
  const selection = diagram.get('selection');

  // This attaches the diagram to the DOM
  eventBus.fire('attach');

  const editor = {
    getViewbox() {
      return canvas.viewbox();
    },
    setViewbox(viewbox) {
      canvas.viewbox({
        x: viewbox.x,
        y: viewbox.y,
        width: viewbox.width,
        height: viewbox.height,
      });
    },
    alignToOrigin() {
      alignToOrigin.align();

      const viewbox = this.getViewbox();
      viewbox.x = 0;
      viewbox.y = 0;
      canvas.viewbox(viewbox);
    },
    create(event, blueprintItem, data, sourceId) {
      const shape = createShape(elementFactory, blueprintItem, data);
      const source = sourceId ? elementRegistry.get(sourceId) : undefined;
      create.start(event, shape, { source });
    },
    connect(sourceId, targetId) {
      const source = elementRegistry.get(sourceId);
      if (!source) throw new Error(`Cannot create connection from undefined source ${sourceId}`);
      const target = elementRegistry.get(targetId);
      if (!target) throw new Error(`Cannot create connection to undefined target ${targetId}`);

      const connection = modeling.connect(source, target);
      selection.select(connection);
    },
    add(element) {
      const shape = elementFactory.createShape({ type: 'shape', ...element });
      modeling.createShape(shape, { x: element.x, y: element.y }, root);
    },
    load(items) {
      loadItems(blueprint, items, canvas, elementRegistry, elementFactory);
    },
    refresh(id) {
      const element = elementRegistry.get(id);
      if (element) {
        modeling.refresh(element);
      }
    },
    addOverlay(id, type, overlay) {
      return overlays.add(id, type, overlay);
    },
    removeOverlays(filter) {
      overlays.remove(filter);
    },
    onItemChange(callback) {
      eventBus.on(['shape.changed', 'connection.changed'], (event) => callback(createDiagramEvent(event.element)));
    },
    onItemRemove(callback) {
      eventBus.on(['shape.removed', 'connection.removed'], (event) => callback(createDiagramEvent(event.element)));
    },
    onItemSelect(callback) {
      eventBus.on('selection.changed', (event) => {
        if (event.newSelection.length === 0) {
          callback(undefined);
        } else {
          callback(createDiagramEvent(event.newSelection[event.newSelection.length - 1]));
        }
      });
    },
    onItemDoubleClick(callback) {
      eventBus.on('element.dblclick', (event) => callback(createDiagramEvent(event.element)));
    },
    onCanvasMove(callback) {
      eventBus.on('canvas.moved', (event) => callback(event));
    },
    onContextAction(callback) {
      eventBus.on('contextaction.click', (event) => callback({ name: event.action, event: createDiagramEvent(event.element) }));
    },
    saveSvg() {
      return saveSvg(canvas);
    },
    destroy() {
      diagram.destroy();
    }
  };

  return editor;
}
