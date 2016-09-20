const fs = require('fs')
const path = require('path')
const getPixels = require('get-pixels')
const getRgbaPalette = require('get-rgba-palette')
const chroma = require('chroma-js')
const getSvgColors = require('get-svg-colors')
const _ = require('lodash/core')

const patterns = {
  base64: /;base64,/i,
  image: /\.(gif|jpg|png|svg)$/i,
  raster: /\.(gif|jpg|png)$/i,
  svg: /svg$/i
}

const paletteFromSVG = (options, callback) => {
  const palette = getSvgColors(options.fileName, { flat: true })
  const uniqueSvgColors = []

  _.each(palette, (color) => {
    if (color.hex) {
      const hex = color.hex()
      if (uniqueSvgColors.indexOf(hex) === -1) {
        uniqueSvgColors.push(hex)
      }
    }
  })

  const scaleColors = chroma.scale(uniqueSvgColors).colors(options.colorLength)
  const colors = _.map(scaleColors, (colorString) => {
    return chroma(colorString)
  })
  callback(null, colors)
}

const paletteFromBitmap = (options, callback) => {
  getPixels(options.fileName, function (err, pixels) {
    if (err) return callback(err)
    const palette = getRgbaPalette(pixels.data, options.colorLength + 1).map(function (rgba) {
      return chroma(rgba)
    })
    return callback(null, palette)
  })
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

module.exports = colorPalette
