import RuleProvider from 'diagram-js/lib/features/rules/RuleProvider';
import { executeConnectionRule, findBlueprint } from '../utils/find-utils';

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

      const connection = executeConnectionRule(this._blueprint, source, target);
      return connection !== undefined;
    });

    this.addRule('shape.resize', (context) => {
      const { shape } = context;

      const blueprintElement = findBlueprint(this._blueprint, shape);
      return blueprintElement?.rules?.resizable || false;
    });
  }
}

BlueprintRuleProvider.$inject = ['eventBus', 'blueprint'];
