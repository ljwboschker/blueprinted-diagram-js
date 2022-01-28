import RuleProvider from 'diagram-js/lib/features/rules/RuleProvider';
import { findBlueprint } from '../utils/find-utils';

export default class BlueprintRuleProvider extends RuleProvider {
  constructor(eventBus, blueprint) {
    super(eventBus);
    this._blueprint = blueprint;
  }

  init() {
    this.addRule('shape.create', (context) => {
      const { target, shape } = context;

      return target.parent === shape.target;
    });

    this.addRule('connection.create', (context) => {
      const { source, target } = context;

      if (!target.type || target.type === 'label') {
        return false;
      }

      const blueprintElement = findBlueprint(this._blueprint, source);
      if (!blueprintElement?.rules?.connect) {
        return false;
      }

      return blueprintElement?.rules?.connect.map((c) => c.to).includes(target.blueprint);
    });

    this.addRule('shape.resize', (context) => {
      const { shape } = context;

      const blueprintElement = findBlueprint(this._blueprint, shape);
      return blueprintElement?.rules?.resizable || false;
    });
  }
}

BlueprintRuleProvider.$inject = ['eventBus', 'blueprint'];
