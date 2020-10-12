export function strNorm (str) {
  return str.toLowerCase().normalize('NFD').replace(
    /[\u0300-\u036f]/g, ''
  )
}

export function strSort (arr, attr) {
  const newArr = [...arr]
  if (attr) {
    newArr.sort((a, b) => strNorm(a[attr]) < strNorm(b[attr]) ? -1 : 1)
  } else {
    newArr.sort((a, b) => strNorm(a) < strNorm(b) ? -1 : 1)
  }
  return newArr
}

export function productStars (reviews) {
  if (reviews && reviews.length) {
    return reviews.reduce((acc, cur) => acc + Number(cur.rating), 0) / reviews.length
  } else {
    return 0
  }
}
