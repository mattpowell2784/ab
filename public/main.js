let recordCount;

//fetch client data
getClients = async function () {
  try {
    let getAddressData = await fetch('/all-clients');
    addressData = await getAddressData.json();
    console.log(addressData);
    recordCount = addressData.results;
    renderData(addressData.data);
  } catch (error) {
    console.log(error);
  }
};
getClients();

//render clients data
function renderData(addressData) {
  let div = document.querySelector('.customers');
  console.log(addressData);
  let i = 0;
  addressData.data.forEach(e => {
    i = i + 1;
    let html = `
    <span id="${e._id}">
      <tr class="${e._id}">
        <td class="${e._id}_name">${e.name}</td>
        <td class="${e._id}_address">${e.address}</td>
        <td class="${e._id}_postCode">${e.postCode}</td>
        <td><button id="edit_button" class="${e._id}">Edit</button></td>
        <td><button id="delete_button" class="${e._id}">Delete</button></td>      
      </tr>
      </span>`;

    div.insertAdjacentHTML('beforeend', html);
    //return html;
  });
}

//---------------------------------------------------------------------

//new client button event listener
const btnAddClient = document.getElementById('btn_add_client');
btnAddClient.addEventListener('click', function () {
  renderNewClientForm();
  btnAddClient.parentNode.removeChild(btnAddClient);
});

//render new client form
function renderNewClientForm() {
  let div = btnAddClient;
  //document.querySelector('.text_container');
  let html = `
  <form class="form" action="/add-client" method="post">
    
      <td><input type="text" id="name" name="name" /></td>
      <td><input type="text" id="address" name="address"/></td>
      <td><input type="text" id="postcode" name="postCode"/></td>
      <td><a class="btn_cancel" href="/">Cancel</a></td>
      <td><button>Submit</button></td>
    
  </form>`;

  //let newForm = document.getElementById('new_form');
  let newForm = document.getElementById('table_top');
  console.log(newForm);
  newForm.insertAdjacentHTML('afterbegin', html);

  let formHtmlElement = document.querySelector('.table_form');
  formHtmlElement.action = `/add-client`;
  formHtmlElement.method = 'post';

  removeButtons(1);
}

//---------------------------------------------------------------------

//delete record
document.addEventListener('click', function (e) {
  if (e.target.id === 'delete_button') {
    e.preventDefault();

    //select row
    recordId = e.target.className;
    const endpoint = `/delete/${recordId}`;
    console.log(endpoint);

    //remove dom elements
    let rowName = document.getElementsByClassName(recordId);
    console.log(rowName);
    rowName[0].remove();

    fetch(endpoint, {
      method: 'DELETE',
    }).then(console.log('deleted'));
  }
});

//---------------------------------------------------------------------

//edit record
document.addEventListener('click', function (e) {
  if (e.target.id === 'edit_button') {
    //select row
    recordId = e.target.className;
    let spanName = document.getElementById(recordId);
    console.log(spanName);
    console.log(spanName.nextSibling);

    //store current data
    let name = spanName.nextSibling.childNodes[1].textContent;
    let address = spanName.nextSibling.childNodes[3].textContent;
    let postCode = spanName.nextSibling.childNodes[5].textContent;

    console.log(name);

    //remove dom elements
    let rowName = document.getElementsByClassName(recordId);
    let btn = document.getElementsByClassName('btn' + recordId);
    let newForm = document.getElementById('table_top');
    console.log(rowName);
    rowName[0].remove();
    //btn[0].remove();

    //add form elements
    let html = `
      
    <form class="form" action="/patch/${recordId}" method="post">
    
    <td><input type="text" id="name${recordId}" name="name" value="${name}" /></td>
    <td><input type="text" id="address" name="address" value="${address}" /></td>
    <td><input type="text" id="postcode" name="postCode" value="${postCode}" /></td>
    <td><a class="btn_cancel" href="/">Cancel</a></td>
    <td><button>Submit</button></td>
  
    </form>`;

    spanName.insertAdjacentHTML('afterend', html);

    let formHtmlElement = document.querySelector('.table_form');
    formHtmlElement.action = `/patch/${recordId}`;
    formHtmlElement.method = 'post';

    removeButtons(0);
  }
});

//---------------------------------------------------------------------

//remove buttons to ensure integirty of data entry
function removeButtons(extraEntry) {
  for (let i = 0; i < recordCount - 1 + extraEntry; i++) {
    let editButton = document.getElementById('edit_button');
    editButton.remove();
  }
  for (let i = 0; i < recordCount - 1 + extraEntry; i++) {
    let deleteButton = document.getElementById('delete_button');
    deleteButton.remove();
  }
  btnAddClient.remove();
}
