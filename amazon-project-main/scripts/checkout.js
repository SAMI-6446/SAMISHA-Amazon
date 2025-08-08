import { cart, removeCartItem } from "../data/cart.js";
import { products } from "../data/products.js";
import { formatCurrency } from "./utils/money.js";
import { deliveryOptions } from "../data/delivery options.js";




let cartsummeryHtml = '';

function generateCart(){
cart.forEach((CartItem) => {
  let productId = CartItem.productid;
  let matchingproduct;
  // maching product to add in cart list
  products.forEach((product) => {
       if (product.id === productId) {
        matchingproduct = product;
       } 
  });

function deleverDateSelect(){
   // Add event listener for delivery option change
  setTimeout(() => {
    document.querySelectorAll(`input[name="delivery-option-${matchingproduct.id}"]`).forEach((input, idx) => {
      input.addEventListener('change', () => {
        const selectedOption = deliveryOptions[idx];
        const today = dayjs();
        const delverDate = today.add(selectedOption.deliverydate, 'days');
        const dateString = delverDate.format('dddd, MMMM D');
        const deliveryDateElem = document.querySelector(`.js-cart-item-container-${matchingproduct.id} .delivery-date`);
        if (deliveryDateElem) {
          deliveryDateElem.textContent = `Delivery date: ${dateString}`;
        }
      });
    });
  }, 0);
}
  deleverDateSelect();
  // generate cart item html
  cartsummeryHtml +=` 
    <div class="cart-item-container js-cart-item-container-${productId}">
      <div class="delivery-date">
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
            <span class="delete-quantity-link link-primary js-delet-link" data-product-id="${matchingproduct.id}">
              Delete
            </span>
          </div>
          </div>
           <div class="delivery-options">
          <div class="delivery-options-title">
            Choose a delivery option:
          </div>
          ${delivery(matchingproduct, CartItem)}
      </div> 
     </div>
    </div>`;
});
// the end of gererate html of cart

}
generateCart();

// generate html for cart item delivery options
function delivery(matchingproduct){
  let html = '';
deliveryOptions.forEach((options) => {
  const today = dayjs();
  const delverDate = today.add(options.deliverydate, 'days');
  const dateString = delverDate.format('dddd, MMMM D');
  const priceString = options.pricecent === 0 ? 'FREE' : `$${formatCurrency(options.pricecent)} -`;
 html += `
   
          
          <div class="delivery-option">
            <input type="radio" 
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
document.querySelector('.js-order-summary').innerHTML = cartsummeryHtml;
// the end of generate html of delivery options

function deletlisner(){
document.querySelectorAll('.js-delet-link').forEach((link) => {
  link.addEventListener('click', () => {

    let productId = link.dataset.productId;
    removeCartItem(productId);
    let container = document.querySelector(`.js-cart-item-container-${productId}`);
    container.remove();
  });
});
}
deletlisner();
