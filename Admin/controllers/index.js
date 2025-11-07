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
    contentTable += `
           <tr>
              <td>${obj_product.id}</td>
              <td>${obj_Product.name}</td>
              <td>
                <img src="${obj_Product.img}" alt="${obj_Product.name}">
              </td>
              <td class="price">${Number(object_Product.price).toLocaleString(
                "vi-VN"
              )} ₫</td>
              <td style="vertical-align: middle;">
                <span class="stock ${
                  obj_Product.stock === "stock" ? "inventory" : ""
                }">
                    ${
                      obj_Product.stock === "available"
                        ? "Còn Hàng"
                        : "Hết Hàng"
                    }
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
    Get_Element_ID("productTableBody").innerHTML = contentTable;
  }
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

  document.getElementsByClassName("btn-submit")[0].style.display = "none";
  document.getElementsByClassName("btn-update")[0].style.display = "block";
  const promise_Edit_Product = api.edit_Api_Product(id);
  promise_Edit_Product
    .then((result) => {
      const obj_Product = result.data;
      Get_Element_ID("id").value = obj_Product.id;
      Get_Element_ID("id").disabled = true;
      Get_Element_ID("name").value = obj_Product.name;
      Get_Element_ID("price").value = obj_Product.price;
      Get_Element_ID("brand").value = obj_Product.brand;
      Get_Element_ID("os").value = obj_Product.os;
      Get_Element_ID("battery").value = obj_Product.battery;
      Get_Element_ID("description").value = obj_Product.description;
      Get_Element_ID("img").value = obj_Product.img;
      Get_Element_ID("stock").value = obj_Product.stock.toLowerCase();
      Get_Element_ID("specifications").value = obj_Product.specifications;
    })
    .catch((error) => {
      console.log(error.data);
    });
};
window.btn_Edit = btn_Edit;

// Dom tới nút thêm sản phẩm mới
Get_Element_ID("btnAddProduct").onclick = function () {
  Get_Element_ID("modal-title").innerHTML = "Thêm sản phẩm mới";
  Get_Element_ID("addProductForm").reset();
  document.getElementsByClassName("btn-submit")[0].style.display = "block";
  document.getElementsByClassName("btn-update")[0].style.display = "none";
  Get_Element_ID("productId").disabled = false;
};
// Add new Product Action Modal
Get_Element_ID("btn-submit").onclick = function (e) {
  e.preventDefault();
  const input_id = Get_Element_ID("id").value;
  const input_name = Get_Element_ID("name").value;
  const input_price = Get_Element_ID("price").value;
  const input_brand = Get_Element_ID("brand").value;
  const input_os = Get_Element_ID("os").value;
  const input_battery = Get_Element_ID("battery").value;
  const input_short_desc = Get_Element_ID("short description").value;
  const input_img = Get_Element_ID("img").value;
  const input_stock = Get_Element_ID("stock").value;
  const input_specifications = Get_Element_ID("specifications").value;

  // Boolean
  let isValid = true;

  // Kiểm tra validation
  isValid &= validation.checkEmpty(
    input_id,
    "invalid-ID",
    "(*) Vui lòng nhập ID"
  );

  isValid =
    isValid &&
    validation.checkDuplicateID(
      input_id,
      manager.arr_Cart,
      "invalid-ID",
      "(*) ID này đã tồn tại, vui lòng nhập ID khác!"
    );

  isValid &= validation.checkEmpty(
    input_name,
    "invalid-name",
    "(*) Vui lòng nhập tên sản phẩm"
  );
  isValid &= validation.checkEmpty(
    input_price,
    "invalid-price",
    "(*) Vui lòng nhập giá sản phẩm"
  );
  isValid &= validation.checkOption(
    "productBrand",
    "invalid-Brand",
    "(*) Vui lòng chọn Hãng SX"
  );
    isValid &= validation.checkOption(
    "productOS",
    "invalid-OS",
    "(*) Vui lòng chọn OS tương ứng"
  );

  isValid &= validation.checkEmpty(
    input_battery,
    "invalid-battery",
    "(*) Vui lòng nhập thông số battery"
  );
  isValid &=
    validation.checkEmpty(
      input_img,
      "invalid-img",
      "(*) Vui lòng nhập URl sản phẩm"
    ) &&
    validation.checkURL(
      input_img,
      "invalid-img",
      "(*) Vui lòng nhập đúng cú pháp"
    );
  isValid &= validation.checkOption(
    "productStock",
    "invalid-stock",
    "(*) Vui lòng cập nhật tình trạng sản phẩm"
  );
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
  const arr_Cart = manager.btn_Add_Cart(product);
  console.log(arr_Cart);

  const add_Product = api.add_Api_Product(product);
  add_Product
    .then((result) => {
      const obj_Product = result.data;
      get_Arr_Product();
      document.getElementsByClassName("close")[0].click();
      alert(
        `Sản phẩm ID là ${obj_Product.id} - ${obj_Product.name} đã được thêm thành công`
      );
    })
    .catch((error) => {
      console.log(error.data);
    });
};

// Update Product Action Modal
Get_Element_ID("btn-update").onclick = function (e) {
    e.preventDefault();

  const input_id = Get_Element_ID("id").value;
  const input_name = Get_Element_ID("name").value;
  const input_price = Get_Element_ID("price").value;
  const input_brand = Get_Element_ID("brand").value;
  const input_os = Get_Element_ID("os").value;
  const input_battery = Get_Element_ID("battery").value;
  const input_short_desc = Get_Element_ID("short description").value;
  const input_img = Get_Element_ID("img").value;
  const input_stock = Get_Element_ID("stock").value;
  const input_specifications = Get_Element_ID("specifications").value;

   // Boolean
  let isValid = true;

  // Kiểm tra validation
  isValid &= validation.checkEmpty(
    input_Id,
    "invalid-ID",
    "(*) Vui lòng nhập ID"
  );

  isValid =
    isValid &&
    validation.checkDuplicateID(
      input_id,
      manager.arr_Cart,
      "invalid-ID",
      "(*) ID này đã tồn tại, vui lòng nhập ID khác!"
    );

  isValid &= validation.checkEmpty(
    input_name,
    "invalid-name",
    "(*) Vui lòng nhập tên sản phẩm"
  );
  isValid &= validation.checkEmpty(
    input_price,
    "invalid-price",
    "(*) Vui lòng nhập giá sản phẩm"
  );
  isValid &= validation.checkOption(
    "productBrand",
    "invalid-Brand",
    "(*) Vui lòng chọn Hang SX"
  );
    isValid &= validation.checkOption(
    "productOS",
    "invalid-OS",
    "(*) Vui lòng chọn OS"
  );

  isValid &= validation.checkEmpty(
    input_battery,
    "invalid-battery",
    "(*) Vui lòng nhập thông số battery"
  );
  isValid &=
    validation.checkEmpty(
      input_img,
      "invalid-img",
      "(*) Vui lòng nhập URl sản phẩm"
    ) &&
    validation.checkURL(
      input_img,
      "invalid-img",
      "(*) Vui lòng nhập đúng cú pháp"
    );
  isValid &= validation.checkOption(
    "productStock",
    "invalid-stock",
    "(*) Vui lòng cập nhật tình trạng sản phẩm"
  );
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
      document.getElementsByClassName("close")[0].click();
      alert(
        `Sản phẩm ID là ${obj_Product.id} - ${obj_Product.name} đã được cập nhật thành công`
      );
    })
    .catch((error) => {
      console.log(error.data);
    });
}

