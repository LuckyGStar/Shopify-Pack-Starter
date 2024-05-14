import * as fragments from "./fragments";

export const products = `
  query products($ids: [ID!]!) {
    nodes(ids: $ids) {
      ...on Product {
        ${fragments.product}
      }
    }
  }
`;

export const product = `
  query product($handle: String!) {
    productByHandle(handle: $handle) {
      ${fragments.product}
    }
  }
`;

export const productsByTag = (group) => `
  query {
    products(query: "tag:'${group}'", first: 20, sortKey: TITLE) {
      edges {
        cursor
        node {
          ${fragments.product}
        }
      }
    }
  }
`;

export const productsByCollection = (handle, productsQuery) => `
  query {
    collection(handle: "${handle}") {
      handle
      products(${productsQuery}) {
        pageInfo {
          endCursor
          hasNextPage
          hasPreviousPage
          startCursor
        }
        edges {
          cursor
          node {
            ${fragments.product}
          }
        }
      }
    }
  }

`;