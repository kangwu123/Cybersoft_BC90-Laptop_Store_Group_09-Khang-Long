/**
 * Carts function store in LocalStorage
 */
class Manager {
  constructor() {
    this.arr_Cart = [];
  }

  btn_Add_Cart(product) {
    this.arr_Cart.push(product);
    return this.arr_Cart;
  }

  btn_minus() {}
  btn_delete() {}
}
export default Manager;