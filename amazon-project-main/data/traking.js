import { getProduct } from "./products.js";

export function renderTrackedProduct() {
  let raw = null;
  try {
    raw = sessionStorage.getItem("trackProduct");
  } catch (e) {
    console.error("tracking: sessionStorage unavailable", e);
    return;
  }
  const container = document.querySelector(".js-tracking-container");
  if (!raw) {
    if (container) {
      container.innerHTML = `
        <div class="tracking-empty">
          <p>No tracking information was found. Go to <a href="orders.html">Orders</a> to select a package to track.</p>
        </div>
      `;
    }
    return;
  }
  let payload;
  try {
    payload = JSON.parse(raw);
  } catch (e) {
    console.warn("tracking: invalid payload", raw);
    sessionStorage.removeItem("trackProduct");
    return;
  }
  const { productId } = payload;
  if (!productId) {
    if (container) {
      container.innerHTML = `
        <div class="tracking-empty">
          <p>Invalid tracking product. Go to <a href="orders.html">Orders</a> to try again.</p>
        </div>
      `;
    }
    return;
  }

  const product = getProduct(productId);
  if (!product) {
    console.warn("tracking: product not found", productId);
    if (container) {
      container.innerHTML = `
        <div class="tracking-empty">
          <p>Product not found for id: ${productId}. Return to <a href="orders.html">Orders</a>.</p>
        </div>
      `;
    }
    return;
  }

  if (!container) return;

  container.innerHTML = `
    <div class="tracking-product">
      <div class="product-image-container"><img src="${product.image}" alt="${
    product.name
  }" /></div>
      <div class="product-info">
        <h2 class="product-name">${product.name}</h2>
        <div class="product-price">${product.getPrice()}</div>
        <div class="product-description">${product.description || ""}</div>
        <div class="tracking-status">Status: In transit</div>
      </div>
    </div>
  `;
}

// auto-run when loaded on tracking page
document.addEventListener("DOMContentLoaded", renderTrackedProduct);
