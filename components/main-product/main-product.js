class MainProduct extends HTMLElement {
  constructor() {
    super()
  }
}

if (!customElements.get('main-product')) {
  customElements.define('main-product', MainProduct)
}
