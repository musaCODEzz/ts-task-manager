import {
    TaskStatus,
    TaskPriority,
    createTask,
    updateTask,
    getAllTasks,
    getTasksByStatus,
    deleteTask,
    clearTasks,
} from "../taskManager.js";

beforeEach(() => {
    clearTasks();
    jest.spyOn(console, "log").mockImplementation(() => undefined);
});

afterEach(() => {
    jest.restoreAllMocks();
});

// ─── createTask ──────────────────────────────────────────────────────────────

describe("createTask", () => {
    it("returns a task with the provided title, description, status and priority", () => {
        const task = createTask({
            title: "Test task",
            description: "A description",
            status: TaskStatus.Todo,
            priority: TaskPriority.High,
        });

        expect(task.title).toBe("Test task");
        expect(task.description).toBe("A description");
        expect(task.status).toBe(TaskStatus.Todo);
        expect(task.priority).toBe(TaskPriority.High);
    });

    it("assigns an id in the format TASK-<number>", () => {
        const task = createTask({
            title: "id format check",
            description: "",
            status: TaskStatus.Todo,
            priority: TaskPriority.Low,
        });

        expect(task.id).toMatch(/^TASK-\d+$/);
    });

    it("sets createdAt to a Date instance close to now", () => {
        const before = new Date();
        const task = createTask({
            title: "timestamp check",
            description: "",
            status: TaskStatus.Todo,
            priority: TaskPriority.Low,
        });
        const after = new Date();

        expect(task.createdAt).toBeInstanceOf(Date);
        expect(task.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
        expect(task.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
    });

    it("adds the task to the global store", () => {
        expect(getAllTasks()).toHaveLength(0);
        createTask({
            title: "Stored task",
            description: "",
            status: TaskStatus.Todo,
            priority: TaskPriority.Medium,
        });
        expect(getAllTasks()).toHaveLength(1);
    });

    it("logs a success message containing the task title and id", () => {
        const task = createTask({
            title: "Log check",
            description: "",
            status: TaskStatus.Todo,
            priority: TaskPriority.Low,
        });

        expect(console.log).toHaveBeenCalledWith(
            expect.stringContaining("Log check")
        );
        expect(console.log).toHaveBeenCalledWith(
            expect.stringContaining(task.id)
        );
    });

    it("each created task receives a unique id", () => {
        const ids = new Set<string>();
        for (let i = 0; i < 20; i++) {
            const task = createTask({
                title: `task ${i}`,
                description: "",
                status: TaskStatus.Todo,
                priority: TaskPriority.Low,
            });
            ids.add(task.id);
        }
        // All 20 tasks should have unique ids
        expect(ids.size).toBe(20);
    });
});

// ─── updateTask ──────────────────────────────────────────────────────────────

describe("updateTask", () => {
    it("updates the title of an existing task", () => {
        const task = createTask({
            title: "Original",
            description: "desc",
            status: TaskStatus.Todo,
            priority: TaskPriority.Low,
        });

        updateTask(task.id, { title: "Updated" });

        expect(getAllTasks()[0]!.title).toBe("Updated");
    });

    it("updates the description of an existing task", () => {
        const task = createTask({
            title: "t",
            description: "old desc",
            status: TaskStatus.Todo,
            priority: TaskPriority.Low,
        });

        updateTask(task.id, { description: "new desc" });

        expect(getAllTasks()[0]!.description).toBe("new desc");
    });

    it("updates the status of an existing task", () => {
        const task = createTask({
            title: "t",
            description: "",
            status: TaskStatus.Todo,
            priority: TaskPriority.Low,
        });

        updateTask(task.id, { status: TaskStatus.Done });

        expect(getAllTasks()[0]!.status).toBe(TaskStatus.Done);
    });

    it("updates the priority of an existing task", () => {
        const task = createTask({
            title: "t",
            description: "",
            status: TaskStatus.Todo,
            priority: TaskPriority.Low,
        });

        updateTask(task.id, { priority: TaskPriority.High });

        expect(getAllTasks()[0]!.priority).toBe(TaskPriority.High);
    });

    it("can update multiple fields at once", () => {
        const task = createTask({
            title: "Original",
            description: "old desc",
            status: TaskStatus.Todo,
            priority: TaskPriority.Low,
        });

        updateTask(task.id, {
            title: "New title",
            status: TaskStatus.InProgress,
            priority: TaskPriority.High,
        });

        const updated = getAllTasks()[0]!;
        expect(updated.title).toBe("New title");
        expect(updated.status).toBe(TaskStatus.InProgress);
        expect(updated.priority).toBe(TaskPriority.High);
    });

    it("does not modify any task when the id is not found", () => {
        const task = createTask({
            title: "Unchanged",
            description: "desc",
            status: TaskStatus.Todo,
            priority: TaskPriority.Low,
        });

        updateTask("TASK-9999", { title: "Should not apply" });

        expect(task.title).toBe("Unchanged");
        expect(getAllTasks()).toHaveLength(1);
    });

    it("logs an error message when the task is not found", () => {
        updateTask("TASK-9999", { title: "ghost" });

        expect(console.log).toHaveBeenCalledWith(
            expect.stringContaining("TASK-9999")
        );
    });

    it("logs an update message when the task is found", () => {
        const task = createTask({
            title: "Log update",
            description: "",
            status: TaskStatus.Todo,
            priority: TaskPriority.Low,
        });

        jest.clearAllMocks();
        updateTask(task.id, { status: TaskStatus.Done });

        expect(console.log).toHaveBeenCalledWith(
            expect.stringContaining(task.id)
        );
    });
});

// ─── getAllTasks ──────────────────────────────────────────────────────────────

describe("getAllTasks", () => {
    it("returns an empty array when no tasks have been created", () => {
        expect(getAllTasks()).toEqual([]);
    });

    it("returns all created tasks", () => {
        createTask({ title: "A", description: "", status: TaskStatus.Todo, priority: TaskPriority.Low });
        createTask({ title: "B", description: "", status: TaskStatus.InProgress, priority: TaskPriority.Medium });
        createTask({ title: "C", description: "", status: TaskStatus.Done, priority: TaskPriority.High });

        expect(getAllTasks()).toHaveLength(3);
    });

    it("returns the same task objects that were created", () => {
        const task = createTask({
            title: "Reference check",
            description: "desc",
            status: TaskStatus.Todo,
            priority: TaskPriority.High,
        });

        expect(getAllTasks()).toContainEqual(task);
    });
});

// ─── getTasksByStatus ─────────────────────────────────────────────────────────

describe("getTasksByStatus", () => {
    it("returns an empty array when no tasks exist", () => {
        expect(getTasksByStatus(TaskStatus.Todo)).toEqual([]);
    });

    it("returns only tasks matching the requested status", () => {
        createTask({ title: "todo 1", description: "", status: TaskStatus.Todo, priority: TaskPriority.Low });
        createTask({ title: "todo 2", description: "", status: TaskStatus.Todo, priority: TaskPriority.Low });
        createTask({ title: "done 1", description: "", status: TaskStatus.Done, priority: TaskPriority.Low });

        const todos = getTasksByStatus(TaskStatus.Todo);
        expect(todos).toHaveLength(2);
        todos.forEach(t => expect(t.status).toBe(TaskStatus.Todo));
    });

    it("returns an empty array when no tasks match the given status", () => {
        createTask({ title: "todo", description: "", status: TaskStatus.Todo, priority: TaskPriority.Low });

        expect(getTasksByStatus(TaskStatus.Done)).toEqual([]);
    });

    it("filters correctly for each TaskStatus value", () => {
        createTask({ title: "todo",        description: "", status: TaskStatus.Todo,       priority: TaskPriority.Low });
        createTask({ title: "in-progress", description: "", status: TaskStatus.InProgress, priority: TaskPriority.Low });
        createTask({ title: "done",        description: "", status: TaskStatus.Done,        priority: TaskPriority.Low });

        expect(getTasksByStatus(TaskStatus.Todo)).toHaveLength(1);
        expect(getTasksByStatus(TaskStatus.InProgress)).toHaveLength(1);
        expect(getTasksByStatus(TaskStatus.Done)).toHaveLength(1);
    });
});

// ─── deleteTask ───────────────────────────────────────────────────────────────

describe("deleteTask", () => {
    it("removes the task with the given id from the store", () => {
        const task = createTask({
            title: "To delete",
            description: "",
            status: TaskStatus.Todo,
            priority: TaskPriority.Low,
        });

        deleteTask(task.id);

        expect(getAllTasks()).toHaveLength(0);
    });

    it("only removes the targeted task and leaves others intact", () => {
        const task1 = createTask({ title: "Keep", description: "", status: TaskStatus.Todo, priority: TaskPriority.Low });
        const task2 = createTask({ title: "Delete", description: "", status: TaskStatus.Todo, priority: TaskPriority.Low });

        deleteTask(task2.id);

        const remaining = getAllTasks();
        expect(remaining).toHaveLength(1);
        expect(remaining[0]!.id).toBe(task1.id);
    });

    it("does not change the store when the id is not found", () => {
        createTask({ title: "Stays", description: "", status: TaskStatus.Todo, priority: TaskPriority.Low });

        deleteTask("TASK-9999");

        expect(getAllTasks()).toHaveLength(1);
    });

    it("logs a success message after successful deletion", () => {
        const task = createTask({
            title: "Del log",
            description: "",
            status: TaskStatus.Todo,
            priority: TaskPriority.Low,
        });

        jest.clearAllMocks();
        deleteTask(task.id);

        expect(console.log).toHaveBeenCalledWith(
            expect.stringContaining(task.id)
        );
    });

    it("logs an error message when the task is not found", () => {
        deleteTask("TASK-9999");

        expect(console.log).toHaveBeenCalledWith(
            expect.stringContaining("TASK-9999")
        );
    });
});

// ─── clearTasks (test-helper) ─────────────────────────────────────────────────

describe("clearTasks", () => {
    it("empties the task store", () => {
        createTask({ title: "t", description: "", status: TaskStatus.Todo, priority: TaskPriority.Low });
        expect(getAllTasks()).toHaveLength(1);

        clearTasks();

        expect(getAllTasks()).toHaveLength(0);
    });
});
