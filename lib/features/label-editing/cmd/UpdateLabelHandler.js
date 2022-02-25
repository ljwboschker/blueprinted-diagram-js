import TextUtil from 'diagram-js/lib/util/Text';

export default class UpdateLabelHandler {
  constructor() {
    this._text = new TextUtil();
  }

  execute(ctx) {
    const label = ctx.element;

    ctx.oldContent = label.content;
    ctx.oldWidth = label.width;
    ctx.oldHeight = label.height;
    ctx.oldX = label.x;
    ctx.oldY = label.y;

    const newDimensions = this._text.getDimensions(ctx.newContent, label.textOptions);
    label.height = newDimensions.height;
    label.content = ctx.newContent;

    return label;
  }

  revert(ctx) {
    const label = ctx.element;

    label.content = ctx.oldContent;
    label.width = ctx.oldWidth;
    label.height = ctx.oldHeight;
    label.x = ctx.oldX;
    label.y = ctx.oldY;

    return ctx.element;
  }
}
