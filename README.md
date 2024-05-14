# Shopify Pack Starter Theme

## Development Dependencies

1. Shopify CLI: https://shopify.dev/themes/tools/cli/installation
2. Node/NPM: https://nodejs.org/en/download/
3. Yarn: https://classic.yarnpkg.com/lang/en/docs/install/

## Developing

The build process creates individual packages for each built component (e.g. Header, Hero, Footer, Product Cards, etc). These components will each be built as a [custom HTML element](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements) and will only load each package (JS, CSS) when each component is present.

The following process should be used for creating new components.

1. Create a new folder in the `./components/` directory that is named for the component. (e.g. Hero)
1. In the above directory, create the following files:
   1. `*.scss` named for the component (e.g. `hero.scss`)
   1. `*.js` named for the component (e.g. `hero.js`)
   1. `*.*.liquid` named for the component and type of file (e.g. `section.product-carousel.scss`, `snippet.product-card.scss`)
1. `*.scss` : Will house all related styles for the section or snippet. Should import any needed variables and utility classes to ensure maintainability
1. `*.js` : Will define the custom element and house all functions related to the element.

   ```
     class SectionProductCarousel extends HTMLElement {
       constructor() {
         super();
       }
     }

     // Ensure that element is only defined once
     if (!customElements.get("section-product-carousel")) {
       customElements.define("section-product-carousel", SectionProductCarousel);
     }

   ```

1. `*.*.liquid` : Will define markup for the component. The file prefix (`snippet`, `section`) will define the folder the file is compiled into.

   ```
     {{ 'product-carousel.min.css' | asset_url | stylesheet_tag }}
     <script src="{{ 'product-carousel.min.js' | asset_url }}" defer="defer"></script>

     <section-product-carousel>
       Product Carousel Content
     </section-product-carousel>
   ```
