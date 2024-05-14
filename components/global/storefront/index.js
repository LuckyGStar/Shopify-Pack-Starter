/**
 * A class for managing storefront API requests
 *
 * Usage example:
 *
 * import storefront from '../helpers/storefront';
 * import * as queries from '../helpers/storefront/queries';
 * const response = await storefront.request({
 *   query: queries.product,
 *   variables: {
 *     handle: 'product-handle',
 *   },
 * });
 */

class Storefront {
  constructor() {
    this.headers = {
      "X-Shopify-Storefront-Access-Token": window.api.token,
      "Content-Type": "application/json",
    };
  }

  request = async ({ query, variables = {} }) => {
    if (!window.api.token || !window.api.shop) {
      console.error("There was an error with the storefront token.");
      return undefined;
    }

    const response = await fetch(
      `https://${window.api.shop}/api/${window.api.version}/graphql.json`,
      {
        headers: this.headers,
        method: "POST",
        body: JSON.stringify({
          query,
          variables,
        }),
      }
    );
    return await response.json();
  };
}

export default new Storefront();
