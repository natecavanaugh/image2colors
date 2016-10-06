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
        palette[colorKey].weight++
      } else {
        palette[colorKey] = {
          color: 'rgb(' + colorKey + ')',
          weight: 1
        }
      }
    }
  })
  return _values(palette)
}

const getDominantColors = function (pixels, numberOfColors) {
  numberOfColors = numberOfColors || 20
  let palette = samplePalette(pixels)
  palette.sort(function (a, b) {return b.weight - a.weight})
  palette = palette.slice(0, numberOfColors)
  palette = _map(palette, function (pigment) {
    return {
      weight: pigment.weight,
      color: chroma(pigment.color)
    }
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
