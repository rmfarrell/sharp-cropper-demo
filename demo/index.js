const sharp = require('sharp'),
  fs = require('fs'),
  Cropper = require('../index'),
  srcImagePath = './test.jpg',

  // -- adjust the below values.

  // this sets the focus to: 
  // a little higher than the center horizontally and;
  // pretty high (20%) vertically
  focus = {
    x: 0.4,
    y: 0.9
  },

  // this will crop 30% off all sides when zoom is set to true
  cropGuide = {
    top: 0.3,
    right: 0.7,
    bottom: 0.7,
    left: 0.4
  },

  // output height and widths
  // caluculate from width, height, res and ratio values
  targets = [
    [200, 300],
    [200, 400],
    [400, 200],
    [300, 200],
    [400, 200]
  ],

  // read image
  image = sharp(fs.readFileSync(srcImagePath));

// array of cropper outputs sent to sharp
let trimmed = [],
  zoomed = []

image
  // get the height and width of the original image
  .metadata()
  .then(({ height, width }) => {
    const cropper = new Cropper(width, height)

    // -- get Trim values

    // set the focus
    // these can be used for generating trimmed crops
    // wrapped in try/catch since setting focus can throw error with invalid errors
    try {
      cropper.focus = focus

      // run crop with all dimensions
      trimmed = targets.map((dimensions) => cropper.trim(...dimensions))
    } catch (e) {
      console.error(e)
    }

    // -- get Zoomed values
    try {
      cropper.cropGuide = cropGuide

      // run crop with all dimensions
      zoomed = targets.map((dimensions) => cropper.zoom(...dimensions))
    } catch (e) {
      console.error(e)
    }

    console.log('Trimmed')
    console.log(trimmed)
    console.log('\n\n')

    console.log('Zoomed')
    console.log(zoomed)
    console.log('\n\n')


    // handle zoomed
    zoomed.forEach((cropped, idx) => {

      // whole numbers
      cropped = cropped.map((val) => Math.ceil(val))
      const [x, y, width, height] = cropped,
        [targetWidth, targetHeight] = targets[idx]

      return image
        // resizing the image to the resized image (larger than the actual output)
        .resize(width, height)
        // extract the pixels from the resized image which corresponds to the target height and width
        .extract({
          left: Math.abs(x),
          top: Math.abs(y),
          width: targetWidth,
          height: targetHeight
        })
        .toFile(`zoomed-${targetWidth}-${targetHeight}.jpg`, (err, info) => {
          if (err) {
            throw err
          }
          console.log(info)
        })
    })


    // handle trimmed
    trimmed.forEach((cropped, idx) => {

      // whole numbers
      cropped = cropped.map((val) => Math.ceil(val))
      const [x, y, width, height] = cropped,
        [targetWidth, targetHeight] = targets[idx]

      return image
        // resizing the image to the resized image (larger than the actual output)
        .resize(width, height)
        // extract the pixels from the resized image which corresponds to the target height and width
        .extract({
          left: Math.abs(x),
          top: Math.abs(y),
          width: targetWidth,
          height: targetHeight
        })
        .toFile(`trimmed-${targetWidth}-${targetHeight}.jpg`, (err, info) => {
          if (err) {
            throw err
          }
          console.log(info)
        })
    })
  })
