import ExampleContextPadProvider from './ExampleContextPadProvider';
import BlueprintPaletteProvider from './blueprint-palette-provider';
import BlueprintRuleProvider from './blueprint-rule-provider';

export default {
  __depends__: [
    'blueprint'
  ],
  __init__: [    
    'exampleContextPadProvider',
    'blueprintPaletteProvider',
    'blueprintRuleProvider'
  ],
  exampleContextPadProvider: [ 'type', ExampleContextPadProvider ],
  blueprintPaletteProvider: [ 'type', BlueprintPaletteProvider ],
  blueprintRuleProvider: [ 'type', BlueprintRuleProvider ]
};