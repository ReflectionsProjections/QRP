const loginForm = document.getElementById("login-form2");
const loginButton = document.getElementById("login-form-submit");
const loginErrorMsg = document.getElementById("login-error-msg");

loginButton.addEventListener("click", (e) => {
    e.preventDefault();
    const email = loginForm.email.value;
    const password = loginForm.password.value;
    try {
        fetch("http://localhost:8080/verifyPassword", {
            method: "POST",
            mode: 'cors',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(JSON.parse(email, password)),
        });    
        console.log('Success:');
        window.location.href =  "/qr-code.html"
    } catch (e) {
        console.log('Error', e);
    }

    
  
})