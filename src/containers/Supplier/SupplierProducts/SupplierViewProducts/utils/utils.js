export const productValidation = product => {

  let imagesError
  // let nameErrorEn
  // let nameErrorAr
  // let descriptionErrorEn
  // let descriptionErrorAr
  // let statusError

  if (product.productImages.length === 0) {
    imagesError = {
      title: 'No images found',
      description: 'Please, add at least one image to your product'
    }
  }

  // if (product.productName.en.length <= 4) {
  //   nameErrorEn = {
  //     title: 'Product title in English is empty or too short',
  //     description: 'Please, add more descriptive title to your product'
  //   }
  // }

  // if (product.productName.ar.length <= 4) {
  //   nameErrorAr = {
  //     title: 'Product title in Arabic is empty or too short',
  //     description: 'Please, add more descriptive title to your product'
  //   }
  // }

  // if (product.productDescription.en.length <= 4) {
  //   descriptionErrorEn = {
  //     title: 'Product description in English is empty or too short',
  //     description: 'Please, add more descriptive description to your product'
  //   }
  // }

  // if (product.productDescription.ar.length <= 4) {
  //   descriptionErrorAr = {
  //     title: 'Product description in Arabic is empty or too short',
  //     description: 'Please, add more descriptive description to your product'
  //   }
  // }

  // if (product.status === 'Inactive') {
  //   statusError = {
  //     title: 'Product status is Inactive',
  //     description: 'Don\'t forget to switch status of your product when it came approved'
  //   }
  // }

  return {
    imagesError
    // statusError,
  }

}
