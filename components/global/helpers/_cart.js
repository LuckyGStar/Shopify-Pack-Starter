import { getData, postData } from "./_api";

function informCartUpdated() {
  const event = new CustomEvent("cartUpdated");
  document.dispatchEvent(event);
}

export async function getCart() {
  const response = await getData("/cart.js");
  return response;
}

export async function addToCart(items) {
  const response = await postData("/cart/add.js", {
    items,
  });
  informCartUpdated();
  return response;
}

export async function updateCart(id, quantity) {
  const response = await postData("/cart/change.js", {
    id,
    quantity,
  });
  informCartUpdated();
  return response;
}

export async function clearCart() {
  const response = await postData("/cart/clear.js");
  informCartUpdated();
  return response;
}
