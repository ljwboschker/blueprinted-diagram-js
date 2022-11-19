import inherits from 'inherits';
import TextUtil from 'diagram-js/lib/util/Text';
import {
  create as svgCreate,
  append as svgAppend,
  innerSVG as svgInner,
  classes as svgClasses
} from 'tiny-svg';

import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';
import { findBlueprint } from '../utils/find-utils';

export default function SvgRenderer(eventBus, blueprint) {
  BaseRenderer.call(this, eventBus, 100);

  const textUtil = new TextUtil();

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

    const { embeddedText } = blueprintElement.shape;
    if (embeddedText) {
      const content = embeddedText.content(element.data);
      const label = textUtil.createText(content, embeddedText.textOptions);

      svgClasses(label).add('djs-label');
      svgAppend(svg, label);
    }

    svgAppend(parent, svg);
    return element;
  };
}

inherits(SvgRenderer, BaseRenderer);

SvgRenderer.$inject = ['eventBus', 'blueprint'];
