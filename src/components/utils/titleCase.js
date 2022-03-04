import urlSlug from 'url-slug'

export const titleCase = name => {

  let revert = urlSlug.revert(name, () => name.split('-').join(' '))

  return revert.toLowerCase()
  .split(' ')
  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
  .join(' ')

}
