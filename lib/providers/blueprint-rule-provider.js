import RuleProvider from 'diagram-js/lib/features/rules/RuleProvider';
import { createDiagramEvent } from '../create-diagram-event';
import { findConnectionRule, findBlueprint } from '../utils/find-utils';

export default class BlueprintRuleProvider extends RuleProvider {
  constructor(eventBus, blueprint) {
    super(eventBus);
    this._blueprint = blueprint;
  }

  _targetAllowed(shape, target) {
    const blueprintElement = findBlueprint(this._blueprint, shape);
    if (!blueprintElement?.rules?.allowed) return true;

    return blueprintElement.rules.allowed(createDiagramEvent(target));
  }

  init() {
    this.addRule('shape.create', (context) => {
      const { target, shape } = context;
      return this._targetAllowed(shape, target);
    });

    this.addRule('elements.move', (context) => {
      const { shapes, target } = context;

      if (target === undefined) return true;

      return (shapes.every((shape) => {
        if (shape.parent.id === target.id) return true;

        return this._targetAllowed(shape, target);
      }));
    });

    this.addRule('connection.create', (context) => {
      const { source, target } = context;

      if (!source.blueprint || !target.blueprint) return false;

      const rule = findConnectionRule(this._blueprint, source);
      return rule?.allowed(target.blueprint) || false;
    });

    this.addRule('shape.resize', (context) => {
      const { shape } = context;

      if (shape.type === 'label') return true;

      const blueprintElement = findBlueprint(this._blueprint, shape);
      return blueprintElement?.rules?.resizable || false;
    });
  }
}

BlueprintRuleProvider.$inject = ['eventBus', 'blueprint'];
