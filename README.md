# !! NOT YET READY FOR GENERAL USE !!

## aframe-extrude-svg-component

[![Version](http://img.shields.io/npm/v/aframe-extrude-svg-component.svg?style=flat-square)](https://npmjs.org/package/aframe-extrude-svg-component)
[![License](http://img.shields.io/npm/l/aframe-extrude-svg-component.svg?style=flat-square)](https://npmjs.org/package/aframe-extrude-svg-component)

A Extrude SVG component for A-Frame.

For [A-Frame](https://aframe.io).

### API

| Property | Description | Default Value |
| -------- | ----------- | ------------- |
|          |             |               |

### Installation

#### Browser

Install and use by directly including the [browser files](dist):

```html
<head>
  <title>My A-Frame Scene</title>
  <script src="https://aframe.io/releases/0.6.0/aframe.min.js"></script>
  <script src="https://unpkg.com/aframe-extrude-svg-component/dist/aframe-extrude-svg-component.min.js"></script>
</head>

<body>
  <a-scene>
    <a-entity extrude-svg="foo: bar"></a-entity>
  </a-scene>
</body>
```

<!-- If component is accepted to the Registry, uncomment this. -->
<!--
Or with [angle](https://npmjs.com/package/angle/), you can install the proper
version of the component straight into your HTML file, respective to your
version of A-Frame:

```sh
angle install aframe-extrude-svg-component
```
-->

#### npm

Install via npm:

```bash
npm install aframe-extrude-svg-component
```

Then require and use.

```js
require('aframe');
require('aframe-extrude-svg-component');
```
