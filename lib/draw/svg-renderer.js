import inherits from 'inherits';
import {
    create as svgCreate,
    append as svgAppend,
    attr as svgAttr,
    innerSVG as svgInner,
    remove as svgRemove
} from 'tiny-svg';

import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';

export default function SvgRenderer(eventBus) {

    BaseRenderer.call(this, eventBus, 100);

    this.canRender = (element) => {
        return element.blueprint?.shape.svg !== undefined;
    };

    this.drawShape = (parent, element) => {
        const svg = svgCreate('svg', {
            viewBox: `0 0 ${element.width} ${element.height}`,
            width: element.width,
            height: element.height
        });

        svgInner(svg, element.blueprint.shape.svg());
        svgAppend(parent, svg);

        return element;
    };
}

inherits(SvgRenderer, BaseRenderer);

SvgRenderer.$inject = ['eventBus'];
