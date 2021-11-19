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
  elements: BlueprintElement[];
}

export interface BlueprintElement {
  type: string;
  title: string;
  iconClassName: string;
  svg: any;
  width: number;
  height: number;
  resizable: boolean
}
