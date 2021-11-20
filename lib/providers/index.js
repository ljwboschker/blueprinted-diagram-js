import BlueprintContextPadProvider from './blueprint-contextpad-provider';
import BlueprintPaletteProvider from './blueprint-palette-provider';
import BlueprintRuleProvider from './blueprint-rule-provider';

export default {
  __depends__: [
    'blueprint'
  ],
  __init__: [    
    'blueprintContextPadProvider',
    'blueprintPaletteProvider',
    'blueprintRuleProvider'
  ],
  blueprintContextPadProvider: [ 'type', BlueprintContextPadProvider ],
  blueprintPaletteProvider: [ 'type', BlueprintPaletteProvider ],
  blueprintRuleProvider: [ 'type', BlueprintRuleProvider ]
};