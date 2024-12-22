import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';
import { findBlueprint } from '../../utils/find-utils';

export default class EmbeddedTextBehavior extends CommandInterceptor {
  constructor(eventBus, blueprint) {
    super(eventBus);
    this._blueprint = blueprint;

    this.postExecute(['shape.create'], (event) => this._createEmbeddedText(event));
  }

  _createEmbeddedText(event) {
    const { shape } = event.context;
    const { embeddedText } = findBlueprint(this._blueprint, shape).shape;

    if (!embeddedText) return;

    shape.embeddedText = [];

    embeddedText.forEach((line) => {
      const data = line.data ? line.data(shape) : undefined;
      const content = line.content(data);
      shape.embeddedText.push({
        data,
        content,
        textOptions: { ...line.textOptions }
      });
    });
  }
}

EmbeddedTextBehavior.$inject = ['eventBus', 'blueprint'];
