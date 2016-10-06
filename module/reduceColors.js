'use strict'

const palette32 = require('./palette32')
const closestColor = require('color2library/module/closestColor')
const _each = require('lodash/each')
const _maxBy = require('lodash/maxBy')
const _map = require('lodash/map')

const reduceColors = function (colors) {
  const palette = _map(colors, function (pigment) {
    pigment.p32 = closestColor(pigment.color, palette32)
    return pigment
  })
  const output = []
  const color32 = {}
  _each(palette, function (pigment) {
    if (!color32[pigment.p32]) {
      color32[pigment.p32] = []
    }
    color32[pigment.p32].push(pigment)
  })
  _each(color32, function (list) {
    const max = _maxBy(list, 'weight')
    delete max.p32
    output.push(max)
  })
  return output
}

module.exports = reduceColors
