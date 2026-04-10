enum TaskStatus{
    Todo = "TODO",
    InProgress = "IN_PROGRESS",
    Done = "DONE"
}

enum TaskPriority{
    Low = "LOW",
    Medium = "MEDIUM",
    High = "HIGH"
}


interface Task {
    readonly id: string;
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    createdAt: Date;
}

// UTITLITY TYPES

type CreateTaskInput = Omit<Task, "id" | "createdAt">;
type UpdateTaskInput = Partial<Omit<Task, "id" | "createdAt">> 

//OUR DATABASE

let tasks: Task[] = [];

// create function

function createTask(input: CreateTaskInput){
    const newId = `TASK-${Math.floor(Math.random() * 10000)}`;
    const newTask: Task = {
        id: newId,
        createdAt: new Date(),
        ...input
    };

    tasks.push(newTask);

    // 4. Print a success message
    console.log(`✅ Task "${newTask.title}" created with id ${newId}.`);
    return newTask;
}

// update function

function updateTask(taskId: string, updates: UpdateTaskInput){
    const taskToUpdate = tasks.find(task => task.id === taskId);

    if(!taskToUpdate){
        console.log(`❌ Task with id ${taskId} not found.`);
        return;
    }

    if (updates.title) taskToUpdate.title = updates.title;
    if (updates.description) taskToUpdate.description = updates.description;
    if (updates.status) taskToUpdate.status = updates.status;
    if (updates.priority) taskToUpdate.priority = updates.priority;

    console.log(`🔄 Task "${taskToUpdate.title}" (${taskId}) has been updated.`);

}

// read  all tasks

function getAllTasks(): Task[]{
    return tasks;
}

// read task by status

function getTasksByStatus(status: TaskStatus): Task[]{
    return tasks.filter(task => task.status === status);
}

// delete
function deleteTask(taskId: string){
    const initialLength = tasks.length;
    tasks = tasks.filter(task => task.id !== taskId);

    if (tasks.length < initialLength) {
        console.log(`🗑️ Task with id ${taskId} has been deleted.`);
    } else {
        console.log(`❌ Task with id ${taskId} not found.`);
    }
}

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

