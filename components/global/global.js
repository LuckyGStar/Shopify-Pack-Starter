import Swiper from "swiper";
import { Autoplay, EffectFade, Navigation, Pagination, Scrollbar, FreeMode, Mousewheel, Thumbs } from 'swiper/modules';
import SelectElement from './components/form-select.js'
import * as helpers from './helpers';

// Load Swiper once for re-use by any other components
window.loadSwiperFulfillPromise({ Swiper, Autoplay, EffectFade, Navigation, Pagination, Scrollbar,FreeMode, Mousewheel, Thumbs });

/**
 * Scrapes a section element for data needing to be handled in section JS
 *
 * @param {DOMNode} container
 * @returns parsed JSON
 */
window.scrapeSectionData = (container) => {
  const dataEl = container.querySelector("[data-section-data]");
  if (!dataEl) return {};

  try {
    return JSON.parse(dataEl.textContent);
  } catch {
    console.warn(
      `Error parsing data for ${container.dataset.sectionType} ${container.dataset.sectionId}`
    );
    return {};
  }
};

customElements.define('select-element', SelectElement);

Object.keys(helpers).forEach((key) => {
  window[key] = helpers[key];
});
