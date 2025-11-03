<script lang="ts">
	import TodoItem from './TodoItem.svelte';
	import { filteredTodos, currentFilter, setFilter, totalCount, activeCount, completedCount } from '$lib/stores/todos.svelte.ts';
	import type { TodoFilter } from '$lib/types/todo';

	const filters: { label: string; value: TodoFilter; count?: number }[] = [
		{ label: 'All', value: 'all' },
		{ label: 'Active', value: 'active' },
		{ label: 'Completed', value: 'completed' }
	];

	function getFilterCount(filter: TodoFilter): number {
		switch (filter) {
			case 'all':
				return totalCount();
			case 'active':
				return activeCount();
			case 'completed':
				return completedCount();
		}
	}
</script>

<div class="flex flex-col gap-4">
	{#if totalCount() > 0}
		<!-- Select dropdown for small screens (mobile) -->
		<select
			value={currentFilter()}
			onchange={(e) => setFilter(e.currentTarget.value as TodoFilter)}
			class="block md:hidden w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
			aria-label="Filter todos"
		>
			{#each filters as filter}
				<option value={filter.value}>
					{filter.label} ({getFilterCount(filter.value)})
				</option>
			{/each}
		</select>

		<!-- Button group for larger screens (tablet and up) -->
		<div class="hidden md:flex gap-2 pb-2">
			{#each filters as filter}
				<button
					type="button"
					onclick={() => setFilter(filter.value)}
					class:bg-blue-500={currentFilter() === filter.value}
					class:text-white={currentFilter() === filter.value}
					class:bg-gray-100={currentFilter() !== filter.value}
					class:text-gray-700={currentFilter() !== filter.value}
					class="px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
					aria-pressed={currentFilter() === filter.value}
					aria-label="{filter.label} todos"
				>
					{filter.label}
					<span class="ml-2 text-sm opacity-75">({getFilterCount(filter.value)})</span>
				</button>
			{/each}
		</div>

		{#if filteredTodos().length > 0}
			<ul class="divide-y divide-gray-200 rounded-lg border border-gray-200 overflow-hidden">
				{#each filteredTodos() as todo (todo.id)}
					<TodoItem {todo} />
				{/each}
			</ul>
		{:else}
			<div class="text-center py-12 px-4 text-gray-500">
				<p class="text-lg font-medium">No {currentFilter()} todos</p>
				<p class="text-sm mt-2">Try a different filter or add a new todo</p>
			</div>
		{/if}
	{:else}
		<div class="text-center py-12 px-4 text-gray-500">
			<p class="text-lg font-medium">No todos yet</p>
			<p class="text-sm mt-2">Get started by adding a new todo above</p>
		</div>
	{/if}
</div>
