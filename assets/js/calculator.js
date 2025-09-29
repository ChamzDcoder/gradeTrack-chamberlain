
function showToast(message, type = "primary") { 
  const toastEl = document.getElementById("toast");
  const toastBody = document.getElementById("toastBody");
  toastBody.textContent = message;
  toastEl.className = `toast align-items-center text-white bg-${type} border-0`;
  new bootstrap.Toast(toastEl).show();
}

const coursesContainer = document.getElementById("coursesContainer");
const cgpaResult = document.getElementById("cgpaResult");

function createCourseRow() {
  const row = document.createElement("div");
  row.classList.add("row", "g-2", "align-items-center", "mb-2", "courseRow");
  row.innerHTML = `
    <div class="col-md-3"><input type="text" class="form-control" placeholder="Enter course Name"></div>
    <div class="col-md-2"><input type="text" class="form-control" placeholder="course code"></div>
    <div class="col-md-2"><input type="text" class="form-control creditUnit" placeholder="course units"></div>
    <div class="col-md-2">
      <select class="form-select gradeSelect">
        <option value="">Select grade</option>
        <option value="5">A</option>
        <option value="4">B</option>
        <option value="3">C</option>
        <option value="2">D</option>
        <option value="1">E</option>
        <option value="0">F</option>
      </select>
    </div>
    <div class="col-md-1 text-center">
      <button class="btn btn-sm btn-outline-danger removeCourse"><i class="bi bi-trash"></i></button>
    </div>
  `;
  return row;
}

document.getElementById("addCourse").addEventListener("click", () => {
  coursesContainer.appendChild(createCourseRow());
});

coursesContainer.addEventListener("click", (e) => {
  if (e.target.closest(".removeCourse")) {
    e.target.closest(".courseRow").remove();
  }
});

function validateInputs() {
  let isValid = true;
  document.querySelectorAll(".courseRow").forEach(row => {
    const name = row.querySelector("input[placeholder='Enter course Name']");
    const code = row.querySelector("input[placeholder='course code']");
    const units = row.querySelector(".creditUnit");
    const grade = row.querySelector(".gradeSelect");

    [name, code, units, grade].forEach(input => input.classList.remove("is-invalid"));

    if (!name.value.trim()) { name.classList.add("is-invalid"); isValid = false; }
    if (!code.value.trim()) { code.classList.add("is-invalid"); isValid = false; }
    if (!units.value.trim()) { units.classList.add("is-invalid"); isValid = false; }
    if (!grade.value.trim()) { grade.classList.add("is-invalid"); isValid = false; }
  });
  return isValid;
}

function calculateCGPA() {
  let totalPoints = 0, totalUnits = 0;
  document.querySelectorAll(".courseRow").forEach(row => {
    const units = parseFloat(row.querySelector(".creditUnit").value) || 0;
    const grade = parseFloat(row.querySelector(".gradeSelect").value) || 0;
    totalPoints += units * grade;
    totalUnits += units;
  });
  return totalUnits > 0 ? (totalPoints / totalUnits).toFixed(2) : "0.00";
}

document.getElementById("calculateBtn").addEventListener("click", () => {
  if (!validateInputs()) {
    showToast("⚠️ Fill all fields!", "warning");
    return;
  }

  const cgpa = calculateCGPA();
  cgpaResult.textContent = cgpa;

  // Show the card below the buttons
  const card = document.getElementById("currentCalculationCard");
  card.style.display = "block";

  // Smooth scroll to the card
  card.scrollIntoView({ behavior: "smooth", block: "start" });
});

document.getElementById("saveBtn").addEventListener("click", () => {
  if (!validateInputs()) {
    showToast("⚠️ Fill all fields before saving!", "warning");
    return;
  }

  const semesterName = document.getElementById("semesterName").value || "Unnamed Semester";
  const cgpa = calculateCGPA();

  let courses = [];
  document.querySelectorAll(".courseRow").forEach(row => {
    const name = row.querySelector("input[placeholder='Enter course Name']").value.trim();
    const code = row.querySelector("input[placeholder='course code']").value.trim();
    const units = row.querySelector(".creditUnit").value.trim();
    const gradeSelect = row.querySelector(".gradeSelect");
    const gradeText = gradeSelect.options[gradeSelect.selectedIndex].text;
    courses.push({ name, code, units, grade: gradeText });
  });

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
    showToast("You must be logged in to save results.", "warning");
    return;
  }

  const key = "cgpaRecords_" + currentUser.email;
  let results = JSON.parse(localStorage.getItem(key)) || [];
  results.push({ semester: semesterName, cgpa, courses });
  localStorage.setItem(key, JSON.stringify(results));

  showToast("✅ Result saved to Dashboard!", "success");
  setTimeout(() => window.location.href = "dashboard.html", 1200);
});

// Delete account
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

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("currentUser");
  window.location.replace("login.html");
});

