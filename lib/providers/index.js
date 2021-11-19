import ExampleContextPadProvider from './ExampleContextPadProvider';
import BlueprintPaletteProvider from './blueprint-palette-provider';
import ExampleRuleProvider from './ExampleRuleProvider';

export default {
  __depends__: [
    'blueprint'
  ],
  __init__: [    
    'exampleContextPadProvider',
    'blueprintPaletteProvider',
    'exampleRuleProvider'
  ],
  exampleContextPadProvider: [ 'type', ExampleContextPadProvider ],
  blueprintPaletteProvider: [ 'type', BlueprintPaletteProvider ],
  exampleRuleProvider: [ 'type', ExampleRuleProvider ]
};