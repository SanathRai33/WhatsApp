const signupForm = document.getElementById("signupForm");

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const userData = {
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    password: document.getElementById("password").value.trim(),
  };

  try {
    const { data } = await axios.post("/api/auth/signup", userData);

    alert(data.message);

    if (data.success) {
      window.location.href = "/login";
    }
  } catch (error) {
    alert(error.response?.data?.message || "Signup Failed");
  }
});
