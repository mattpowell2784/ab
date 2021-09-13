'use strict';

let currentPage = 1;
let currentSort = 'name';
let currentResults = '/get-clients?';

//---------------------------------------------------------------------

//event listeners
function addEventListeners() {
  document.addEventListener('click', function (e) {
    //login
    if (e.target.id == 'login_btn') {
      e.preventDefault();
      login();
    }

    //logout
    if (e.target.id == 'btn_logout') {
      e.preventDefault();
      logout();
    }

    //get cleints  data event listner
    if (e.target.id == 'btn_show_all') {
      removeAllDataFromDom();
      getClients('/get-clients?sort=name');
    }

    //add new client event listener
    if (e.target.id == 'btn_add_client') {
      renderNewClientForm();
    }

    //sort ascending
    if (e.target.id == 'material_icons_north') {
      e.preventDefault();

      removeAllDataFromDom();
      getClients('/get-clients?sort=name');
    }

    //sort desceding
    if (e.target.id == 'material_icons_south') {
      e.preventDefault();

      removeAllDataFromDom();
      getClients('/get-clients?sort=-name');
    }

    //search by name
    if (e.target.className == 'search_btn') {
      e.preventDefault();
      searchByName();
    }

    //edit record
    let editBtnRegEx = /edit_button.*/;
    if (e.target.id.match(editBtnRegEx)) {
      let recordId = e.target.id.slice(12);
      renderEditClientForm(recordId);
    }

    //delete record
    let deleteBtnRegEx = /delete_button_.*/;
    if (e.target.id.match(deleteBtnRegEx)) {
      let recordId = e.target.id.slice(14);
      e.preventDefault();
      deleteRecord(recordId);
    }
  });

  //next page
  document.addEventListener('click', function (e) {
    if (e.target.className == 'btn_next_page') {
      e.preventDefault();
      nextPage();
    }
  });

  //prev page
  document.addEventListener('click', function (e) {
    if (e.target.className == 'btn_prev_page') {
      e.preventDefault();
      prevPage();
    }
  });
}
addEventListeners();

//---------------------------------------------------------------------

async function getClients(fetchRoute) {
  try {
    console.log('fetch route', fetchRoute);

    let getAddressData = await fetch(fetchRoute);
    let addressData = await getAddressData.json();

    currentResults = fetchRoute;
    currentPage = addressData.page;
    currentSort = addressData.sort;

    console.log('current page', currentPage);
    console.log('current sort', currentSort);
    console.log('current results', currentResults);
    console.log(addressData);
    console.log('------------');

    renderData(addressData.data);
  } catch (error) {
    console.log(error);
  }
}
getClients('/get-clients?sort=name');

//---------------------------------------------------------------------

//render clients data
function renderData(addressData) {
  removeAllDataFromDom();

  let addressDisplayTable = document.querySelector('.customers');

  addressData.data.forEach(e => {
    let html = `
    <span id="${e._id}">
      <tr class="${e._id}">
        <td class="name_${e._id}">${e.name}</td>
        <td class="address_${e._id}_address">${e.address}</td>
        <td class="postCode_${e._id}">${e.postCode}</td>
        <td><button id="edit_button_${e._id}" class="edit_btn__active">Edit</button></td>
        <td><button id="delete_button_${e._id}" class="delete_btn__active">Delete</button></td>      
      </tr>
      </span>`;

    addressDisplayTable.insertAdjacentHTML('beforeend', html);
  });
}

//---------------------------------------------------------------------

//render new client form
function renderNewClientForm() {
  removeAllDataFromDom();

  let html = ` 
      <tr class="new_client_form__row">
      <td><input type="text" class="new_client_form__name" /></td>
      <td><input type="text" class="new_client_form__address" /></td>
      <td><input type="text" class="new_client_form__postcode" /></td>
      <td><a class="new_client_form__btn_cancel" href="/">Cancel</a></td>
      <td><button class="new_client_form__btn_submit">Submit</button></td>
      </tr>      
    `;

  let newForm = document.getElementById('table_top');
  newForm.insertAdjacentHTML('afterbegin', html);

  removeButtons();
  addNewClient();
}

//---------------------------------------------------------------------

//add new client
function addNewClient() {
  //get input elements
  let newClientForm = {
    name: document.getElementsByClassName('new_client_form__name'),
    address: document.getElementsByClassName('new_client_form__address'),
    postCode: document.getElementsByClassName('new_client_form__postcode'),
    submitBtn: document.getElementsByClassName('new_client_form__btn_submit'),
  };

  //submit form data
  newClientForm.submitBtn[0].addEventListener('click', async function () {
    try {
      const data = JSON.stringify({
        name: newClientForm.name[0].value,
        address: newClientForm.address[0].value,
        postCode: newClientForm.postCode[0].value,
      });

      const myInit = {
        headers: { 'Content-Type': 'application/json' },
        body: data,
        method: 'POST',
      };

      let newClient = await fetch('/add-client', myInit);
      let newClientResponse = await newClient.json();
      console.log(newClientResponse);

      if (newClientResponse.status === 'success') {
        //reload data
        removeAllDataFromDom();
        getClients(`/search-clients?_id=${newClientResponse.data._id}`);
        addButtons();
      }

      if (newClientResponse.status === 'fail') {
        renderInputError(newClientResponse.message);
      }
    } catch (err) {
      console.log(err);
    }
  });
}

//---------------------------------------------------------------------

//remove all data
function removeAllDataFromDom() {
  let tableData = document.getElementsByClassName('customers');
  tableData = tableData[0].childNodes;

  while (tableData.length > 0) {
    tableData[0].remove();
  }
}

//---------------------------------------------------------------------

//delete record
async function deleteRecord(recordId) {
  //delete data from database
  try {
    let deleteClientResponse = await fetch(`/delete/${recordId}`, {
      method: 'DELETE',
    });

    //remove dom elements
    if (deleteClientResponse.ok == true) {
      console.log(deleteClientResponse);
      let tableRow = document.getElementsByClassName(recordId);
      tableRow[0].remove();
    }
  } catch (err) {}
}

//---------------------------------------------------------------------

//render edit client form
function renderEditClientForm(recordId) {
  //get table using object id
  let tableRow = document.getElementsByClassName(recordId);

  //store current data
  let currentData = {
    name: tableRow[0].childNodes[1].textContent,
    address: tableRow[0].childNodes[3].textContent,
    postCode: tableRow[0].childNodes[5].textContent,
  };

  //remove dom elements
  removeAllDataFromDom();

  //add form elements
  let html = `
  <tr class="edit_client_form__row">
  <td><input type="text" class="edit_client_form__name" value="${currentData.name}" /></td>
  <td><input type="text" class="edit_client_form__address" value="${currentData.address}" /></td>
  <td><input type="text" class="edit_client_form__postcode" value="${currentData.postCode}" /></td>
  <td><a class="edit_client_form__btn_cancel" href="/">Cancel</a></td>
  <td><button class="edit_client_form__btn_submit">Submit</button></td>
  </tr>`;

  let editForm = document.getElementById('table_top');
  editForm.insertAdjacentHTML('afterbegin', html);

  removeButtons();
  updateRecord(recordId);
}

//---------------------------------------------------------------------

//update record information
function updateRecord(recordId) {
  //get input elements
  let editClientForm = {
    name: document.getElementsByClassName('edit_client_form__name'),
    address: document.getElementsByClassName('edit_client_form__address'),
    postCode: document.getElementsByClassName('edit_client_form__postcode'),
    submitBtn: document.getElementsByClassName('edit_client_form__btn_submit'),
  };

  //submit form data
  editClientForm.submitBtn[0].addEventListener('click', async function () {
    try {
      const data = JSON.stringify({
        name: editClientForm.name[0].value,
        address: editClientForm.address[0].value,
        postCode: editClientForm.postCode[0].value,
      });

      const myInit = {
        headers: { 'Content-Type': 'application/json' },
        body: data,
        method: 'PATCH',
      };

      let updatwClient = await fetch(`/patch/${recordId}`, myInit);
      let updateClientResponse = await updatwClient.json();
      console.log(updateClientResponse);
      if (updateClientResponse.status === 'success') {
        removeAllDataFromDom();
        currentPage = 0;
        getClients(
          `/search-clients?_id=${updateClientResponse.data.updateAddress._id}`
        );
        addButtons();
      }

      if (updateClientResponse.status === 'fail') {
        renderInputError(updateClientResponse.message);
      }
    } catch (err) {}
  });
}

//---------------------------------------------------------------------

function removeInputErrors() {
  let inputErrors = document.getElementsByClassName('new_client_form__error');
  console.log(inputErrors);

  while (inputErrors.length > 0) {
    inputErrors[0].remove();
  }
}

function renderInputError(errorMessage) {
  console.log(errorMessage.errors);
  removeInputErrors();

  let html = '';
  Object.values(errorMessage.errors).forEach(error => {
    console.log(error.message);

    html =
      html +
      `<tr class="new_client_form__error"><td>${error.message}</td></tr>
      `;
  });
  console.log('----------');

  let newForm = document.getElementById('table_top');
  newForm.insertAdjacentHTML('beforeend', html);
}

//---------------------------------------------------------------------

//remove buttons to ensure integirty of data entry
function removeButtons() {
  let editButton = document.getElementsByClassName('edit_btn__active');
  while (editButton.length > 0) {
    editButton[0].remove();
  }

  let deleteButton = document.getElementsByClassName('delete_btn__active');
  while (deleteButton.length > 0) {
    deleteButton[0].remove();
  }

  let sortArrows = document.getElementsByClassName('material-icons');
  while (sortArrows.length > 0) {
    sortArrows[0].remove();
  }

  let addAddressButton = document.getElementsByClassName('btn_add_client');
  addAddressButton[0].remove();

  let loadAllDataButton = document.getElementsByClassName('btn_show_all');
  loadAllDataButton[0].remove();

  let searchButton = document.getElementsByClassName('search_btn');
  searchButton[0].remove();

  let searchBox = document.getElementsByClassName('search_box');
  searchBox[0].remove();

  let nextButton = document.getElementsByClassName('btn_next_page');
  nextButton[0].remove();

  let prevButton = document.getElementsByClassName('btn_prev_page');
  prevButton[0].remove();
}

//---------------------------------------------------------------------
//add buttons
function addButtons() {
  let buttonsList = [
    {
      classname: 'btn_next_page',
      html: '<button id="btn_next_page" class="btn_next_page">></button>',
    },
    {
      classname: 'btn_prev_page',
      html: '<button id="btn_prev_page" class="btn_prev_page"><</button>',
    },
    {
      classname: 'btn_show_all',
      html: '<button id="btn_show_all" class="btn_show_all">Load All Data</button>',
    },
    {
      classname: 'btn_add_client',
      html: '<button id="btn_add_client" class="btn_add_client">Add Address</button>',
    },
    {
      classname: 'search_btn',
      html: '<button id="main__search_btn" class="search_btn">Search by Name (full text search)</button>',
    },
    {
      classname: 'search_box',
      html: '<input class="search_box" type="text" id="main__search_box" name="name"/>',
    },
  ];

  let sortArrows = [
    {
      classname: 'material-icons',
      html: ' <span id="material_icons_south" class="material-icons">south</span>',
    },
    {
      classname: 'material-icons',
      html: ' <span id="material_icons_north" class="material-icons">north</span>',
    },
  ];

  const insertPointButtons =
    document.getElementsByClassName('search_container');
  const insertPointSortArrows = document.getElementsByClassName('name_header');

  buttonsList.forEach(e => {
    insertPointButtons[0].insertAdjacentHTML('afterbegin', e.html);
  });

  sortArrows.forEach(e => {
    insertPointSortArrows[0].insertAdjacentHTML('beforeend', e.html);
  });
}

//---------------------------------------------------------------------

//search by name function
async function searchByName(e) {
  try {
    let searchBox = document.getElementsByClassName('search_box');
    let searchString = searchBox[0].value;
    console.log(searchString);

    removeAllDataFromDom();

    let searchClients = await fetch(`/search-clients?name=${searchString}`);
    let searchClientsResponse = await searchClients.json();
    console.log(searchClientsResponse);
    if (searchClientsResponse.status == 'success') {
      renderData(searchClientsResponse.data);
    }
  } catch (err) {}
}

//---------------------------------------------------------------------

//pagination

async function nextPage() {
  let nextPage = currentPage + 1;
  if (!nextPage || !currentSort) {
    getClients('/get-clients?sort=name');
    return;
  }

  console.log('next page function', nextPage);
  await getClients(`/get-Clients?page=${nextPage}&limit=8&sort=${currentSort}`);
}

async function prevPage() {
  if (!nextPage || !currentSort) {
    getClients('/get-clients?sort=name');
    return;
  }

  let prevPage = currentPage - 1;
  console.log('prev page function', prevPage);
  await getClients(`/get-Clients?page=${prevPage}&limit=8&sort=${currentSort}`);
}

//---------------------------------------------------------------------

async function logout() {
  await fetch(`/logout`, {
    method: 'GET',
  });
  window.location.href = '/';
}
