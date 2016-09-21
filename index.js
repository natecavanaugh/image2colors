'use strict'

const fs = require('fs')
const path = require('path')
const getPixels = require('get-pixels')
const getRgbaPalette = require('get-rgba-palette')
const chroma = require('chroma-js')
const getSvgColors = require('svg2colors')
const _map = require('lodash/map')
const _each = require('lodash/each')

const patterns = {
  base64: /;base64,/i,
  image: /\.(gif|jpg|png|svg)$/i,
  raster: /\.(gif|jpg|png)$/i,
  svgFile: /\.svg$/i,
  svgSrouce: /<svg[^>]*>[^]*<\/svg>\s*$/i
}

const paletteFromSVG = (options, callback) => {
  const palette = getSvgColors(options.image, { flat: true })
  const uniqueSvgColors = []
  let scaleColors

  _each(palette, (color) => {
    if (color.hex) {
      const hex = color.hex()
      if (uniqueSvgColors.indexOf(hex) === -1) {
        uniqueSvgColors.push(hex)
      }
    }
  })

  if (options.scaleSvg) {
    scaleColors = chroma.scale(uniqueSvgColors).colors(options.colors)
  } else {
    scaleColors = uniqueSvgColors
  }

  const colors = _map(scaleColors, (colorString) => {
    return chroma(colorString)
  })

  callback(null, colors)
}

const paletteFromBitmap = (options, callback) => {
  getPixels(options.image, function (err, pixels) {
    if (err) return callback(err)
    const palette = _map(getRgbaPalette(pixels.data, options.colors + 1), function (rgba) {
      return chroma(rgba)
    })
    return callback(null, palette)
  })
}

const colorPalette = (options, callback) => {
  options.colors = options.colors || 5
  if (typeof options.scaleSvg === 'undefined') {
    options.scaleSvg = false
  }

  // SVG
  if (options.image.match(patterns.svgFile) || options.image.match(patterns.svgSrouce)) {
    return paletteFromSVG(options, callback)
  }

  // PNG, GIF, JPG
  return paletteFromBitmap(options, callback)
}

module.exports = colorPalette
