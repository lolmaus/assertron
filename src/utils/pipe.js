export default function pipe (...args) {
  return function (firstCallback, ...callbacks) {
    const firstResult = firstCallback(...args)

    if (!callbacks || !callbacks.length) return firstResult

    return callbacks.reduce((result, callback) => {
      return callback(result)
    }, firstResult)
  }
}
