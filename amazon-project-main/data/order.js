import { formatCurrency } from "../scripts/utils/money.js";
import { cart } from "./cart.js";
import { getDeliveryOption } from "./delivery-options.js";
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
  
  // helper to detect the initial default placeholder order
  function isDefaultOrder(entry) {
    if (!Array.isArray(entry)) return false;
    if (entry.length < 1) return false;
    const ids = entry.map((it) => it && it.productid).filter(Boolean);
    const defaults = new Set([
      "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
      "15b6fc6f-327a-4ec4-896f-486349e85a3d",
    ]);
    // return true when every id in entry is one of the default ids
    return ids.every((id) => defaults.has(id));
  }
  function orderHtml() {
    let ordersGrid = "";
  // loop through each order container
    order.forEach((groupOfCart) => {
  //  generate uniq id for each order
  function GenerateOrderID(){
    function generateRandomString(length=20){
      const vlaue = "ABCDEFGHIGKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      const array = new Uint32Array(length);
      crypto.getRandomValues(array);
      return Array.from(array, num => vlaue[num % vlaue.length]).join("")
    }
    const generateString = new Set();
    function generateUniqueString(length){
      let str;
      do{
        str = generateRandomString(length);
      }
      while(
        generateString.has(str)
      );
      generateString.add(str);
      return str;
    };

    return generateUniqueString(20);
   };
      let orderProducts = [];
      let Shepping = 0;
  // loop through each product
      groupOfCart.forEach((Item) => {
        let ProductId = Item.productid;
        let matchingproduct = getProduct(ProductId);
        const deliveryOption = getDeliveryOption(Item.deliveryOptions);
        const today = dayjs();
        const deliveryDate = today.add(deliveryOption.deliverydate, 'days');
        const dateString = deliveryDate.format('dddd, MMMM D');
        matchingproduct.DeliveryDate = dateString;
        matchingproduct.quantity = Item.quantity;
        matchingproduct.shepping = deliveryOption.pricecent;
        Shepping += matchingproduct.shepping;
        orderProducts.push(matchingproduct);

      });
      let productDtailsHtml = "";
      let ProductPrice = 0;
  // loop through order porduct and generate its HTML 
      orderProducts.forEach((itemDtail) => {
        ProductPrice += itemDtail.priceCents * itemDtail.quantity;
        productDtailsHtml += `
            <div class="product-image-container">
              <img src="${itemDtail.image}">
            </div>

            <div class="product-details">
              <div class="product-name">
              ${itemDtail.name}
              </div>
              
              <div class="product-delivery-date">
                Arriving on: ${itemDtail.DeliveryDate}
              </div>
              <div class="product-quantity">
                Quantity: ${itemDtail.quantity}
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
  
      let OrderDay = dayjs().format('dddd, MMMM D');
      let TotalBeforeTax = ProductPrice + Shepping; 
      let Tax = TotalBeforeTax * 0.1;
      let TotalPrice = TotalBeforeTax + Tax;
      let OrderID = GenerateOrderID();
  // generate HTML  for order container
      let orderContainerHtml = `
        <div class="order-container">
            <div class="order-header">
              <div class="order-header-left-section">
                <div class="order-date">
                  <div class="order-header-label">Order Placed: ${OrderDay}</div>
                </div>
                <div class="order-total">
                  <div class="order-header-label">Total: $${formatCurrency(TotalPrice)}</div>
                </div>
            </div>
              <div class="order-header-right-section">
                <div class="order-header-label">Order ID: ${OrderID}</div>
              </div>
            </div>
          <div class="order-details-grid">
            ${productDtailsHtml}
              </div>
            </div>
          `;
      ordersGrid += orderContainerHtml;
    });
  // loop through each order product is ended
    const container = document.querySelector(".js-orders-grid");
    if (!container) {
      // Skip rendering when the DOM element is absent to avoid runtime errors.
      return;
       }
    container.innerHTML = ordersGrid;
  }
  export function addOrder() {
    // remove any placeholder/default orders before adding a real order
    try {
      order = order.filter((entry) => !isDefaultOrder(entry));
    } catch (e) {
      // ignore and proceed
      console.warn("addOrder: failed to strip default order", e);
    }
    order.unshift(cart);
    saveLocal();
    window.location.href = "orders.html";
  };
  document.addEventListener("DOMContentLoaded", () => {
    orderHtml();
  });
  const qtyEl = document.querySelector('.cart-quantity');
  if (qtyEl) qtyEl.textContent = order.length;
  