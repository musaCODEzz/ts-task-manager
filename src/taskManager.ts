export enum TaskStatus {
    Todo = "TODO",
    InProgress = "IN_PROGRESS",
    Done = "DONE"
}

export enum TaskPriority {
    Low = "LOW",
    Medium = "MEDIUM",
    High = "HIGH"
}

export interface Task {
    readonly id: string;
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    createdAt: Date;
}

export type CreateTaskInput = Omit<Task, "id" | "createdAt">;
export type UpdateTaskInput = Partial<Omit<Task, "id" | "createdAt">>;

let tasks: Task[] = [];

export function createTask(input: CreateTaskInput): Task {
    const newId = `TASK-${Math.floor(Math.random() * 10000)}`;
    const newTask: Task = {
        id: newId,
        createdAt: new Date(),
        ...input
    };

    tasks.push(newTask);

    console.log(`✅ Task "${newTask.title}" created with id ${newId}.`);
    return newTask;
}

export function updateTask(taskId: string, updates: UpdateTaskInput): void {
    const taskToUpdate = tasks.find(task => task.id === taskId);

    if (!taskToUpdate) {
        console.log(`❌ Task with id ${taskId} not found.`);
        return;
    }

    if (updates.title) taskToUpdate.title = updates.title;
    if (updates.description) taskToUpdate.description = updates.description;
    if (updates.status) taskToUpdate.status = updates.status;
    if (updates.priority) taskToUpdate.priority = updates.priority;

    console.log(`🔄 Task "${taskToUpdate.title}" (${taskId}) has been updated.`);
}

export function getAllTasks(): Task[] {
    return tasks;
}

export function getTasksByStatus(status: TaskStatus): Task[] {
    return tasks.filter(task => task.status === status);
}

export function deleteTask(taskId: string): void {
    const initialLength = tasks.length;
    tasks = tasks.filter(task => task.id !== taskId);

    if (tasks.length < initialLength) {
        console.log(`🗑️ Task with id ${taskId} has been deleted.`);
    } else {
        console.log(`❌ Task with id ${taskId} not found.`);
    }
}

/** Resets the in-memory task store. Used in tests to ensure isolation. */
export function clearTasks(): void {
    tasks = [];
}
