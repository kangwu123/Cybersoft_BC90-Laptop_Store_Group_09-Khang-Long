import Manager from "./../models/manager.js";
import Api_Service from "./../services/apiServices.js";

const manager = new Manager();
const api = new Api_Service();

const Get_Element_ID = (id) => document.getElementById(id);
let productsBackup = [];

// 🔢 Cập nhật hiển thị tổng số lượng sản phẩm trong giỏ (cộng dồn quantity)
const renderCartCount = () => {
  const totalQuantity = manager.arr_Cart.reduce((sum, p) => sum + (p.quantity || 0), 0);
  const cartEl = document.querySelector(".cart-icon span");
  if (cartEl) cartEl.innerText = totalQuantity;
};

// 💾 Lưu giỏ hàng vào localStorage
const saveCart = () => {
  localStorage.setItem("cart", JSON.stringify(manager.arr_Cart));
};

// 🔁 Load lại giỏ hàng khi load trang
const loadCart = () => {
  const data = localStorage.getItem("cart");
  if (data) {
    manager.arr_Cart = JSON.parse(data);
    renderCartCount();
  }
};
loadCart();

// 🛒 Thêm sản phẩm vào giỏ hàng
window.btn_Add_Cart = (id) => {
  const product = productsBackup.find(p => p.id == id);
  if (!product) return;

  manager.btn_Add_Cart(product);
  saveCart();
  renderCartCount();

  // 🌟 [FIX 1] Refresh the modal body if it's currently open
  if (document.getElementById("cart-modal")) {
    renderCartModalBody();
  }

  // Add animation to cart icon
  const cartIcon = document.querySelector(".cart-icon");
  if (cartIcon) {
    cartIcon.classList.add("animate__animated", "animate__rocket");
    cartIcon.addEventListener('animationend', () => {
      cartIcon.classList.remove("animate__animated", "animate__rocket");
    }, { once: true });
  }

  console.log("🛒 Giỏ hàng hiện tại:", manager.arr_Cart);
};

// 🧠 Gọi API để lấy danh sách sản phẩm
const Arr_Product = () => {
  api.get_Api_Promise()
    .then((result) => {
      console.log("✅ Dữ liệu API:", result.data);
      productsBackup = result.data;
      Render_UI(productsBackup);
    })
    .catch((err) => console.error("❌ Lỗi API:", err));
};
Arr_Product();

// 🎨 Hàm render sản phẩm ra giao diện
const Render_UI = (arr_product) => {
  if (!arr_product || arr_product.length === 0) {
    Get_Element_ID("products-grid").innerHTML =
      "<p class='text-center text-gray-500'>Không có sản phẩm nào để hiển thị.</p>";
    return;
  }

  let contentHTML = "";
  for (let i = 0; i < arr_product.length; i++) {
    const p = arr_product[i];
    const stockLower = (p.stock || "").toLowerCase();

    let statusText = "Còn hàng";
    let statusClass = "completed";
    if (stockLower === "0" || stockLower === "out of stock") {
      statusText = "Hết hàng";
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
          <img src="${p.img}" alt="${p.brand}" />
          <div class="product-actions">
            <button class="action-btn zoom" onclick="showProductDetail('${p.id}')">
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
          <h3 class="product-title">${p.name}</h3>
          <span class="status ${statusClass}">${statusText}</span>
          <div class="product-price">
            <span class="text-black font-light text-sm">Giá chỉ từ:</span>
            <span class="price">${Number(p.price).toLocaleString("vi-VN")}đ</span>
          </div>
          <p class="description">Cấu hình: ${p.specifications || "Đang cập nhật"}</p>
          <p>Pin: ${p.battery || "Không rõ"}</p>
          <button class="add-to-cart-btn" onclick="btn_Add_Cart('${p.id}')">
            <i class="fa-solid fa-cart-shopping"></i> Add To Cart
          </button>
        </div>
      </div>
    `;
  }

  Get_Element_ID("products-grid").innerHTML = contentHTML;
};

// 🔎 Lọc sản phẩm theo các tiêu chí
const Filter_Products = () => {
  let filtered = [...productsBackup];
  const brand = Get_Element_ID("brand-filter").value;
  const price = Get_Element_ID("price-filter").value;
  const sort = Get_Element_ID("sort-filter").value;
  const search = document.querySelector(".filter-section .search-form input").value.toLowerCase();

  if (brand) filtered = filtered.filter(p => p.brand?.toLowerCase() === brand.toLowerCase());

  if (price) {
    const [min, max] = price.split("-");
    filtered = filtered.filter(p => {
      const priceNum = Number(p.price);
      if (max) {
        return priceNum >= Number(min) && priceNum <= Number(max);
      } else if (min === "2000+") {
        return priceNum >= 2000;
      } else if (min === "0") {
         return priceNum <= 1000;
      }
      return true;
    });
  }

  if (sort === "price-low") filtered.sort((a, b) => a.price - b.price);
  if (sort === "price-high") filtered.sort((a, b) => b.price - a.price);
  if (sort === "newest") filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  if (search) filtered = filtered.filter(p => p.name.toLowerCase().includes(search));

  Render_UI(filtered);
};

Get_Element_ID("brand-filter").addEventListener("change", Filter_Products);
Get_Element_ID("price-filter").addEventListener("change", Filter_Products);
Get_Element_ID("sort-filter").addEventListener("change", Filter_Products);
document.querySelector(".filter-section .search-form").addEventListener("submit", (e) => {
  e.preventDefault();
  Filter_Products();
});

// 🪟 Hiển thị chi tiết sản phẩm trong modal
window.showProductDetail = (id) => {
  api.get_LaptopInfo_By_ID(id).then(res => {
    const p = res.data;
    const modalHTML = `
      <div id="productModal" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50" onclick="if(event.target.id === 'productModal') closeProductModal()">
        <div class="bg-white rounded-2xl p-6 w-[500px] relative">
          <button class="absolute top-3 right-4 text-gray-600 text-2xl" onclick="closeProductModal()">&times;</button>
          <img src="${p.img}" alt="${p.name}" class="w-full rounded-lg mb-4" />
          <h2 class="text-xl font-semibold mb-2">${p.name}</h2>
          <p><b>Hãng:</b> ${p.brand}</p>
          <p><b>Giá:</b> ${Number(p.price).toLocaleString("vi-VN")}đ</p>
          <p><b>Cấu hình:</b> ${p.specifications}</p>
          <p><b>Pin:</b> ${p.battery}</p>
          <p><b>Trạng thái:</b> ${p.stock}</p>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML("beforeend", modalHTML);
  });
};

// ❌ Đóng modal chi tiết
window.closeProductModal = () => {
  const modal = document.getElementById("productModal");
  if (modal) modal.remove();
};


// 🌟 --- CART MODAL --- 🌟

/**
 * 🎨 (Helper) Render lại nội dung bên trong modal (list item & totals)
 */
const renderCartModalBody = () => {
  const itemListEl = document.getElementById("cart-item-list");
  const totalEl = document.getElementById("cart-total-price");


  if (!itemListEl || !totalEl) return;

  let contentHTML = "";
  let subtotal = 0;

  if (manager.arr_Cart.length === 0) {
    contentHTML = `<p class="empty-cart">Chưa có sản phẩm nào</p>`;
    totalEl.innerText = "0đ";
  } else {
    manager.arr_Cart.forEach((p, index) => {
      const itemTotal = p.price * p.quantity;
      subtotal += itemTotal;
      contentHTML += `
        <div class="cart-item">
          <h3 class="stt">${index + 1}</h3>
          <img src="${p.img}" alt="${p.name}" />
          <div class="cart-item-main">
            <div class="cart-item-content">
              <div class="cart-item-info">
                <h4 class="item-name">${p.name}</h4>
                <div class="item-right">
                <div class="quantity-control">
                <button class="qty-btn" onclick="cart_DecreaseQty('${p.id}')">-</button>
                <span class="qty-number">${p.quantity}</span>
                <button class="qty-btn" onclick="cart_IncreaseQty('${p.id}')">+</button>
                </div>
                <span class="item-price">${itemTotal.toLocaleString("vi-VN")}đ</span>
                </div>
              </div>
              <button class="remove-btn" onclick="cart_RemoveItem('${p.id}')">Xóa</button>
            </div>
          </div>
        </div>
      `;
    });
    
    // Update totals
    const total = subtotal;
    totalEl.innerText = `${total.toLocaleString("vi-VN")}đ`;
  }

  itemListEl.innerHTML = contentHTML;
};

/**
 * 🛒 (Action) Tăng số lượng
 */
window.cart_IncreaseQty = (id) => {
  const product = productsBackup.find(p => p.id == id);
  const itemInCart = manager.arr_Cart.find(p => p.id == id);

  manager.btn_Add_Cart(product || itemInCart); 
  saveCart();
  renderCartCount();
  renderCartModalBody(); 
};

/**
 * 🛒 (Action) Giảm số lượng
 */
window.cart_DecreaseQty = (id) => {
  const item = manager.arr_Cart.find(p => p.id == id);
  if (item) {
    if (item.quantity > 1) {
      item.quantity--;
    } else {
      manager.arr_Cart = manager.arr_Cart.filter(p => p.id != id);
    }
    saveCart();
    renderCartCount();
    renderCartModalBody(); 
  }
};

/**
 * 🛒 (Action) Xóa sản phẩm
 */
window.cart_RemoveItem = (id) => {
  manager.arr_Cart = manager.arr_Cart.filter(p => p.id != id);
  saveCart();
  renderCartCount();
  renderCartModalBody(); 
};
            
/**
 * 🛒 (Action) Xóa tất cả
 */
window.btnClearCart = () => {
  manager.arr_Cart = [];
  saveCart();
  renderCartCount();
  renderCartModalBody(); 
};

/**
 * 🪟 (Action) Mở Modal
 */
window.openCartModal = () => {
  if (document.getElementById("cart-modal")) return;

  const modalHTML = `
    <div id="cart-modal" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50" onclick="if(event.target.id === 'cart-modal') closeCartModal()">
      <div class="cart-modal"> 
        <button class="close-btn" onclick="closeCartModal()">
          <i class="fas fa-times"></i>
        </button>
        <h2 class="cart-modal-title">
          <i class="fi fi-rr-shopping-cart"></i>
          GIỎ HÀNG CỦA TÔI
        </h2>
        <div class="cart-modal-body">
          <div class="list-cart-item" id="cart-item-list">
            </div>
          <div class="modal-right">
            <h3 class="discount-label">Mã giảm giá</h3>
            <div class="discount-group">
              <input type="text" placeholder="Nhập mã giảm giá" />
              <button class="apply-btn">Áp dụng</button>
            </div>
            <hr> 
            <div class="total">
              <span>Tổng tiền:</span>
              <strong id="cart-total-price">0đ</strong>
            </div>
            <div class="agreement">
              <input type="checkbox" id="terms-agree">
              <label for="terms-agree">Tôi đã đọc và đồng ý với <span>điều khoản và điều kiện</span> của website</label>
            </div>
            <div class="modal-actions">
              <button class="btn-clear" onclick="btnClearCart()">Xóa Tất Cả</button>
              <button class="btn-checkout">Thanh Toán</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML("beforeend", modalHTML);
  renderCartModalBody(); 
};

/**
 * ❌ (Action) Đóng Modal
 */
window.closeCartModal = () => {
  const modal = document.getElementById("cart-modal");
  if (modal) modal.remove();
};