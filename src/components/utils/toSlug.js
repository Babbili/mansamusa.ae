import urlSlug from 'url-slug'

export const toSlug = (slug) => {
  if (slug !== undefined) {
    let temp = ''
    if (typeof slug === 'object') {
      temp = urlSlug(slug.en, () => slug.en.split(' ').join('-').toLowerCase())
    } else {
      temp = urlSlug(slug, () => slug.split(' ').join('-').toLowerCase())
    }
    return `/${temp}`
  } else {
    return ''
  }
}