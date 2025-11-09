import Manager from "./../models/manager.js";
import Api_Service from "./../services/apiServices.js";

const manger = new Manager();
const api = new Api_Service();

const Get_Element_ID = (Id) => document.getElementById(Id);

const Arr_Product = () => {
  const get_promise = api.get_Api_Promise();
  get_promise
    .then((result) => {
      Render_UI(result.data);
    })
    .catch((e) => {
      console.log(e.data);
    });
};

// FIX 1: Changed "get_Arr_Product()" to "Arr_Product()" to match the function definition
Arr_Product();

const Render_UI = (arr_product) => {
  let contentHTML = "";
  for (let i = 0; i < arr_product.length; i += 1) {
    const obj_Product = arr_product[i];
    let statusText = "Còn Hàng";
    let statusClass = "completed";
    const stockLower = obj_Product.stock.toLowerCase();

    if (stockLower === "0" || stockLower === "out of stock") {
      statusText = "Hết Hàng";
      statusClass = "pending";
    } else if (stockLower === "new") {
      statusText = "New Box";
      statusClass = "process";
    }

    contentHTML += `
    <div class="product-item">
        <span class="badge-left">Giảm sốc</span>
        <span class="badge-right">Trả góp 0%</span> 

            <div class="product-image">
                <img src="${obj_Product.img}" alt="${obj_Product.brand}" />
                <div class="product-actions">
                    <button class="action-btn zoom">
                        <i class="fi fi-rr-search"></i>
                    </button>
                    <button class="action-btn wishlist">
                        <i class="fi fi-rr-heart"></i>
                    </button>
                    <button class="action-btn compare">
                        <i class="fa-solid fa-arrows-rotate"></i>
                    </button>
                
                </div>
            </div>

                <div class="product-info">
                    <h3 class="product-title">${obj_Product.name}</h3>
                    <span class="status ${statusClass}">
                        ${statusText}
                    </span>
                    <div class="product-price">
                    	  <span class="text-black font-light text-sm">Giá chỉ từ:</span> 
                        <span class="price">${Number(obj_Product.price).toLocaleString("vi-VN")}đ</span>
                        <span class="original-price">$1,499.00</span>
                    </div>
             
                    <p class="description">Cấu Hình:
                      ${obj_Product.specifications} & 
                      <p>Pin:${obj_Product.battery}</p>
                    </p>

                    <div class="product-rating">
                        <span class="stars">⭐⭐⭐⭐⭐</span>
                        <span class="reviews">(21)</span>
                    </div>
                    <button class="add-to-cart-btn" onclick="btn_Add_Cart('${obj_Product.id}')">
                        Add To Cart
                    </button>
                </div>
    </div>  
    `;
  }
  Get_Element_ID("products-grid").innerHTML = contentHTML;
};
