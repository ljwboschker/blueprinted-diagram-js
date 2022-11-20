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
import { deepClone } from '../utils/deep-clone';

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

    const { embeddedText } = element;
    if (!embeddedText) return undefined;

    let previousHeight = 0;
    embeddedText.forEach((line) => {
      const textOptions = deepClone(line.textOptions);
      textOptions.padding.top += previousHeight;

      const newTextOptions = {
        ...textOptions,
        box: {
          width: element.width
        }
      };

      const text = textUtil.layoutText(line.content, newTextOptions);
      previousHeight = text.dimensions.height;

      svgClasses(text.element).add('djs-label');
      svgAppend(svg, text.element);
    });

    svgAppend(parent, svg);
    return element;
  };
}

inherits(SvgRenderer, BaseRenderer);

SvgRenderer.$inject = ['eventBus', 'blueprint'];
