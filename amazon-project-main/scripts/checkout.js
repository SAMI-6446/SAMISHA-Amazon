import { cart } from "../data/cart.js";
import { renderOrderSummary } from "./checkout/order-summery.js";
import { renderPaymentSummary } from "./checkout/paymentSummery.js";
if (cart) {
  renderPaymentSummary();
  renderOrderSummary();
}
