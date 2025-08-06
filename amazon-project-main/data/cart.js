export const cart = [];

export function addtoCart(productId) {
  let matchingItem;

  cart.forEach((cartItem) => {
    if (productId === cartItem.productid) {
      matchingItem = cartItem;
    }
  });

  if (matchingItem) {
    matchingItem.quantity += 1;
  } else {
    cart.push({
      productid: productId,
      quantity: 1,
    });
  }
}
export function cartQuntity() {
  let cartquantity = 0;
  cart.forEach((cartItem) => {
    cartquantity += cartItem.quantity;
  });
   document.querySelector(".cart-quantity").textContent = cartquantity;
}