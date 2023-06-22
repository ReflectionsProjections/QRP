const loginForm = document.getElementById("login-form2");
const loginButton = document.getElementById("login-form-submit");

// Check if the user is already logged in
window.addEventListener("DOMContentLoaded", () => {
  const email = localStorage.getItem("email");
  const password = localStorage.getItem("password");
  if (email && password) {
    window.location.href = "qr-code.html";
  }
});

loginButton.addEventListener("click", (e) => {
  e.preventDefault();
  const email = loginForm.email.value;
  const password = loginForm.password.value;
  loginUser(email, password);
});

function loginUser(email, password) {
  const data = { email: email, passcode: password };
  try {
    fetch("http://dev.reflectionsprojections.org/api/auth/verify", {
      method: "POST",
      mode: 'cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
      .then(response => {
        if (response.ok) {
          // Store the credentials in local storage
          localStorage.setItem("email", email);
          localStorage.setItem("password", password);
          window.location.href = "index.html";
        } else {
          console.log('Login failed');
        }
      })
      .catch(error => {
        console.log('Error', error);
      });
  } catch (e) {
    console.log('Error', e);
  }
}
