# Getting Started with Virtual-Live

## 1. Dowolad Cubism SDK for Web

Dowolad the Cubism SDK for Web from [here](https://www.live2d.com/download/cubism-sdk/download-web/). Then move the Core and Framework folder to static/Cubism/*. Virtual-Live currently use cubism 4 series. 

## 2. Installation dependency

``` bash
yarn install
```

## 3. During development, serve with hot reload at localhost:9080
The terminal inside vs-code do not have camera access, so you need to run this command in the original terminal instead.
``` bash
yarn run dev

```

## 3. Build electron application for production

``` bash
yarn run build

```