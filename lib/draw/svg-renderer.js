import inherits from 'inherits';
import {
    create as svgCreate,
    append as svgAppend,
    attr as svgAttr,
    innerSVG as svgInner
} from 'tiny-svg';

import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';

export default function SvgRenderer(eventBus) {

    BaseRenderer.call(this, eventBus, 100);

    this.canRender = (element) => {
        return element.viewBox && element.svg;
    };

    this.drawShape = (parent, element) => {
        const svg = svgCreate('svg', {
            viewBox: element.viewBox,
            width: element.width,
            height: element.height
        });

        if (element.preserveAspectRatio) {
            svgAttr(svg, 'preserveAspectRatio', element.preserveAspectRatio)
        };

        svgInner(svg, element.svg);
        svgAppend(parent, svg);

        return element;
    };
}

inherits(SvgRenderer, BaseRenderer);

SvgRenderer.$inject = ['eventBus'];
