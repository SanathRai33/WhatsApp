const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const identifier =
    document.getElementById("identifier").value.trim();

  const password =
    document.getElementById("password").value.trim();

  const user =
    JSON.parse(localStorage.getItem("user"));

  if (!user) {
    alert("No user found. Please sign up.");
    return;
  }

  const validUser =
    (identifier === user.email ||
      identifier === user.phone) &&
    password === user.password;

  if (validUser) {
    alert("Login Successful");
  } else {
    alert("Invalid Credentials");
  }
});