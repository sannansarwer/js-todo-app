// ================= DOM ELEMENTS =================
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskTable = document.getElementById("taskTable");

const deleteAll = document.getElementById("deleteAll");
const filterAll = document.getElementById("filterAll");
const filterPending = document.getElementById("filterPending");
const filterComplete = document.getElementById("filterComplete");

const lightModeBtn = document.getElementById("lightMode");
const darkModeBtn = document.getElementById("darkMode");

// Keep track of total tasks
let taskCount = 0;

// ================= LOCAL STORAGE =================
function saveTasksToLocalStorage() {
    const rows = taskTable.querySelectorAll("tr");
    const tasks = [];

    rows.forEach(row => {
        tasks.push({
            text: row.querySelector("td").childNodes[0].textContent.trim(),
            status: row.dataset.status
        });
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasksFromLocalStorage() {
    const tasks = JSON.parse(localStorage.getItem("tasks"));
    if (!tasks) return;

    tasks.forEach(task => {
        taskInput.value = task.text;
        addTaskToTable();

        if (task.status === "completed") {
            const lastRow = taskTable.lastElementChild;
            lastRow.querySelector(".doneBtn").click();
        }
    });
}

// ===== IMPORT / EXPORT FUNCTIONALITY =====

// Select Import & Export buttons
const importBtn = document.querySelector(".card-footer .btn-outline-primary");
const exportBtn = document.querySelector(".card-footer .btn-outline-dark");
const importFile = document.getElementById("importFile");

// EXPORT: download tasks.json
exportBtn.addEventListener("click", () => {
    const data = localStorage.getItem("tasks");
    if (!data) {
        alert("No tasks to export!");
        return;
    }

    const blob = new Blob([data], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "tasks.json";
    link.click();
});

// IMPORT: load tasks from file
importBtn.addEventListener("click", () => {
    importFile.click();
});

importFile.addEventListener("change", e => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
        try {
            const importedTasks = JSON.parse(reader.result);

            if (!Array.isArray(importedTasks)) throw "Invalid file";

            // Clear existing tasks
            taskTable.innerHTML = "";
            taskCount = 0;

            // Add tasks using your existing function
            importedTasks.forEach(task => {
                taskInput.value = task.text;
                addTaskToTable();

                if (task.status === "completed") {
                    const lastRow = taskTable.lastElementChild;
                    lastRow.querySelector(".doneBtn").click();
                }
            });

            saveTasksToLocalStorage();
            alert("Tasks imported successfully!");
        } catch {
            alert("Invalid JSON file!");
        }
    };

    reader.readAsText(file);
});


// ================= ADD TASK =================
const addTaskToTable = () => {
    const taskValue = taskInput.value.trim();

    if (taskValue === "") {
        alert("Please enter a task!");
        return;
    }

    taskCount++;

    const row = document.createElement("tr");
    row.dataset.status = "pending";

    row.innerHTML = `
        <th scope="row">${taskCount}</th>
        <td>${taskValue}</td>
        <td>
            <button class="btn btn-outline-primary btn-sm editBtn">Edit</button>
            <button class="btn btn-outline-success btn-sm doneBtn">Done</button>
            <button class="btn btn-outline-danger btn-sm deleteBtn">Delete</button>
        </td>
    `;

    const editBtn = row.querySelector(".editBtn");
    const doneBtn = row.querySelector(".doneBtn");
    const deleteBtn = row.querySelector(".deleteBtn");

    // EDIT
    editBtn.addEventListener("click", () => {
        const currentTask = row.querySelector("td");
        const newTask = prompt("Update Your Task", currentTask.textContent);

        if (newTask !== null && newTask.trim() !== "") {
            currentTask.textContent = newTask.trim();
            saveTasksToLocalStorage();
        }
    });

    // DONE
    doneBtn.addEventListener("click", () => {
        const currentTask = row.querySelector("td");
        currentTask.style.textDecoration = "line-through";

        const tickBadge = document.createElement("span");
        tickBadge.className = "badge bg-success ms-2";
        tickBadge.textContent = "✓";
        currentTask.appendChild(tickBadge);

        row.dataset.status = "completed";

        doneBtn.disabled = true;
        editBtn.disabled = true;

        saveTasksToLocalStorage();
    });

    // DELETE
    deleteBtn.addEventListener("click", () => {
        row.remove();

        const rows = taskTable.querySelectorAll("tr");
        rows.forEach((r, index) => {
            r.querySelector("th").textContent = index + 1;
        });

        taskCount = rows.length;
        saveTasksToLocalStorage();
    });

    taskTable.appendChild(row);
    taskInput.value = "";

    saveTasksToLocalStorage();
};

// ================= ADD BUTTON EVENTS =================
addTaskBtn.addEventListener("click", addTaskToTable);

taskInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addTaskToTable();
});

// ================= DELETE ALL =================
deleteAll.addEventListener("click", () => {
    if (taskTable.rows.length === 0) {
        alert("There are no tasks available to delete!");
        return;
    }

    if (!confirm("Are you sure you want to delete all tasks?")) return;

    taskTable.innerHTML = "";
    taskCount = 0;
    localStorage.removeItem("tasks");
});

// ================= FILTERS =================
const filterButtons = [filterAll, filterPending, filterComplete];

function setActiveFilter(activeButton) {
    filterButtons.forEach(btn => btn.classList.remove("active"));
    activeButton.classList.add("active");
}

filterAll.addEventListener("click", () => {
    setActiveFilter(filterAll);
    taskTable.querySelectorAll("tr").forEach(row => row.style.display = "");
});

filterPending.addEventListener("click", () => {
    setActiveFilter(filterPending);
    taskTable.querySelectorAll("tr").forEach(row => {
        row.style.display = row.dataset.status === "pending" ? "" : "none";
    });
});

filterComplete.addEventListener("click", () => {
    setActiveFilter(filterComplete);
    taskTable.querySelectorAll("tr").forEach(row => {
        row.style.display = row.dataset.status === "completed" ? "" : "none";
    });
});

// ================= MODES =================
document.body.classList.add("light-mode");
lightModeBtn.classList.add("active");

const setMode = (mode) => {
    document.body.classList.remove("light-mode", "dark-mode");

    if (mode === "light") {
        document.body.classList.add("light-mode");
        lightModeBtn.classList.add("active");
        darkModeBtn.classList.remove("active");
    } else {
        document.body.classList.add("dark-mode");
        darkModeBtn.classList.add("active");
        lightModeBtn.classList.remove("active");
    }
};

lightModeBtn.addEventListener("click", () => setMode("light"));
darkModeBtn.addEventListener("click", () => setMode("dark"));

// ================= LOAD SAVED TASKS =================
loadTasksFromLocalStorage();
