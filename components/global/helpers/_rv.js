const setCookie = (name, value, days) => {
    let expires = ''

    if (days) {
      const date = new Date()
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
      expires = `expires=${date.toUTCString()}`
    }
    document.cookie = `${name}=${(value || '')};${expires};path=/`
}

const getCookie = (name) => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop().split(';').shift()
}

const getRecentlyViewedProducts = () => {
  let viewedProducts = []
  const cookie = getCookie('recently_viewed_products')
  if (cookie) {
    viewedProducts = JSON.parse(cookie)
  }
  return viewedProducts
}

const addRecentlyViewedProduct = (productId) => {
  const viewedProducts = getRecentlyViewedProducts()
  const index = viewedProducts.indexOf(productId)
  if (index > -1) {
    viewedProducts.splice(index, 1)
  }
  viewedProducts.unshift(productId)
  setCookie('recently_viewed_products', JSON.stringify(viewedProducts), 30)
}

export {
  getRecentlyViewedProducts,
  addRecentlyViewedProduct,
}
