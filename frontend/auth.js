
//get widgets
const home = document.getElementById("home");
const stats = document.getElementById("stats");
const users = document.getElementById("users");
const login = document.getElementById("login");
const register = document.getElementById("register");
const logout_btn = document.getElementById("logout");

window.addEventListener("load", () => {
    let user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
        location.href = "http://127.0.0.1:5500/client/login.html"
    }
    login.classList.add("hide");
    register.classList.add("hide");
    logout_btn.classList.remove("hide");

    //remove navs from normal user
    if (!user.isAdmin) {
        stats.classList.add("hide");
        users.classList.add("hide");
    }
});



function logout() {
    let user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
        return;
    }
    localStorage.removeItem("user");
    location.href = "http://127.0.0.1:5500/client/index.html";
}