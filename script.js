const closeButton = document.querySelector(".close-button");
const sectionUserAdd = document.querySelector(".section-user-add");
const form = document.querySelector("#user-form");
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
    name: mainName.value.trim(),
    username: userName.value.trim(),
    email: email.value.trim(),
    phone: phoneNumber.value.trim(),
    website: website.value.trim(),
  };

  if (!isEdit) {
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
  const target = e.target.closest("button");

  if (!target) return;

  if (target.classList.contains("delete")) {
    target.closest("tr").remove();
    allRows = Array.from(userTable.querySelectorAll(".table-row"));
    filterRows = [...allRows];
    displayTableRows();
  }

  if (target.classList.contains("edit")) {
    isEdit = true;
    sectionUserAdd.style.display = "flex";
    const selectRow = target.closest("tr");
    editRow = selectRow;
    mainName.value = selectRow.children[1].textContent;
    userName.value = selectRow.children[2].textContent;
    email.value = selectRow.children[3].textContent;
    phoneNumber.value = selectRow.children[4].textContent;
    website.value = selectRow.children[5].textContent;
    submitButton.value = "Save Changes";
  }
});

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
