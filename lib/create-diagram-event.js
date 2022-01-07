import { deepClone } from './utils/deep-clone';

export function createDiagramEvent(element) {
  // Create a stripped object without internal properties and functions
  const {
    children, labels, svg, viewBox, ...stripped
  } = element;
  const strippedElement = deepClone(stripped);

  switch (element.type) {
    case 'shape':
      return {
        type: element.type,
        item: {
          id: element.id,
          type: element.type,
          parentId: element.parent?.id,
          element: strippedElement
        }
      };
    case 'label':
      return {
        type: element.type,
        item: {
          id: element.id,
          parentId: element.parent?.id,
          type: element.type,
          element: strippedElement,
          labelTargetId: element.labelTarget?.id,
        },
        getTarget: () => element.labelTarget
      };
    case 'connection':
      return {
        type: element.type,
        item: {
          id: element.id,
          parentId: element.parent?.id,
          type: element.type,
          element: strippedElement,
          sourceId: element.source.id,
          targetId: element.target.id,
        },
        getSource: () => element.source,
        getTarget: () => element.target
      };
    default:
      throw new Error('Element type not supported', element);
  }
}
