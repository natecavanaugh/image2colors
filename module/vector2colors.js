'use strict'

const getSvgColors = require('svg2colors')
const chroma = require('chroma-js')
const _map = require('lodash/map')
const _each = require('lodash/each')

const svg2colors = (options, callback) => {
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

module.exports = svg2colors
