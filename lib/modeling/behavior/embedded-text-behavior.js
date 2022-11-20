import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';
import inherits from 'inherits';
import { findBlueprint } from '../../utils/find-utils';
import { createDiagramEvent } from '../../create-diagram-event';

export default function EmbeddedTextBehavior(eventBus, blueprint) {
  CommandInterceptor.call(this, eventBus);

  this.postExecute(['shape.create'], (event) => {
    const { shape } = event.context;
    const { embeddedText } = findBlueprint(blueprint, shape).shape;

    if (!embeddedText) return;

    shape.embeddedText = [];
    const diagramEvent = createDiagramEvent(shape);

    embeddedText.forEach((line) => {
      const content = line.content(diagramEvent);
      shape.embeddedText.push({
        content,
        textOptions: { ...line.textOptions }
      });
    });
  });
}

inherits(EmbeddedTextBehavior, CommandInterceptor);

EmbeddedTextBehavior.$inject = ['eventBus', 'blueprint'];
