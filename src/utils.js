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
}
