declare module 'blueprinted-diagram-js';

/**
 * Create a new instance of a diagram editor.
 * 
 * @param options editor options
 */
declare function createEditor(options: EditorOptions): void;

export interface EditorOptions {
  /**
   * The DOM element where the diagram is rendered.
   */
  container: Element;

  /**
   * The blueprint for this diagram.
   */
  blueprint: Blueprint;
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
}

export interface BlueprintShape {
  /**
   * Passed to the main SVG element that will contain your shape.
   */
  viewBox: string;

  /**
   * Passed to the main SVG element that will contain your shape.
   */
  preserveAspectRatio?: string;

  /**
   * The width of your shape.
   */
  width: number;

  /**
   * The height of your shape.
   */
  height: number;

  /**
   * The inner SVG that is rendered inside the main SVG element. 
   */
  svg: string;

  /**
   * Indicate if your shape is resizable.
   */
  resizable?: boolean;
}
