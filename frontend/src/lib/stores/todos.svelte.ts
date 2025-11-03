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


export const todos = $state<Todo[]>(loadTodosFromStorage());

export const filterState = $state({ value: 'all' as TodoFilter });
export const currentFilter = () => filterState.value;

const _filteredTodos = $derived.by<Todo[]>(() => {
	switch (filterState.value) {
		case 'active':
			return todos.filter((todo) => !todo.completed);
		case 'completed':
			return todos.filter((todo) => todo.completed);
		case 'all':
		default:
			return todos;
	}
});
export const filteredTodos = () => _filteredTodos;

const _activeCount = $derived<number>(todos.filter((todo) => !todo.completed).length);
export const activeCount = () => _activeCount;

const _completedCount = $derived<number>(todos.filter((todo) => todo.completed).length);
export const completedCount = () => _completedCount;

const _totalCount = $derived(todos.length);
export const totalCount = () => _totalCount;

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
	filterState.value = filter;
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
