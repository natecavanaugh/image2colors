'use strict'

const fs = require('fs')
const path = require('path')
const vector2colors = require('./module/vector2colors')
const raster2colors = require('./module/raster2colors')
const reduceColors = require('./module/reduceColors')

const patterns = {
  base64: /;base64,/i,
  image: /\.(gif|jpg|png|svg)$/i,
  raster: /\.(gif|jpg|png)$/i,
  svgFile: /\.svg$/i,
  svgSrouce: /<svg[^>]*>[^]*<\/svg>\s*$/i
}

const colorPalette = (options, callback) => {
  options.sample = options.sample || 1024
  options.colors = options.colors || 5
  if (typeof options.scaleSvg === 'undefined') {
    options.scaleSvg = false
  }

  // SVG
  if (options.image.match(patterns.svgFile) || options.image.match(patterns.svgSrouce)) {
    return vector2colors(options, callback)
  }

  // PNG, GIF, JPG
  return raster2colors(options, callback)
}

module.exports = colorPalette
