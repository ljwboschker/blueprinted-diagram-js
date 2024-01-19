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

export default class SvgRenderer extends BaseRenderer {
  constructor(eventBus, blueprint) {
    super(eventBus, 100);

    this._blueprint = blueprint;
    this._textUtil = new TextUtil();
  }

  canRender(element) {
    const blueprintElement = findBlueprint(this._blueprint, element);
    return blueprintElement?.shape.svg !== undefined;
  }

  drawShape(parent, element) {
    const blueprintElement = findBlueprint(this._blueprint, element);
    const svg = svgCreate('svg', {
      viewBox: `0 0 ${element.width} ${element.height}`,
      width: element.width,
      height: element.height
    });

    svgInner(svg, blueprintElement.shape.svg(element.id, element.data));

    if (element.embeddedText) {
      this._renderEmbeddedText(svg, element);
    }

    svgAppend(parent, svg);
    return element;
  }

  _renderEmbeddedText(svg, element) {
    let previousHeight = 0;
    element.embeddedText.forEach((line) => {
      const textOptions = deepClone(line.textOptions);
      textOptions.padding.top += previousHeight;
      textOptions.box = {
        width: element.width
      };

      // Keep the full offset with the embeddedText line for the embedded-text-editor.
      // eslint-disable-next-line no-param-reassign
      line.offset = {
        y: textOptions.padding.top
      };

      const text = this._textUtil.layoutText(line.content, textOptions);
      previousHeight = text.dimensions.height;

      svgClasses(text.element).add('djs-label');
      svgAppend(svg, text.element);
    });
  }
}

SvgRenderer.$inject = ['eventBus', 'blueprint'];
