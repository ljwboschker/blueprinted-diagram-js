import { ElementData } from "src/app/modules/atlas/context-diagram/context-diagram.blueprint";

declare module 'blueprinted-diagram-js';

/**
 * Create a new instance of a diagram editor.
 *
 * T is the type of the data element that will be linked to shapes and labels.
 *
 * @param container the DOM element to put the diagam in
 * @param blueprint the blueprint definition for this diagram
 * @returns the diagram editor
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
   * The labels to place in (or by) the shapes.
   */
  labels?: BlueprintShapeLabel<T>[];
}

export interface BlueprintShapeLabel<T = void> {
  /**
   * Return an object that will be linked to this label.
   */
  data?: (target: DiagramEvent<T>) => T;

  /**
   * Return the content of the label.
   */
  content: { (data: T): string };

   /**
   * The y-offset of the label (in pixels) from the element's top.
   * Note: labels are always centered with the element.
   */
  y: number,

  style: BlueprintTextStyle;
}

export interface BlueprintRules<T = void> {
  /**
   * Specify that this element can only connect to the specified types.
   * If not specified, then this element cannot connect to anything.
   */
  connect?: BlueprintConnection<T>[];
}

export interface BlueprintConnection<T = void> {
  /**
   * The type of the target element.
   */
  to: string,

  /**
   * Show the direction of the connection by rendering an arrow.
   * Note: the arrow head will take the color of the connection's stroke style.
   */
  direction?: boolean;

  /**
   * Return an object that will be linked to this connection.
   */
  data?: () => T;

  /**
   * The connection style as a CSS rule.
   */
  style?: string;

  label: {
    /**
     * Initial content of the label.
     * TODO: use function here?
     */
    content: string,

    textOptions: {
      style?: BlueprintTextStyle,
      box: {
        /**
         * The width of the label text editor (in pixels).
         */
        width: number
      }
    }
  }
}

export interface BlueprintTextStyle {
  /**
   * Fontsize in pixels
   */
  fontSize?: number,

  /**
   * Text color
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
   * Set the diagram's viewbox
   */
  setViewbox(viewbox: Viewbox): void;

  /**
   * Create a new item in the current diagram.
   */
  create(item: ShapeElement<T> | ConnectionElement<T>): void;

  /**
   * Load items in the diagram. Only add those<T> emitted by onItemChange.
   */
  load(items: DiagramItem<T>[]): void;

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
   */
  onItemSelect(callback: (event: DiagramEvent<T>) => void): void;

  /**
  * Called when a diagram item was double-clicked.
  */
  onItemDoubleClick(callback: (event: DiagramEvent<T>) => void): void;

  /**
   * Called when a context-action of a diagram item was selected.
   */
  onContextAction(callback: (name: string, event: DiagramEvent<T>) => void): void;

  /**
   * Called when the canvas was moved.
   */
  onCanvasMove(callback: (event: CanvasMoveEvent) => void): void;
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
  data?: T
}

export interface LabelElement<T> {
  content: string;
  data?: T;
}

export interface ShapeElement<T> {
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
