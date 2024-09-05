document.addEventListener("DOMContentLoaded", function() {
    const addTaskButton = document.getElementById("addTaskButton");
    const taskInput = document.getElementById("taskInput");
    const taskList = document.getElementById("taskList");

    // Add task event
    addTaskButton.addEventListener("click", addTask);

    // Function to add a task
    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText === "") return; // Prevent adding empty tasks

        const listItem = document.createElement("li");
        listItem.className = "task-item";
        listItem.innerHTML = `
            ${taskText}
            <div>
                <button class="complete-btn">✓</button>
                <button class="delete-btn">✗</button>
            </div>
        `;

        // Complete task event
        listItem.querySelector(".complete-btn").addEventListener("click", function() {
            listItem.classList.toggle("completed");
        });

        // Delete task event
        listItem.querySelector(".delete-btn").addEventListener("click", function() {
            listItem.classList.add("removing"); // Add animation class
            listItem.addEventListener("transitionend", function() {
                listItem.remove();
            });
        });

        taskList.appendChild(listItem);
        taskInput.value = ""; // Clear input field
    }

    // Enter key event to add task
    taskInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            addTask();
        }
    });
});
