<script lang="ts">
	import type { Todo } from '$lib/types/todo';
	import { toggleTodo, deleteTodo, updateTodo } from '$lib/stores/todos.svelte.ts';

	interface Props {
		todo: Todo;
	}

	let { todo }: Props = $props();

	let isEditing = $state(false);
	let editText = $state('');
	let inputRef = $state<HTMLInputElement | undefined>(undefined);

	function startEdit() {
		isEditing = true;
		editText = todo.text;
		setTimeout(() => {
			if (inputRef) {
				inputRef.focus();
			}
		}, 0);
	}

	function saveEdit() {
		const trimmed = editText.trim();
		if (trimmed && trimmed !== todo.text) {
			updateTodo(todo.id, trimmed);
		} else {
			editText = todo.text;
		}
		isEditing = false;
	}

	function cancelEdit() {
		editText = todo.text;
		isEditing = false;
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			e.preventDefault();
			saveEdit();
		} else if (e.key === 'Escape') {
			e.preventDefault();
			cancelEdit();
		}
	}
</script>

<li
	class="flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-200 hover:bg-gray-50 transition-colors"
	data-testid="todo-item"
>
	<input
		type="checkbox"
		checked={todo.completed}
		onchange={() => toggleTodo(todo.id)}
		class="w-5 h-5 rounded border-gray-300 text-blue-500 focus:ring-2 focus:ring-blue-500 cursor-pointer flex-shrink-0"
		aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
	/>

	{#if isEditing}
		<input
			bind:this={inputRef}
			bind:value={editText}
			onkeydown={handleKeydown}
			onblur={saveEdit}
			type="text"
			class="flex-1 px-2 py-1 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
			aria-label="Edit todo text"
		/>
	{:else}
		<button
			onclick={startEdit}
			class="flex-1 text-left px-2 py-1 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors min-h-[44px]"
			aria-label="Edit todo"
		>
			<span
				class:line-through={todo.completed}
				class:text-gray-500={todo.completed}
			>
				{todo.text}
			</span>
		</button>
	{/if}

	<button
		onclick={() => deleteTodo(todo.id)}
		class="px-3 py-2 text-red-500 hover:bg-red-50 rounded focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
		aria-label="Delete todo"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			class="w-5 h-5"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
			/>
		</svg>
	</button>
</li>
