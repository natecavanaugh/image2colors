'use strict'

const chroma = require('chroma-js')
const getPixels = require('get-pixels')
const _map = require('lodash/map')
const _each = require('lodash/each')
const _values = require('lodash/values')

const samplePalette = function (pixels) {
  const palette = {}
  _each(pixels, function (color) {
    const raw = _values(color)
    for (var i = 0; i < raw.length; i += 4) {
      var color = [
        raw[i], // r
        raw[i + 1], // g
        raw[i + 2] // b
      ]
      var colorKey = color.join(',')
      if (palette[colorKey]) {
        palette[colorKey]._n++
      } else {
        palette[colorKey] = {
          rgba: 'rgb(' + colorKey + ')',
          _n: 1
        }
      }
    }
  })
  return _values(palette)
}

const getDominantColors = function (pixels, numberOfColors) {
  numberOfColors = numberOfColors || 20
  let palette = samplePalette(pixels)
  palette.sort(function (a, b) {return b._n - a._n})
  palette = palette.slice(0, numberOfColors)
  palette = _map(palette, function (color) {
    return chroma(color.rgba)
  })
  return palette
}

const raster2colors = function (options, cb) {
  getPixels(options.image, function (err, pixels) {
    if (err) {
      return cb(err)
    }
    return cb(null, getDominantColors(pixels, options.colors))
  })
}

module.exports = raster2colors
