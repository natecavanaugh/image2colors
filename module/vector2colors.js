'use strict'

const getSvgColors = require('svg2colors')
const chroma = require('chroma-js')
const _map = require('lodash/map')
const _each = require('lodash/each')

const svg2colors = (options, callback) => {
  const svgColors = getSvgColors(options.image, { flat: true })
  const palette = {}
  let colors

  _each(svgColors, (color) => {
    if (color.hex) {
      const colorKey = color.rgb().toString()
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

  if (options.scaleSvg) {
    var colorList = _map(palette, function (pigment) {
      return pigment.color
    })
    colors = chroma.scale(colorList).colors(options.colors)
    colors = _map(colors, function (hex) {
      return {
        weight: 0,
        color: chroma(hex)
      }
    })
  } else {
    colors = _map(palette, function (pigment) {
      return {
        weight: pigment.weight,
        color: chroma(pigment.color)
      }
    })
  }

  callback(null, colors)
}

module.exports = svg2colors
