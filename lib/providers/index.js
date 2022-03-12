import BlueprintContextPadProvider from './blueprint-contextpad-provider';
import BlueprintPopupMenuProvider from './blueprint-popupmenu-provider';
import BlueprintPaletteProvider from './blueprint-palette-provider';
import BlueprintRuleProvider from './blueprint-rule-provider';

export default {
  __depends__: [
    'blueprint'
  ],
  __init__: [
    'blueprintContextPadProvider',
    'blueprintPaletteProvider',
    'blueprintRuleProvider',
    'blueprintPopupMenuProvider',
  ],
  blueprintContextPadProvider: ['type', BlueprintContextPadProvider],
  blueprintPaletteProvider: ['type', BlueprintPaletteProvider],
  blueprintRuleProvider: ['type', BlueprintRuleProvider],
  blueprintPopupMenuProvider: ['type', BlueprintPopupMenuProvider]
};
