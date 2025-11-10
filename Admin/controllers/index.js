import Api_Service from "./../services/apiServices.js";
import Product from "./../models/product.js";
import Manager from "./../models/manager.js";
import Validation from "./../models/validation.js";

const api = new Api_Service();
const manager = new Manager();
const validation = new Validation();

// Dom tới Element ID
export const Get_Element_ID = (id) => document.getElementById(id);

// Lấy Info Promise
const get_Arr_Product = () => {
  const get_Promise = api.get_Api_Promise();
  get_Promise
    .then((result) => {
      render_UI(result.data);
    })
    .catch((error) => {
      console.log(error.data);
    });
};
get_Arr_Product();
// Render UI
const render_UI = (arr_Product) => {
  let contentTable = "";
  for (let i = 0; i < arr_Product.length; i += 1) {
    const obj_Product = arr_Product[i];
    // FIX: Lấy trạng thái hiển thị
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

    contentTable += `
           <tr>
              <td>${obj_Product.id}</td> <td>${obj_Product.name}</td>
              <td>
                 <img src="${obj_Product.img}" alt="${obj_Product.name}">
              </td>
              <td class="price">${Number(obj_Product.price).toLocaleString(
                "vi-VN"
              )} ₫</td>
             <td style="vertical-align: middle;">
                 <span class="status ${statusClass}">
                    ${statusText}
                </span>
              </td>
              <td>
                 <button class="btn edit" onclick="btn_Edit('${obj_Product.id}')
                       "data-toggle="modal" data-target="#product-modal"> Sửa
                </button>
                <button class="btn delete" onclick="btn_Delete('${
                  obj_Product.id
                }')"> Xóa </button>
             </td>
          </tr>
        `;
  }
  // FIX 4: Move this line OUTSIDE the for-loop
  Get_Element_ID("productTableBody").innerHTML = contentTable;
};
// Delete Action
const btn_Delete = (id) => {
  const delete_product = api.delete_Api_Product(id);
  delete_product
    .then((result) => {
      const obj_Product = result.data;
      get_Arr_Product();
      alert(
        `Sản phẩm ID là ${obj_Product.id} - ${obj_Product.name} đã được xóa thành công`
      );
    })
    .catch((error) => {
      console.log(error.data);
    });
};
window.btn_Delete = btn_Delete;
//  Edit Action
const btn_Edit = (id) => {
  Get_Element_ID("modal-title").innerHTML = "Sửa sản phẩm";
  //Xóa các thông báo lỗi cũ (nếu có)
  const invalids = document.querySelectorAll("[id^='invalid-']");
  invalids.forEach((el) => (el.innerHTML = ""));

  // FIX: Use correct button IDs from index.html
  Get_Element_ID("btnSubmit").style.display = "none";
  Get_Element_ID("btnUpdate").style.display = "block";

  const promise_Edit_Product = api.edit_Api_Product(id);
  promise_Edit_Product
    .then((result) => {
      const obj_Product = result.data;

      // FIX: Use all correct Element IDs from index.html
      // and correct object properties from DataMockAPI.json
      Get_Element_ID("productId").value = obj_Product.id;
      Get_Element_ID("productId").disabled = true;
      Get_Element_ID("productName").value = obj_Product.name;
      Get_Element_ID("productPrice").value = obj_Product.price;
      Get_Element_ID("productBrand").value = obj_Product.brand;
      Get_Element_ID("OS").value = obj_Product.os;
      Get_Element_ID("battery").value = obj_Product.battery;
      Get_Element_ID("shortDescription").value = obj_Product.shortdescription;
      Get_Element_ID("productImg").value = obj_Product.img;
      // Stock Condition
      const stockValue = obj_Product.stock.toLowerCase();
      let stockForSelect = "out of stock"; 
      if (stockValue === "new") {
        stockForSelect = "new";
      } else if (stockValue === "stock" || stockValue === "in-stock") {
        stockForSelect = "in-stock";
      } else if (stockValue === "0" || stockValue === "out of stock") {
        stockForSelect = "out of stock";
      }
      Get_Element_ID("productStock").value = stockForSelect;
      Get_Element_ID("productDescription").value = obj_Product.specifications;
    })
    .catch((error) => {
      console.log(error.data);
    });
};
window.btn_Edit = btn_Edit;
// Dom tới nút thêm sản phẩm mới
Get_Element_ID("btn-Add").onclick = function () {
  Get_Element_ID("modal-title").innerHTML = "Thêm sản phẩm mới";
  Get_Element_ID("addProductForm").reset();

  // FIX 2: Use correct button IDs "btnSubmit" and "btnUpdate"
  Get_Element_ID("btnSubmit").style.display = "block";
  Get_Element_ID("btnUpdate").style.display = "none";
  Get_Element_ID("productId").disabled = false;

  // FIX 3: Clear all old validation messages
  const invalids = document.querySelectorAll("[id^='invalid-']");
  invalids.forEach((el) => (el.innerHTML = ""));
};

// Add new Product Action Modal
Get_Element_ID("btnSubmit").onclick = function (e) {
  e.preventDefault();

  // FIX 5: Get values using correct element IDs from index.html
  const input_id = Get_Element_ID("productId").value;
  const input_name = Get_Element_ID("productName").value;
  const input_price = Get_Element_ID("productPrice").value;
  const input_brand = Get_Element_ID("productBrand").value;
  const input_os = Get_Element_ID("OS").value;
  const input_battery = Get_Element_ID("battery").value;
  const input_short_desc = Get_Element_ID("shortDescription").value;
  const input_img = Get_Element_ID("productImg").value;
 // FIX: Lấy giá trị Stock trực tiếp (chuỗi mới)
  const input_stock = Get_Element_ID("productStock").value;
  const input_specifications = Get_Element_ID("productDescription").value;

  // Boolean
  let isValid = true;

  // FIX 6: Validate using correct error message IDs from index.html
  // --- ID ---
  isValid &= validation.checkEmpty(
    input_id,
    "invalid-ID",
    "(*) Vui lòng nhập ID"
  );

  if (isValid) {
    // Only check for duplicates if ID is not empty
    isValid =
      isValid &&
      validation.checkDuplicateID(
        input_id,
        manager.arr_Cart, // Note: This check will only work if manager.arr_Cart is loaded
        "invalid-ID",
        "(*) ID này đã tồn tại, vui lòng nhập ID khác!"
      );
  }

  // --- Name ---
  isValid &= validation.checkEmpty(
    input_name,
    "invalid-name",
    "(*) Vui lòng nhập tên sản phẩm"
  );

  // --- Price ---
  isValid &= validation.checkEmpty(
    input_price,
    "invalid-price",
    "(*) Vui lòng nhập giá sản phẩm"
  );

  // --- Brand ---
  isValid &= validation.checkOption(
    "productBrand",
    "invalid-brand", // Was "invalid-Brand"
    "(*) Vui lòng chọn Hãng SX"
  );

  // --- OS ---
  // Note: Your HTML is missing <p id="invalid-OS"></p>
  // The validation will run but won't show a message.
  isValid &= validation.checkOption(
    "OS", // Was "productOS"
    "invalid-OS",
    "(*) Vui lòng chọn OS tương ứng"
  );

  // --- Battery ---
  isValid &= validation.checkEmpty(
    input_battery,
    "invalid-battery",
    "(*) Vui lòng nhập thông số battery"
  );

  // --- Short Description ---
  isValid &= validation.checkEmpty(
    input_short_desc,
    "invalid-shortdesc",
    "(*) Vui lòng nhập mô tả ngắn"
  );

// --- Image ---
  // FIX: Áp dụng logic validation hình ảnh đã sửa
  let isImageValid = validation.checkEmpty(
    input_img,
    "invalid-img",
    "(*) Vui lòng nhập URl sản phẩm"
  );
  if (isImageValid) {
    // Chỉ kiểm tra cú pháp URL nếu trường không rỗng
    isImageValid &= validation.checkURL(
      input_img,
      "invalid-img",
      "(*) Vui lòng nhập đúng cú pháp"
    );
  }
  isValid &= isImageValid;

  // --- Stock ---
  isValid &= validation.checkOption(
    "productStock",
    "invalid-stock",
    "(*) Vui lòng cập nhật tình trạng sản phẩm"
  );

  // --- Specifications ---
  // Note: Your HTML is missing <p id="invalid-specification"></p>
  // The validation will run but won't show a message.
  isValid &= validation.checkEmpty(
    input_specifications,
    "invalid-specification",
    "(*) Vui lòng Nhập thông số chi tiết sản phẩm"
  );

  if (!isValid) return false;

  const product = new Product(
    input_id,
    input_name,
    input_price,
    input_brand,
    input_os,
    input_battery,
    input_short_desc,
    input_img,
    input_stock,
    input_specifications
  );

  // This line seems to be for a cart, not for adding to the API
  // const arr_Cart = manager.btn_Add_Cart(product);
  // console.log(arr_Cart);

  const add_Product = api.add_Api_Product(product);
  add_Product
    .then((result) => {
      const obj_Product = result.data;
      get_Arr_Product();

      // FIX 7: Use correct class ".close-btn" to close modal
      document.getElementsByClassName("close-btn")[0].click();

      alert(
        `Sản phẩm ID là ${obj_Product.id} - ${obj_Product.name} đã được thêm thành công`
      );
    })
    .catch((error) => {
      console.log(error.data);
    });
};
// Update Product Action Modal
// Update Product Action Modal
// FIX 1: Use correct button ID "btnUpdate"
Get_Element_ID("btnUpdate").onclick = function (e) {
  e.preventDefault();

  // FIX 2: Get values using correct element IDs from index.html
  const input_id = Get_Element_ID("productId").value;
  const input_name = Get_Element_ID("productName").value;
  const input_price = Get_Element_ID("productPrice").value;
  const input_brand = Get_Element_ID("productBrand").value;
  const input_os = Get_Element_ID("OS").value;
  const input_battery = Get_Element_ID("battery").value;
  const input_short_desc = Get_Element_ID("shortDescription").value;
  const input_img = Get_Element_ID("productImg").value;
// FIX: Lấy giá trị Stock trực tiếp (chuỗi mới)
  const input_stock = Get_Element_ID("productStock").value;
  const input_specifications = Get_Element_ID("productDescription").value;

  // Boolean
  let isValid = true;

  // FIX 3: Validate using correct error message IDs from index.html
  // (Validation for ID is not strictly needed since it's disabled, but good practice)
  isValid &= validation.checkEmpty(
    input_id,
    "invalid-ID",
    "(*) Vui lòng nhập ID"
  );

  // --- Name ---
  isValid &= validation.checkEmpty(
    input_name,
    "invalid-name",
    "(*) Vui lòng nhập tên sản phẩm"
  );

  // --- Price ---
  isValid &= validation.checkEmpty(
    input_price,
    "invalid-price",
    "(*) Vui lòng nhập giá sản phẩm"
  );

  // --- Brand ---
  isValid &= validation.checkOption(
    "productBrand",
    "invalid-brand", // Was "invalid-Brand"
    "(*) Vui lòng chọn Hang SX"
  );

  // --- OS ---
  isValid &= validation.checkOption(
    "OS", // Was "productOS"
    "invalid-OS",
    "(*) Vui lòng chọn OS"
  );

  // --- Battery ---
  isValid &= validation.checkEmpty(
    input_battery,
    "invalid-battery",
    "(*) Vui lòng nhập thông số battery"
  );

  // --- Short Description ---
  isValid &= validation.checkEmpty(
    input_short_desc,
    "invalid-shortdesc",
    "(*) Vui lòng nhập mô tả ngắn"
  );

  // --- Image ---
  // Fix: Cải thiện validation cho Image URL
  let isImageValid = validation.checkEmpty(
    input_img,
    "invalid-img",
    "(*) Vui lòng nhập URl sản phẩm"
  );
  if (isImageValid) {
    // Chỉ kiểm tra cú pháp URL nếu trường không rỗng
    isImageValid &= validation.checkURL(
      input_img,
      "invalid-img",
      "(*) Vui lòng nhập đúng cú pháp"
    );
  }
  isValid &= isImageValid;

  // --- Stock ---
  isValid &= validation.checkOption(
    "productStock",
    "invalid-stock",
    "(*) Vui lòng cập nhật tình trạng sản phẩm"
  );

  // --- Specifications ---
  isValid &= validation.checkEmpty(
    input_specifications,
    "invalid-specification",
    "(*) Vui lòng Nhập thông số chi tiết sản phẩm"
  );

  if (!isValid) return false;

  const product = new Product(
    input_id,
    input_name,
    input_price,
    input_brand,
    input_os,
    input_battery,
    input_short_desc,
    input_img,
    input_stock,
    input_specifications
  );

  const update_Product = api.update_Api_Product(product);
  update_Product
    .then((result) => {
      const obj_Product = result.data;
      get_Arr_Product();

      // FIX 4: Use correct class ".close-btn" to close modal
      document.getElementsByClassName("close-btn")[0].click();

      alert(
        `Sản phẩm ID là ${obj_Product.id} - ${obj_Product.name} đã được cập nhật thành công`
      );
    })
    .catch((error) => {
      console.log(error.data);
    });
};

// ✅ SEARCH FUNCTION
window.searchProduct = function () {
  const searchInput = document.getElementById("searchInput").value.toLowerCase();
  
  // Lấy toàn bộ danh sách sản phẩm hiện tại
  api.get_Api_Promise()
    .then((result) => {
      const filtered = result.data.filter((item) => {
        const name = item.name ? item.name.toLowerCase() : "";
        const desc = item.shortdescription ? item.shortdescription.toLowerCase() : "";
        return name.includes(searchInput) || desc.includes(searchInput);
      });
      render_UI(filtered);
    })
    .catch((error) => console.log(error));
};
