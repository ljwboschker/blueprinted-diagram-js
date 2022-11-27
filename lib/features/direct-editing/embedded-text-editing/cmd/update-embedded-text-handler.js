export default class UpdateEmbeddedTextHandler {
  execute(ctx) {
    const { element, newText, oldText } = ctx;

    const index = element.embeddedText.findIndex((line) => line.content === oldText);

    ctx.old = {
      index,
      text: oldText
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
