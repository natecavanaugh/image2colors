# image2colors

Extract colors from images. Supports GIF, JPG, PNG, and even SVG!

![example color palette](https://lh3.googleusercontent.com/aygg3azvXF-6uilOc7nS3uKU2UQFasL36pc_kPz-X9tJSAn3d839I32YyVVoD7Yfte52k6MRlh9ZTQroRIlrqqkN9lGWoA5dbZHsmGA_5A4sCvPX2iFa5sqtxOPVAl8uQg5DoEhSlqcdTRB3e58H76D7_5x_CPuj4c9UZ1KIoLQIXRMB0zJ-2PDCI1G_XS1GqH-GxYaSO_VQ6SVKWb5ascQeGi_TJUNbg0iDbiWtD4DEP-We3wEQ23qAE6H1ALDJ1qQXv4cvDfAAS1bpIoHoH9rqBZPVLLs4nCi8srhkFurMZJg7ej1dJwIMMkeLVhW7qb5-FRr5tWkcS9c4EU1-6YA-uuXvmRH5b1f6bjsc1w9G6coIV-6uH3qHDclIfBtbP7Gd4ZmUqMhvrdpqMD9rscl__tIkI-xZW9iPMy8W4Q5m5BmG5eFA16R0x4u0KeWxR_WkD8y3ebiZ2doDJahq8hrqqeokasQNDQ6uIntBwh9hmPsRuQjCagyo-VAcZ2jF4SEt1l3OOfyOrdND2LxQrSIFsMn86sYfb_xTGRGjZasFNO3YTUZBqHpSRTFszCUWMvg1hOdWElggIqDRCSlZhso2RsfCo1XcM-wNQpsXMCAHBnHMMg=w558-h390-no)

## Installation

```sh
npm install image2colors --save
```

## Usage

```js
const image2colors = require("image2colors")

image2colors({
  image: __dirname + 'double-rainbow.png',
  colors: 5,
  scaleSvg: false
}, function(err, colors) {
  // colors is an array of colors
})
```

`colors` is an array of custom objects, with occurrence (wegiht) and [chroma.js](http://gka.github.io/chroma.js) color objects. chroma.js objects have methods that lets you pick the color format you want (RGB hex, HSL, etc), and give you access to powerful color manipulation features:

```js
colors.map(pigment => pigment.color.hex())
// => ['#FFFFFF', '#123123', '#F0F0F0']
colors.map(pigment => pigment.weight)
// => [1700, 64, 23]

colors[0].color.alpha(0.5).css();
// => 'rgb(0,128,128)''
```

## Options

- image: could be a path (file system path or url), base64 data:image or svg xml string
- colors: default: 5; restrict the number of result colors
- scaleSvg: default: false; probably you need all of the svg colors, if this is ´false´, the ´colors´ option will be bypassed

## How it Works

`get-image-colors` uses [get-pixels](http://npm.im/get-pixels) to create a pixel array, then extracts a color palette with [get-rgba-palette](http://npm.im/get-rgba-palette), which uses [quantize](http://npm.im/quantize) under the hood.

Colors are converted from [get-rgba-palette's flat array format](https://github.com/mattdesl/get-rgba-palette#palettepixels-count-quality-filter) into [chroma.js color instances](http://gka.github.io/chroma.js/).

To extract palettes from SVG files, a PNG copy is created on the fly using [svg2png](http://npm.im/svg2png), which depends on PhantomJS. PhantomJS can be installed as a local node module, unlike [canvas](http://npm.im/canvas) which has [external dependencies](https://github.com/Automattic/node-canvas#installation).

## Tests

```sh
npm install
npm test
```

## Dependencies

- [chroma-js](https://github.com/gka/chroma.js): JavaScript library for color conversions
- [get-pixels](https://github.com/scijs/get-pixels): Reads the pixels of an image as an ndarray
- [svg2png](https://github.com/domenic/svg2png): A SVG to PNG converter, using PhantomJS

## Dev Dependencies

- [mocha](https://github.com/mochajs/mocha): simple, flexible, fun test framework

## Credits

The original "get-image-colors" module comes from [zeke](https://github.com/zeke/get-image-colors)
And great thanks giving for all the developers of the required dependencies.

## License

MIT

