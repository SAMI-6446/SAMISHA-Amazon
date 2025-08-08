import {
  cart,
  addtoCart,
  cartQuntity
} from "../data/cart.js";
import {
  products
} from "../data/products.js";
import { formatCurrency } from "./utils/money.js";

let producthtml = "";
products.forEach((product) => {
  producthtml += `
   <div class="product-container">
  <div class="product-delivery-date">
    Delivery: 
    ${new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()}
  </div>
            <div class="product-image-container">
             <img src="${product.image}" alt="" class="product-image">
            </div>

            <div class="product-name limit-text-to-2-lines">
              ${product.name}
            </div>

            <div class="product-rating-container">
              <img src="${
                product.rating.stars
              }" alt="" class="product-rating-stars">

              <div class="product-rating-count link-primary">
               ${product.rating.count}
              </div>
            </div>

            <div class="product-price">
              $${formatCurrency(product.priceCents)}
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
    addtoCart(productId);
    cartQuntity();
  });
});
