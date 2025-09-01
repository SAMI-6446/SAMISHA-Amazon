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
              <select>
                <option selected value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
              </select>
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
      if (cart) {
        addtoCart(productId);
        cartQuntity();
      } else {
        return;
      }
    });
  });
  }
  if (cart) {
    cartQuntity();
  }
  generateHtml();

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
