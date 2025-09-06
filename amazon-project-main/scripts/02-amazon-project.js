import { cart, addtoCart, cartQuntity, loadFromStorage } from "../data/cart.js";
import { products } from "../data/products.js";
loadFromStorage();
function generateHtml() {
  let producthtml = "";
  products.forEach((product) => {
    producthtml += `
          <div class="product-container" data-product-id="${product.id}">
          <div class="product-name limit-text-to-2-lines">
                  ${product.name}
            </div>
            <div class="product-image-container">
             <img src="${product.image}" alt="" class="product-image">
            </div>
            <div class="product-rating-container">
              <img src="${product.getStarsUrl()}" alt="" class="product-rating-stars">

              <div class="product-rating-count link-primary">
               ${product.rating.count}
              </div>
            </div>

            <div class="product-price">
            ${product.getPrice()}
            </div>

            <div class="product-quantity-container">
              <input max="99999" min="1" class="quantity-input" type="number" placeholder="Quantity">
              <p id="error">invalid value</p>
            </div>
              ${product.extraInfoHTML()}
            <div class="product-spacer">

            </div>
            <div class="added-to-cart">
              <img src="images/icons/checkmark.png" alt="">
              Added
            </div>

            
            <button class="add-to-cart-button button-primary" data-product-id= ${
              product.id
            }>
              Add to Cart
            </button>
          </div>
     `;
  });
  document.querySelector(".js-product-grid").innerHTML = producthtml;

  const addCartbtn = document.querySelectorAll(".add-to-cart-button");

  addCartbtn.forEach((button) => {
    button.addEventListener("click", () => {
      const productId = button.dataset.productId;
      if (!cart) return;
      // find the quantity select within the same product container
      const productContainer = button.closest(".product-container");
      let qty = 1;
      if (productContainer) {
        const select = productContainer.querySelector(".quantity-input");
        const errorMess = productContainer.querySelector("#error");
        if (select) {
          if (select.value >= 1 && select.value <= 101) {
            qty = Number(select.value) || 1;
          } else if (
            (select.value <= 1 || select.value >= 101) &&
            select.value
          ) {
            errorMess.style.display = "block";
          }
        }
        select.value = "";
      }
      addtoCart(productId, qty);
      cartQuntity();
      // if we arrived here from an editProduct intent with a returnTo, go back
      try {
        const raw = sessionStorage.getItem("editProduct");
        if (raw) {
          const payload = JSON.parse(raw);
          if (payload && payload.returnTo) {
            // clear the intent and navigate back
            sessionStorage.removeItem("editProduct");
            window.location.href = payload.returnTo;
            return;
          }
        }
      } catch (e) {
        // ignore
      }
    });
  });
}
if (cart) {
  cartQuntity();
}
generateHtml();

// If user clicked Update from checkout, restore edit info and focus product
function restoreEditFromSession() {
  let raw = null;
  try {
    raw = sessionStorage.getItem("editProduct");
  } catch (e) {
    console.error("restoreEditFromSession: sessionStorage unavailable", e);
    return;
  }
  if (!raw) return;
  let payload;
  try {
    payload = JSON.parse(raw);
  } catch (e) {
    console.warn("restoreEditFromSession: invalid payload", raw);
    sessionStorage.removeItem("editProduct");
    return;
  }
  const { productId, quantity, returnTo, autoAdd } = payload;
  const el = document.querySelector(`[data-product-id="${productId}"]`);
  if (!el) return;
  // highlight and scroll similar to search highlight
  el.classList.add("search-highlight");
  el.scrollIntoView({ behavior: "smooth", block: "center" });
  // prefill quantity input
  const input = el.querySelector(".quantity-input");
  if (input) {
    input.value = Number(quantity) || 1;
  }
  // if autoAdd is requested, add the product now and clear the intent
  if (autoAdd) {
    const qty = Number(quantity) || 1;
    try {
      addtoCart(productId, qty);
      cartQuntity();
    } catch (e) {
      console.error("restoreEditFromSession: autoAdd failed", e);
    }
    // remove intent so it doesn't re-run
    try {
      sessionStorage.removeItem("editProduct");
    } catch (e) {}
    // briefly flash an "Added" state on the tile (existing markup has .added-to-cart)
    const addedEl = el.querySelector(".added-to-cart");
    if (addedEl) {
      addedEl.classList.add("visible");
      setTimeout(() => addedEl.classList.remove("visible"), 2000);
    }
    // remove highlight after a short delay
    setTimeout(() => el.classList.remove("search-highlight"), 1800);
    return;
  }
  // only clear the session key later after the user acts; keep it so add flow can redirect back
  // remove highlight after a short delay
  setTimeout(() => el.classList.remove("search-highlight"), 3000);
}

restoreEditFromSession();

// --- Search / highlight functionality ---
function searchProduct() {
  // PreviousHighlight function
  function clearPreviousHighlight() {
    const prev = document.querySelectorAll(".search-highlight");
    prev.forEach((el) => el.classList.remove("search-highlight"));
  }

  function highlightAndScroll(el) {
    if (!el) return;
    clearPreviousHighlight();
    el.classList.add("search-highlight");
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    // remove highlight after animation completes (~3 cycles)
    setTimeout(() => el.classList.remove("search-highlight"), 3000);
  }

  function findMatch(query) {
    const q = (query || "").trim().toLowerCase();
    if (!q) return null;
    // first try to match name, then keywords
    let matched = products.find((p) => p.name.toLowerCase().includes(q));
    if (matched) return matched;
    matched = products.find(
      (p) => p.keywords && p.keywords.some((k) => k.toLowerCase().includes(q))
    );
    return matched || null;
  }

  function searchAndHighlight() {
    const input = document.querySelector(".search-bar");
    if (!input) return;
    const q = input.value;
    if (!q) {
      clearPreviousHighlight();
      return;
    }
    const matched = findMatch(q);
    if (!matched) return;
    const el = document.querySelector(`[data-product-id="${matched.id}"]`);
    highlightAndScroll(el);
  }

  // debounce helper
  function debounce(fn, ms) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), ms);
    };
  }
  function lisenForSearch() {
    const searchInput = document.querySelector(".search-bar");
    if (searchInput) {
      searchInput.addEventListener("input", debounce(searchAndHighlight, 180));
    }
  }
  lisenForSearch();
}
searchProduct();
