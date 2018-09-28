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
}
