<script lang="ts">
	import TodoForm from '$lib/components/TodoForm.svelte';
	import TodoList from '$lib/components/TodoList.svelte';
	import { todos } from '$lib/stores/todos.svelte.ts';
	import { browser } from '$app/environment';

	const STORAGE_KEY = 'todos';

	function saveTodosToStorage(items: typeof todos): void {
		if (!browser) return;

		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
		} catch (error) {
			console.error('Failed to save todos to localStorage:', error);
		}
	}

	$effect(() => {
		saveTodosToStorage(todos);
	});
</script>

<div class="min-h-screen bg-gray-50 py-8 px-4">
	<div class="max-w-2xl mx-auto">
		<header class="mb-8 text-center">
			<h1 class="text-4xl font-bold text-gray-900 mb-2">Todo App</h1>
			<p class="text-gray-600">Organize your tasks and stay productive</p>
		</header>

		<main class="space-y-6">
			<div class="bg-white rounded-lg shadow-sm p-6">
				<TodoForm />
			</div>

			<div class="bg-white rounded-lg shadow-sm p-6">
				<TodoList />
			</div>
		</main>
	</div>
</div>