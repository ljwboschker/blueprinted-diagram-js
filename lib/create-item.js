import { deepClone } from './utils/deep-clone';

export function createItem(element) {
  // Create a stripped object without internal properties and functions
  const {
    children, labels, svg, viewBox, ...stripped
  } = element;
  const strippedElement = deepClone(stripped);

  switch (element.type) {
    case 'shape':
      return {
        id: element.id,
        type: element.type,
        parentId: element.parent?.id,
        element: strippedElement,
        getLabels: () => element.labels || [],
        getIncoming: () => element.incoming || [],
        getOutgoing: () => element.outgoing || []

      };
    case 'label':
      return {
        id: element.id,
        parentId: element.parent?.id,
        type: element.type,
        element: strippedElement,
        labelTargetId: element.labelTarget?.id,
        getTarget: () => element.labelTarget
      };
    case 'connection':
      return {
        id: element.id,
        parentId: element.parent?.id,
        type: element.type,
        element: strippedElement,
        sourceId: element.source.id,
        targetId: element.target.id,
        getLabels: () => element.labels || [],
        getSource: () => element.source,
        getTarget: () => element.target
      };
    default:
      throw new Error('Element type not supported', element);
  }
}
