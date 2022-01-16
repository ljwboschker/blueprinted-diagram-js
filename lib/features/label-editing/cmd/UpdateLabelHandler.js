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
    ctx.oldx = label.x;

    const newDimensions = this._text.getDimensions(ctx.newContent, label.textOptions);

    label.width = newDimensions.width;
    label.height = newDimensions.height;

    label.x += (ctx.oldWidth - newDimensions.width) / 2;

    label.content = ctx.newContent;

    return label;
  }

  revert(ctx) {
    ctx.element.content = ctx.oldContent;
    ctx.element.width = ctx.oldWidth;
    ctx.element.height = ctx.oldHeight;
    ctx.element.x = ctx.oldx;

    return ctx.element;
  }
}
