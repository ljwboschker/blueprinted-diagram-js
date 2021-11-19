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
}
