 const togglePassword = document.getElementById("togglePassword");
    const passwordInput = document.getElementById("password");
    togglePassword.addEventListener("click", () => {
      const type = passwordInput.type === "password" ? "text" : "password";
      passwordInput.type = type;
      togglePassword.innerHTML = type === "password" ? '<i class="bi bi-eye"></i>' : '<i class="bi bi-eye-slash"></i>';
    });

    
    const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");
    const confirmInput = document.getElementById("confirm-password");
    toggleConfirmPassword.addEventListener("click", () => {
      const type = confirmInput.type === "password" ? "text" : "password";
      confirmInput.type = type;
      toggleConfirmPassword.innerHTML = type === "password" ? '<i class="bi bi-eye"></i>' : '<i class="bi bi-eye-slash"></i>';
    });

    
    function showToast(message, type = "primary") {
      const toastEl = document.getElementById("toast");
      const toastBody = document.getElementById("toastBody");
      toastBody.textContent = message;
      toastEl.className = `toast align-items-center text-white bg-${type} border-0`;
      const toast = new bootstrap.Toast(toastEl);
      toast.show();
    }

    
    document.getElementById("resetForm").addEventListener("submit", function (e) {
      e.preventDefault();

      const email = document.getElementById("email").value.trim();
      const pass = document.getElementById("password").value.trim();
      const confirmPass = document.getElementById("confirm-password").value.trim();

      const btnText = document.getElementById("resetBtnText");
      const loader = document.getElementById("resetLoader");
      btnText.textContent = "Resetting...";
      loader.classList.remove("d-none");

      if (pass !== confirmPass) {
        showToast("Passwords do not match", "danger");
        btnText.textContent = "Reset Password";
        loader.classList.add("d-none");
        return;
      }

      fetch("https://testapi-touo.onrender.com/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, newPassword: pass })
      })
      .then(response => response.json().then(data => ({ status: response.status, body: data })))
      .then(result => {
        if (result.status >= 400) {
          showToast(result.body.message || "Could not reset password", "danger");
        } else {
          showToast("Password reset successful! Please login.", "success");
          setTimeout(() => window.location.href = "./login.html", 1500);
        }
      })
      .catch(err => {
        console.error(err);
        showToast("Something went wrong.", "danger");
      })
      .finally(() => {
        btnText.textContent = "Reset Password";
        loader.classList.add("d-none");
      });
    });