const cloudinary = require('../../../utils/cloudinary')
const removeTmp = require('../../../utils/removeTmp')
const { asyncForEach, catchAsync } = require('../../../common/commonFunctions')
const { jsonResponse } = require('../../../common/response')
const AppError = require('../../../common/error')

const uploadImageToCloudinary = async (image, options) => {
  let imageObj = await cloudinary.v2.uploader.upload(image, options)
  imageObj.url = imageObj.url.split('upload').join('upload/f_auto')
  return imageObj
}

exports.uploadImages = catchAsync(async (req, res, next) => {
  let results = []
  let images = []
  req.body.from = req.body.from || 'unknown'
  if (req.files && req.files.image) {
    if (Array.isArray(req.files.image) && req.files.image.length) {
      images = [...req.files.image]
    } else if (Object.keys(req.files.image).length > 0) {
      images.push(req.files.image)
    } else {
      return next(new AppError('No images to upload', 400))
    }
    await asyncForEach(images, async (image) => {
      const { public_id, url } = await uploadImageToCloudinary(image.tempFilePath, { folder: req.body.from })
      removeTmp(image.tempFilePath)
      results.push({ public_id, url, name: image.name })
    })
  } else {
    return next(new AppError('No images to upload', 400))
  }

  jsonResponse(res, 202, 'success', {
    message: 'Image upladed successfully',
    images: results,
  })
})

exports.deleteImages = catchAsync(async (req, res, next) => {
  const images = req.body.images
  await asyncForEach(images, async (image) => {
    const data = await cloudinary.v2.uploader.destroy(image.public_id)
    console.log(data)
  })
  jsonResponse(res, 202, 'success', {
    message: 'Images deleted successfully',
    images,
  })
})
