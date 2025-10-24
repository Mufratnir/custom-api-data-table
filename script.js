const closeButton = document.querySelector(".close-button");
const sectionUserAdd = document.querySelector(".section-user-add");
const form = document.querySelector("#user-form");
const id = document.querySelector("#userId");
const mainName = document.querySelector("#name");
const userName = document.querySelector("#user-name");
const email = document.querySelector("#email");
const phoneNumber = document.querySelector("#phone-number");
const website = document.querySelector("#website");
const userTable = document.querySelector("#user-table");
const submitButton = form.querySelector(".submit-btn");
const searchInput = document.querySelector("#search");
const paginationContainer = document.getElementById("pagination");
const addUser = document.querySelector("#addUser");

const apiUrl = "http://localhost/api/api.php";

let isEdit = false;
let isDataLoaded = false;
let editRow = null;

let rowsPerPage = 2;
let currentPage = 1;
let allRows = [];
let filterRows = [];

addUser.addEventListener("click", () => {
  sectionUserAdd.style.display = "flex";
});

closeButton.addEventListener("click", () => {
  sectionUserAdd.style.display = "none";
});

/* =============================
   🧩 Fetch & Load Users
============================= */

async function apiCall() {
  try {
    const response = await fetch(apiUrl);
    const users = await response.json();
    userTab(users);
  } catch (error) {
    alert.error("❌ Error fetching users:", error);
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const userData = {
    id: id.value.trim(),
    name: mainName.value.trim(),
    username: userName.value.trim(),
    email: email.value.trim(),
    phone: phoneNumber.value.trim(),
    website: website.value.trim(),
  };

  if (isEdit == false) {
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();
      console.log(result);

      if (result.success) {
        sectionUserAdd.style.display = "none";
        form.reset();
        userTable.innerHTML = "";
        apiCall();
      } else {
        alert("❌ " + (result.error || "Failed to save user"));
      }
    } catch (error) {
      console.error("❌ Failed to add user:", error);
      alert("❌ Failed to add user");
    }
  } else {
    // 🟡 Update existing user
    const userId = editRow.children[0].textContent;
    console.log(userId);
    const updatedData = { id: userId, ...userData };
    try {
      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      const result = await response.json();

      if (result.success) {
        alert("✅ User updated successfully");
        form.reset();
        sectionUserAdd.style.display = "none";
        isEdit = false;
        submitButton.textContent = "Add User"; // reset button text
        editRow = null;
        userTable.innerHTML = "";
        apiCall();
      } else {
        alert("❌ " + (result.error || "Failed to update user"));
      }
    } catch (err) {
      console.error(err);
      alert("❌ Failed to update user");
    }
  }
});
function userTab(users) {
  console.log(users);
  users.forEach((user) => {
    const newRow = document.createElement("tr");
    newRow.classList.add("table-row");
    newRow.innerHTML = `
    <td>${user.id}</td>
    <td>${user.name}</td>
    <td>${user.username}</td>
    <td>${user.email}</td>
    <td>${user.phone}</td>
    <td>${user.website}</td>
    <td class="is-right">
    <button class="btn edit"><span class="material-symbols-outlined">edit</span></button>
    <button class="btn delete"><span class="material-symbols-outlined">delete</span></button>
    </td>
    `;
    userTable.appendChild(newRow);
  });

  allRows = Array.from(userTable.querySelectorAll(".table-row"));
  filterRows = [...allRows];
  isDataLoaded = true;
  displayTableRows();
}

/* =============================
🔍 Search Bar (outside sync)
============================= */
searchInput.addEventListener("input", (e) => {
  const value = e.target.value.toLowerCase();

  filterRows = allRows.filter((row) => {
    const cells = row.querySelectorAll("td");
    const name = cells[1]?.textContent.toLowerCase() || "";
    const email = cells[3]?.textContent.toLowerCase() || "";
    return name.includes(value) || email.includes(value);
  });

  currentPage = 1;
  displayTableRows();
});

/* =============================
❌ Delete / ✏️ Edit Logic
============================= */
userTable.addEventListener("click", (e) => {
  const editBtn = e.target.closest(".edit");
  const deleteBtn = e.target.closest(".delete");

  // 🧩 Handle Edit
  // if (!editBtn) return;

  const row = editBtn.closest("tr");
  // if (!row) return;

  const cells = row.querySelectorAll("td");

  id.value = cells[0].textContent;
  mainName.value = cells[1].textContent;
  userName.value = cells[2].textContent;
  email.value = cells[3].textContent;
  phoneNumber.value = cells[4].textContent;
  website.value = cells[5].textContent;

  sectionUserAdd.style.display = "flex";
  submitButton.value = "Update User";

  console.log("Edit mode ON");
  editRow = row;
  isEdit = true;

  // 🧩 Handle Delete
  if (deleteBtn) {
    const row = deleteBtn.closest("tr");
    const userId = row.children[0].textContent;

    if (confirm("Are you sure you want to delete this user?")) {
      deleteUser(userId, row);
    }
  }
});

async function deleteUser(id, row) {
  try {
    const response = await fetch(apiUrl, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const result = await response.json();

    if (result.success) {
      alert("🗑️ User deleted successfully");
      row.remove();
    } else {
      alert("❌ " + result.error);
    }
  } catch (error) {
    console.error("Delete failed:", error);
    alert("❌ Failed to delete user");
  }
}
/* =============================
👁️ Show Table Rows
============================= */
function displayTableRows() {
  const totalRows = filterRows.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  // Hide all first
  allRows.forEach((row) => (row.style.display = "none"));

  // Show only paginated filtered rows
  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  filterRows.slice(start, end).forEach((row) => (row.style.display = ""));

  updatePagination(totalPages);
}

/* =============================
📄 Pagination Controls
============================= */
function updatePagination(totalPages) {
  paginationContainer.innerHTML = "";

  // Hide pagination if only one page
  if (totalPages <= 1) {
    paginationContainer.style.display = "none";
    return;
  } else {
    paginationContainer.style.display = "";
  }

  // Prev button
  if (currentPage > 1) {
    const prev = document.createElement("a");
    prev.href = "#";
    prev.textContent = "Prev";
    prev.classList.add("page-prev");
    prev.addEventListener("click", (e) => {
      e.preventDefault();
      if (currentPage > 1) {
        currentPage--;
        displayTableRows();
      }
    });
    paginationContainer.appendChild(prev);
  }

  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    const pageLink = document.createElement("a");
    pageLink.href = "#";
    pageLink.textContent = i;
    pageLink.classList.add("page-link");
    if (i === currentPage) pageLink.classList.add("active");
    pageLink.addEventListener("click", (e) => {
      e.preventDefault();
      currentPage = i;
      displayTableRows();
    });
    paginationContainer.appendChild(pageLink);
  }

  // Next button
  if (currentPage < totalPages) {
    const next = document.createElement("a");
    next.href = "#";
    next.textContent = "Next";
    next.classList.add("page-next");
    next.addEventListener("click", (e) => {
      e.preventDefault();
      if (currentPage < totalPages) {
        currentPage++;
        displayTableRows();
      }
    });
    paginationContainer.appendChild(next);
  }
}

/* =============================
🧹 Utility Events
============================= */
closeButton.addEventListener("click", () => {
  sectionUserAdd.style.display = "none";
});

// window.addEventListener("DOMContentLoaded", displayTableRows);
window.addEventListener("DOMContentLoaded", apiCall);
