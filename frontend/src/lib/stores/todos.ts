import type { Todo, TodoFilter } from '$lib/types/todo';

export const todos = $state<Todo[]>([]);

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
