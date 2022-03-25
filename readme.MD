# blueprinted-diagram-js

This package provides an opinionated wrapper for the excellent [diagram-js](https://github.com/bpmn-io/diagram-js) library.

Elements and rules can be configured for each instance through a typed blueprint. Events from the diagram are published via RxJs observabled.

## Styling

When using this module, don't forget to import the stylesheets:

```css
@import './node_modules/diagram-js/assets/diagram-js.css';
@import './node_modules/bpmn-font/dist/css/bpmn.css';
@import './node_modules/@softwareatlas/blueprinted-diagram-js/styles.css';
```

## Development

For easy develop of this package, link it to a typescripted client application (e.g. an Angular app) using `npm link (path to this package)`.

This way changes in this code is immediately reflected in the client application.
