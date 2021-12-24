import { deepClone } from './utils/deep-clone';

export function createItem(element) {
  // Create a stripped object without internal properties and functions
  const {
    children, labels, svg, viewBox, ...stripped
  } = element;
  const strippedElement = deepClone(stripped);

  const getLabels = () => element.labels || [];

  const getIncoming = () => element.incoming || [];

  const getOutgoing = () => element.outgoing || [];

  switch (element.type) {
    case 'root':
      return {
        id: element.id,
        type: element.type
      };
    case 'shape':
      return {
        id: element.id,
        type: element.type,
        parentId: element.parent?.id,
        element: strippedElement,
        getLabels,
        getIncoming,
        getOutgoing
      };
    case 'label':
      return {
        id: element.id,
        parentId: element.parent?.id,
        type: element.type,
        element: strippedElement,
        labelTargetId: element.labelTarget?.id
      };
    case 'connection':
      return {
        id: element.id,
        parentId: element.parent?.id,
        type: element.type,
        element: strippedElement,
        sourceId: element.source.id,
        targetId: element.target.id
      };
    default:
      throw new Error('Element type not supported', element);
  }
}
