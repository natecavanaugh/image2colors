/* globals describe, it */

const image2colors = require('..')
const assert = require('assert')
const fs = require('fs')

describe('image2colors', function () {

  const testPalette = (err, palette, done) => {
    if (err) throw err
    assert(Array.isArray(palette))
    assert(palette.length)
    palette = palette.map(color => color.hex())
    console.log()
    console.info('Palette length: ', palette.length)
    console.info('Palette: ', JSON.stringify(palette))
    assert(palette[0].match(/^#[0-9a-f]{3,6}$/i))
    done()
  }


  it('works on base64 images', (done) => {
    const base64image = fs.readFileSync(__dirname + '/fixtures/thumb.base64').toString()
    image2colors({
      fileName: base64image,
      colorLength: 10
    }, (err, palette) => ( testPalette(err, palette, done) ))
  })

  it('works on JPG images', (done) => {
    image2colors({
      fileName: __dirname + '/fixtures/thumb.jpg',
      colorLength: 10
    }, (err, palette) => ( testPalette(err, palette, done) ))
  })

  it('works on GIF images', (done) => {
    image2colors({
      fileName: __dirname + '/fixtures/thumb.gif',
      colorLength: 10
    }, (err, palette) => ( testPalette(err, palette, done) ))
  })

  it('works on PNG images', (done) => {
    image2colors({
      fileName: __dirname + '/fixtures/thumb.png',
      colorLength: 10
    }, (err, palette) => ( testPalette(err, palette, done) ))
  })

  it('works on SVG images', (done) => {
    image2colors({
      fileName: __dirname + '/fixtures/thumb.svg',
      colorLength: 10
    }, (err, palette) => ( testPalette(err, palette, done) ))
  })

})
