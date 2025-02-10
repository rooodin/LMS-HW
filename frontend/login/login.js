// Get widgets and variables
const URL = "http://localhost:3000/api/login";
const email = document.getElementById("email");
const password = document.getElementById("password");
const error_login = document.getElementById("error-login");

// Functions
async function handleLogin(event) {
  event.preventDefault();
  let user = {
    email: email.value,
    password: password.value,
  };

  try {
    const res = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Login failed");
    }

    console.log("User logged in successfully!");

    // Store the JWT token in localStorage
    localStorage.setItem("token", data.token); // Store the token, not user info

    // Redirect to the home page
    window.location.href = "http://127.0.0.1:5500/frontend/home/home.html";
  } catch (error) {
    console.error(error);
    error_login.classList.remove("hide");
    email.style.border = "1px solid red";
    password.style.border = "1px solid red";
  }
}
