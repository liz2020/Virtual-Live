# AtelierPumpkin



## Build Setup

``` bash
# install dependencies
yarn install

# serve with hot reload at localhost:9080
yarn run dev

# build electron application for production
yarn run build

# run unit tests
yarn test

# lint all JS/Vue component files in `src/`
yarn run lint

```

## Decisions

### Setup eslint with prettier to auto format the files
When using electron-vue to init the project, choose Use ESLint, and then choose config by yourself. Then, follow these two links to install dependencies.（[1](https://alligator.io/vuejs/vue-eslint-plugin/) & [2](https://alligator.io/vuejs/vue-eslint-prettier/) ）After that, move the "parser: "babel-eslint"" line in .eslintrc.js file into ParserOption and change the 'html' in plugins to 'vue'.


### Enable typescript support 
- https://webpack.js.org/guides/typescript/
- https://stackoverflow.com/a/54505559/13563675
- https://madogiwa0124.hatenablog.com/entry/2020/04/25/181858


### Cannot build for windows on Mac Catalina
<del> received the error "bad CPU type in executable: wine" when trying to build for windows on mac Catalina. According to [this](https://github.com/electron/node-rcedit/issues/51), install wine-stable using "brew cask install wine-stable". Make sure "/usr/local/bin/wine64" exists. </del> Use "DEBUG=electron-builder yarn run build -w" to see the full log. It shows before the "x error:" line that the electron-builder is using rcedit-ia32.exe (even if the --x64 flag is set). Maybe could use rcedit-ia64.exe to replace that file, but not sure if that will break the electron-builder. May verify latter. 

### Open Multiple Windows
The webpack.renderer.config.js manage the window loading. Add entry for new window, and add a new HtmlWebpackPlugin in the plugin to resolve the ejs file. Then write window logic in src/main/index.js.
- https://simulatedgreg.gitbooks.io/electron-vue/content/cn/- webpack-configurations.html
- https://github.com/SimulatedGREG/electron-vue/issues/- 736#issuecomment-501968309
- https://www.electronjs.org/docs/api/browser-window
- https://www.youtube.com/watch?v=K-H2amwQ_pU&list=WL&index=3&t=0s

### Logo design
Use WordArt provided by http://www.zitiweb.com/ziti/859. This website claims the fonts are free to use. Kind of suspicious thought. 

### Mac keyboard and mouse monitoring
Existing node module [iohook](https://wilix-team.github.io/iohook/usage.html) provides supports for all three platforms. Just using the module is not enough, and I still need to read some materials to understand the reasoning behind it. 

### Color Picker
- https://narsenico.github.io/a-color-picker/
- https://github.com/narsenico/a-color-picker/pull/16

### live2d
- [editor menual](https://docs.live2d.com/cubism-editor-manual/top/)
- [Parameters standard](https://docs.live2d.com/cubism-editor-manual/standard-parametor-list/)
- [Parameters operation](https://docs.live2d.com/cubism-sdk-manual/parameters/)

### Persistent User Data
- https://medium.com/cameron-nokes/how-to-store-user-data-in-electron-3ba6bf66bc1e
- https://github.com/sindresorhus/electron-store

### CSS sticky bottom using flexbox
- https://css-tricks.com/couple-takes-sticky-footer/
- https://css-tricks.com/snippets/css/a-guide-to-flexbox/

### @types from one submodule conflict with other module
The solution is to add "types":[] in tsconfig.json under the "compilerOptions" block. See the following link
- https://github.com/microsoft/TypeScript/issues/9731#issuecomment-250371776

### Electron crash when calling getUserMedia 
Use the native terminal instead of the one provided by VScode. The VScode one does not have camera access. 
- https://github.com/electron/electron/issues/14801#issuecomment-615219188
Reference for using media
- https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia