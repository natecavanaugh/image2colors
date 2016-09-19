const fs = require('fs')
const path = require('path')
const getPixels = require('get-pixels')
const getRgbaPalette = require('get-rgba-palette')
const chroma = require('chroma-js')
const getSvgColors = require('get-svg-colors')
const _ = require('lodash/core')

const patterns = {
  image: /\.(gif|jpg|png|svg)$/i,
  raster: /\.(gif|jpg|png)$/i,
  svg: /svg$/i
}

const paletteFromSVG = (options, callback) => {
  const palette = getSvgColors(options.fileName, { flat: true })
  const paletteByHex = {}

  _.each(palette, (color) => {
    if (color.hex) {
      const hex = color.hex()
      if (!paletteByHex[hex]) {
        paletteByHex[hex] = color
      }
    }
  })

  callback(null, _.toArray(paletteByHex))
}

const colorPalette = (options, callback) => {
  options.colorLength = options.colorLength || 5

  // SVG
  if (options.fileName.match(patterns.svg)) {
    return paletteFromSVG(options, callback)
  }

  // PNG, GIF, JPG
  return paletteFromBitmap(options, callback)
}

const paletteFromBitmap = (options, callback) => {
  getPixels(options.fileName, function (err, pixels) {
    if (err) return callback(err)
    const palette = getRgbaPalette(pixels.data, options.colorLength).map(function (rgba) {
      return chroma(rgba)
    })
    return callback(null, palette)
  })
}

module.exports = colorPalette
