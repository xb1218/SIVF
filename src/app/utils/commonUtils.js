import moment from 'moment'

export const debounce = (fn, ms) => {
  let timeoutId
  return function () {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      fn.apply(this, arguments)
    }, ms)
  }
}

export const substract = (date) => {
  return moment(date).subtract(1, 'days')
}

export const add = (date) => {
  return moment(date).add(1, 'days')
}

export function safeParse(jsonStr) {
  return jsonStr ? JSON.parse(jsonStr) : {}
}

export const isRequireEmpty = (value) => {
  switch (toString.call(value)) {
    case '[object Null]':
      return true
    case '[object Undefined]':
      return true
    case '[object Array]':
      return value.length === 0
    case '[object String]':
      return value.trim() === ''
    default:
      return false
  }
}

