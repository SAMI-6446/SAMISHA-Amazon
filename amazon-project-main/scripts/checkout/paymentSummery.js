import { cart, loadFromStorage } from "../../data/cart.js";
import { getProduct } from "../../data/products.js";
import { formatCurrency } from "../utils/money.js";
import { getDeliveryOption } from "../../data/delivery-options.js";
import { addOrder } from "../../data/order.js";

loadFromStorage();

export function renderPaymentSummary() {
  // Defensive: ensure the payment summary container exists
  const container = document.querySelector(".js-payment-summery");
  if (!container) return;

  let productPriceCents = 0;
  let shippingPriceCents = 0;

  // Calculate totals from the cart model
  const itemCount = (cart || []).reduce(
    (sum, it) => sum + (Number(it.quantity) || 0),
    0
  );

  (cart || []).forEach((cartItem) => {
    const product = getProduct(cartItem.productid);
    if (!product) {
      console.error(
        "renderPaymentSummary: product not found for id",
        cartItem.productid
      );
      return;
    }
    productPriceCents +=
      (product.priceCents || 0) * (Number(cartItem.quantity) || 0);

    const deliveryOption = getDeliveryOption(cartItem.deliveryOptions);
    if (!deliveryOption) {
      console.warn(
        "renderPaymentSummary: delivery option not found for id",
        cartItem.deliveryOptions
      );
    }
    shippingPriceCents += Number(deliveryOption?.pricecent || 0);
  });

  const totalBeforeTaxCents = productPriceCents + shippingPriceCents;
  const taxCents = Math.round(totalBeforeTaxCents * 0.1);
  const totalCents = totalBeforeTaxCents + taxCents;

  const PaymentSummeryHtml = `
    <div class="payment-summary-title">Order Summary</div>

    <div class="payment-summary-row items-row">
      <div>Items (${itemCount}):</div>
      <div class="payment-summary-money">${formatCurrency(
        productPriceCents
      )}</div>
    </div>

    <div class="payment-summary-row">
      <div>Shipping &amp; handling:</div>
      <div class="payment-summary-money">${formatCurrency(
        shippingPriceCents
      )}</div>
    </div>

    <div class="payment-summary-row subtotal-row">
      <div>Total before tax:</div>
      <div class="payment-summary-money">${formatCurrency(
        totalBeforeTaxCents
      )}</div>
    </div>

    <div class="payment-summary-row">
      <div>Estimated tax (10%):</div>
      <div class="payment-summary-money">${formatCurrency(taxCents)}</div>
    </div>

    <div class="payment-summary-row total-row">
      <div>Order total:</div>
      <div class="payment-summary-money">${formatCurrency(totalCents)}</div>
    </div>
    <div class="js-notify"></div>
    <button class="place-order-button button-primary js-place-order">Place your order</button>
  `;

  container.innerHTML = PaymentSummeryHtml;

  const paymentBtn = container.querySelector(".js-place-order");
  const messSpace = container.querySelector(".js-notify");
  let notifyTimeoutId = null;

  function showNotify() {
    if (!messSpace) return;

    // If a notify already exists, remove it and clear previous timeout
    const existing = messSpace.querySelector('.js-cart-empty-notify');
    if (existing) {
      existing.remove();
    }
    if (notifyTimeoutId) {
      clearTimeout(notifyTimeoutId);
      notifyTimeoutId = null;
    }

    const notify = document.createElement('div');
    notify.className = 'js-cart-empty-notify';

    const btn = document.createElement('button');
    btn.className = 'notify-dismiss';
    btn.setAttribute('aria-label', 'Dismiss notification');
    btn.textContent = '×';
    btn.addEventListener('click', () => {
      if (notify.parentNode) notify.parentNode.removeChild(notify);
      if (notifyTimeoutId) { clearTimeout(notifyTimeoutId); notifyTimeoutId = null; }
    });

    const text = document.createElement('div');
    text.textContent = 'Your cart is empty. Please add products before placing your order.';

    notify.appendChild(btn);
    notify.appendChild(text);
    messSpace.appendChild(notify);

    // Auto-hide after 4 seconds
    notifyTimeoutId = setTimeout(() => {
      if (notify.parentNode) notify.parentNode.removeChild(notify);
      notifyTimeoutId = null;
    }, 4000);
  }

  paymentBtn.addEventListener("click", () => {
    // prefer authoritative model check (cart) but also check rendered item count
    const itemsRow = container.querySelector(".items-row");
    const renderedCount = itemsRow
      ? Number((itemsRow.textContent || "").match(/Items \((\d+)\)/)?.[1] || 0)
      : 0;
    if ((cart || []).length === 0 || renderedCount === 0) {
      showNotify();
       
      return;
    }
    // remove notify if present then place order
    const notify = container.querySelector(".js-cart-empty-notify");
    if (notify) notify.remove();
    addOrder();
  });
}

// Auto-render on DOM ready
document.addEventListener("DOMContentLoaded", () => renderPaymentSummary());
