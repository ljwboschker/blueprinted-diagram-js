import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';
import inherits from 'inherits';

/**
 * Emit a canvas.moved event with the new position and the delta when the canvas moves.
 */
export default function CanvasMoveBehavior(eventBus, canvas) {
  CommandInterceptor.call(this, eventBus);

  let moving = false;
  let previousViewbox = canvas.viewbox();

  eventBus.on('canvas.viewbox.changing', () => {
    if (!moving) {
      moving = true;
      eventBus.fire('canvas.start.moving');
    }
  });

  eventBus.on('canvas.viewbox.changed', (event) => {
    const delta = {
      x: (previousViewbox.x - event.viewbox.x),
      y: (previousViewbox.y - event.viewbox.y)
    };

    const newEvent = { delta, newViewbox: event.viewbox };
    eventBus.fire('canvas.moved', newEvent);

    moving = false;
    previousViewbox = event.viewbox;
  });
}

inherits(CanvasMoveBehavior, CommandInterceptor);

CanvasMoveBehavior.$inject = ['eventBus', 'canvas'];
