const fs = require('fs')
const path = require('path')
const getPixels = require('get-pixels')
const getRgbaPalette = require('get-rgba-palette')
const chroma = require('chroma-js')
const getSvgColors = require('get-svg-colors')

const patterns = {
  image: /\.(gif|jpg|png|svg)$/i,
  raster: /\.(gif|jpg|png)$/i,
  svg: /svg$/i
}

module.exports = function colorPalette (options, callback) {
  options.colorLength = options.colorLength || 5

  // SVG
  if (options.fileName.match(patterns.svg)) {
    return callback(null, getSvgColors(options.fileName, {flat: true}))
  }

  // PNG, GIF, JPG
  return paletteFromBitmap(options, callback)
}

function paletteFromBitmap (options, callback) {
  getPixels(options.fileName, function (err, pixels) {
    if (err) return callback(err)
    const palette = getRgbaPalette(pixels.data, options.colorLength).map(function (rgba) {
      return chroma(rgba)
    })
    return callback(null, palette)
  })
}
