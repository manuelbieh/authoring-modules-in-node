# Authoring and publishing packages in Node

I am not sure yet if it is realistic, I'm not even sure if this all makes sense, but I want to find a way to build and publish a JavaScript package that works both in the Browser and in Node with the minimal possible effort. With commonjs and esm. With support for treeshaking. Without going crazy on configuration or build steps and without changing the way you're working right now (or at least without changing it too much).

The main reason for this investigation is a [(still unresolved) issue](https://github.com/manuelbieh/geolib/issues/208) I got in an open source project of mine. At the time of writing this, I have absolutely no idea how an ideal solution to that issue could look like.

## Specific goals

- browser support by directly embedding a transpiled/bundled UMD version via `<script src></script>`
- browser support for `<script type="module" src></script>`
- full backwards-compatibilty with commonjs and `require()` in Node
- tree-shaking support for bundlers like Parcel.js, Rollup or Webpack
- work effortlessly with the current state of Node's experimental support for ECMAScript Modules (`import x from 'x'`, without additional build step required)
- stick with Babel + Webpack for transpiling and bundling the library that is published to npm
- do not require users to make changes to their existing build tools

## Things to find out

- Do browsers understand .cjs file endings without explicitly sending a application/javascript header (assumption: they do)
- Does webpack and other bundlers find `.cjs` files without explicit configuration (assumption: as long as the `main` property in package.json points to a `.cjs` file, they do)
- How do source files need to be built/transpiled so that they can be tree-shaken by webpack et al.?
- What must happen so that Node can `import` particular ESModules without complaining

## Findings

1. Node's experimental implementation of ESModules had breaking changes/different behavior between versions `12.11.0` → `12.11.1`, `12.12.0`, `12.13.0` → `12.13.1` when `type` is set to `module` in package.json.
1. Native ESModules can only be imported in Node if the file that is importing the ESModule is ending on `.mjs` **or** if it is inside of a project that has `"type": "module"` defined in its package.json. In this case `.js` also works.
1. When importing from a relative ESModule the import path must contain the file suffix (`import add from './add.js'` works while `import add from './add'` does not). This is according to the current spec and matches Browser behavior as far as I know.
1. LOL: when importing `./example/es/index.js` with ESLint with `eslint-plugin-unicorn` and autofix enabled, the `unicorn/import-index` rule automatically shortens the path to `./example/es` making the script fail.

## Related tweets:

- https://twitter.com/MylesBorins/status/1202686414896300033
- https://twitter.com/mjackson/status/1202650812159184896

## Credits

- [@montogeek](https://twitter.com/montogeek)
- [@satya164](https://twitter.com/satya164)

## Setup

If you wanna try it out yourself:

```
npx lerna bootstrap --force-local
```
