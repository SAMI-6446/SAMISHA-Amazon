import { loadProducts } from '../data/products.js';
import { renderOrderSummary } from './checkout/order-summery.js';
import {renderPaymentSummary } from './checkout/paymentSummery.js';
//  

// loadProducts(() => {
//   renderOrderSummary();
//   renderPaymentSummary();
// });
new Promise((resolve) => {
  loadProducts(() => {
    resolve();
  });
  
}).then(() => {
renderOrderSummary();
renderPaymentSummary();
});
