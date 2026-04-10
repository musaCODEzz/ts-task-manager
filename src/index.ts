import {
    TaskStatus,
    TaskPriority,
    createTask,
    updateTask,
    getAllTasks,
    getTasksByStatus,
    deleteTask
} from "./taskManager.js";

// ==========================================
// 5. TESTING THE SYSTEM (Simulation)
// ==========================================
console.log("--- STARTING SYSTEM ---\n");

// 1. Create a few tasks and save their receipts
const task1 = createTask({
    title: "Learn TypeScript",
    description: "Understand Utility Types",
    status: TaskStatus.Todo,
    priority: TaskPriority.High
});
console.log(`✅ Created: ${task1.title}`);

const task2 = createTask({
    title: "Buy Groceries",
    description: "Milk and eggs",
    status: TaskStatus.Todo,
    priority: TaskPriority.Low
});
console.log(`✅ Created: ${task2.title}`);

const task3 = createTask({
    title: "Write Blog",
    description: "Post about TS Interfaces",
    status: TaskStatus.Todo,
    priority: TaskPriority.Medium
});
console.log(`✅ Created: ${task3.title}`);


// 2. Update a task using its receipt ID
console.log("\n--- UPDATING A TASK ---");
updateTask(task1.id, { status: TaskStatus.InProgress });


// 3. Delete a task using its receipt ID
console.log("\n--- DELETING A TASK ---");
deleteTask(task2.id);


// 4. View specific tasks (Filtering)
console.log("\n--- VIEWING 'TODO' TASKS ---");
const todoTasks = getTasksByStatus(TaskStatus.Todo);
console.log(todoTasks);


// 5. Final Database View
console.log("\n--- FINAL DATABASE STATE ---");
console.log(getAllTasks());

