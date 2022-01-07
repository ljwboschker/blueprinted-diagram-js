declare module 'blueprinted-diagram-js';

/**
 * Create a new instance of a diagram editor.
 *
 * @param container the DOM element to put the diagam in
 * @param blueprint the blueprint definition for this diagram
 * @returns the diagram editor
 */
declare function createDiagramEditor(container: Element, blueprint: Blueprint): DiagramEditor;

export interface Blueprint {
  name: string;
  /**
   * Array with drawable elements.
   */
  elements: BlueprintElement[];
}

export interface BlueprintElement {
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
  shape: BlueprintShape;

  /**
   * Modeling rules for this element.
   */
  rules: BlueprintRules;

  /**
   * Extra actions added to this element's context pad.
   *
   * When selected, the onContextAction method on the editor is called with the name of the action and the diagram item
   * where the action was selected.
   */
  contextActions?: BlueprintContextAction[];
}

export interface BlueprintShape {

  /**
   * The width of your shape.
   */
  width: number;

  /**
   * The height of your shape.
   */
  height: number;

  /**
   * Returns the SVG image definition (as a string).
   */
  svg: { (): string };

  /**
   * Returns the content of a label.
   *
   * @param key the key of the requested label
   */
  label?: { (key: string): string; }

  /**
   * The labels to place in (or by) the shapes.
   */
  labels?: BlueprintShapeLabel[];
}

export interface BlueprintShapeLabel {
  /**
   * The key of this label. This is passed to the label parent's label() function.
   */
  key: string;

  /**
   * The y-offset of the label (in pixels) from the element's top.
   * Note: labels are always centered with the element.
   */
  y: number,

  style: BlueprintTextStyle;
}

export interface BlueprintRules {
  /**
   * Specify that this element can only connect to the specified types.
   * If not specified, then this element cannot connect to anything.
   */
  connect?: BlueprintConnection[];
}

export interface BlueprintConnection {
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
   * The connection style as a CSS rule.
   */
  style?: string;

  label: {
    /**
     * The key value attached to this label, so you can find it's content when processing create or update events.
     */
    key?: string,

    /**
     * The default text for this label.
     */
    text: string,

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

export interface DiagramEditor {
  /**
   * Set the diagram's viewbox
   */
  setViewbox(viewbox: Viewbox): void;

  /**
   * Create a new item in the current diagram.
   */
  create(item: ShapeElement | ConnectionElement): void;

  /**
   * Load items in the diagram. Only add those emitted by onItemChange.
   */
  load(items: DiagramItem[]): void;

  /**
   * Called when a diagram item is created or changes.
   *
   * @param callback method that is called with the item that was created or changed.
   */
  onItemChange(callback: Callback<DiagramEvent>): void;

  /**
   * Called when a diagram item is removed.
   *
   * @param callback method that is called with the item that was removed.
   */
  onItemRemove(callback: Callback<DiagramEvent>): void;

  /**
   * Called when an item is selected.
   *
   * @param callback method that is called with the item that was doubleclicked.
   */
  onItemSelect(callback: Callback<DiagramEvent>): void;

  /**
  * Called when a diagram item was double-clicked.
  *
  * @param callback method that is called with the item that was doubleclicked.
  */
  onItemDoubleClick(callback: Callback<DiagramEvent>): void;

  /**
   * Called when a context-action of a diagram item was selected.
   *
   * @param callback method that is called with the name of the action and the item on which the context action was triggered.
   */
  onContextAction(callback: ActionCallback<DiagramEvent>): void;

  /**
   * Called when the canvas was moved.
   *
   * @param callback method that is called with information about the movement of the diagram
   */
  onCanvasMove(callback: Callback<CanvasMoveEvent>): void;
}

type Callback<D> = (item: D) => void;

type ActionCallback<D> = (action: string, item: D) => void;

export type DiagramEvent = ShapeEvent | LabelEvent | ConnectionEvent;

export interface ShapeEvent {
  type: 'shape';
  item: ShapeItem;
}

export interface LabelEvent {
  type: 'label';
  item: LabelItem;

  getTarget: () => ShapeElement;
}

export interface ConnectionEvent {
  type: 'connection',
  item: ConnectionItem;

  getSource: () => ShapeElement;
  getTarget: () => ShapeElement;
}

export type DiagramItem = ShapeItem | LabelItem | ConnectionItem;

export interface ShapeItem {
  id: string;
  type: 'shape';
  parentId: string | undefined;
  element: ShapeElement;
}

export interface LabelItem {
  id: string;
  type: 'label';
  parentId: string | undefined;
  element: LabelElement;
  labelTargetId: string | undefined;
}

export interface ConnectionItem {
  id: string;
  type: 'connection';
  parentId: string | undefined;
  element: ConnectionElement;
  sourceId: string;
  targetId: string;
}

export interface ConnectionElement {
  source: ShapeElement,
  target: ShapeElement
}

export interface LabelElement {
  key: string;
  content: string;
}

export interface ShapeElement {
  blueprint: string;
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
