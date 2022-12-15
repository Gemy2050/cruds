// ****************************************** Variables ****************************************************
let title = document.querySelector(".form1 .title"),
  category = document.querySelector(".form1 .category"),
  price = document.querySelector(".form1 .price"),
  tax = document.querySelector(".form1 .tax"),
  ads = document.querySelector(".form1 .ads"),
  discount = document.querySelector(".form1 .discount"),
  total = document.querySelector(".form1 .total-price"),
  count = document.querySelector(".form1 .count"),
  createBtn = document.querySelector(".form1 .create-btn"),
  updateBtn = document.querySelector(".form1 .update-btn"),
  searchTitle = document.querySelector(".form2 .searchTitle"),
  searchCategory = document.querySelector(".form2 .searchCategory"),
  titleSearchBtn = document.querySelector(".form2 .search-title"),
  categorySearchBtn = document.querySelector(".form2 .search-category"),
  deleteAllBtn = document.querySelector(".form2 .delete-all"),
  productCount = document.querySelector(".form2 .products-count"),
  tableBody = document.querySelector(".container table tbody"),
  allInputs = document.querySelectorAll(".container .form1 input");

let id = 0;
let array = [];

// Check if Theres Tasks In Local Storage
if (localStorage.getItem("data")) {
  array = JSON.parse(localStorage.getItem("data"));
  id = array.length;
  productCount.innerHTML = array.length;
}

// Get total Price
document.querySelectorAll(".money").forEach((input) => {
  input.oninput = function () {
    if (price.value != "") {
      total.innerHTML = parseInt(
        +price.value + +tax.value + +ads.value - +discount.value
      );
      total.parentElement.style.backgroundColor = "green";
    } else {
      total.innerHTML = "";
      total.parentElement.style.backgroundColor = "red";
    }
  };
});

// Handle Create Button
createBtn.onclick = function () {
  if (
    title.value == "" ||
    price.value == "" ||
    category.value == "" ||
    count.value > 100
  )
    return false;

  createData(array);
  allInputs.forEach((input) => (input.value = ""));
  total.innerHTML = "";
  total.parentElement.style.backgroundColor = "red";
};
// ******************************************* Create Data *******************************************
function createData(arrayOfData) {
  if (count.value == "" || count < 1) count.value = 1;
  for (let i = 0; i < count.value; i++) {
    id++;

    const data = {
      id: id,
      title: title.value,
      category: category.value,
      price: price.value,
      tax: tax.value,
      ads: ads.value,
      discount: discount.value,
      total: total.textContent,
    };
    arrayOfData.push(data);
    addDataToLocalStorage(arrayOfData);
    getDataFromArray(arrayOfData);
  }
}
// *************************************** Add Data To Local Storage **************************************
function addDataToLocalStorage(arr) {
  window.localStorage.setItem("data", JSON.stringify(arr));
}
// *************************************** Get Data From Local Storage *************************************
function getDataFromLocalStorage() {
  let output = window.localStorage.getItem("data");
  if (output) {
    let data = JSON.parse(output);
    getDataFromArray(data);
  }
}
// ******************************************* Show Data in Page *******************************************
function getDataFromArray(arr) {
  tableBody.innerHTML = "";
  let tr = "";
  let counter = 0;
  arr.forEach((data) => {
    counter++;
    tr += `
    <tr data-id=${data.id}>
    <td>${counter}</td>
    <td>${data.title}</td>
    <td>${data.category}</td>
    <td>${data.price}</td>
    <td>${data.tax}</td>
    <td>${data.ads}</td>
    <td>${data.discount}</td>
    <td>${data.total}</td>
    <td class='update'>update</td>
    <td class='delete'>delete</td>
    </tr>
    `;
  });
  tableBody.innerHTML = tr;
  productCount.innerHTML = arr.length;
  if (arr.length > 0) {
    deleteAllBtn.style.display = "block";
  } else {
    deleteAllBtn.style.display = "none";
  }
}
getDataFromLocalStorage();

// ******************************************* Delete One Element *******************************************
function deleteData(theId) {
  array = array.filter((el) => el.id != theId);

  productCount.innerHTML = array.length;
  if (array.length == 0) id = 0;


  let items;
  if (searchCategory.value) {
    items = array.filter((el) =>
      el.category.toLowerCase().includes(searchCategory.value.toLowerCase())
    );
  } else if(searchTitle.value) {
    items = array.filter((el) =>
      el.title.toLowerCase().includes(searchTitle.value.toLowerCase())
    );
  } else {
    items = array;
  }
  addDataToLocalStorage(array);
    getDataFromArray(items);
    search();
}

document.addEventListener("click", (e) => {
  if (e.target.className == "delete") {
    e.target.parentElement.remove();
    deleteData(e.target.parentElement.getAttribute("data-id"));
  }
});

// ******************************************* Delete All Element *******************************************
deleteAllBtn.onclick = function () {
  localStorage.removeItem("data");
  array = [];
  id = 0;
  getDataFromArray(array);
  productCount.innerHTML = array.length;
};
// ******************************************* Search *******************************************
function search() {
  titleSearchBtn.onclick = function () {
    searchCategory.style.visibility = "hidden";
    searchTitle.style.visibility = "visible";
    searchTitle.focus();
    searchCategory.value = "";
    getDataFromArray(array);
  };
  categorySearchBtn.onclick = function () {
    searchTitle.style.visibility = "hidden";
    searchCategory.style.visibility = "visible";
    searchCategory.focus();
    searchTitle.value = "";
    getDataFromArray(array);
  };

  searchTitle.oninput = function () {
    let items = array.filter((el) =>
      (el.title.toLowerCase()).includes(searchTitle.value.toLowerCase())
    );
    getDataFromArray(items);
    productCount.innerHTML = items.length;
  };
  searchCategory.oninput = function () {
    let items = array.filter((el) =>
      (el.category.toLowerCase()).includes(searchCategory.value.toLowerCase())
    );
    getDataFromArray(items);
    productCount.innerHTML = items.length;
  };
}
search();

// ******************************************* Update *******************************************
function updateData(id, arr) {
  let itemArray = arr.filter((el) => el.id == id);
  let item = itemArray[0];

  title.value = item.title;
  category.value = item.category;
  price.value = item.price;
  tax.value = item.tax;
  ads.value = item.ads;
  discount.value = item.discount;
  total.innerHTML = item.total;

  count.style.visibility = "hidden";
  updateBtn.style.visibility = "visible";
  createBtn.style.visibility = "hidden";

  updateBtn.onclick = function () {
    array.filter((el) => {
      if (el.id == item.id) {
        el.title = title.value;
        el.category = category.value;
        el.price = price.value;
        el.tax = tax.value;
        el.ads = ads.value;
        el.discount = discount.value;
        el.total = total.innerHTML;
      }
      e = item;
    });

    getDataFromArray(array);
    addDataToLocalStorage(array);

    count.style.visibility = "visible";
    updateBtn.style.visibility = "hidden";
    createBtn.style.visibility = "visible";
    allInputs.forEach((el) => (el.value = ""));
    total.innerHTML = "";
    total.parentElement.style.backgroundColor = "red";
  };
}

document.addEventListener("click", (e) => {
  if (e.target.className == "update") {
    updateData(e.target.parentElement.dataset.id, array);
    total.parentElement.style.backgroundColor = "green";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
});
// *****************************************************************