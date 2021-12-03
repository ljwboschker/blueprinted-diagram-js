declare module 'blueprinted-diagram-js';

/**
 * Create a new instance of a diagram editor.
 * 
 * @param container the DOM element to put the diagam in
 * @param blueprint the blueprint definition for this diagram
 * @returns the diagram editor
 */
declare function createDiagramEditor<T>(container: Element, blueprint: Blueprint): DiagramEditor<T>;

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
   * The default text for the connection label.
   */
  text: string,

  /**
   * Show the direction of the connection by rendering an arrow.
   * Note: the arrow head will take the color of the connection's stroke style.
   */
  direction?: boolean;

  /**
   * The connection style as a CSS rule.
   */
  style?: string;

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
  svg: {(): string};

  /**
   * The labels to place in (or by) the shapes.
   */
  labelDefinitions?: BlueprintShapeLabel[];
}

export interface BlueprintShapeLabel {
  /**
   * The y-offset of the label (in pixels) from the element's top.
   * Note: labels are always centered with the element.
   */
  y: number,

  text: string,

  style: BlueprintTextStyle;
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

type DiagramEvent<T> = (element: T) => void;
export interface DiagramEditor<T> extends EventTarget {

  /**
   * 
   */
  setViewbox(viewbox: Viewbox): void;

  /**
   * Load elements in the diagram. Only add those emitted by elementChanged.
   */
   load(elements: T[]): void;

  /**
   * Called when an element is created or changes.
   * 
   * @param element the element that was created or changed.
   */
   onElementChange(element: DiagramEvent<T>): void;

   /**
    * Called when an element is removed.
    * 
    * @param id the id of the element that was removed.
    */
   onElementRemove(id: DiagramEvent<string>): void;

   /**
    * Called when an element was double-clicked.
    * 
    * @param element the element that was doubleclicked.
    */
   onElementDoubleClick(element: DiagramEvent<T>): void;
   
   /**
    * Called when the canvas was moved.
    * 
    * @param move information about the movement of the diagram
    */
   onCanvasMove(move: DiagramEvent<CanvasMove>): void;

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
