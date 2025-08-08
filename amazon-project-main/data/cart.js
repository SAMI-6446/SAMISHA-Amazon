export let cart = JSON.parse(localStorage.getItem('cart'));
if(!cart){
  cart = [
  {productid: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
    quantity: 2,
    deliveryOptions: '1',
    
  },
  {
    productid: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
    quantity: 1,
    deliveryOptions: '2'
  }
];
}


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
  saveCartLocal();
}
export function cartQuntity() {
  let cartquantity = 0;
  cart.forEach((cartItem) => {
    cartquantity += cartItem.quantity;
  });
   document.querySelector(".cart-quantity").textContent = cartquantity;
}
export function removeCartItem(productId){
  let newCart = [];
  cart.forEach((cartItem) => {
    if(cartItem.productid !== productId){
      newCart.push(cartItem);
    }
  })
cart = newCart;
saveCartLocal();
}
 function saveCartLocal(){
  localStorage.setItem('cart', JSON.stringify(cart));
}







{/* <script>
  // Example: Set a dynamic delivery date (e.g., 5 days from now)
  function getDeliveryDate(daysToAdd = 5) {
    const date = new Date();
    date.setDate(date.getDate() + daysToAdd);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  }

  // Example usage: update delivery date in cart items
  document.addEventListener('DOMContentLoaded', () => {
    // Find all elements where you want to show the delivery date
    // For demo, let's assume you have a span with class 'delivery-date' in each cart item
    const deliveryDateElements = document.querySelectorAll('.delivery-date');
    deliveryDateElements.forEach(el => {
      el.textContent = getDeliveryDate();
    });
  });
</script> */}