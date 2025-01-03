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
      const content = line.content(line.key, shape.data);
      shape.embeddedText.push({
        key: line.key,
        content,
        textOptions: { ...line.textOptions }
      });
    });
  }
}

EmbeddedTextBehavior.$inject = ['eventBus', 'blueprint'];
