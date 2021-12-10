import { deepClone } from './utils/deep-clone';

export function loadItems(blueprint, items, canvas, elementRegistry, elementFactory) {

  const shapes = items.filter(item => item.type !== 'label' && item.type !== 'connection');
  const connections = items.filter(item => item.type === 'connection');
  const labels = items.filter(item => item.type === 'label');

  // The order in which they are added to the diagram is important
  shapes.forEach(item => {
    const elementType = blueprint.elements.find(e => e.type === item.element.type);
    if (!elementType) {
      throw new Error(`Element of type ${item.element.type} not found in current blueprint`);
    }
  
    const shape = elementFactory.createShape({ ...(deepClone(item.element)), blueprint: { shape: elementType.shape, rules: elementType.rules } });
    const parent = elementRegistry.get(item.parentId);
    canvas.addShape(shape, parent);
  });

  connections.forEach(item => {
    const source = elementRegistry.get(item.sourceId);
    const target = elementRegistry.get(item.targetId);
    const connection = elementFactory.createConnection({ ...(deepClone(item.element)), source, target });
    const parent = elementRegistry.get(item.parentId);
    canvas.addConnection(connection, parent);
  });

  labels.forEach(item => {
    const labelTarget = elementRegistry.get(item.labelTargetId);
    const label = elementFactory.createLabel({ ...(deepClone(item.element)), labelTarget });
    const parent = elementRegistry.get(item.parentId);
    canvas.addShape(label, parent);
  });
}
