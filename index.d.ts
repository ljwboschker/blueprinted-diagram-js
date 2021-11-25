declare module 'blueprinted-diagram-js';

/**
 * Create a new instance of a diagram editor.
 * 
 * @param options editor options
 */
declare function createEditor<T>(options: EditorOptions<T>): void;

type ElementEvent<T> = (element: T) => void;
export interface EditorOptions<T> {
  /**
   * The DOM element where the diagram is rendered.
   */
  container: Element;

  /**
   * The blueprint for this diagram.
   */
  blueprint: Blueprint;

  /**
   * Emits when an element has been created or changed.
   */
  elementChanged?: ElementEvent<T>;

  /**
   * Emits the ID of an element that was removed.
   */
  elementRemoved?: ElementEvent<string>;
}

export interface Blueprint {
  /**
   * Array with drawable elements.
   */
  elements: BlueprintElement[];
}

export interface BlueprintElement {
  /**
   * Arbitrary type indication for your element. 
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
  connect?: BlueprintRulesConnection[];
}

export interface BlueprintRulesConnection {
  /**
   * The type of an allowed target element.
   */
  to: string,

  /**
   * The default text for the connection's label.
   */
  text: string,

  /// TODO: label style definition
  style?: {
  },

  /// TODO: label box definition
  box?: {
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
   * Note that the SVG is rendered inside a viewbox that starts with 0 0 and has the width and height as specified for this shape. 
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

  style: {
    /**
     * Fontsize (in pixels)
     */
    fontSize: number,

    /**
     * Text color
     */
    fill: string
  }
}
