import inherits from 'inherits';
import {
  create as svgCreate,
  append as svgAppend,
  innerSVG as svgInner
} from 'tiny-svg';

import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';
import { findBlueprint } from '../utils/find-utils';

export default function SvgRenderer(eventBus, blueprint) {
  BaseRenderer.call(this, eventBus, 100);

  this.canRender = (element) => {
    const blueprintElement = findBlueprint(blueprint, element);
    return blueprintElement?.shape.svg !== undefined;
  };

  this.drawShape = (parent, element) => {
    const blueprintElement = findBlueprint(blueprint, element);
    const svg = svgCreate('svg', {
      viewBox: `0 0 ${element.width} ${element.height}`,
      width: element.width,
      height: element.height
    });

    svgInner(svg, blueprintElement.shape.svg(element.data));
    svgAppend(parent, svg);

    return element;
  };
}

inherits(SvgRenderer, BaseRenderer);

SvgRenderer.$inject = ['eventBus', 'blueprint'];
