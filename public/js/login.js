const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const loginData = {
    identifier: document.getElementById("identifier").value.trim(),
    password: document.getElementById("password").value.trim(),
  };

  try {
    const { data } = await axios.post("/api/auth/login", loginData);

    if (data.success) {
      localStorage.setItem("token", data.token);

      localStorage.setItem("userId", data.userId);

      alert(data.message);

      window.location.href = "/chat";
    }
  } catch (error) {
    alert(error.response?.data?.message || "Login Failed");
  }
});
