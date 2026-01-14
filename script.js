//DOM ELEMENTS
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

// Function to add task
const addTaskToTable = () => {
    const taskValue = taskInput.value.trim();

    if (taskValue === "") {
        alert("Please enter a task!");
        return;
    }

    // Increment task count
    taskCount++;

    // Create a new table row
    const row = document.createElement("tr");

    //Default Status of Tasks
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

    //Task management functions

    // Select buttons and task cell
    const editBtn = row.querySelector(".editBtn");
    const doneBtn = row.querySelector(".doneBtn");
    const deleteBtn = row.querySelector(".deleteBtn");
    
    //Edit Task functionality
    editBtn.addEventListener("click", () => {
        const currentTask = row.querySelector("td");
        const newTask = prompt("Update Your Task", currentTask.textContent);
            if (newTask !== null && newTask.trim() !== "") {
                currentTask.textContent = newTask.trim();
            }
    });

    //Completed Task functionality
    doneBtn.addEventListener("click", () => {
        const currentTask = row.querySelector("td");

        // Apply strikethrough
        currentTask.style.textDecoration = "line-through";

        // Add tick badge
        const tickBadge = document.createElement("span");
        tickBadge.className = "badge bg-success ms-2"; // small green badge
        tickBadge.textContent = "✓";
        currentTask.appendChild(tickBadge);

        //Status of Completed Tasks
        row.dataset.status = "completed";

        // Disable Done & Edit buttons to prevent re-click
        doneBtn.disabled = true;
        editBtn.disabled = true;
    });

    //Delete Task functionality
    deleteBtn.addEventListener("click", () => {
        row.remove(); // remove row

        // Recalculate numbers
        const rows = taskTable.querySelectorAll("tr");
        rows.forEach((r, index) => {
            r.querySelector("th").textContent = index + 1;
        });

        taskCount = rows.length;
    });

    // Append row to table
    taskTable.appendChild(row);

    // Clear input
    taskInput.value = "";
};

//Add Button Events 

// Button click
addTaskBtn.addEventListener("click", addTaskToTable);

// Enter key
taskInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addTaskToTable();
});

//Delete All Task functionality
deleteAll.addEventListener( "click" , () => {

    // Check if there are no tasks
    if (taskTable.rows.length === 0) {
        alert("There are no tasks available to delete!");
        return;
    }

    // Confirmation
    if (!confirm("Are you sure you want to delete all tasks?")) return;

    // Remove all rows from tbody
    taskTable.innerHTML = "";

    // Reset task count
    taskCount = 0;
 
});

//Filter functionalities

//Active Filter Function
const filterButtons = [filterAll, filterPending, filterComplete];
function setActiveFilter(activeButton) {
    filterButtons.forEach(btn => {
        btn.classList.remove("active");
    });

    activeButton.classList.add("active");
}

//ALL Section
filterAll.addEventListener("click", () => {
    setActiveFilter(filterAll);
    const rows = taskTable.querySelectorAll("tr");

    rows.forEach(row => {
        row.style.display = "";
    });
});

//Await Section
filterPending.addEventListener("click", () => {
    setActiveFilter(filterPending);
    const rows = taskTable.querySelectorAll("tr");

    rows.forEach(row => {
        if (row.dataset.status === "pending") {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
});

//Completed Section
filterComplete.addEventListener("click", () => {
    setActiveFilter(filterComplete);
    const rows = taskTable.querySelectorAll("tr");

    rows.forEach(row => {
        if (row.dataset.status === "completed") {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
});

//Modes Functionalities

//Default Mode
document.body.classList.add("light-mode");
lightModeBtn.classList.add("active");

const setMode = (mode) => {
    document.body.classList.remove( "light-mode" , "dark-mode" );
    if ( mode === "light" ){

        document.body.classList.add("light-mode");
        lightModeBtn.classList.add("active");
        darkModeBtn.classList.remove("active");

    } else {
        
        document.body.classList.add("dark-mode");
        darkModeBtn.classList.add("active");
        lightModeBtn.classList.remove("active");
    }
};

//Mode Click Event
lightModeBtn.addEventListener("click", () => setMode ("light") );
darkModeBtn.addEventListener("click", () => setMode ("dark") );
