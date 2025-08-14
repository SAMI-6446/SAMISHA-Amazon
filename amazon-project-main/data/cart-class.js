class Cart {
 cartItems;
localStorageKey;

constructor (loadFromStorageKey) {
  this.loadFromStorageKey = loadFromStorageKey;
  this.loadFromStorage();
}

 loadFromStorage(){
    this.cartItems = JSON.parse(localStorage.getItem(this.localStorageKey));
      if(!this.cartItems){
        this.cartItems = [
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
   }


   loadFromStorage(){
    this.cartItems = JSON.parse(localStorage.getItem(this.loadFromStorageKey));
      if(!this.cartItems){
        this.cartItems = [
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
   }


    loadFromStorage(){
    this.cartItems = JSON.parse(localStorage.getItem('cart-oop'));
      if(!this.cartItems){
        this.cartItems = [
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
   }


   addtoCart(productId) {
      let matchingItem;
      this.cartItems.forEach((cartItem) => {
        if (productId === cartItem.productid) {
          matchingItem = cartItem;
        }
      });
      if (matchingItem) {
        matchingItem.quantity += 1;
      } else {
        this.cartItems.push({
          productid: productId,
          quantity: 1,
          deliveryOptions: '1'
        });
      }
      this.saveCartLocal();
    }


     removeCartItem(productId){
      let newCart = [];
      this.cartItems.forEach((cartItem) => {
        if(cartItem.productid !== productId){
          newCart.push(cartItem);
        }
      })
    this.cartItems = newCart;
    this.saveCartLocal();
    }


     updateDeliveryOptions(productId, deliveryOptionsId) {
      let matchingItem;
      this.cartItems.forEach((cartItem) => {
        if (productId === cartItem.productid) {
          matchingItem = cartItem;
        }
      });
      matchingItem.deliveryOptions = deliveryOptionsId;
      this.saveCartLocal();
    }


    cartQuntity() {
      let cartquantity = 0;
      this.cartItems.forEach((cartItem) => {
        cartquantity += cartItem.quantity;
      });
      document.querySelector(".cart-quantity").textContent = cartquantity;
    }
  
}
const cart = new Cart('cart-oop');
cart.loadFromStorageKey = 'cart-oop';
console.log(cart);