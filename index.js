const sharp = require('sharp'),
  fs = require('fs'),
  Cropper = require('./cropper'),
  srcImagePath = './test.jpg',
  outputImgPath = './out.jpg',

  // focus of image
  focus = {
    x: 100,
    y: 300
  },

  // output dimensions
  target = [
    200, // width
    300  // height
  ]

main()

const

function main() {
  const image = sharp(fs.readFileSync(srcImagePath))

  image
    // get the height and width of the original image
    .metadata()
    .then(({ height, width }) => {
      const cropper = new Cropper({ height, width }, focus)
      const cropped = cropper
        .crop(...target)
        .map((val) => Math.floor(val))

      // cropped outputs an image that is large enough to fill the the frame (resizedWidth/resizedHeight)
      // it's ceentered itn place and then shifted to fill the frame
      // x and y are offset of the resized image used to fill the space of the output image
      // since the resized image is guaranteed to leave no gaps x and y will always be either 0 or negative.
      const [
        x, // x-position of resized image
        y, // y-position of same
        resizedWidth, // width of resized image
        resizedHeight // height of resized image
      ] = croppped

      console.log('\n-- cropped\n')
      console.log(cropped)

      // this is the param that extract taks
      const area = {
        left: cropped[2] - target[0] + cropped[0],
        top: cropped[3] - target[1] + cropped[1],
        width: target[0],
        height: target[1]
      }

      console.log('\n-- area\n')
      console.log(area)

      return image
        // resizing the image to the resized image (larger than the actual output)
        .resize(...cropped.slice(2))
        // extract the pixels from the resized image which corresponds to the target height and width
        .extract(area)
        .toFile('out.jpg', (err, info) => {
          if (err) {
            throw err
          }
          console.log(info)
        })
    })
}
