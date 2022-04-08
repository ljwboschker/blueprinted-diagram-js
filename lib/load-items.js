import { deepClone } from './utils/deep-clone';
import { findBlueprint } from './utils/find-utils';

export function loadItems(blueprint, items, canvas, elementRegistry, elementFactory) {
  // The order in which they are added to the diagram is important

  // So: we start with shapes on the root, then all shapes within those shapes etc. etc.
  const shapes = [];
  sortHierarchically(items.filter((item) => item.type === 'shape'), 'root_', shapes);
  shapes.forEach((item) => {
    const elementType = findBlueprint(blueprint, item.element);
    if (!elementType) {
      console.warn('Item type not found in blueprint. Ignoring it.', item);
      return;
    }

    const shape = elementFactory.createShape({ ...(deepClone(item.element)) });
    const parent = elementRegistry.get(item.parentId);
    canvas.addShape(shape, parent);
  });

  // Then the connections (because they are attached to shapes)
  const connections = items.filter((item) => item.type === 'connection');
  connections.forEach((item) => {
    const source = elementRegistry.get(item.sourceId);
    const target = elementRegistry.get(item.targetId);
    const connection = elementFactory.createConnection(
      { ...(deepClone(item.element)), source, target }
    );
    const parent = elementRegistry.get(item.parentId);
    canvas.addConnection(connection, parent);
  });

  // And finally the labels (since they can be attached to both shapes and connections)
  const labels = items.filter((item) => item.type === 'label');
  labels.forEach((item) => {
    const labelTarget = elementRegistry.get(item.labelTargetId);

    const label = elementFactory.createLabel({ ...deepClone(item.element), labelTarget });
    const parent = elementRegistry.get(item.parentId);
    canvas.addShape(label, parent);
  });
}

function sortHierarchically(items, parentId, result) {
  const children = items.filter((item) => item.parentId?.startsWith(parentId));
  if (children.length > 0) {
    result.push(...children);

    const childIds = children.map((child) => child.id);
    childIds.forEach((childId) => sortHierarchically(items, childId, result));
  }
}
