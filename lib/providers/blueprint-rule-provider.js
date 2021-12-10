import inherits from 'inherits';

import RuleProvider from 'diagram-js/lib/features/rules/RuleProvider';
import BlueprintContextPadProvider from './blueprint-contextpad-provider';

export default function BlueprintRuleProvider(eventBus, blueprint) {
  this._blueprint = blueprint;

  RuleProvider.call(this, eventBus);
}

BlueprintRuleProvider.$inject = ['eventBus', 'blueprint'];

inherits(BlueprintRuleProvider, RuleProvider);

BlueprintRuleProvider.prototype.init = function () {
  const blueprint = this._blueprint;

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

    const blueprintElement = blueprint.elements.find(e => e.type === source.type);

    if (!blueprintElement?.rules?.connect) {
      return false;
    }

    return blueprintElement?.rules?.connect.map(c => c.to).includes(target.type);
  });

  this.addRule('shape.resize', function (context) {
    return false;
  });
};