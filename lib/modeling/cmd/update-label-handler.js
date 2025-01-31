/* eslint-disable no-param-reassign */
import TextUtil from 'diagram-js/lib/util/Text';

export default class UpdateLabelHandler {
  constructor() {
    this._text = new TextUtil();
  }

  execute(ctx) {
    const { changes } = ctx;

    ctx.old = changes.map((change) => ({
      element: change.element,
      content: change.element.content,
      width: change.element.width,
      height: change.element.height,
      x: change.element.x,
      y: change.element.y
    }));

    changes.forEach((change) => {
      const newDimensions = this._text.getDimensions(change.newContent, change.element.textOptions);
      change.element.height = newDimensions.height;
      change.element.content = change.newContent;
    });

    return changes.map((change) => change.element);
  }

  revert(ctx) {
    const { old } = ctx;

    old.forEach((previous) => {
      previous.element.content = previous.content;
      previous.element.width = previous.width;
      previous.element.height = previous.height;
      previous.element.x = previous.x;
      previous.element.y = previous.y;
    });

    return old.map((previous) => previous.element);
  }
}
