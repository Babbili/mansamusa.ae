import { isEven } from './isEven'

export const gridBuilder = (length, index) => {

  let col = ''

  if (length === 1) {
    col = 'col-12'
  } else if (length === 2) {
    col = 'col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12 mb-lg-5 mb-4'
  } else if (length === 3) {
    col = 'col-xl-4 col-lg-4 col-md-4 col-sm-12 col-12 mb-lg-5 mb-4'
  } else if (length === 4) {
    col = 'col-xl-3 col-lg-6 col-md-6 col-sm-6 col-12 mb-lg-5 mb-4'
  } else if (length === 5) {
    if (index <= 2) {
      col = 'col-xl-4 col-lg-4 col-md-4 col-sm-6 col-12 mb-lg-5 mb-4'
    } else if (index === length - 1) {
      col = 'col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12 mb-lg-5 mb-4'
    } else {
      col = 'col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 mb-lg-5 mb-4'
    }
  } else if (length === 6) {
    col = 'col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12 mb-lg-5 mb-4'
  } else if (length === 7) {
    if (index <= 2) {
      col = 'col-xl-4 col-lg-4 col-md-4 col-sm-12 col-12 mb-lg-5 mb-4'
    } else if (index === length - 1) {
      col = 'col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12 mb-lg-5 mb-4'
    } else {
      col = 'col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12 mb-lg-5 mb-4'
    }
  } else if (length === 8) {
    col = 'col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12 mb-lg-5 mb-4'
  } else if (length === 9) {
    if (index <= 1) {
      col = 'col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12 mb-lg-5 mb-4'
    } else if (index > 1 && index <= 5) {
      col = 'col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12 mb-lg-5 mb-4'
    } else if (index === length - 1) {
      col = 'col-xl-4 col-lg-4 col-md-4 col-sm-12 col-12 mb-lg-5 mb-4'
    } else {
      col = 'col-xl-4 col-lg-4 col-md-4 col-sm-6 col-12 mb-lg-5 mb-4'
    }
  } else if (length === 10) {
    if (index <= 7) {
      col = 'col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12 mb-lg-5 mb-4'
    } else {
      col = 'col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 mb-lg-5 mb-4'
    }
  } else {
    if (isEven(length)) {
      col = 'col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12 mb-lg-5 mb-4'
    } else {
      if (index <= length - 4) {
        col = 'col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12 mb-lg-5 mb-4'
      } else if (index <= length - 1) {
        col = 'col-xl-4 col-lg-4 col-md-4 col-sm-12 col-12 mb-lg-5 mb-4'
      } else {
        col = 'col-xl-4 col-lg-4 col-md-4 col-sm-6 col-12 mb-lg-0 mb-4'
      }
    }
  }

  return col

}
