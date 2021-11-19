# blueprinted-diagram-js

This package provides an opinionated wrapper for the excellent [diagram-js](https://github.com/bpmn-io/diagram-js) library.

Elements and rules can be configured for each instance through a typed blueprint. Events from the diagram are published via RxJs observabled.

## Development

For easy develop of this package, link it to a typescripted client application (e.g. an Angular app) using `npm link (path to this package)`. Don't forget to @import the `styles.css` from this package!

This way changes in this code is immediately reflected in the client application.