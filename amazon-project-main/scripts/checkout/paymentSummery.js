import { cart, loadFromStorage } from "../../data/cart.js";
import { getProduct } from "../../data/products.js";
import { formatCurrency } from "../utils/money.js";
import { getDeliveryOption } from "../../data/delivery-options.js";
import { addOrder } from "../../data/order.js";
loadFromStorage();
export function renderPaymentSummary() {
  function CalculatingPrice() {
    let productPriceCents = 0;
    let shippingPriceCents = 0;

    cart.forEach((cartItem) => {
      const product = getProduct(cartItem.productid);
      if (!product) {
        console.error(
          "renderPaymentSummary: product not found for id",
          cartItem.productid,
          cartItem
        );
        return; // skip this cart item to avoid exceptions
      }
      productPriceCents += (product.priceCents || 0) * (cartItem.quantity || 0);
      // Calculate shipping price based on delivery options
      const deliverOption = getDeliveryOption(cartItem.deliveryOptions);
      if (!deliverOption) {
        console.error(
          "renderPaymentSummary: delivery option not found for id",
          cartItem.deliveryOptions,
          cartItem
        );
      }
      // defensive: ensure we add a number
      shippingPriceCents += Number(deliverOption?.pricecent || 0);
    });
    const totalBeforeTaxCents = productPriceCents + shippingPriceCents;
    const taxCents = totalBeforeTaxCents * 0.1;
    const totalCents = totalBeforeTaxCents + taxCents;
    const PaymentSummeryHtml = `
        <div class="payment-summary-title">
                Order Summary
              </div>

              <div class="payment-summary-row">
                <div>Items (3):</div>
                <div class="payment-summary-money">
                ${formatCurrency(productPriceCents)}
                </div>
              </div>

              <div class="payment-summary-row">
                <div>Shipping &amp; handling:</div>
                <div class="payment-summary-money">
                    ${formatCurrency(shippingPriceCents)}
                </div>
              </div>

              <div class="payment-summary-row subtotal-row">
                <div>Total before tax:</div>
                <div class="payment-summary-money">
                ${formatCurrency(totalBeforeTaxCents)}
                </div>
              </div>

              <div class="payment-summary-row">
                <div>Estimated tax (10%):</div>
                <div class="payment-summary-money">
                  ${formatCurrency(taxCents)}
                </div>
              </div>

              <div class="payment-summary-row total-row">
                <div>Order total:</div>
                <div class="payment-summary-money">
                ${formatCurrency(totalCents)}
                </div>
              </div>

              <button class="place-order-button button-primary js-place-order">
                Place your order
              </button>
              
    `;
    document.querySelector(".js-payment-summery").innerHTML =
      PaymentSummeryHtml;
  }

  CalculatingPrice();

  function placeOrder() {
    const paymentButn = document.querySelector(".js-place-order");
    if (paymentButn) {
      paymentButn.addEventListener("click", () => {
        if (!cart) {
          console.log("there is no cart fhuehuehk");
        } else {
          addOrder();
        }
      });
    } else {
      console.error(
        "renderPaymentSummary: .js-place-order button not found in DOM"
      );
    }
  }
  placeOrder();
  }
