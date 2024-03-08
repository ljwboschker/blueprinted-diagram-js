import Diagram from 'diagram-js';

import KeyboardMoveCanvasModule from 'diagram-js/lib/navigation/keyboard-move';
import LabelSupportModule from 'diagram-js/lib/features/label-support';
import MoveCanvasModule from 'diagram-js/lib/navigation/movecanvas';
import ZoomScrollModule from 'diagram-js/lib/navigation/zoomscroll';

import AlignToOrigin from './features/align-to-origin';
import AppModelingModule from './modeling';
import DrawModule from './draw';
import OverlaysModule from './features/overlays';

import { loadItems } from './load-items';
import { saveSvg } from './utils/save-svg';

export function createDiagramViewer(container, blueprint) {
  const BlueprintModule = {
    __init__: ['blueprint'],
    blueprint: ['value', blueprint],
  };

  // Default modules provided by diagram-js
  const builtinModules = [
    KeyboardMoveCanvasModule,
    LabelSupportModule,
    MoveCanvasModule,
    OverlaysModule,
    ZoomScrollModule
  ];

  // Modules specific for blueprinted diagrams
  const customModules = [
    AlignToOrigin,
    AppModelingModule,
    BlueprintModule,
    DrawModule,
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

  // Create the viewer
  const canvas = diagram.get('canvas');
  const elementFactory = diagram.get('elementFactory');
  const elementRegistry = diagram.get('elementRegistry');

  const root = elementFactory.createRoot({ type: 'root' });
  canvas.setRootElement(root);

  const eventBus = diagram.get('eventBus');
  const modeling = diagram.get('modeling');
  const overlays = diagram.get('overlays');
  const alignToOrigin = diagram.get('alignToOrigin');

  // This attaches the diagram to the DOM
  eventBus.fire('attach');

  const viewer = {
    setViewbox(viewbox) {
      canvas.viewbox({
        x: viewbox.x,
        y: viewbox.y,
        width: viewbox.width,
        height: viewbox.height,
      });
    },
    load(items) {
      loadItems(blueprint, items, canvas, elementRegistry, elementFactory);
      elementRegistry
        .filter((e) => e.type === 'shape')
        .forEach((shape) => {
          modeling.refresh(shape);
        });

      alignToOrigin.align();
      canvas.zoom('fit-viewport', 'auto');
    },
    refresh(id) {
      const element = elementRegistry.get(id);
      if (element) {
        modeling.refresh(element);
      }
    },
    resetView() {
      canvas.zoom('fit-viewport', 'auto');
    },
    addOverlay(id, type, overlay) {
      return overlays.add(id, type, overlay);
    },
    saveSvg() {
      return saveSvg(canvas);
    },
    destroy() {
      diagram.destroy();
    }
  };

  return viewer;
}
