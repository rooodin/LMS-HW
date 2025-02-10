
//get widgets and variables
const URL = "http://localhost:3000/register";
const email = document.getElementById("email");
const username = document.getElementById("username");
const password = document.getElementById("password");
const error_login = document.getElementById('error-login');

//functions
async function handleRegister(event) {
    event.preventDefault();
    let user = {
        email: email.value,
        username: username.value,
        password: password.value,
    };

    try {
        const res = await fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user),
        })

        const data = await res.json();
        
        if (!res.ok) {
            throw new Error(data.error || "Registration failed");
        }
        console.log("user Sign Up succesfully!!!");
        window.location.href = "http://127.0.0.1:5500/client/login.html"


    } catch (error) {
        console.error("Error:", error.message);
        error_login.classList.remove("hide");
        email.style.border = "1px solid red";
    }

}
