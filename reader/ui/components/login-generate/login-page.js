const loginForm = document.getElementById("login-form");
const loginButton = document.getElementById("login-form-submit");


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
            window.location.href = "../login-verify/login-page2.html"; // Redirect to login-page2.html
        } else {
            console.log('Error:', response.status);
        }
    } catch (e) {
        console.log('Error:', e);
    }
});