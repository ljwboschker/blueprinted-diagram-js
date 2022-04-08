# blueprinted-diagram-js

This package provides an opinionated wrapper for the excellent [diagram-js](https://github.com/bpmn-io/diagram-js) library.

Elements and rules can be configured for each instance through a typed blueprint.

## Styling

This package imports stylesheets from diagram-js. In order to work, you'll need a css preprocessor (like webpack with css-loader) to import them correctly.

You'll need to import the following stylesheet in your application:

```css
@import '~@softwareatlas/blueprinted-diagram-js/styles.css';
```

## Development

For easy develop of this package, link it to a typescripted client application (e.g. an Angular app) using `npm link (path to this package)`.

This way changes in this code is immediately reflected in the client application.

## Publishing

To publish this package, use npm to give it a version and push the tag to git:

```bash
npm version v1.0.2
git push --tags
```

Be sure to use [semantic versioning](https://semver.org)!

Next, [create a release in Gitlab](https://github.com/ljwboschker/blueprinted-diagram-js/releases) using this tag. The version will automatically be published to NPM by a Github action
