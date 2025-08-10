import { cart, removeCartItem, updateDeliveryOptions } from "../../data/cart.js";
import { getProduct, products } from "../../data/products.js";
import { formatCurrency } from "../utils/money.js";
import { deliveryOptions, getDeliveryOption } from "../../data/delivery options.js";


export function renderOrderSummary(){
let cartsummeryHtml = "";
function generateCart() {
  cart.forEach((CartItem) => {
    const productId = CartItem.productid;

    const matchingproduct = getProduct(productId);
    const deliveryOptionsId = CartItem.deliveryOptions;
    const deliverOption = getDeliveryOption(deliveryOptionsId);

console.log( deliveryOptionsId)
    const today = dayjs();
    const deliveryDate = today.add(deliverOption.deliverydate, 'days');
   const dateString = deliveryDate.format('dddd, MMMM D');
     
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
            ${formatCurrency(matchingproduct.priceCents)}
          </div>
          <div class="product-quantity">
            <span>
              Quantity: <span class="quantity-label">
              ${CartItem.quantity}
              </span>
            </span>
            <span class="update-quantity-link link-primary">
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
generateCart();
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
document.querySelector(".js-order-summary").innerHTML = cartsummeryHtml;
            // the end of generate html of delivery options

function deletlisner() {
  document.querySelectorAll(".js-delet-link").forEach((link) => {
    link.addEventListener("click", () => {
      let productId = link.dataset.productId;
      removeCartItem(productId);
      let container = document.querySelector(
        `.js-cart-item-container-${productId}`
      );
      container.remove();
    });
  });
}
deletlisner();
function deliveryLisner(){
      document.querySelectorAll('.js-delivery-option')
      .forEach((element) => {
        element.addEventListener('click', () => {
          const productId = element.dataset.productId;
          const deliveryOptionsId = element.dataset.deliveryOptionsId || element.dataset['delivery-options-id'];
          updateDeliveryOptions(productId, deliveryOptionsId);
          renderOrderSummary();
        });
      });
}
deliveryLisner();
}
