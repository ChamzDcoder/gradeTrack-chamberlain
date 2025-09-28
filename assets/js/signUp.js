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
    toastBody.textContent = message;
    toastEl.className = `toast align-items-center text-white bg-${type} border-0`;
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
  }

  
  document.getElementById("signupForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    const btnText = document.getElementById("signupBtnText");
    const loader = document.getElementById("signupLoader");
    btnText.textContent = "Signing up...";
    loader.classList.remove("d-none");

    fetch("https://testapi-touo.onrender.com/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    })
    .then(response => response.json().then(data => ({ status: response.status, body: data })))
    .then(result => {
      if (result.status >= 400) {
        showToast(result.body.message || "Error signing up", "danger");
      } else {
       
        localStorage.setItem("currentUser", JSON.stringify(result.body));

        showToast("Sign up successful! Redirecting...", "success");
        setTimeout(() => window.location.href = "./login.html", 1500);
      }
    })
    .catch(error => {
      console.error(error);
      showToast("Something went wrong. Please try again.", "danger");
    })
    .finally(() => {
      btnText.textContent = "Sign Up";
      loader.classList.add("d-none");
    });
  });