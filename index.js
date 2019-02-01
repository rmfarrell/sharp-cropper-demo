const sharp = require('sharp'),
  fs = require('fs'),
  Cropper = require('./cropper')

// main()

getCropBox()

const target = [
  200, // width
  300  // height
]

function getCropBox() {
  const image = sharp(fs.readFileSync('./test.jpg'))

  image
    .metadata()
    .then(({ height, width }) => {
      let top = 0,
        left = 0
      const cropper = new Cropper({ height, width }, { x: 100, y: 300 })
      const cropped = cropper
        .crop(...target)
        .map((val) => Math.floor(val))

      console.log('\n-- cropped\n')
      console.log(cropped)

      left = Math.abs(cropped[0])

      restHeight = cropped[2] - target[1]

      console.log('resth', cropped[2] - target[0])

      top = restHeight + cropped[1]

      const area = {
        left: cropped[2] - target[0] + cropped[0],
        top: cropped[3] - target[1] + cropped[1],
        width: target[0],
        height: target[1]
      }

      const diff = cropped[3] - target[1]

      console.log('\n-- area\n')
      console.log(area)

      return image
        .resize(...cropped.slice(2))
        .extract(area)
        .toFile('out.jpg', (err, info) => {
          if (err) {
            throw err
          }
          console.log(info)
        })
    })
}

function main() {

  sharp(fs.readFileSync('./test.jpg'))
    .resize(200, 200)
    .toFile('./test2.jpg', (err, info) => {
      if (err) {
        throw err
      }
      console.log(info)
    })
}
