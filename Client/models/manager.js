class Manager {
  constructor() {
    this.arr_Cart = [];
    this.arr_UI = [];
  }

  btn_Add_Cart(obj_Product) {
    let found = false;

    for (let i = 0; i < this.arr_Cart.length; i += 1) {
      const product = this.arr_Cart[i];
      if (product.id === obj_Product.id) {
        product.quantity += 1;
        found = true;
        break;
      }
    }

    if (!found) {
      obj_Product.quantity = 1;
      this.arr_Cart.push(obj_Product);
    }
  }

  Find_Index(id) {
    return this.arr_Cart.findIndex((product) => {
      return product.id === id;
    });
  }

  btn_delete(id) {
    const index = this.Find_Index(id);
    if (index !== -1) {
      this.arr_Cart.splice(index, 1);
    }
    return this.arr_Cart;
  }

  filter(type) {
    const filter_Cart = [];
    if (type === "all") {
      return this.arr_UI;
    }

    for (let i = 0; i < this.arr_UI.length; i++) {
      const product = this.arr_UI[i];
      if (product.type.toLowerCase() === type.toLowerCase()) {
        filter_Cart.push(product);
      }
    }
    return filter_Cart;
  }
}
export default Manager;
