const togglePassword = document.getElementById("togglePassword");
  const passwordInput = document.getElementById("password");
  togglePassword.addEventListener("click", () => {
    const type = passwordInput.type === "password" ? "text" : "password";
    passwordInput.type = type;
    togglePassword.innerHTML = type === "password" ? '<i class="bi bi-eye"></i>' : '<i class="bi bi-eye-slash"></i>';
  });

  
  function showToast(message, type = "primary") {
    const toastEl = document.getElementById("toast");
    const toastBody = document.getElementById("toastBody");
    if (toastBody) toastBody.textContent = message;
    if (toastEl) toastEl.className = `toast align-items-center text-white bg-${type} border-0`;
    if (toastEl) new bootstrap.Toast(toastEl).show();
  }

  
  document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    const btnText = document.getElementById("loginBtnText");
    const loader = document.getElementById("loginLoader");
    btnText.textContent = "Logging in...";
    loader.classList.remove("d-none");

    fetch("https://testapi-touo.onrender.com/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    })
    .then(response => response.json().then(data => ({ status: response.status, body: data })))
    .then(result => {
      if (result.status >= 400) {
        showToast(result.body.message || "Login failed", "danger");
        return;
      }

      showToast("✅ Login successful!", "success");

     
      if (result.body.token) {
        localStorage.setItem("authToken", result.body.token);
      }

      
      const respUser = result.body.user || result.body;
      const userId = respUser?._id || respUser?.id || result.body._id || result.body.id || null;

      const currentUser = {
        _id: userId,
        id: userId,
        name: respUser?.name || result.body.name || "User",
        email: respUser?.email || result.body.email || email
      };

      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      -

      setTimeout(() => window.location.href = "./dashboard.html", 1500);
    })
    .catch(error => {
      console.error(error);
      showToast("Something went wrong. Please try again.", "danger");
    })
    .finally(() => {
      btnText.textContent = "Login";
      loader.classList.add("d-none");
    });
  });