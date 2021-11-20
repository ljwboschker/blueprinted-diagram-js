import inherits from 'inherits';
import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';
import TextUtil from 'diagram-js/lib/util/Text';
import {
    append as svgAppend,
    classes as svgClasses
} from 'tiny-svg';

export default function LabelRenderer(eventBus) {

    BaseRenderer.call(this, eventBus, 100);

    const text = new TextUtil();

    this.canRender = (element) => {
        return (element.type === 'label' && element.labelTarget);
    };

    this.drawShape = (parent, element) => {
        const content = element.content;

        const label = text.createText(content, element.textOptions);

        svgClasses(label).add('djs-label');
        svgAppend(parent, label);

        return element;
    };
}

inherits(LabelRenderer, BaseRenderer);

LabelRenderer.$inject = ['eventBus'];
