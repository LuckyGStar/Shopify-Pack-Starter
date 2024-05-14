export const product = `
  id
  handle
  title
  onlineStoreUrl
  priceRange {
    minVariantPrice {
      amount
      currencyCode
    }
  }
  compareAtPriceRange {
    minVariantPrice {
      amount
      currencyCode
    }
  }
  options {
    name
    values
  }
  variants(first: 50) {
    edges {
      node {
        id
        title
        availableForSale
        price {
          amount
        }
        selectedOptions {
          name
          value
        }
      }
    }
  }
  media(first: 2) {
    edges {
      node {
        previewImage {
          url
        }
      }
    }
  }
  metafield: metafield(namespace: "custom", key:"absorbency_attribute") {
    value
    description
    type
   }
`;
