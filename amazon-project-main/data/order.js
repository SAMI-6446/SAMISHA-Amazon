import { cart } from "./cart.js";
import { getProduct } from "./products.js";

  export let order = JSON.parse(localStorage.getItem("order")) || [
    [
      {
        productid: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
        quantity: 2,
        deliveryOptions: "1",
      },
      {
        productid: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
        quantity: 1,
        deliveryOptions: "2",
      },
    ]
  ];

  function saveLocal() {
    localStorage.setItem("order", JSON.stringify(order));
  }
  function orderHtml() {
    let ordersGrid = "";
    order.forEach((groupOfCart) => {
      let orderProducts = [];
      groupOfCart.forEach((Item) => {
        let ProductId = Item.productid;
        let matchingproduct = getProduct(ProductId);
        orderProducts.push(matchingproduct);
      });
      // the end of groupof cart array
      let productDtailsHtml = "";
      orderProducts.forEach((itemDtail) => {
        productDtailsHtml += `
            <div class="product-image-container">
              <img src="images/products/athletic-cotton-socks-6-pairs.jpg">
            </div>

            <div class="product-details">
              <div class="product-name">
                Black and Gray Athletic Cotton Socks - 6 Pairs
              </div>
              
              <div class="product-delivery-date">
                Arriving on: August 15
              </div>
              <div class="product-quantity">
                Quantity: 1
              </div>
              <button class="buy-again-button button-primary">
                <img class="buy-again-icon" src="images/icons/buy-again.png">
                <span class="buy-again-message">Buy it again</span>
              </button>
            </div>

            <div class="product-actions">
              <a href="tracking.html">
                <button class="track-package-button button-secondary">
                  Track package
                </button>
              </a>
            </div> 
          `;
      });
      // the end of orderProductDtailHtml array
      let orderContainerHtml = `
        <div class="order-container">
            <div class="order-header">
              <div class="order-header-left-section">
                <div class="order-date">
                  <div class="order-header-label">Order Placed:</div>
                    <div>August 12</div>
                </div>
                <div class="order-total">
                  <div class="order-header-label">Total:</div>
                  <div>$35.06</div>
                </div>
            </div>
              <div class="order-header-right-section">
                <div class="order-header-label">Order ID:</div>
                <div>27cba69d-4c3d-4098-b42d-ac7fa62b7664</div>
              </div>
            </div>
          <div class="order-details-grid">
            ${productDtailsHtml}
              </div>
            </div>
          `;
      ordersGrid += orderContainerHtml;
    });
    const container = document.querySelector(".js-orders-grid");
    if (!container) {
      // This module can be imported on pages that don't have the orders container.
      // Skip rendering when the DOM element is absent to avoid runtime errors.
      return;
    }
    container.innerHTML = ordersGrid;
  }

  export function addOrder() {
    order.unshift(cart);
    saveLocal();
    window.location.href = "orders.html";
  }
  document.addEventListener("DOMContentLoaded", () => {
    orderHtml();
  });