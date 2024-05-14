export function debounce(fn, wait) {
  let t
  return (...args) => {
    clearTimeout(t)
    t = setTimeout(() => fn.apply(this, args), wait)
  }
}

export function throttle(fn, delay) {
  let lastCall = 0
  return function (...args) {
    const now = new Date().getTime()
    if (now - lastCall < delay) {
      return
    }
    lastCall = now
    return fn(...args)
  }
}
