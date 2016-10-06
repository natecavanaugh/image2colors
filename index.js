'use strict'

const fs = require('fs')
const path = require('path')
const vector2colors = require('./module/vector2colors.js')
const raster2colors = require('./module/raster2colors.js')
const _map = require('lodash/map')

const patterns = {
  base64: /;base64,/i,
  image: /\.(gif|jpg|png|svg)$/i,
  raster: /\.(gif|jpg|png)$/i,
  svgFile: /\.svg$/i,
  svgSrouce: /<svg[^>]*>[^]*<\/svg>\s*$/i
}

const paletteFromBitmap = (options, callback) => {
  raster2colors(options, function (err, colors) {
    if (err) return callback(err)
    return callback(null, colors)
  })
}

const colorPalette = (options, callback) => {
  options.colors = options.colors || 5
  if (typeof options.scaleSvg === 'undefined') {
    options.scaleSvg = false
  }

  // SVG
  if (options.image.match(patterns.svgFile) || options.image.match(patterns.svgSrouce)) {
    return vector2colors(options, callback)
  }

  // PNG, GIF, JPG
  return paletteFromBitmap(options, callback)
}

module.exports = colorPalette
