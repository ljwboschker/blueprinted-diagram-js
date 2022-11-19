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

    const diagramEvent = createDiagramEvent(shape);
    const content = embeddedText.content(diagramEvent);

    shape.embeddedText = content;
  });
}

inherits(EmbeddedTextBehavior, CommandInterceptor);

EmbeddedTextBehavior.$inject = ['eventBus', 'blueprint'];
