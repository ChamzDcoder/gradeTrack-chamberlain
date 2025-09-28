function showToast(message, type = "primary") {
      const toastEl = document.getElementById("toast");
      const toastBody = document.getElementById("toastBody");
      toastBody.textContent = message;
      toastEl.className = `toast align-items-center text-white bg-${type} border-0`;
      new bootstrap.Toast(toastEl).show();
    }

    
    function classify(cgpa) {
      if (cgpa >= 4.5) return "First Class";
      if (cgpa >= 3.5) return "Upper Second Class (2:1)";
      if (cgpa >= 2.5) return "Lower Second Class (2:2)";
      if (cgpa >= 1.5) return "Third Class";
      return "Pass";
    }

    
    function loadDashboard() {
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      if (!currentUser) {
        window.location.replace("login.html");
        return;
      }

      document.getElementById("welcomeMessage").textContent = "Welcome, " + currentUser.name;

      const key = "cgpaRecords_" + currentUser.email;
      const results = JSON.parse(localStorage.getItem(key)) || [];
      const semesterList = document.getElementById("semesterList");
      semesterList.innerHTML = "";

      let totalCgpa = 0;
      results.forEach((r, index) => {
        totalCgpa += parseFloat(r.cgpa);
        semesterList.innerHTML += `
          <li class="list-group-item d-flex justify-content-between align-items-center">
            <span>${r.semester}</span>
            <div>
              <span class="fw-bold me-2">${r.cgpa}</span>
              <button class="btn btn-sm btn-outline-primary viewSemester" data-index="${index}">
                <i class="bi bi-eye"></i>
              </button>
              <button class="btn btn-sm btn-outline-danger deleteSemester" data-index="${index}">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </li>
        `;
      });

      const avgCgpa = results.length ? (totalCgpa / results.length).toFixed(2) : "0.00";
      document.getElementById("currentCgpa").textContent = avgCgpa;
      document.getElementById("classification").textContent = results.length ? classify(avgCgpa) : "--";
    }

    
    document.getElementById("semesterList").addEventListener("click", (e) => {
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      if (!currentUser) return;
      const key = "cgpaRecords_" + currentUser.email;
      let results = JSON.parse(localStorage.getItem(key)) || [];

      
      if (e.target.closest(".deleteSemester")) {
        const index = e.target.closest(".deleteSemester").dataset.index;
        results.splice(index, 1);
        localStorage.setItem(key, JSON.stringify(results));
        showToast("Semester deleted!", "danger");
        loadDashboard();
      }

      
      if (e.target.closest(".viewSemester")) {
        const index = e.target.closest(".viewSemester").dataset.index;
        const semester = results[index];

        let detailsHtml = `
          <p><strong>Semester:</strong> ${semester.semester}</p>
          <p><strong>CGPA:</strong> ${semester.cgpa}</p>
        `;

        if (semester.courses && semester.courses.length) {
          detailsHtml += `
            <h6 class="mt-3">Courses</h6>
            <div class="table-responsive">
              <table class="table table-bordered table-striped align-middle">
                <thead class="table-primary">
                  <tr><th>Name</th><th>Code</th><th>Units</th><th>Grade</th></tr>
                </thead><tbody>
          `;
          semester.courses.forEach(c => {
            detailsHtml += `<tr><td>${c.name}</td><td>${c.code}</td><td>${c.units}</td><td>${c.grade}</td></tr>`;
          });
          detailsHtml += `</tbody></table></div>`;
        } else {
          detailsHtml += `<p class="text-muted">No courses saved.</p>`;
        }

        document.getElementById("semesterDetails").innerHTML = detailsHtml;
        new bootstrap.Modal(document.getElementById("viewSemesterModal")).show();
      }
    });

    
   document.getElementById("deleteAccountBtn").addEventListener("click", function () {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
    showToast("❌ User not found. Please log in again.", "danger");
    return;
  }

  
  const userId = currentUser._id || currentUser.id || null;
  if (!userId) {
    showToast("❌ User ID not found. Please log in again.", "danger");
    return;
  }

  if (!confirm("⚠️ Are you sure you want to permanently delete your account?")) return;

  fetch(`https://testapi-touo.onrender.com/api/users/${encodeURIComponent(userId)}`, {
    method: "DELETE"
  })
  .then(res => {
    if (!res.ok) {
      
      return res.json().then(body => {
        const msg = (body && (body.message || JSON.stringify(body))) || "Failed to delete account";
        throw new Error(msg);
      }).catch(() => { throw new Error("Failed to delete account"); });
    }
    
    localStorage.removeItem("currentUser");
    localStorage.removeItem("authToken");
    showToast("✅ Account deleted successfully!", "success");
    setTimeout(() => window.location.replace("login.html"), 1400);
  })
  .catch(err => {
    console.error(err);
    showToast("❌ Error deleting account: " + (err.message || ""), "danger");
  });
});


    document.getElementById("logoutBtn").addEventListener("click", () => {
      localStorage.removeItem("currentUser");
      window.location.replace("login.html");
    });

    loadDashboard();