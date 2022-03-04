export const topFilter = (initialQuery, filter) => {

  return initialQuery
  .where(filter.optionTitle, '==', filter.optionValue)

}

export const dateTime = (initialQuery, filter) => {

  if (filter.filterGroupCollection === 'stores') {
    return initialQuery
    .where('createdAt', '>=', filter.optionValue.startDate)
    .where('createdAt', '<=', filter.optionValue.endDate)
  } else {
    return initialQuery
    .where('status.last_changed', '>=', filter.optionValue.startDate)
    .where('status.last_changed', '<=', filter.optionValue.endDate)
  }

}

export const stringFilter = (initialQuery, filter) => {

  return initialQuery
  .where(filter.optionValue.field, 'in', [filter.optionValue.value])

}
