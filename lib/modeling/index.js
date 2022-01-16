import CommandModule from 'diagram-js/lib/command';
import ChangeSupportModule from 'diagram-js/lib/features/change-support';
import SelectionModule from 'diagram-js/lib/features/selection';
import RulesModule from 'diagram-js/lib/features/rules';

import CroppingConnectionDocking from 'diagram-js/lib/layout/CroppingConnectionDocking';
import Modeling from './modeling';
import ConnectionLayouter from './connection-layouter';
import DiagramElementUpdater from './diagram-element-updater';
import BehaviorModule from './behavior';

export default {
  __init__: ['modeling', 'diagramElementUpdater'],
  __depends__: [
    BehaviorModule,
    CommandModule,
    ChangeSupportModule,
    SelectionModule,
    RulesModule
  ],
  modeling: ['type', Modeling],
  layouter: ['type', ConnectionLayouter],
  diagramElementUpdater: ['type', DiagramElementUpdater],
  connectionDocking: ['type', CroppingConnectionDocking]
};
