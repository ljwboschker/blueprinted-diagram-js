import { ElementData } from "src/app/modules/atlas/diagram/diagram.models";

declare module 'blueprinted-diagram-js';

/**
 * Create a new instance of a diagram editor.
 *
 * T is the type of the data element that will be linked to shapes and labels.
 *
 * @param container the DOM element to put the diagam in.
 * @param blueprint the blueprint definition for this diagram.
 * @returns the diagram editor.
 */
declare function createDiagramEditor<T = void>(container: Element, blueprint: Blueprint<T>): DiagramEditor<T>;

export interface Blueprint<T = void> {
  name: string;
  /**
   * Array with drawable elements.
   */
  elements: BlueprintElement<T>[];
}

export interface BlueprintElement<T = void> {
  /**
   * Type indication for your element.
   */
  type: string;

  /**
   * The title that is displayed as tooltip in the diagram palette.
   */
  title: string;

  /**
   * When this element is created in the diagram, it will create a main SVG element that contains this shape.
   */
  shape: BlueprintShape<T>;

  /**
   * Modeling rules for this element.
   */
  rules: BlueprintRules<T>;

  /**
   * Extra actions added to this element's context pad.
   *
   * When selected, the onContextAction method on the editor is called with the name of the action and the diagram item
   * where the action was selected.
   */
  contextActions?: BlueprintContextAction[];
}

export interface BlueprintShape<T = void> {
  /**
   * The width of your shape.
   */
  width: number;

  /**
   * The height of your shape.
   */
  height: number;

  /**
   * Return an object that will be linked to this shape.
   */
  data?: () => T;

  /**
   * Return the SVG image definition (as a string).
   */
  svg: { (data?: T): string };

  /**
   * The SVG to use in the palette and context-pad.
   * If not defined, the svg() method is used.
   */
  iconSvg?: { (data?: T): string };

  /**
   * The labels to place in (or by) the shapes.
   */
  labels?: BlueprintShapeLabel<T>[];
}

export interface BlueprintShapeLabel<T = void> {
  /**
   * Return an object that will be linked to this label.
   */
  data?: (target: DiagramEvent<ElementData>) => T;

  /**
   * Return the content of the label.
   */
  content: { (data: T): string };

  position: BlueprintLabelPosition;

  textOptions: BlueprintShapeLabelTextOptions;
}

export interface BlueprintLabelPosition {
  /**
   * Defines how the label is anchored to it's target element. This defines how the label moves when the target is moved or resized.
   */
  anchor: 'left-top' | 'left-middle' | 'left-bottom' | 'center-top' | 'center-middle' | 'center-bottom' | 'right-top' | 'right-middle' | 'right-bottom';

  /**
  * The offset of the initial position of the label
  */
  offset?: {
    x?: number,
    y?: number
  };
}

export interface BlueprintShapeLabelTextOptions {

  /**
   * The CSS style for this label
   */
  style: BlueprintTextStyle;

  /**
   * Alignment of the text in the label
   */
  align: 'left' | 'center' | 'right';

  /**
   * The initial width of the label
   */
  box: {
    width: number
  };
}

export interface BlueprintRules<T = void> {
  /**
   * Determine if the element is allowed.
   * If not defined, then it is allowed.
   *
   * @param target the target element, or undefined if the target is the root of the diagram
   */
  allowed?: (target: DiagramEvent<T> | undefined) => boolean;

  /**
   * Determine connections from this element.
   */
  connections?: BlueprintConnectionRule<T>;

  /**
   * Set to true to allow this element to be resized.
   */
  resizable?: boolean;
}

export interface BlueprintConnectionRule<T = void> {
  /**
   * Indicate if a connection to a target of this type is allowed.
   */
  allowed: (targetType: string) => boolean;

  /**
   * The connection definition.
   */
  connect: BlueprintConnection<T>;
}

export interface BlueprintConnection<T = void> {
  /**
   * Return an object that will be linked to this connection.
   */
  data?: () => T;

  /**
   * Shows an arrow to indicate the direction of the connection.
   * The arrowhead will use the connection style's stroke.
   */
  arrow?: boolean;

  /**
   * The style definition of the connection.
   */
  style: Partial<CSSStyleDeclaration>;

  /**
   * The label to place with the connection.
   */
  label?: BlueprintConnectionLabel<T>;
}

export interface BlueprintConnectionLabel<T> {
  /**
   * Return an object that will be linked to this label.
   */
   data?: (target: DiagramEvent<ElementData>) => T;

   /**
    * Return the content of the label.
    */
   content: { (data: T): string };

   textOptions: BlueprintConnectionLabelTextOptions;
}

export interface BlueprintConnectionLabelTextOptions {

  /**
   * The CSS style for this label
   */
  style: BlueprintTextStyle;

  /**
   * The initial width of the label
   */
  box: {
    width: number
  };
}

export interface BlueprintTextStyle {
  /**
   * Fontsize in pixels.
   */
  fontSize?: number,

  /**
   * Text color.
   */
  fill?: string
}

export interface BlueprintContextAction {
  /**
   * The name of the action.
   */
  name: string;

  /**
   * The classname that is used for the context-pad item for this action.
   *
   * Use this to render a suitable icon.
   */
  className: string;

  /**
   * Text rendered in the tooltip of this context-pad item.
   */
  title: string;
}

export interface DiagramEditor<T> {
  /**
   * Set the diagram's viewbox.
   *
   * @param viewbox
   */
  setViewbox(viewbox: Viewbox): void;

  /**
   * Create a new item in the diagram based on the specified blueprint element.
   *
   * @param event the original click event that triggered this create. Needed to detemine the start-point for the item.
   * @param blueprintItem
   * @param data if specified, then this is used as the new element's data part. Of not specified, the blueprint data() method is used.
   */
  create(event: Event, blueprintItem: BlueprintElement<T>, data?: T): void;

  /**
   * Add an existing element to the diagram.
   *
   * @param item
   */
  add(item: ShapeElement<T> | ConnectionElement<T>): void;

  /**
   * Load items in the diagram. Only add those emitted by onItemChange.
   *
   * @param items
   */
  load(items: DiagramItem<T>[]): void;

  /**
   * Refresh a specific item in the diagram.
   * This will rerender the SVG and update any labels.
   *
   * @param id the ID of the item to refresh.
   */
  refresh(id: string): void;

  /**
   * Called when a diagram item is created or changes.
   */
  onItemChange(callback: (event: DiagramEvent<T>) => void): void;

  /**
   * Called when a diagram item is removed.
   */
  onItemRemove(callback: (event: DiagramEvent<T>) => void): void;

  /**
   * Called when an item is selected.
   * Event will be undefined if nothing is selected anymore.
   */
  onItemSelect(callback: (event: DiagramEvent<T> | undefined) => void): void;

  /**
  * Called when a diagram item was double-clicked.
  */
  onItemDoubleClick(callback: (event: DiagramEvent<T>) => void): void;

  /**
   * Called when a context-action of a diagram item was selected.
   */
  onContextAction(callback: (action: ContextActionEvent<T>) => void): void;

  /**
   * Called when the canvas was moved.
   */
  onCanvasMove(callback: (event: CanvasMoveEvent) => void): void;
}

export interface ContextActionEvent<T> {
  name: string;
  event: DiagramEvent<T>
}

export type DiagramEvent<T> = ShapeEvent<T> | LabelEvent<T> | ConnectionEvent<T>;

export interface ShapeEvent<T> {
  type: 'shape';
  item: ShapeItem<T>;
}

export interface LabelEvent<T> {
  type: 'label';
  item: LabelItem<T>;

  getTarget: () => ShapeElement<T>;
}

export interface ConnectionEvent<T> {
  type: 'connection',
  item: ConnectionItem<T>;

  getSource: () => ShapeElement<T>;
  getTarget: () => ShapeElement<T>;
}

export type DiagramItem<T> = ShapeItem<T> | LabelItem<T> | ConnectionItem<T>;

export interface ShapeItem<T> {
  id: string;
  type: 'shape';
  parentId: string | undefined;
  element: ShapeElement<T>;
}

export interface LabelItem<T> {
  id: string;
  type: 'label';
  parentId: string | undefined;
  element: LabelElement<T>;
  labelTargetId: string | undefined;
}

export interface ConnectionItem<T> {
  id: string;
  type: 'connection';
  parentId: string | undefined;
  element: ConnectionElement<T>;
  sourceId: string;
  targetId: string;
}

export interface ConnectionElement<T> {
  type: 'connection',
  data?: T
}

export interface LabelElement<T> {
  type: 'label',
  content: string;
  data?: T;
}

export interface ShapeElement<T> {
  type: 'shape',
  blueprint: string;
  data?: T;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CanvasMoveEvent {
  delta: Point,
  newViewbox: Viewbox
}

export interface Point {
  x: number,
  y: number
}

export interface Viewbox extends Point {
  width: number;
  height: number;
  scale: number;
}
