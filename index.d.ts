declare module 'blueprinted-diagram-js';

/**
 * Create a new instance of a diagram editor.
 *
 * @param container the DOM element to put the diagam in
 * @param blueprint the blueprint definition for this diagram
 * @returns the diagram editor
 */
declare function createDiagramEditor<D>(container: Element, blueprint: Blueprint<D>): DiagramEditor<D>;

export interface Blueprint<D> {
  name: string;
  /**
   * Array with drawable elements.
   */
  elements: BlueprintElement<D>[];
}

export interface BlueprintElement<D> {
  /**
   * Type indication for your element.
   */
  type: string;

  /**
   * The title that is displayed as tooltip in the diagram palette.
   */
  title: string;

  /**
   * A function that returns a new data object that is linked to this element.
   */
  data?: () => D;

  /**
   * When this element is created in the diagram, it will create a main SVG element that contains this shape.
   */
  shape: BlueprintShape<D>;

  /**
   * Modeling rules for this element.
   */
  rules: BlueprintRules<D>;

  /**
   * Extra actions added to this element's context pad.
   *
   * When selected, the onContextAction method on the editor is called with the name of the action and the diagram item
   * where the action was selected.
   */
  contextActions?: BlueprintContextAction[];
}

export interface BlueprintShape<D> {

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
  svg: { (data: D): string };

  /**
   * Returns the content of a label.
   *
   * @param key the key of the requested label
   */
  label?: { (data: D, key: string): string; }

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

export interface BlueprintRules<D> {
  /**
   * Specify that this element can only connect to the specified types.
   * If not specified, then this element cannot connect to anything.
   */
  connect?: BlueprintConnection<D>[];
}

export interface BlueprintConnection<D> {
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

  /**
   * A function that returns a new data object that is linked to this connection.
   */
  data?: () => D;

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
   * Load items in the diagram. Only add those emitted by onItemChange.
   */
  load(items: DiagramItem<T>[]): void;

  /**
   * Called when a diagram item is created or changes.
   *
   * @param callback method that is called with the item that was created or changed.
   */
  onItemChange(callback: Callback<DiagramItem<T>>): void;

  /**
   * Called when a diagram item is removed.
   *
   * @param callback method that is called with the item that was removed.
   */
  onItemRemove(callback: Callback<DiagramItem<T>>): void;

  /**
   * Called when an item is selected.
   *
   * @param callback method that is called with the item that was doubleclicked.
   */
  onItemSelect(callback: Callback<DiagramItem<T>>): void;

  /**
  * Called when a diagram item was double-clicked.
  *
  * @param callback method that is called with the item that was doubleclicked.
  */
  onItemDoubleClick(callback: Callback<DiagramItem<T>>): void;

  /**
   * Called when a context-action of a diagram item was selected.
   *
   * @param callback method that is called with the name of the action and the item on which the context action was triggered.
   */
  onContextAction(callback: ActionCallback<DiagramItem<T>>): void;

  /**
   * Called when the canvas was moved.
   *
   * @param callback method that is called with information about the movement of the diagram
   */
  onCanvasMove(callback: Callback<CanvasMove>): void;
}

type Callback<D> = (item: D) => void;

type ActionCallback<D> = (action: string, item: D) => void;

export type DiagramItem<D> = ShapeItem<D> | LabelItem<D> | ConnectionItem<D>;

export interface ShapeItem<D> {
  id: string;
  type: 'shape';
  parentId: string | undefined;
  element: ShapeElement<D>;

  /**
   * Get the labels attached to this shape.
   */
  getLabels: () => LabelElement<D>[];

  /**
   * Get the incoming connections of this shape.
   */
  getIncoming: () => ConnectionElement<D>[];

  /**
   * Get the outgoing connections of this shape.
   */
   getOutgoing: () => ConnectionElement<D>[];
}

export interface LabelItem<D> {
  id: string;
  type: 'label';
  parentId: string | undefined;
  element: LabelElement<D>;
  labelTargetId: string | undefined;
}

export interface ConnectionItem<D> {
  id: string;
  type: 'connection';
  parentId: string | undefined;
  element: ConnectionElement<D>;
  sourceId: string;
  targetId: string;

  /**
   * Get the labels attached to this connection.
   */
  getLabels: () => LabelElement<D>[];

  /**
   * Get the source shape of this connection.
   */
  getSource: () => ShapeElement<D>;

  /**
   * Get the target shape of this connection.
   */
  getTarget: () => ShapeElement<D>;
}

export interface ConnectionElement<D> {
  data?: D;
  source: ShapeElement<D>,
  target: ShapeElement<D>
}

export interface LabelElement<D> {
  key: string;
  content: string;
  data?: D;
}

export interface ShapeElement<D> {
  data?: D;
  blueprint: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CanvasMove {
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
