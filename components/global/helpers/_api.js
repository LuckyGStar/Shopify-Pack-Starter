export async function getData(path, params = null) {
  try {
    const response = await fetch(path, params);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function postData(path, payload) {
  try {
    const response = await fetch(path, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    return response.json();
  } catch (error) {
    console.error(error);
  }
}

export const getSectionInnerHTML = (html, selector = '.shopify-section') =>
  new DOMParser().parseFromString(html, 'text/html').querySelector(selector)?.innerHTML;
