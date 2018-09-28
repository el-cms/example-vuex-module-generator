export default {
  camelize (snakeText, capitalizeFirstLetter = true) {
    let regexp = /(_\w)/g
    if (capitalizeFirstLetter) {
      regexp = /(^\w|_\w)/g
    }
    const out = snakeText.replace(regexp, (match) => {
      if (match.length > 1) {
        return match[1].toUpperCase()
      } else {
        return match.toUpperCase()
      }
    })
    return out
  },

  // Return true if the given value is an object
  isObject (object) { return object !== null && typeof object === 'object'},

  // Return true if the given object has the given key
  objectHasKey (object, property) {
    if (this.isObject(object)) { return Object.prototype.hasOwnProperty.call(object, property) }
    return false
  },

  // Filters object keys with a callback testing its value
  filterObject (obj, test, first = false) {
    if (obj !== null && typeof obj === 'object') {
      const results = {}
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (test(obj[key], key)) {
            if (first) {
              return obj[key]
            }
            results[key] = obj[key]
          }
        }
      }
      return results
    }

    throw new Error('The thing you try to filter is not an object.')
  },
}
