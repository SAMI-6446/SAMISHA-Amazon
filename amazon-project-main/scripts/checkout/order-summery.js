import {
  cart,
  removeCartItem,
  updateDeliveryOptions,
  loadFromStorage,
  cartQuntity,
} from "../../data/cart.js";
import { getProduct } from "../../data/products.js";
import { formatCurrency } from "../utils/money.js";
import {
  deliveryOptions,
  getDeliveryOption,
} from "../../data/delivery-options.js";
import { renderPaymentSummary } from "./paymentSummery.js";

loadFromStorage();
export function renderOrderSummary() {
  let cartsummeryHtml = "";
  function generateCart() {
    cart.forEach((CartItem) => {
      const productId = CartItem.productid;
      const matchingproduct = getProduct(productId);
      const deliveryOptionsId = CartItem.deliveryOptions;
      const deliverOption = getDeliveryOption(deliveryOptionsId);

      const today = dayjs();
      const deliveryDate = today.add(deliverOption.deliverydate, "days");
      const dateString = deliveryDate.format("dddd, MMMM D");

      // generate cart item html
      cartsummeryHtml += ` 
      <div class="cart-item-container js-cart-item-container-${productId}"
      
      >
        <div class="delivery-date">
        Delivery date: ${dateString}
        </div>
        <div class="cart-item-details-grid">
          <img class="product-image"
            src="${matchingproduct.image}">
          <div class="cart-item-details">
            <div class="product-name">
              ${matchingproduct.name}
            </div>
            <div class="product-price">
            ${matchingproduct.getPrice()}
            </div>
            <div class="product-quantity">
              <span>
                Quantity: <span class="quantity-label">
                ${CartItem.quantity}
                </span>
              </span>
              <span class="update-quantity-link link-primary js-update-link" data-product-id="${
                matchingproduct.id
              }">
                Update
              </span>
              <span class="delete-quantity-link link-primary js-delet-link" data-product-id="${
                matchingproduct.id
              }">
                Delete
              </span>
            </div>
            </div>
            <div class="delivery-options">
            <div class="delivery-options-title">
              Choose a delivery option:
            </div>
            ${generateDeliveryOption(matchingproduct, CartItem)}
        </div> 
      </div>
      </div>`;
    });
    // the end of gererate html of cart
  }
  if (cart) {
    generateCart();
  }
  // generate html for cart item delivery options
  function generateDeliveryOption(matchingproduct, CartItem) {
    let html = "";
    deliveryOptions.forEach((options) => {
      const today = dayjs();
      const delverDate = today.add(options.deliverydate, "days");
      const dateString = delverDate.format("dddd, MMMM D");
      const priceString =
        options.pricecent === 0
          ? "FREE"
          : `$${formatCurrency(options.pricecent)} -`;
      const isChecked = options.id === CartItem.deliveryOptions;
      // data-product-id="${matchingproduct.id}"
      // data-deliveryOptions-id="${options.id}"
      html += `
    
            
            <div class="delivery-option js-delivery-option"
            data-product-id="${matchingproduct.id}"
            data-delivery-options-id="${options.id}"
            > 
              <input type="radio" 
                ${isChecked ? "checked" : ""}
                class="delivery-option-input"
                name="delivery-option-${matchingproduct.id}">
              
              <div>
                <div class="delivery-option-date">
                ${dateString}
                </div>
                <div class="delivery-option-price">
                  ${priceString} shipping
                </div>
              </div>
        </div>`;
    });

    return html;
  }
  const container = document.querySelector(".js-order-summary");
  if (!container) return;

  container.innerHTML = cartsummeryHtml;
  // the end of generate html of delivery options

  function deletlisner() {
    document.querySelectorAll(".js-delet-link").forEach((link) => {
      link.addEventListener("click", () => {
        let productId = link.dataset.productId;
        removeCartItem(productId);

        renderPaymentSummary();
        let container = document.querySelector(
          `.js-cart-item-container-${productId}`
        );
        container.remove();
        renderOrderSummary();
      });
    });
  }
  // If there are no items in the cart, show a small inline message and skip listeners
  if (!cart || cart.length === 0) {
    let msgHTML = `
       <div class="js-order-empty-notify">
               <button class="notify-dismiss" aria-label="Dismiss">×</button>

       <div class="message">Your cart is empty. Add products from the store to see them here.</div>
       <div class="actions">
        <button class="button-primary">Go to store</button>
       </div>
       </div>
    `;
    container.innerHTML = msgHTML;
    const goBtn = document.querySelector(".button-primary");
    const closeBtn = document.querySelector(".notify-dismiss");
    const notify = document.querySelector(".js-order-empty-notify");
    goBtn.addEventListener("click", () => {
      // navigate back to product listing
      window.location.href = "amazon.html";
    });
    closeBtn.addEventListener("click", () => {
      notify.remove();
    });
  } else {
    deletlisner();
    // attach update listeners so user can jump back to product page and edit
    function updateLisner() {
      document.querySelectorAll(".js-update-link").forEach((link) => {
        link.addEventListener("click", () => {
          const productId = link.dataset.productId;
          // find the cart item to prefill data on product page
          const item = cart.find(
            (c) => String(c.productid) === String(productId)
          );
          const quantity = item ? Number(item.quantity) || 1 : 1;
          try {
            sessionStorage.setItem(
              "editProduct",
              JSON.stringify({ productId, quantity })
            );
          } catch (e) {
            console.error("order-summery: failed to set editProduct", e);
          }
          // navigate to store where product listing will restore the edit
          window.location.href = "amazon.html";
        });
      });
    }
    updateLisner();
    function deliveryLisner() {
      document.querySelectorAll(".js-delivery-option").forEach((element) => {
        element.addEventListener("click", () => {
          const productId = element.dataset.productId;
          const deliveryOptionsId =
            element.dataset.deliveryOptionsId ||
            element.dataset["delivery-options-id"];
          updateDeliveryOptions(productId, deliveryOptionsId);
          renderOrderSummary();
          renderPaymentSummary();
        });
      });
    }
    deliveryLisner();
  }
  if (cart) {
    cartQuntity();
  }
}
