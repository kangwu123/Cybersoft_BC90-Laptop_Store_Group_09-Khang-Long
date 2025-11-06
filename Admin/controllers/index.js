import Api_Service from "./../services/apiService.js";
import Product from "./../models/product.js";
import Manager from "./../models/manager.js";
import Validation from "./../models/validation.js";

const api = new Api_Service();
const manager = new Manager();
const validation = new Validation();

// Dom tới Element ID
const Get_Element_ID = (id) => {
    return document.getElementById(id);
};
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
              <td class="price">${Number(object_Product.price).toLocaleString("vi-VN")} ₫</td>
              <td style="vertical-align: middle;">
                <span class="stock ${obj_Product.stock === "stock" ? "inventory" : ""}">
                    ${obj_Product.stock === "available" ? "Còn Hàng": "Hết Hàng"}
                </span>
              </td>
              <td>
                 <button class="btn edit" onclick="btn_Edit('${obj_Product.id}')
                       "data-toggle="modal" data-target="#cart-modal"> Sửa
                </button>
                <button class="btn delete" onclick="btn_Delete('${obj_Product.id}')"> Xóa </button>
             </td>
          </tr>
        `;
        Get_Element_ID("productTableBody").innerHTML = contentTable;
    }
};
// Delete Action
const btn_Delete = (id) => {
    const promise_Delete_Product = api.delete_Api_Product(id);
    promise_Delete_Product
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
            Get_Element_ID("stock").value = obj_Product.stock;
            Get_Element_ID("specifications").value = obj_Product.specifications;
        })
        .catch((error) => {
            console.log(error.data);
        });
};
window.btn_Edit = btn_Edit;
