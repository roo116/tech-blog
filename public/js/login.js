const loginFormHandler = async function(event) {
  event.preventDefault();

  console.log('>>>> button was clicked and in loginformhandler')

  const usernameEl = document.querySelector('#username-input-login');
  const passwordEl = document.querySelector('#password-input-login');

  const response = await fetch('/api/user/login', {
    method: 'POST',
    body: JSON.stringify({
      username: usernameEl.value,
      password: passwordEl.value,
    }),
    headers: { 'Content-Type': 'application/json' },
  });

  if (response.ok) {
    console.log("This is the response in login.js ", response);
    document.location.replace('/dashboard');
  } else {
    alert('Failed to login');
  }
};  

document
  .querySelector('#login-form')
  .addEventListener('submit', loginFormHandler);
