    import { cart } from "./cart.js";
    import { getProduct } from "./products.js";
    export let order = JSON.parse(localStorage.getItem('order')) || [
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
    ];
   
    function saveLocal(){
        localStorage.setItem('order', JSON.stringify(order));
    }
 function orderHtml(){ 
            let orderHtmlStr = "";
        order.forEach((item) => {
            let ProductId = item.productid;
            const matchingproduct = getProduct(ProductId);
            orderHtmlStr += `
                    <div class="product-image-container">
                    <img src="${matchingproduct.image}">
                    </div>

                    <div class="product-details">
                    <div class="product-name">
                      ${matchingproduct.name}
                    </div>
                    <div class="product-delivery-date">
                        Arriving on: 
                    </div>
                    <div class="product-quantity">
                        Quantity: ${item.quantity}
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
                    `  
                });
                
            const container = document.querySelector(".js-order-container");
            if (!container) {
                // This module can be imported on pages that don't have the orders container.
                // Skip rendering when the DOM element is absent to avoid runtime errors.
                return;
            }
            container.innerHTML = orderHtmlStr;
            }

    document.addEventListener('DOMContentLoaded', () => {
        orderHtml();
    });
 export function addOrder(){
    cart.forEach((cartItem) => {
        order.unshift(cartItem);
    })
          console.log(order)

        saveLocal();
        
        window.location.href = 'orders.html';
    }
    