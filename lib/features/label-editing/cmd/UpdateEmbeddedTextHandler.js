export default class UpdateEmbeddedTextHandler {
  execute(ctx) {
    const { element } = ctx;

    ctx.oldContent = element.embeddedText;

    element.embeddedText = ctx.newContent;

    return element;
  }

  revert(ctx) {
    const { element } = ctx;

    element.content = ctx.oldContent;

    return element;
  }
}
