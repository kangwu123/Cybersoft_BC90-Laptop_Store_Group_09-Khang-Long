// ✅ index.js — Phiên bản hoàn chỉnh, đã sửa lỗi và theo đúng yêu cầu đề bài
import Manager from "./../models/manager.js";
import Api_Service from "./../services/apiServices.js";

const manger = new Manager();
const api = new Api_Service();

const Get_Element_ID = (id) => document.getElementById(id);
let productsBackup = [];

// 🔢 Cập nhật hiển thị tổng số lượng sản phẩm trong giỏ (cộng dồn quantity)
const renderCartCount = () => {
  const totalQuantity = manger.arr_Cart.reduce((sum, p) => sum + (p.quantity || 0), 0);
  const cartEl = document.querySelector(".cart-icon span");
  if (cartEl) cartEl.innerText = totalQuantity;
};

// 💾 Lưu giỏ hàng vào localStorage
const saveCart = () => {
  localStorage.setItem("cart", JSON.stringify(manger.arr_Cart));
};

// 🔁 Load lại giỏ hàng khi load trang
const loadCart = () => {
  const data = localStorage.getItem("cart");
  if (data) {
    manger.arr_Cart = JSON.parse(data);
    renderCartCount();
  }
};
loadCart();

// 🛒 Thêm sản phẩm vào giỏ hàng
window.btn_Add_Cart = (id) => {
  const product = productsBackup.find(p => p.id == id);
  if (!product) return;

  manger.btn_Add_Cart(product);
  saveCart();
  renderCartCount();
  console.log("🛒 Giỏ hàng hiện tại:", manger.arr_Cart);
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
      return max ? (priceNum >= min && priceNum <= max) : (priceNum >= 2000);
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
      <div id="productModal" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
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
