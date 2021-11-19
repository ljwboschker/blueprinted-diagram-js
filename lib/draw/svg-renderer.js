import inherits from 'inherits';
import {
    create as svgCreate,
    append as svgAppend,
    innerSVG as svgInner
} from 'tiny-svg';

import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';

export default function SvgRenderer(eventBus) {

    BaseRenderer.call(this, eventBus, 100);

    this.canRender = (element) => {
        return element.svg !== undefined;
    };

    this.drawShape = (parent, element) => {
        const wrapper = svgCreate('svg', {
            width: element.width,
            height: element.height,
            viewport: `0 0 ${element.width} ${element.height}`
        })
        svgInner(wrapper, element.svg);

        svgAppend(parent, wrapper);

        return element;
    };
}

inherits(SvgRenderer, BaseRenderer);

SvgRenderer.$inject = ['eventBus'];
