const loginForm = document.getElementById("login-form");
const loginButton = document.getElementById("login-form-submit");
const loginErrorMsg = document.getElementById("login-error-msg");

loginButton.addEventListener("click", (e) => {
    e.preventDefault();
    const email = loginForm.email.value;
    try {
        fetch("http://localhost:8080/generateVerificationPassword", {
            method: "POST",
            mode: 'cors',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(JSON.parse(email)),
        });    
        console.log('Success:');
    } catch (e) {
        console.log('Error', e);
    }

    window.location.href =  "/login-page2.html"
  
})