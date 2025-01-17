export default class UpdateEmbeddedTextHandler {
  execute(ctx) {
    const { element, changes } = ctx;

    ctx.old = changes.map((change) => ({
      index: change.index,
      content: element.embeddedText[change.index].content
    }));

    changes.forEach((change) => {
      element.embeddedText[change.index].content = change.newContent;
    });

    return element;
  }

  revert(ctx) {
    const { element, old } = ctx;

    old.forEach((change) => {
      element.embeddedText[change.index].content = change.content;
    });

    return element;
  }
}
