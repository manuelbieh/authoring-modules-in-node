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

- Do browsers understand `.cjs` file endings without explicitly sending a application/javascript header (assumption: they do)
- Does webpack and other bundlers find `.cjs` files without explicit configuration (assumption: as long as the `main` property in package.json points to a `.cjs` file, they do)
- How do source files need to be built/transpiled so that they can be tree-shaken by webpack et al.?
- What must happen so that Node can `import` particular ESModules without complaining

## Findings

1. Node's experimental implementation of ESModules had breaking changes/different behavior between versions `12.11.0` → `12.11.1`, `12.12.0`, `12.13.0` → `12.13.1` when `type` is set to `module` in package.json.
1. Native ESModules can only be imported in Node if the file that is importing the ESModule is ending on `.mjs` **or** if it is inside of a project that has `"type":"module"` defined in its package.json. In this case `.js` also works.
1. When importing from a relative ESModule the ~~import path~~ import identifier must contain the file suffix (`import add from './add.js'` works while `import add from './add'` does not). This is according to the current spec and matches Browser behavior as far as I can tell.
1. On the other side, if you do have `"type":"module"` in your package.json, you can use `.cjs` for commonjs modules.
1. LOL: when importing `./example/es/index.js` with ESLint with `eslint-plugin-unicorn` and autofix enabled, the `unicorn/import-index` rule automatically shortens the path to `./example/es` making the script fail.
1. Unless `"type":"module"` is set in package.json, files need to be named `.mjs` to tell Node it's an ESModule. Babel, however, does not yet support writing file extentions other than `.js`. There's been an [open PR](https://github.com/babel/babel/pull/9144#issuecomment-564542788) to add a new `--out-file-extension` option to `babel-cli` but it hasn't been merged yet. **Update:** [will probably be released with Babel 7.8!](https://github.com/babel/babel/pull/9144#issuecomment-564542788)
1. That also means that at the time of writing there seems to be **no way to safely generate ES Modules** in Babel without setting `"type":"modules"` for the complete package due to the lack of support for `.mjs` as output file extension.
1. There is an [open issue](https://github.com/microsoft/TypeScript/issues/18442) in TypeScript to support writing compiled files with a `.mjs` file-extension. Until this is done, there's also no safe support for `.mjs` as indicator for ES Modules.
1. [@karlhorky](https://twitter.com/karlhorky) pointed me to [babel-esm-plugin](https://github.com/prateekbh/babel-esm-plugin) which looks helpful until [#9144](https://github.com/babel/babel/pull/9144#issuecomment-564542788) is merged. Will investigate.
1. VSCode 1.40.2 (and probably other editors and IDEs) do not treat `.cjs` files as JavaScript but use `plaintext` instead. This can be configured by setting:
   ```
   "files.associations": {
     "*.cjs": "javascript"
   }
   ```
   `.mjs` however, is correctly detected as JavaScript.
1. Once `"type":"module"` is set, you can't use `.babelrc.js` or `webpack.config.js` anymore but you must stricly use `.cjs` and rename them `.babelrc.cjs` and `webpack.config.cjs`. That is because `@babel/core` is still using `require()` to load config files. However, Babel looks for the existence of a `.babelrc.cjs` file automatically ([source](https://github.com/babel/babel/blob/master/packages/babel-core/src/config/files/configuration.js#L26)). Webpack does not. You have to add `--config webppack.config.cjs` explicitly.
1. There is a new `exports` property in `package.json` for Node. It is a map containing aliases to tell Node where to look for imports. See [Node docs on ECMAScript Modules](https://nodejs.org/api/esm.html#esm_package_exports) for more info.

## Related links:

- https://twitter.com/MylesBorins/status/1202686414896300033
- https://twitter.com/mjackson/status/1202650812159184896
- https://github.com/graphql/graphql-js/pull/2277
- https://medium.com/@nodejs/announcing-a-new-experimental-modules-1be8d2d6c2ff
- https://nodejs.org/api/esm.html
- https://github.com/rollup/rollup/wiki/pkg.module
- https://github.com/parcel-bundler/parcel/pull/3545
- https://twitter.com/wesbos/status/1205159427491414017
- https://github.com/vanillaes

## Credits

- [@montogeek](https://twitter.com/montogeek)
- [@satya164](https://twitter.com/satya164)
- [@karlhorky](https://twitter.com/karlhorky)
- [@\_philpl](https://twitter.com/_philpl)
- [@lukejacksonn](https://twitter.com/lukejacksonn)
- [@evanplaice](https://twitter.com/evanplaice)

## Setup

If you wanna try it out yourself:

```
yarn
npx lerna bootstrap --force-local
```

_More docs on that coming soon_

## Dictionary

tbd.
