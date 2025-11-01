import { browser } from '$app/environment';
import type { Todo, TodoFilter } from '$lib/types/todo';

const STORAGE_KEY = 'todos';

function loadTodosFromStorage(): Todo[] {
	if (!browser) return [];

	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (!stored) return [];

		const parsed = JSON.parse(stored);
		return parsed.map((t: any) => ({
			...t,
			createdAt: new Date(t.createdAt),
			dueDate: t.dueDate ? new Date(t.dueDate) : undefined
		}));
	} catch (error) {
		console.error('Failed to load todos from localStorage:', error);
		return [];
	}
}

function saveTodosToStorage(items: Todo[]): void {
	if (!browser) return;

	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
	} catch (error) {
		console.error('Failed to save todos to localStorage:', error);
	}
}

export const todos = $state<Todo[]>(loadTodosFromStorage());

export let currentFilter = $state<TodoFilter>('all');

export const filteredTodos = $derived.by<Todo[]>(() => {
	switch (currentFilter) {
		case 'active':
			return todos.filter((todo) => !todo.completed);
		case 'completed':
			return todos.filter((todo) => todo.completed);
		case 'all':
		default:
			return todos;
	}
});

export const activeCount = $derived<number>(todos.filter((todo) => !todo.completed).length);

export const completedCount = $derived<number>(todos.filter((todo) => todo.completed).length);

export const totalCount = $derived(todos.length);

$effect(() => {
	saveTodosToStorage(todos);
});

export function addTodo(text: string): void {
	if (!text.trim()) return;

	const newTodo: Todo = {
		id: crypto.randomUUID(),
		text: text.trim(),
		completed: false,
		createdAt: new Date()
	};

	todos.push(newTodo);
}

export function toggleTodo(id: string): void {
	const todo = todos.find((t) => t.id === id);
	if (todo) {
		todo.completed = !todo.completed;
	}
}

export function deleteTodo(id: string): void {
	const index = todos.findIndex((t) => t.id === id);
	if (index !== -1) {
		todos.splice(index, 1);
	}
}

export function updateTodo(id: string, text: string): void {
	const todo = todos.find((t) => t.id === id);
	if (todo && text.trim()) {
		todo.text = text.trim();
	}
}

export function setFilter(filter: TodoFilter): void {
	currentFilter = filter;
}

export function clearCompleted(): void {
	const activeTodos = todos.filter((todo) => !todo.completed);
	todos.length = 0;
	todos.push(...activeTodos);
}

export function toggleAll(completed: boolean): void {
	todos.forEach((todo) => {
		todo.completed = completed;
	});
}
