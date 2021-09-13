function addEventListeners() {
  document.addEventListener('click', function (e) {
    //login
    if (e.target.id == 'login_btn') {
      e.preventDefault();
      login();
    }
    //sign up link
    if (e.target.id == 'signup_link_btn') {
      e.preventDefault();
      window.location.href = '/signup';
    }
    //sign up
    if (e.target.id == 'signup_with_details_btn') {
      e.preventDefault();
      signUp();
    }
  });
}
addEventListeners();

//---------------------------------------------------------------------

async function login() {
  const emailInput = document.getElementById('email_input');
  const passwordInput = document.getElementById('password_input');

  try {
    const data = JSON.stringify({
      email: emailInput.value,
      password: passwordInput.value,
    });

    const myInit = {
      headers: { 'Content-Type': 'application/json' },
      body: data,
      method: 'POST',
    };

    let login = await fetch('/login', myInit);
    let loginResult = await login.json();
    console.log(loginResult);

    if (loginResult.status === 'success') {
      window.location.href = '/home';
    }

    if (loginResult.status === 'fail') {
      renderLoginInputError(loginResult.message);
    }
  } catch (error) {
    console.log(error);
  }
}

//---------------------------------------------------------------------

async function signUp() {
  const nameInput = document.getElementById('name_input');
  const emailInput = document.getElementById('email_input');
  const passwordInput = document.getElementById('password_input');
  const passwordConfirmInput = document.getElementById(
    'password_input_confirm'
  );

  try {
    const data = JSON.stringify({
      name: nameInput.value,
      email: emailInput.value,
      password: passwordInput.value,
      passwordConfirm: passwordConfirmInput.value,
    });

    const myInit = {
      headers: { 'Content-Type': 'application/json' },
      body: data,
      method: 'POST',
    };

    let signUp = await fetch('/signup', myInit);
    let signUpResult = await signUp.json();
    console.log(signUpResult);

    if (signUpResult.status === 'success') {
      window.location.href = '/home';
      return;
    }

    if (signUpResult.message.code) {
      removeInputErrors();

      let newForm = document.getElementsByClassName(`email_error`);
      html = `<div class="errors">Email already exists!</div>`;
      newForm[0].insertAdjacentHTML('afterbegin', html);

      return;
    }

    if (signUpResult.status === 'fail') {
      renderSignUpInputError(signUpResult.message);
      return;
    }
  } catch (error) {
    console.log(error);
  }
}

//---------------------------------------------------------------------

function renderSignUpInputError(errorMessage) {
  removeInputErrors();
  console.log(errorMessage);

  let html = '';
  Object.values(errorMessage.errors).forEach(error => {
    let newForm = document.getElementsByClassName(`${error.path}_error`);
    html = `<div class="errors">${error.message}</div>`;
    newForm[0].insertAdjacentHTML('afterbegin', html);
  });
}

//---------------------------------------------------------------------

function renderLoginInputError(errorMessage) {
  removeInputErrors();

  let html = `<div class="errors">${errorMessage}</div>`;

  let newForm = document.getElementById('password_error');
  newForm.insertAdjacentHTML('afterend', html);
}

//---------------------------------------------------------------------

function removeInputErrors() {
  let inputErrors = document.getElementsByClassName('errors');

  while (inputErrors.length > 0) {
    inputErrors[0].remove();
  }
}
