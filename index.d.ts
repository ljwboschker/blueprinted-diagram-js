import { Shape } from "diagram-js/lib/model/Types";

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

/**
 * Create a new instance of a diagram viewer.
 *
 * T is the type of the data element that will be linked to shapes and labels.
 *
 * @param container the DOM element to put the diagam in.
 * @param blueprint the blueprint definition for this diagram.
 * @returns the viewer.
 */
declare function createDiagramViewer<T = void>(container: Element, blueprint: Blueprint<T>): DiagramViewer<T>;

export interface Blueprint<T = void> {
  name: string;
  /**
   * Array with drawable elements.
   */
  elements: BlueprintElement<T>[];

  /**
   * Any popups for this diagram. A popup van be triggered by a context action.
   */
  popups?: BlueprintPopup<T>[];
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
   */
  contextActions?: BlueprintContextAction<T>[];
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
  svg: { (elementId?: string, data?: T): string };


  /**
   * The SVG to use in the palette and context-pad.
   * If not defined, the svg() method is used.
   */
  iconSvg?: { (data?: T): string };

  /**
   * Text to embed in this shape. Embedded text cannot be resized, moved or deleted.
   */
  embeddedText?: BlueprintEmbeddedText<T>[];

  /**
   * The labels to place in (or by) the shapes. Labels can be resized, moved or deleted.
   */
  labels?: BlueprintShapeLabel<T>[];
}

export interface BlueprintEmbeddedText<T = void> {
  /**
   * The key to identify this embedded text line.
   */
  key: string;

  /**
   * Return the content of the embedded text line.
   *
   * @param key the key of the embedded text line that is rendered
   * @param data the data object that is linked to the shape
   */
  content: { (key: string, data: T): string };

  textOptions: BlueprintEmbeddedTextOptions;
}

export interface BlueprintEmbeddedTextOptions {
  /**
   * The CSS style for this text
   */
  style: BlueprintTextStyle;

  /**
   * Text alignment
   */
  align: 'left' | 'center' | 'right';

  /**
   * Padding around the text
   */
  padding?: {
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
  };
}

export interface BlueprintShapeLabel<T = void> {
  /**
   * The key to identify this label.
   */
  key: string;

  /**
   * Return the content of the label.
   *
   * @param key the key of the label that is rendered
   * @param data the data object that is linked to the shape
   */
  content: { (key: string, data: T): string };

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
   * Text alignment
   */
  align: 'left' | 'center' | 'right';

  /**
   * The initial width
   */
  box: {
    width: number
  };
}


export interface BlueprintRules<T = void> {
  /**
   * Determine if the element can be created.
   * If not defined, then the element is allowed.
   *
   * @param source The source element that is being created
   * @param target the target element, or undefined if the target is the root of the diagram
  */
  allowed?: BlueprintAllowedRule<T>;

  /**
    * Determine connections from this element.
  */
  connections?: BlueprintConnectionRule<T>;

  /**
   * Set to true to allow this element to be resized.
  */
  resizable?: boolean;
}

export type BlueprintAllowedRule<T> = (source: ShapeElement<T>, target: ShapeElement<T> | undefined) => boolean;

export interface BlueprintConnectionRule<T = void> {
  /**
   * Indicate if a connection to a target of this type is allowed.
   */
  allowed: (targetType: string) => boolean;

  /**
   * Return an object that will be linked to this connection.
   */
  data?: (source: ShapeElement<T>, target: ShapeElement<T>) => T;

  /**
   * Return the style for this connection
   * @param elementId
   * @returns style definition of the connection
   */
  style: (elementId: string) => BlueprintConnectionStyle;

  /**
   * The label to place with the connection.
   */
  label?: BlueprintConnectionLabel<T>;

  /**
   * Extra actions added to this connection's context pad.
   */
  contextActions?: BlueprintContextAction<T>[];
}

export interface BlueprintConnectionStyle {
  /**
   * Shows an arrow to indicate the direction of the connection.
   * The arrowhead will use the connection style's stroke.
   */
  arrow?: boolean;

  /**
   * The style definition of the connection.
   */
  style: Partial<CSSStyleDeclaration>;
}

export interface BlueprintConnectionLabel<T> {
  /**
   * The key to identify this label.
   */
  key: string;

  /**
   * Return the content of the label.
   *
   * @param key the key of the label that is rendered
   * @param data the data object that is linked to the connection
   */
  content: { (key: string, data: T): string };

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
   * The font-weight style property used for the text
   */
  fontWeight?: string,

  /**
   * The font-style style property used for the text
   */
  fontStyle?: string,

  /**
   * The text-decoration style property used for the text
   */
  textDecoration?: string,

  /**
   * Text color.
   */
  fill?: string
}

export interface BlueprintContextAction<T> {
  /**
   * The type of context action. 'action' will immediately trigger an onContextAction event, while 'popup' will open a popup with sub-options.
   */
  type: 'action' | 'popup';

  /**
   * If type is 'action', then this contains the name in the onCntextAction event that is triggered. If 'popup', it will open the popup with this name.
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

  /**
   * If specified, call this method to determine if the context action is allowed.
   */
  allowed?: (source: ShapeElement<T>) => boolean;
}

export interface BlueprintPopup<T> {
  name: string;

  items: (source: ShapeElement<T>) => BlueprintPopupMenuItem[];
}

export interface BlueprintPopupMenuItem {
  /**
   * The name in the onContextAction event that is triggered when  this popup menu item is selected.
   */
  name: string;

  /**
   * The text for this popup item.
   */
  title: string;

  /**
  * The clasname that is used for the popup menu item for this action.
  */
  className?: string;
}

export interface DiagramViewer<T> {
  /**
   * Set the viewer's viewbox.
   *
   * @param viewbox
   */
  setViewbox(viewbox: Viewbox): void;

  /**
   * Load items in the viewer.
   *
   * @param items
   */
  load(items: DiagramItem<T>[]): void;

  /**
   * Refresh a specific item in the diagram.
   * This will rerender the SVG and update any text.
   *
   * @param id the ID of the item to refresh.
   */
  refresh(id: string): void;

  /**
   * Reset the viewport and zoomlevel to fit the entire diagram around the center.
   */
  resetView(): void;

  /**
   * Add an overlay to an item.
   *
   * @param id the ID of the item to attach the overlay to
   * @param type the type of overlay
   * @param overlay
   *
   * @returns the ID of the created overlay
   */
  addOverlay(id: string, type: string, overlay: DiagramOverlay): string;

  /**
   * Get the SVG content as a string, suitable for saving.
   */
  saveSvg(): string;

  /**
   * Destroy the viewer.
   */
  destroy(): void;
}

export interface DiagramEditor<T> {
  /**
   * Get the current viewbox
   *
   * @returns the current viewbox of the diagram
   */
  getViewbox(): Viewbox;

  /**
   * Set the diagram's viewbox.
   *
   * @param viewbox
   */
  setViewbox(viewbox: Viewbox): void;

  /**
   * Reposition all elements to the origin of the canvas.
   */
  alignToOrigin(): void;

  /**
   * Create a new item in the diagram based on the specified blueprint element.
   *
   * @param event the original click event that triggered this create. Needed to detemine the start-point for the item.
   * @param blueprintElement
   * @param data if specified, then this is used as the new element's data part. Of not specified, the blueprint data() method is used.
   * @param source if specified, then the new element will be automatically be connected to this element.
   */
  create(event: Event, blueprintElement: BlueprintElement<T>, data?: T, sourceId?: string): void;

  /**
   * Create a connection between two existing elements.
   *
   * @param sourceId
   * @param targetId
   */
  connect(sourceId: string, targetId: string): void;

  /**
   * Add an existing element to the diagram.
   *
   * @param element
   */
  add(element: NewShapeElement<T> | NewConnectionElement<T>): void;

  /**
   * Update an existing element in the diagram.
   *
   * @param id the ID of the element to update.
   * @param update if the element exists, then this function is called with the current element and should return the updated element.
   */
  update(id: string, update: (element: ShapeElement<T>) => ShapeElement<T>): void;

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
   * Add an overlay to an item.
   *
   * @param id the ID of the item to attach the overlay to
   * @param type the type of overlay
   * @param overlay
   *
   * @returns the ID of the created overlay
   */
  addOverlay(id: string, type: string, overlay: DiagramOverlay): string;

  /**
   * Remove one or more overlays from the diagarm.
   *
   * @param filter the overlay(s) to remove
   */
  removeOverlays(filter: DiagramOverlayFilter): void;

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

  /**
   * Get the SVG content as a string, suitable for saving.
   */
  saveSvg(): string;

  /**
   * Destroy the diagram. This will clean up all event listener.
   */
  destroy(): void;
}


export interface DiagramOverlay {
  /**
   * HTMLElement or string with HTML of the overlay.
   */
  html: HTMLElement | string;

  /**
   * When linked to an element: indicates how to align the overlay with its parent. Defaults to 'left'.
   */
  align?: 'left' | 'center' | 'right',

  /**
   * When linked to an element: indicates how to position the overlay relative to its parent.
   */
  position?: {
    left?: number;
    top?: number;
    bottom?: number;
    right?: number;
  },

  /**
   * The location of the overlay when linked to a connection.
   */
  nearWaypoint?: 'first' | 'last',

  /**
   * The minimum and maximum zoom levels at which this overlay is shown.
   */
  show?: {
    minZoom?: number;
    maxZoom?: number;
  },

  /**
   * The minumum and maximum scale to which this overlay scales.
   */
  scale?: {
    min?: number;
    max?: number;
  }
}

export interface DiagramOverlayFilter {
  /**
   * The ID of the overlay to remove.
   */
  id?: string;

  /**
   * The ID of the item whose overlays to remove.
   */
  itemId?: string;

  /**
   * Remove all overlays of this type.
   */
  type?: string;
}

export interface ContextActionEvent<T> {
  name: string;
  target: ShapeElement<T> | ConnectionElement<T>
}

export type DiagramEvent<T> = ShapeEvent<T> | LabelEvent<T> | ConnectionEvent<T>;

export interface ShapeEvent<T> {
  type: 'shape';
  item: ShapeItem<T>;

  getParent: () => ShapeElement<T>;
}

export interface LabelEvent<T> {
  type: 'label';
  item: LabelItem;

  getTarget: () => ShapeElement<T>;
}

export interface ConnectionEvent<T> {
  type: 'connection',
  item: ConnectionItem<T>;

  getSource: () => ShapeElement<T>;
  getTarget: () => ShapeElement<T>;
}

export type DiagramItem<T> = ShapeItem<T> | ConnectionItem<T> | LabelItem;

export interface ShapeItem<T> {
  id: string;
  type: 'shape';
  parentId: string | undefined;
  element: ShapeElement<T>;
}

export interface LabelItem {
  id: string;
  type: 'label';
  parentId: string | undefined;
  element: LabelElement;
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
  id: string;
  data?: T
}

export type NewConnectionElement<T> = Omit<ConnectionElement<T>, 'id'>;

export interface LabelElement {
  type: 'label',
  key: string;
  content: string;
}

export interface ShapeElement<T> {
  type: 'shape',
  id: string;
  blueprint: string;
  data?: T;
  embeddedText?: ShapeEmbeddedText[];
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ShapeEmbeddedText {
  type: 'label',
  key: string;
  content: string;
}

export type NewShapeElement<T> = Omit<ShapeElement<T>, 'id'>;

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
