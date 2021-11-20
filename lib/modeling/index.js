import BehaviorModule from './behavior';
import CommandModule from 'diagram-js/lib/command';
import ChangeSupportModule from 'diagram-js/lib/features/change-support';
import SelectionModule from 'diagram-js/lib/features/selection';
import RulesModule from 'diagram-js/lib/features/rules';

import Modeling from 'diagram-js/lib/features/modeling/Modeling';
import ConnectionLayouter from './connection-layouter';
import DiagramElementUpdater from './diagram-element-updater';
import CroppingConnectionDocking from 'diagram-js/lib/layout/CroppingConnectionDocking';

export default {
    __depends__: [
        BehaviorModule,
        CommandModule,
        ChangeSupportModule,
        SelectionModule,
        RulesModule
    ],
    __init__: ['modeling', 'diagramElementUpdater'],
    modeling: ['type', Modeling],
    layouter: ['type', ConnectionLayouter],
    diagramElementUpdater: ['type', DiagramElementUpdater],
    connectionDocking: ['type', CroppingConnectionDocking]
};
