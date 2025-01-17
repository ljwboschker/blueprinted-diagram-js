export default class UpdateEmbeddedTextHandler {
  execute(ctx) {
    const { element, index, newText } = ctx;

    ctx.old = {
      index,
      text: element.embeddedText[index].content
    };

    element.embeddedText[index].content = newText;

    return element;
  }

  revert(ctx) {
    const { element } = ctx;

    element.embeddedText[ctx.old.index].content = ctx.old.text;

    return element;
  }
}
