const rgba2hex = (rgba) => `#${rgba.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+\.{0,1}\d*))?\)$/).slice(1).map((n, i) => (i === 3 ? Math.round(parseFloat(n) * 255) : parseFloat(n)).toString(16).padStart(2, '0').replace('NaN', '')).join('')}`

class StyleguideSwatch extends HTMLElement {
  constructor() {
    super();

    const color = window.getComputedStyle(this).backgroundColor;
    this.querySelector('span').innerHTML = rgba2hex(color);
  }
}

if (!customElements.get("styleguide-swatch")) {
  customElements.define("styleguide-swatch", StyleguideSwatch);
}