declare module 'blueprinted-diagram-js';

/**
 * Create a new instance of a diagram editor.
 * 
 * @param container the DOM element to put the diagam in
 * @param blueprint the blueprint definition for this diagram
 * @returns the diagram editor
 */
declare function createDiagramEditor<T>(container: Element, blueprint: Blueprint<T>): DiagramEditor<T>;

export interface Blueprint<T> {
  name: string;
  /**
   * Array with drawable elements.
   */
  elements: BlueprintElement<T>[];
}

export interface BlueprintElement<T> {
  /**
   * Type indication for your element. 
   */
  type: string;

  /**
   * The title that is displayed as tooltip in the diagram palette.
   */
  title: string;

  /**
   * Called when an element is created. 
   */
  initializeData?: () => T;

  /**
   * When this element is created in the diagram, it will create a main SVG element that contains this shape.
   */
  shape: BlueprintShape;

  /**
   * Modeling rules for this element.
   */
  rules: BlueprintRules;
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
   * A function that returns the shape as SVG image. 
   */
  svg: { (): string };

  /**
   * The labels to place in (or by) the shapes.
   */
  labels?: BlueprintShapeLabel[];
}

export interface BlueprintShapeLabel {
  /**
   * The key of the property in the data object that is used as this label's content.
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

export interface DiagramEditor<T> {
  /**
   * Set the diagram's viewbox
   */
  setViewbox(viewbox: Viewbox): void;

  /**
   * Load items in the diagram. Only add those emitted by onItemChange.
   */
  load(items: DiagramItem<T>[]): void;

  /**
   * Called when a diagram item is created or changes.
   * 
   * @param item the item that was created or changed.
   */
  onItemChange(item: Callback<DiagramItem<T>>): void;

  /**
   * Called when a diagram item is removed.
   * 
   * @param id the id of the item that was removed.
   */
  onItemRemove(id: Callback<string>): void;

  /**
   * Called when an item is selected.
   * 
   * @param item the item that was doubleclicked.
   */
  onItemSelect(item: Callback<DiagramItem<T>>): void;

  /**
  * Called when a diagram item was double-clicked.
  * 
  * @param item the item that was doubleclicked.
  */
  onItemDoubleClick(item: Callback<DiagramItem<T>>): void;

  /**
   * Called when the canvas was moved.
   * 
   * @param move information about the movement of the diagram
   */
  onCanvasMove(move: Callback<CanvasMove>): void;
}

type Callback<T> = (item: T) => void;

export interface DiagramItem<T> {
  /**
   * The ID of the diagram element
   */
  id: string;

  /**
   * The type of element, as defined in the blueprint.
   */
  type: string;
  
  /**
   * The diagram element itself.
   */
  element: Readonly<any>;

  /**
   * Extra data associated with this diagram element.
   */
  data?: T;
  
  /**
   * If applicable; the ID of the diagram element that contains this element.
   */
  parentId?: string;

  /**
   * For item type 'connection': the ID of the connection source element.
   */
  sourceId?: string;

  /**
   * For item type 'connection': the ID of the connection target element.
   */
  targetId?: string;

  /**
   * For item type 'label': the ID of the element this label belongs to.
   */
  labelTargetId?: string;
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
}
