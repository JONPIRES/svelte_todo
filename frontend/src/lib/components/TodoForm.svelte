<script lang="ts">
	import { addTodo } from '$lib/stores/todos.svelte.ts';

	let inputRef: HTMLInputElement;
	let text = $state('');

	function handleSubmit() {
		const trimmed = text.trim();
		if (trimmed) {
			addTodo(trimmed);
			text = '';
			inputRef?.focus(); //refocus input for better UX
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			e.preventDefault();
			handleSubmit();
		}
	}
</script>

<form
	onsubmit={(e) => {
		e.preventDefault();
		handleSubmit();
	}}
	class="flex flex-col sm:flex-row gap-2 w-full"
	aria-label="Add new todo"
>
	<input
		bind:this={inputRef}
		bind:value={text}
		onkeydown={handleKeydown}
		type="text"
		placeholder="What needs to be done?"
		class="flex-1 px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
		aria-label="Todo input"
		autocomplete="off"
	/>
	<button
		type="submit"
		disabled={!text.trim()}
		class="px-4 sm:px-6 py-2 sm:py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors w-full sm:w-auto sm:min-w-[80px]"
		aria-label="Add todo"
	>
		Add
	</button>
</form>
