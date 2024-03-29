# blueprinted-diagram-js

This package provides an opinionated wrapper for the excellent [diagram-js](https://github.com/bpmn-io/diagram-js) library.

Elements and rules can be configured for each instance through a typed blueprint.

## Installation

Install [diagram-js](https://www.npmjs.com/package/diagram-js), [bpmn-font](https://www.npmjs.com/package/bpmn-font) and [this package](https://www.npmjs.com/package/@softwareatlas/blueprinted-diagram-js) together:

```
npm install diagram-js bpmn-font @softwareatlas/blueprinted-diagram-js
```

## Styling

Make sure you import all required stylesheets in the appropriate order. For example, when using webpack with css-loader:

```css
@import '~diagram-js/assets/diagram-js.css';
@import '~bpmn-font/dist/css/bpmn.css';
@import '~@softwareatlas/blueprinted-diagram-js/styles.css';
```

## Development

For easy develop of this package, link it to a typescripted client application (e.g. an Angular app).

Check https://docs.npmjs.com/cli/v8/commands/npm-link for more information.

## Versioning

This package heavily relies on diagram-js, so it follows a similar version numbering. We'll keep the major version in sync with diagram-js.

The minor and patch version can vary, based on features in the blueprinted-diagram-js package itself.


## Publishing

To publish this package, use npm to give it a version and push the tag to git:

```bash
npm version v1.0.2
git push --tags
```

Be sure to use [semantic versioning](https://semver.org)!

Next, [create a release in Gitlab](https://github.com/ljwboschker/blueprinted-diagram-js/releases) using this tag. The version will automatically be published to NPM by a Github action
