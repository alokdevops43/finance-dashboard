/* ============================================================
   EXPENSE TRACKER
   PART 1
   Setup • Categories • Local Storage • Initialization
============================================================ */

// ============================================================
// DOM ELEMENTS
// ============================================================

const transactionForm = document.getElementById("transactionForm");

const titleInput = document.getElementById("title");
const amountInput = document.getElementById("amount");
const categorySelect = document.getElementById("category");
const typeSelect = document.getElementById("type");
const dateInput = document.getElementById("date");

const searchInput = document.getElementById("search");
const filterCategory = document.getElementById("filterCategory");
const filterType = document.getElementById("filterType");
const sortSelect = document.getElementById("sort");

const transactionList = document.getElementById("transactionList");
const emptyState = document.getElementById("emptyState");

const balanceElement = document.getElementById("balance");
const incomeElement = document.getElementById("income");
const expenseElement = document.getElementById("expense");
const totalTransactionElement = document.getElementById("transactions");

const currentDateElement = document.getElementById("currentDate");

const titleError = document.getElementById("titleError");
const amountError = document.getElementById("amountError");

// ============================================================
// LOCAL STORAGE KEY
// ============================================================

const STORAGE_KEY = "expense_tracker_transactions";

// ============================================================
// CATEGORY DATA
// ============================================================

const categories = {

    Income: [

        { name: "Salary", emoji: "💼" },
        { name: "Freelance", emoji: "💻" },
        { name: "Business", emoji: "🏢" },
        { name: "Bonus", emoji: "🎉" },
        { name: "Investment", emoji: "📈" },
        { name: "Gift", emoji: "🎁" },
        { name: "Other", emoji: "✨" }

    ],

    Expense: [

        { name: "Food", emoji: "🍔" },
        { name: "Shopping", emoji: "🛒" },
        { name: "Travel", emoji: "✈️" },
        { name: "Bills", emoji: "📄" },
        { name: "Rent", emoji: "🏠" },
        { name: "Education", emoji: "📚" },
        { name: "Entertainment", emoji: "🎬" },
        { name: "Health", emoji: "❤️" },
        { name: "Fuel", emoji: "⛽" },
        { name: "Grocery", emoji: "🛍️" },
        { name: "Other", emoji: "✨" }

    ]

};

// ============================================================
// APPLICATION STATE
// ============================================================

let transactions = JSON.parse(
    localStorage.getItem(STORAGE_KEY)
) || [];

let filteredTransactions = [];

// ============================================================
// SHOW CURRENT DATE
// ============================================================

function showCurrentDate() {

    const today = new Date();

    const options = {

        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"

    };

    currentDateElement.textContent =
        today.toLocaleDateString("en-IN", options);

}

// ============================================================
// POPULATE CATEGORY DROPDOWN
// ============================================================

function loadCategories(type = "Income") {

    categorySelect.innerHTML = "";

    categories[type].forEach(category => {

        const option = document.createElement("option");

        option.value = category.name;

        option.textContent =
            `${category.emoji} ${category.name}`;

        categorySelect.appendChild(option);

    });

}

// ============================================================
// FILTER CATEGORY DROPDOWN
// ============================================================

function populateFilterCategories() {

    filterCategory.innerHTML =
        `<option value="All">All Categories</option>`;

    const all = [
        ...categories.Income,
        ...categories.Expense
    ];

    const unique = [...new Set(all.map(item => item.name))];

    unique.sort();

    unique.forEach(category => {

        const option = document.createElement("option");

        option.value = category;

        option.textContent = category;

        filterCategory.appendChild(option);

    });

}

// ============================================================
// SAVE DATA
// ============================================================

function saveTransactions() {

    localStorage.setItem(

        STORAGE_KEY,

        JSON.stringify(transactions)

    );

}

// ============================================================
// CURRENCY FORMAT
// ============================================================

function formatCurrency(amount) {

    return new Intl.NumberFormat("en-IN", {

        style: "currency",

        currency: "INR",

        maximumFractionDigits: 2

    }).format(amount);

}

// ============================================================
// DATE FORMAT
// ============================================================

function formatDate(date) {

    return new Date(date).toLocaleDateString(

        "en-IN",

        {

            day: "2-digit",

            month: "short",

            year: "numeric"

        }

    );

}

// ============================================================
// UNIQUE ID
// ============================================================

function generateId() {

    return Date.now() + Math.random();

}

// ============================================================
// RESET ERRORS
// ============================================================

function clearErrors() {

    titleError.textContent = "";

    amountError.textContent = "";

}

// ============================================================
// RESET FORM
// ============================================================

function resetForm() {

    transactionForm.reset();

    dateInput.valueAsDate = new Date();

    typeSelect.value = "Income";

    loadCategories("Income");

    clearErrors();

}

// ============================================================
// EMPTY STATE
// ============================================================

function toggleEmptyState() {

    if (transactions.length === 0) {

        emptyState.style.display = "flex";

        transactionList.style.display = "none";

    } else {

        emptyState.style.display = "none";

        transactionList.style.display = "flex";

    }

}

// ============================================================
// INITIALIZE APP
// ============================================================

function initializeApp() {

    showCurrentDate();

    loadCategories();

    populateFilterCategories();

    dateInput.valueAsDate = new Date();

    toggleEmptyState();

}

// ============================================================
// START
// ============================================================

initializeApp();

/* ============================================================
   EXPENSE TRACKER
   PART 2
   Validation • Add Transaction • Dashboard
============================================================ */

// ============================================================
// VALIDATE FORM
// ============================================================

function validateForm() {

    clearErrors();

    let isValid = true;

    const title = titleInput.value.trim();

    const amount = Number(amountInput.value);

    if (title.length < 3) {

        titleError.textContent =
            "Title must contain at least 3 characters.";

        isValid = false;

    }

    if (isNaN(amount) || amount <= 0) {

        amountError.textContent =
            "Amount must be greater than 0.";

        isValid = false;

    }

    if (!dateInput.value) {

        alert("Please select a date.");

        isValid = false;

    }

    return isValid;

}

// ============================================================
// ADD TRANSACTION
// ============================================================

function addTransaction(e) {

    e.preventDefault();

    if (!validateForm()) return;

    const selectedCategory = categories[typeSelect.value]
        .find(item => item.name === categorySelect.value);

    const transaction = {

        id: generateId(),

        title: titleInput.value.trim(),

        amount: Number(amountInput.value),

        category: categorySelect.value,

        icon: selectedCategory
            ? selectedCategory.emoji
            : "💰",

        type: typeSelect.value,

        date: dateInput.value

    };

    transactions.unshift(transaction);

    saveTransactions();

    renderTransactions();

    updateDashboard();

    toggleEmptyState();

    resetForm();

}

// ============================================================
// DASHBOARD
// ============================================================

function updateDashboard() {

    let income = 0;

    let expense = 0;

    transactions.forEach(transaction => {

        if (transaction.type === "Income") {

            income += transaction.amount;

        } else {

            expense += transaction.amount;

        }

    });

    const balance = income - expense;

    animateNumber(balanceElement, balance);

    animateNumber(incomeElement, income);

    animateNumber(expenseElement, expense);

    totalTransactionElement.textContent =
        transactions.length;

}

// ============================================================
// ANIMATED NUMBER
// ============================================================

function animateNumber(element, value) {

    element.style.opacity = 0;

    setTimeout(() => {

        if (element === totalTransactionElement) {

            element.textContent = value;

        }

        else {

            element.textContent =
                formatCurrency(value);

        }

        element.style.opacity = 1;

    }, 120);

}

// ============================================================
// TYPE CHANGE
// ============================================================

typeSelect.addEventListener("change", () => {

    loadCategories(typeSelect.value);

});

// ============================================================
// FORM SUBMIT
// ============================================================

transactionForm.addEventListener(

    "submit",

    addTransaction

);

// ============================================================
// INITIAL DASHBOARD
// ============================================================

updateDashboard();

/* ============================================================
   EXPENSE TRACKER
   PART 3
   Render • Delete • Search • Filters
============================================================ */

// ============================================================
// RENDER TRANSACTIONS
// ============================================================

function renderTransactions(data = transactions) {

    transactionList.innerHTML = "";

    toggleEmptyState();

    if (data.length === 0) {

        transactionList.style.display = "none";
        emptyState.style.display = "flex";

        return;

    }

    transactionList.style.display = "flex";
    emptyState.style.display = "none";

    data.forEach(transaction => {

        const card = document.createElement("div");

        card.className = "transaction-card";

        card.innerHTML = `

            <div class="transaction-left">

                <div class="transaction-icon">

                    ${transaction.icon}

                </div>

                <div class="transaction-info">

                    <h3>${transaction.title}</h3>

                    <p>

                        ${transaction.category}

                        •

                        ${formatDate(transaction.date)}

                    </p>

                </div>

            </div>

            <div class="transaction-right">

                <span class="badge ${
                    transaction.type === "Income"
                        ? "badge-income"
                        : "badge-expense"
                }">

                    ${transaction.type}

                </span>

                <h3 class="transaction-amount ${
                    transaction.type === "Income"
                        ? "amount-income"
                        : "amount-expense"
                }">

                    ${transaction.type === "Income" ? "+" : "-"}

                    ${formatCurrency(transaction.amount)}

                </h3>

                <button
                    class="delete-btn"
                    data-id="${transaction.id}"
                    title="Delete Transaction">

                    🗑️

                </button>

            </div>

        `;

        transactionList.appendChild(card);

    });

}

// ============================================================
// DELETE TRANSACTION
// ============================================================

function deleteTransaction(id) {

    const confirmDelete = confirm(
        "Delete this transaction?"
    );

    if (!confirmDelete) return;

    transactions = transactions.filter(

        transaction => transaction.id != id

    );

    saveTransactions();

    renderFilteredTransactions();

    updateDashboard();

    toggleEmptyState();

}

// ============================================================
// DELETE BUTTON EVENT
// ============================================================

transactionList.addEventListener("click", event => {

    const button = event.target.closest(".delete-btn");

    if (!button) return;

    deleteTransaction(button.dataset.id);

});

// ============================================================
// SEARCH + FILTER
// ============================================================

function renderFilteredTransactions() {

    let result = [...transactions];

    const keyword =
        searchInput.value.trim().toLowerCase();

    const category =
        filterCategory.value;

    const type =
        filterType.value;

    // Search

    if (keyword) {

        result = result.filter(transaction =>

            transaction.title
                .toLowerCase()
                .includes(keyword)

        );

    }

    // Category

    if (category !== "All") {

        result = result.filter(transaction =>

            transaction.category === category

        );

    }

    // Type

    if (type !== "All") {

        result = result.filter(transaction =>

            transaction.type === type

        );

    }

    filteredTransactions = result;

    renderTransactions(result);

}

// ============================================================
// LIVE SEARCH
// ============================================================

searchInput.addEventListener(

    "input",

    renderFilteredTransactions

);

// ============================================================
// CATEGORY FILTER
// ============================================================

filterCategory.addEventListener(

    "change",

    renderFilteredTransactions

);

// ============================================================
// TYPE FILTER
// ============================================================

filterType.addEventListener(

    "change",

    renderFilteredTransactions

);

// ============================================================
// LOAD SAVED DATA
// ============================================================

renderTransactions();

renderFilteredTransactions();

/* ============================================================
   EXPENSE TRACKER
   PART 4
   Sorting • Final Initialization • Helpers
============================================================ */

// ============================================================
// SORT TRANSACTIONS
// ============================================================

function sortTransactions(list) {

    const sorted = [...list];

    switch (sortSelect.value) {

        case "newest":

            sorted.sort((a, b) =>
                new Date(b.date) - new Date(a.date)
            );

            break;

        case "oldest":

            sorted.sort((a, b) =>
                new Date(a.date) - new Date(b.date)
            );

            break;

        case "high":

            sorted.sort((a, b) =>
                b.amount - a.amount
            );

            break;

        case "low":

            sorted.sort((a, b) =>
                a.amount - b.amount
            );

            break;

        case "az":

            sorted.sort((a, b) =>
                a.title.localeCompare(b.title)
            );

            break;

        case "za":

            sorted.sort((a, b) =>
                b.title.localeCompare(a.title)
            );

            break;

        default:

            sorted.sort((a, b) =>
                new Date(b.date) - new Date(a.date)
            );

    }

    return sorted;

}

// ============================================================
// OVERRIDE FILTER FUNCTION
// ============================================================

function renderFilteredTransactions() {

    let result = [...transactions];

    const keyword = searchInput.value.trim().toLowerCase();
    const category = filterCategory.value;
    const type = filterType.value;

    if (keyword) {

        result = result.filter(item =>
            item.title.toLowerCase().includes(keyword)
        );

    }

    if (category !== "All") {

        result = result.filter(item =>
            item.category === category
        );

    }

    if (type !== "All") {

        result = result.filter(item =>
            item.type === type
        );

    }

    result = sortTransactions(result);

    filteredTransactions = result;

    renderTransactions(result);

}

// ============================================================
// SORT EVENT
// ============================================================

sortSelect.addEventListener(

    "change",

    renderFilteredTransactions

);

// ============================================================
// SMOOTH SCROLL
// ============================================================

function scrollToTop() {

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}

// ============================================================
// SUCCESS FLASH
// ============================================================

function flashDashboard() {

    document.querySelectorAll(".card").forEach(card => {

        card.style.transform = "scale(1.03)";

        setTimeout(() => {

            card.style.transform = "";

        }, 220);

    });

}

// ============================================================
// PATCH ADD TRANSACTION
// ============================================================

const originalAddTransaction = addTransaction;

addTransaction = function (e) {

    originalAddTransaction(e);

    flashDashboard();

    scrollToTop();

};

// Re-bind submit event

transactionForm.removeEventListener(
    "submit",
    originalAddTransaction
);

transactionForm.addEventListener(
    "submit",
    addTransaction
);

// ============================================================
// LOAD SAVED DATA
// ============================================================

if (transactions.length > 0) {

    renderFilteredTransactions();

} else {

    renderTransactions();

}

// ============================================================
// DASHBOARD
// ============================================================

updateDashboard();

// ============================================================
// EMPTY STATE
// ============================================================

toggleEmptyState();

// ============================================================
// DEFAULT DATE
// ============================================================

dateInput.valueAsDate = new Date();

// ============================================================
// CONSOLE
// ============================================================

console.log("%cExpense Tracker Loaded",
    "color:#4F46E5;font-size:16px;font-weight:bold;"
);

console.log(
    "Transactions:",
    transactions.length
);

