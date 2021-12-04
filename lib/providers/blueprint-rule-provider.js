import inherits from 'inherits';

import RuleProvider from 'diagram-js/lib/features/rules/RuleProvider';
import BlueprintContextPadProvider from './blueprint-contextpad-provider';

export default function BlueprintRuleProvider(eventBus) {
  RuleProvider.call(this, eventBus);
}

BlueprintRuleProvider.$inject = ['eventBus'];

inherits(BlueprintRuleProvider, RuleProvider);

BlueprintRuleProvider.prototype.init = function () {
  this.addRule('shape.create', function (context) {
    var target = context.target,
      shape = context.shape;

    return target.parent === shape.target;
  });

  this.addRule('connection.create', function (context) {
    const source = context.source;
    const target = context.target;

    if (!target.type || target.type === 'label') {
      return false;
    }

    if (!source.blueprint?.rules?.connect) {
      return false;
    }

    return source.blueprint?.rules?.connect.map(c => c.to).includes(target.type);
  });

  this.addRule('shape.resize', function (context) {
    return false;
  });
};