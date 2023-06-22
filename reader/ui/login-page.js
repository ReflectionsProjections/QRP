const loginForm = document.getElementById("login-form");
const loginButton = document.getElementById("login-form-submit");

// Check if the user is already logged in
window.addEventListener("DOMContentLoaded", () => {
    const email = localStorage.getItem("email");
    const password = localStorage.getItem("password");
    if (email && password) {
      window.location.href = "qr-code.html";
    }
  });


loginButton.addEventListener("click", async (e) => {
    e.preventDefault();
    const email = loginForm.email.value;
    const data = { email: email };
    console.log(data);
    

    try {
        const response = await fetch("http://dev.reflectionsprojections.org/api/auth/generate", {
            method: "POST",
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            console.log('Success');
            window.location.href = "login-page2.html"; // Redirect to login-page2.html
        } else {
            console.log('Error:', response.status);
        }
    } catch (e) {
        console.log('Error:', e);
    }
});