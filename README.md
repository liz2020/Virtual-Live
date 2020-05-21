# pumpkinface



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

#### Setup eslint with prettier to auto format the files
When using electron-vue to init the project, choose Use ESLint, and then choose config by yourself. Then, follow these two links to install dependencies.（[1](https://alligator.io/vuejs/vue-eslint-plugin/) & [2](https://alligator.io/vuejs/vue-eslint-prettier/) ）After that, move the "parser: "babel-eslint"" line in .eslintrc.js file into ParserOption and change the 'html' in plugins to 'vue'.


#### Enable typescript support 
https://webpack.js.org/guides/typescript/
https://stackoverflow.com/a/54505559/13563675
https://madogiwa0124.hatenablog.com/entry/2020/04/25/181858
