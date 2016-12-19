'use strict'

const chroma = require('chroma-js')
const getPixels = require('get-pixels')
var imageType = require('image-type')
const palette32 = require('./palette32')
const reduceColors = require('./reduceColors')
const _map = require('lodash/map')
const _each = require('lodash/each')
const _values = require('lodash/values')

const samplePalette = function (pixels) {
  const palette = {}
  _each(pixels, function (axis) {
    const raw = _values(axis)
    for (var i = 0; i < raw.length; i += 4) {
      const color = [
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


const getStrongColors = function (pixels, colors) {
  colors = colors || 1024
  // Search for the strongest 1024 colors
  let palette = samplePalette(pixels)
  palette.sort(function (a, b) {return b.weight - a.weight})
  return palette.slice(0, colors)
}

const getMainColors = function (palette, colors) {
  colors = colors || 20
  // Group found colors by 32 base colors and get the strongest
  let list = reduceColors(palette)
  return list.slice(0, colors)
}

const getChromaColors = function (palette) {
  return _map(palette, function (pigment) {
    pigment.color = chroma(pigment.color)
    return pigment
  })
}

const getDominantColors = function (pixels, options) {
  const strongs = getStrongColors(pixels, options.sample)
  const raw = getMainColors(strongs, options.colors)
  return getChromaColors(raw)
}

const raster2colors = function (options, cb) {
  const callback = function (err, pixels) {
    if (err) {
      return cb(err)
    }
    return cb(null, getDominantColors(pixels, options))
  };

  if (Buffer.isBuffer(options.image)) {
    getPixels(options.image, imageType(options.image).mime, callback)
  }
  else {
    getPixels(options.image, callback)
  }
}

module.exports = raster2colors