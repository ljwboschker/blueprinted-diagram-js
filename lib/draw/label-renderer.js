import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';
import TextUtil from 'diagram-js/lib/util/Text';
import {
  append as svgAppend,
  classes as svgClasses
} from 'tiny-svg';

export default class LabelRenderer extends BaseRenderer {
  constructor(eventBus) {
    super(eventBus, 100);
    this._text = new TextUtil();
  }

  canRender(element) {
    return (element.type === 'label' && element.labelTarget);
  }

  drawShape(parent, element) {
    const { content } = element;

    const label = this._text.createText(content, element.textOptions);

    svgClasses(label).add('djs-label');
    svgAppend(parent, label);

    return element;
  }
}

LabelRenderer.$inject = ['eventBus'];
