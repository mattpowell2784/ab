//fetch client data
getClients = async function () {
  try {
    let getAddressData = await fetch('/all-clients');
    addressData = await getAddressData.json();
    recordCount = addressData.results;
    renderData(addressData.data);
  } catch (error) {
    console.log(error);
  }
};
getClients();

//render clients data
function renderData(addressData) {
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

//add new client event listener
const btnAddClient = document.getElementById('btn_add_client');
btnAddClient.addEventListener('click', function () {
  renderNewClientForm();
  btnAddClient.parentNode.removeChild(btnAddClient);
});

//render new client form
function renderNewClientForm() {
  let html = ` 
      <div class="new_client_form">
      <td><input type="text" class="new_client_form__name" /></td>
      <td><input type="text" class="new_client_form__address" /></td>
      <td><input type="text" class="new_client_form__postcode" /></td>
      <td><a class="new_client_form__btn_cancel" href="/">Cancel</a></td>
      <td><button class="new_client_form__btn_submit">Submit</button></td>
      </div>
    `;

  let newForm = document.getElementById('table_top');
  newForm.insertAdjacentHTML('afterbegin', html);

  removeButtons();
  addNewClient();
}

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
      if ((newClientResponse.status = 'success')) {
        window.location.reload();
      }
    } catch (err) {}
  });
}

//---------------------------------------------------------------------

//delete record
document.addEventListener('click', async function (e) {
  //get table row using object id
  let regEx = /delete_button_.*/;
  if (e.target.id.match(regEx)) {
    recordId = e.target.id.slice(14);
    e.preventDefault();

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
});

//---------------------------------------------------------------------

//edit record
document.addEventListener('click', function (e) {
  let regEx = /edit_button.*/;
  if (e.target.id.match(regEx)) {
    recordId = e.target.id.slice(12);
    renderEditClientForm(recordId);
  }
});

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
  tableRow[0].remove();

  //add form elements
  let html = `
  <td><input type="text" class="edit_client_form__name" value="${currentData.name}" /></td>
  <td><input type="text" class="edit_client_form__address" value="${currentData.address}" /></td>
  <td><input type="text" class="edit_client_form__postcode" value="${currentData.postCode}" /></td>
  <td><a class="edit_client_form__btn_cancel" href="/">Cancel</a></td>
  <td><button class="edit_client_form__btn_submit">Submit</button></td>`;

  let editForm = document.getElementById(recordId);
  editForm.insertAdjacentHTML('afterend', html);

  removeButtons();

  updateRecord(recordId);
}

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
      if ((updateClientResponse.status = 'success')) {
        window.location.reload();
      }
    } catch (err) {}
  });
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
}

//---------------------------------------------------------------------

//serach function
document.addEventListener('click', async function (e) {
  if (e.target.className == 'search_btn') {
    e.preventDefault();

    try {
      let searchBox = document.getElementsByClassName('search_box');
      let searchString = searchBox[0].value;
      console.log(searchString);

      // const data = JSON.stringify({
      //   name: searchString,
      // });

      // console.log(data);

      // const myInit = {
      //   headers: { 'Content-Type': 'application/json' },
      //   method: 'GET',
      // };

      let searchClients = await fetch(`/search-clients?name=${searchString}`);
      let searchClientsResponse = await searchClients.json();
      console.log(searchClientsResponse);
      if ((searchClientsResponse.status = 'success')) {
        //window.location.reload();
      }
    } catch (err) {}
  }
});
