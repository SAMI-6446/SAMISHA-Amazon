export let cart;
export function loadFromStorage() {
  cart = JSON.parse(localStorage.getItem("cart")) || [
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
}

loadFromStorage();

export function addtoCart(productId, quantity = 1) {
  let qty = Math.floor(Number(quantity)) || 1;

  let matchingItem;

  cart.forEach((cartItem) => {
    if (productId === cartItem.productid) {
      matchingItem = cartItem;
    }
  });

  if (matchingItem) {
    matchingItem.quantity = (matchingItem.quantity || 0) + qty;
  } else {
    cart.push({
      productid: productId,
      quantity: qty,
      deliveryOptions: "1",
    });
  }
  saveCartLocal();
}

export function cartQuntity() {
  let cartquantity = 0;
  cart.forEach((cartItem) => {
    cartquantity += cartItem.quantity;
  });
  document.querySelector(".cart-quantity").textContent = cartquantity;
}

export function removeCartItem(productId) {
  let newCart = [];
  cart.forEach((cartItem) => {
    if (cartItem.productid !== productId) {
      newCart.push(cartItem);
    }
  });
  cart = newCart;
  saveCartLocal();
}
export function saveCartLocal() {
  localStorage.setItem("cart", JSON.stringify(cart));
}
export function updateDeliveryOptions(productId, deliveryOptionsId) {
  let matchingItem;
  cart.forEach((cartItem) => {
    if (productId === cartItem.productid) {
      matchingItem = cartItem;
    }
  });
  matchingItem.deliveryOptions = deliveryOptionsId;
  saveCartLocal();
}
