import inherits from 'inherits';

import RuleProvider from 'diagram-js/lib/features/rules/RuleProvider';
import { findBlueprint } from '../utils/find-utils';

export default function BlueprintRuleProvider(eventBus, blueprint) {
  this._blueprint = blueprint;

  RuleProvider.call(this, eventBus);
}

BlueprintRuleProvider.$inject = ['eventBus', 'blueprint'];

inherits(BlueprintRuleProvider, RuleProvider);

BlueprintRuleProvider.prototype.init = function init() {
  const blueprint = this._blueprint;

  this.addRule('shape.create', (context) => {
    const { target, shape } = context;

    return target.parent === shape.target;
  });

  this.addRule('connection.create', (context) => {
    const { source, target } = context;

    if (!target.type || target.type === 'label') {
      return false;
    }

    const blueprintElement = findBlueprint(blueprint, source);

    if (!blueprintElement?.rules?.connect) {
      return false;
    }

    return blueprintElement?.rules?.connect.map((c) => c.to).includes(target.blueprint);
  });

  this.addRule('shape.resize', () => false);
};
